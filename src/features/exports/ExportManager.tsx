import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ExportService } from '../../services/exportService';
import {
  Download,
  FileArchive,
  FileJson,
  FileSpreadsheet,
  FolderTree,
  FileText,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const ExportManager: React.FC = () => {
  const { recordsList, importAudits } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const manifest = useMemo(() => {
    return ExportService.generateManifest(recordsList);
  }, [recordsList]);

  const handleDownloadZip = async () => {
    try {
      setIsGenerating(true);
      const zipBlob = await ExportService.buildExportZip(recordsList, importAudits);
      ExportService.triggerDownload(
        zipBlob,
        `revenue_intelligence_export_${new Date().toISOString().slice(0, 10)}.zip`
      );
      setDownloadSuccess('Complete export archive downloaded successfully.');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (e: any) {
      alert(`Export error: ${e.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadManifestJson = () => {
    const jsonStr = JSON.stringify(manifest, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    ExportService.triggerDownload(blob, 'manifest.json');
    setDownloadSuccess('manifest.json downloaded.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadManifestCsv = () => {
    const csvStr = ExportService.manifestToCsv(manifest);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    ExportService.triggerDownload(blob, 'manifest.csv');
    setDownloadSuccess('manifest.csv downloaded.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase mb-1">
          <Download className="w-4 h-4" />
          <span>Artifact Delivery</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Export Engine & Manifest Generation
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Generate structured, downloadable ZIP packages and machine-readable manifests representing the current applied application state.
        </p>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center space-x-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Download Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Full ZIP */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-2">
              <FileArchive className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Complete Archive ZIP</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Complete archive containing the Manager Brief, categorized route folders (markdown), full transcripts, raw payloads, import audits, and manifests.
            </p>
          </div>

          <button
            disabled={isGenerating}
            onClick={handleDownloadZip}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm flex items-center justify-center transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>{isGenerating ? 'Packaging Archive...' : 'Download Complete ZIP'}</span>
          </button>
        </div>

        {/* JSON Manifest */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
              <FileJson className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">JSON Manifest</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Machine-readable JSON manifest detailing source IDs, applied revisions, suggested & effective routes, review states, and relative archive paths.
            </p>
          </div>

          <button
            onClick={handleDownloadManifestJson}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm flex items-center justify-center transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download manifest.json</span>
          </button>
        </div>

        {/* CSV Manifest */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">CSV Manifest</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Spreadsheet-compatible CSV format containing all 12 mandatory columns: source_type, source_id, applied_revision, route lists, and review states.
            </p>
          </div>

          <button
            onClick={handleDownloadManifestCsv}
            className="w-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm flex items-center justify-center transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download manifest.csv</span>
          </button>
        </div>
      </div>

      {/* Archive File Tree Preview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <FolderTree className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Archive Internal Hierarchy & Layout</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            {recordsList.length} records • {manifest.records.reduce((acc, r) => acc + r.output_paths.length, 0)} total generated files
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-slate-700">
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-indigo-400 font-bold">exports/</div>
            <div className="pl-3 text-slate-400">├── README.txt</div>
            <div className="pl-3 text-slate-400">├── manifest.json</div>
            <div className="pl-3 text-slate-400">├── manifest.csv</div>
            <div className="pl-3 text-emerald-400">├── manager_brief/</div>
            <div className="pl-6 text-slate-300">└── 2026-08-21.md</div>
            <div className="pl-3 text-indigo-300">├── sales_coaching/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── deal_followups/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── customer_followups/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── technical_requirements/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── internal_vendor/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── relationship_partnership/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── human_review/ (markdown analysis)</div>
            <div className="pl-3 text-indigo-300">├── no_action/ (markdown analysis)</div>
            <div className="pl-3 text-amber-300">├── transcripts/ (*_transcript.txt)</div>
            <div className="pl-3 text-blue-300">├── metadata/ (*_payload.json)</div>
            <div className="pl-3 text-purple-300">└── audit/</div>
            <div className="pl-6 text-slate-300">└── import_audit_history.json</div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-2 font-sans text-slate-600">
            <h4 className="font-bold text-slate-800">Export Guarantee Standards:</h4>
            <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed">
              <li><strong>Zero Empty Files:</strong> Every markdown file contains structured executive summaries, risk analysis, explicit commitments, and source passages.</li>
              <li><strong>Relative Paths:</strong> Every path listed in <code>manifest.json</code> and <code>manifest.csv</code> is guaranteed to be relative to the archive root and points to an existing file.</li>
              <li><strong>Preserved Multi-Destination Context:</strong> Conversations with multiple routes (e.g. C03 or M07) generate separate destination files without losing their core record identity.</li>
              <li><strong>Current State Reflection:</strong> The manifest dynamically updates to reflect current applied source revisions and active human overrides.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
