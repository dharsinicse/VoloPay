import React from 'react';
import { useApp } from '../context/AppContext';
import { Search, Calendar, Database, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface TopNavProps {
  currentPageTitle: string;
  onNavigateToImports: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ currentPageTitle, onNavigateToImports }) => {
  const { searchQuery, setSearchQuery, recordsList } = useApp();

  const total = recordsList.length;
  const withTx = recordsList.filter(r => r.usable_transcript).length;
  const coveragePercent = total > 0 ? ((withTx / total) * 100).toFixed(1) : '0';

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 flex items-center justify-between px-6">
      {/* Title & Date Breadcrumb */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 leading-tight">
            {currentPageTitle}
          </h1>
          <div className="flex items-center text-xs text-slate-500 space-x-2">
            <span className="flex items-center text-indigo-600 font-medium">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              21 August 2026
            </span>
            <span>•</span>
            <span>Asia/Kolkata (UTC+05:30)</span>
            <span>•</span>
            <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">
              Selected Sample ({total} records)
            </span>
          </div>
        </div>
      </div>

      {/* Global Search & Live Stats */}
      <div className="flex items-center space-x-4">
        {/* Search Input */}
        <div className="relative w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ref, company, transcript, rep..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </div>

        {/* Coverage pill */}
        <div className="hidden lg:flex items-center space-x-2 text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-lg font-medium">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Coverage: {withTx}/{total} ({coveragePercent}%)</span>
        </div>

        {/* Import Action shortcut */}
        <button
          onClick={onNavigateToImports}
          className="flex items-center space-x-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg font-medium shadow-sm transition-colors"
          title="Open Import Engine & Replay Verification"
        >
          <Database className="w-3.5 h-3.5" />
          <span>Import / Replay</span>
        </button>
      </div>
    </header>
  );
};
