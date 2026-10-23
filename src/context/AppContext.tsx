import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  StoredRecord,
  ImportAuditEntry,
  RouteCategory,
  ReviewState,
  DeliveryEnvelope
} from '../types';
import { PersistenceService, ManualOverrideEntry } from '../services/persistenceService';
import { ImportService } from '../services/importService';
import { RoutingService } from '../services/routingService';

// Direct data imports from provided JSON files
import initialBatchData from '../../data/01_initial.json';
import updateBatchData from '../../data/02_update.json';

interface AppContextType {
  records: Record<string, StoredRecord>;
  recordsList: StoredRecord[];
  manualOverrides: Record<string, ManualOverrideEntry>;
  importAudits: ImportAuditEntry[];
  isLoading: boolean;
  activeRecord: StoredRecord | null;
  activeRecordKey: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  openRecordDetail: (keyOrRef: string) => void;
  closeRecordDetail: () => void;
  importEnvelope: (envelope: DeliveryEnvelope) => Promise<{ success: boolean; message: string }>;
  applyManualOverride: (recordKey: string, routes: RouteCategory[], note: string | null, status?: ReviewState) => Promise<void>;
  resetToSuggested: (recordKey: string) => Promise<void>;
  setReviewStatus: (recordKey: string, status: ReviewState) => Promise<void>;
  loadInitialBatch: () => Promise<{ success: boolean; message: string }>;
  loadUpdateBatch: () => Promise<{ success: boolean; message: string }>;
  resetAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<Record<string, StoredRecord>>({});
  const [manualOverrides, setManualOverrides] = useState<Record<string, ManualOverrideEntry>>({});
  const [importAudits, setImportAudits] = useState<ImportAuditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRecordKey, setActiveRecordKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Initial load from storage or default to initial batch
  useEffect(() => {
    async function init() {
      try {
        const loadedRecords = await PersistenceService.loadRecords();
        const loadedOverrides = await PersistenceService.loadManualOverrides();
        const loadedAudits = await PersistenceService.loadAuditLogs();

        if (Object.keys(loadedRecords).length > 0) {
          setRecords(loadedRecords);
          setManualOverrides(loadedOverrides);
          setImportAudits(loadedAudits);
        } else {
          // Auto-load initial delivery on first visit
          const result = ImportService.processEnvelope(
            initialBatchData as DeliveryEnvelope,
            {},
            {}
          );
          if (result.success) {
            setRecords(result.updatedRecords);
            if (result.auditEntry) {
              setImportAudits([result.auditEntry]);
              await PersistenceService.saveAuditLogs([result.auditEntry]);
            }
            await PersistenceService.saveRecords(result.updatedRecords);
          }
        }
      } catch (e) {
        console.error('Initialization error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  const recordsList = Object.values(records);

  const activeRecord = activeRecordKey ? records[activeRecordKey] || null : null;

  const openRecordDetail = (keyOrRef: string) => {
    // Can match by key or record_ref (e.g. "M07" or "C04")
    if (records[keyOrRef]) {
      setActiveRecordKey(keyOrRef);
    } else {
      const match = Object.entries(records).find(
        ([_, r]) => r.record_ref.toUpperCase() === keyOrRef.toUpperCase()
      );
      if (match) {
        setActiveRecordKey(match[0]);
      }
    }
  };

  const closeRecordDetail = () => {
    setActiveRecordKey(null);
  };

  const importEnvelope = async (envelope: DeliveryEnvelope) => {
    const result = ImportService.processEnvelope(envelope, records, manualOverrides);
    if (result.success) {
      setRecords(result.updatedRecords);
      await PersistenceService.saveRecords(result.updatedRecords);

      if (result.auditEntry) {
        const newAudits = [result.auditEntry, ...importAudits];
        setImportAudits(newAudits);
        await PersistenceService.saveAuditLogs(newAudits);
      }
    }
    return { success: result.success, message: result.message };
  };

  const loadInitialBatch = async () => {
    return await importEnvelope(initialBatchData as DeliveryEnvelope);
  };

  const loadUpdateBatch = async () => {
    return await importEnvelope(updateBatchData as DeliveryEnvelope);
  };

  const applyManualOverride = async (
    recordKey: string,
    routes: RouteCategory[],
    note: string | null,
    status: ReviewState = 'reviewed'
  ) => {
    const record = records[recordKey];
    if (!record) return;

    const overrideEntry: ManualOverrideEntry = {
      source_type: record.source_type,
      source_id: record.source_id,
      manualOverrideRoutes: routes,
      manualCorrectionNote: note,
      reviewStatus: status,
      updated_at: new Date().toISOString()
    };

    const newOverrides = {
      ...manualOverrides,
      [recordKey]: overrideEntry
    };
    setManualOverrides(newOverrides);
    await PersistenceService.saveManualOverrides(newOverrides);

    const routing = RoutingService.computeRouteDecision(
      record.routing.suggestedRoutes,
      record.routing.suggestedExplanation,
      record.routing.suggestedEvidence,
      record.routing.suggestedNextAction,
      overrideEntry
    );

    const updatedRecord: StoredRecord = {
      ...record,
      routing,
      last_updated_at: new Date().toISOString()
    };

    const newRecords = {
      ...records,
      [recordKey]: updatedRecord
    };
    setRecords(newRecords);
    await PersistenceService.saveRecords(newRecords);
  };

  const resetToSuggested = async (recordKey: string) => {
    const record = records[recordKey];
    if (!record) return;

    const newOverrides = { ...manualOverrides };
    delete newOverrides[recordKey];
    setManualOverrides(newOverrides);
    await PersistenceService.saveManualOverrides(newOverrides);

    const routing = RoutingService.computeRouteDecision(
      record.routing.suggestedRoutes,
      record.routing.suggestedExplanation,
      record.routing.suggestedEvidence,
      record.routing.suggestedNextAction,
      null
    );

    const updatedRecord: StoredRecord = {
      ...record,
      routing,
      last_updated_at: new Date().toISOString()
    };

    const newRecords = {
      ...records,
      [recordKey]: updatedRecord
    };
    setRecords(newRecords);
    await PersistenceService.saveRecords(newRecords);
  };

  const setReviewStatus = async (recordKey: string, status: ReviewState) => {
    const record = records[recordKey];
    if (!record) return;

    const existingOverride = manualOverrides[recordKey] || null;
    const updatedOverride: ManualOverrideEntry = {
      source_type: record.source_type,
      source_id: record.source_id,
      manualOverrideRoutes: existingOverride?.manualOverrideRoutes || null,
      manualCorrectionNote: existingOverride?.manualCorrectionNote || null,
      reviewStatus: status,
      updated_at: new Date().toISOString()
    };

    const newOverrides = {
      ...manualOverrides,
      [recordKey]: updatedOverride
    };
    setManualOverrides(newOverrides);
    await PersistenceService.saveManualOverrides(newOverrides);

    const updatedRecord: StoredRecord = {
      ...record,
      routing: {
        ...record.routing,
        reviewStatus: status
      },
      last_updated_at: new Date().toISOString()
    };

    const newRecords = {
      ...records,
      [recordKey]: updatedRecord
    };
    setRecords(newRecords);
    await PersistenceService.saveRecords(newRecords);
  };

  const resetAllData = async () => {
    await PersistenceService.clearAll();
    setRecords({});
    setManualOverrides({});
    setImportAudits([]);
    setActiveRecordKey(null);
  };

  return (
    <AppContext.Provider
      value={{
        records,
        recordsList,
        manualOverrides,
        importAudits,
        isLoading,
        activeRecord,
        activeRecordKey,
        searchQuery,
        setSearchQuery,
        openRecordDetail,
        closeRecordDetail,
        importEnvelope,
        applyManualOverride,
        resetToSuggested,
        setReviewStatus,
        loadInitialBatch,
        loadUpdateBatch,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
