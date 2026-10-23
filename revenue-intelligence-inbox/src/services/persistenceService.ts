import { StoredRecord, ImportAuditEntry, RouteCategory, ReviewState } from '../types';

export interface ManualOverrideEntry {
  source_type: string;
  source_id: string;
  manualOverrideRoutes: RouteCategory[] | null;
  manualCorrectionNote: string | null;
  reviewStatus: ReviewState;
  updated_at: string;
}

const STORAGE_KEYS = {
  RECORDS: 'revenue_intel_records_v1',
  OVERRIDES: 'revenue_intel_manual_overrides_v1',
  AUDITS: 'revenue_intel_import_audits_v1',
  CURRENT_BATCH: 'revenue_intel_current_batch_v1'
};

const DB_NAME = 'RevenueIntelligenceInboxDB';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('records')) {
        db.createObjectStore('records', { keyPath: 'storage_key' });
      }
      if (!db.objectStoreNames.contains('overrides')) {
        db.createObjectStore('overrides', { keyPath: 'storage_key' });
      }
      if (!db.objectStoreNames.contains('audits')) {
        db.createObjectStore('audits', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export class PersistenceService {
  /**
   * Save records map to IndexedDB and localStorage fallback
   */
  static async saveRecords(records: Record<string, StoredRecord>): Promise<void> {
    try {
      const serialized = JSON.stringify(records);
      localStorage.setItem(STORAGE_KEYS.RECORDS, serialized);
    } catch (e) {
      console.warn('localStorage saveRecords failed (size limit?):', e);
    }

    try {
      const db = await openDB();
      const tx = db.transaction('records', 'readwrite');
      const store = tx.objectStore('records');
      await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => resolve();
        clearReq.onerror = () => reject(clearReq.error);
      });
      for (const [key, record] of Object.entries(records)) {
        store.put({ storage_key: key, data: record });
      }
      await new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB saveRecords failed:', e);
    }
  }

  /**
   * Load records map
   */
  static async loadRecords(): Promise<Record<string, StoredRecord>> {
    // Try IndexedDB first
    try {
      const db = await openDB();
      const tx = db.transaction('records', 'readonly');
      const store = tx.objectStore('records');
      const records: Record<string, StoredRecord> = {};
      await new Promise<void>((resolve, reject) => {
        const req = store.openCursor();
        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            records[cursor.value.storage_key] = cursor.value.data;
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = () => reject(req.error);
      });
      if (Object.keys(records).length > 0) {
        return records;
      }
    } catch {
      // fallback to localStorage
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('localStorage loadRecords failed:', e);
    }
    return {};
  }

  /**
   * Save manual overrides
   */
  static async saveManualOverrides(overrides: Record<string, ManualOverrideEntry>): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.OVERRIDES, JSON.stringify(overrides));
    } catch (e) {
      console.warn('localStorage saveManualOverrides failed:', e);
    }

    try {
      const db = await openDB();
      const tx = db.transaction('overrides', 'readwrite');
      const store = tx.objectStore('overrides');
      for (const [key, entry] of Object.entries(overrides)) {
        store.put({ storage_key: key, data: entry });
      }
    } catch (e) {
      console.warn('IndexedDB saveManualOverrides failed:', e);
    }
  }

  /**
   * Load manual overrides
   */
  static async loadManualOverrides(): Promise<Record<string, ManualOverrideEntry>> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.OVERRIDES);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('localStorage loadManualOverrides failed:', e);
    }

    try {
      const db = await openDB();
      const tx = db.transaction('overrides', 'readonly');
      const store = tx.objectStore('overrides');
      const overrides: Record<string, ManualOverrideEntry> = {};
      await new Promise<void>((resolve, reject) => {
        const req = store.openCursor();
        req.onsuccess = () => {
          const cursor = req.result;
          if (cursor) {
            overrides[cursor.value.storage_key] = cursor.value.data;
            cursor.continue();
          } else {
            resolve();
          }
        };
        req.onerror = () => reject(req.error);
      });
      return overrides;
    } catch {
      return {};
    }
  }

  /**
   * Save audit logs
   */
  static async saveAuditLogs(audits: ImportAuditEntry[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDITS, JSON.stringify(audits));
    } catch (e) {
      console.warn('localStorage saveAuditLogs failed:', e);
    }
  }

  /**
   * Load audit logs
   */
  static async loadAuditLogs(): Promise<ImportAuditEntry[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.AUDITS);
      if (raw) {
        return JSON.parse(raw);
      }
    } catch {
      // empty
    }
    return [];
  }

  /**
   * Reset all stored records and overrides
   */
  static async clearAll(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.OVERRIDES);
    localStorage.removeItem(STORAGE_KEYS.AUDITS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_BATCH);

    try {
      const db = await openDB();
      const tx = db.transaction(['records', 'overrides', 'audits', 'meta'], 'readwrite');
      tx.objectStore('records').clear();
      tx.objectStore('overrides').clear();
      tx.objectStore('audits').clear();
      tx.objectStore('meta').clear();
    } catch (e) {
      console.warn('IndexedDB clear failed:', e);
    }
  }
}
