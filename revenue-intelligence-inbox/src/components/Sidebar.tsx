import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Inbox,
  ListTodo,
  FileText,
  Database,
  Download,
  ShieldAlert,
  HelpCircle,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export type NavItem =
  | 'overview'
  | 'inbox'
  | 'queue'
  | 'brief'
  | 'imports'
  | 'data-quality'
  | 'exports'
  | 'about';

interface SidebarProps {
  currentTab: NavItem;
  onSelectTab: (tab: NavItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const { recordsList } = useApp();

  const total = recordsList.length;
  const unreviewed = recordsList.filter(r => r.routing.reviewStatus === 'unreviewed').length;
  const followUps = recordsList.filter(r => r.analysis.recommendedAction && r.usable_transcript).length;
  const overrides = recordsList.filter(r => r.routing.isManualOverride).length;
  const discrepancies = recordsList.filter(r => r.metadata_inconsistencies.length > 0).length;

  const navItems = [
    { id: 'overview' as NavItem, label: 'Overview', icon: LayoutDashboard },
    { id: 'inbox' as NavItem, label: 'Conversation Inbox', icon: Inbox, badge: total.toString() },
    { id: 'queue' as NavItem, label: 'Follow-up Queue', icon: ListTodo, badge: followUps.toString(), badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'brief' as NavItem, label: 'Manager Brief', icon: FileText },
    { id: 'imports' as NavItem, label: 'Imports & Replay', icon: Database },
    { id: 'data-quality' as NavItem, label: 'Data Quality & Trust', icon: ShieldAlert, badge: discrepancies > 0 ? discrepancies.toString() : undefined, badgeColor: 'bg-rose-100 text-rose-800' },
    { id: 'exports' as NavItem, label: 'Exports & Manifest', icon: Download },
    { id: 'about' as NavItem, label: 'Settings / About Metrics', icon: HelpCircle }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 h-screen sticky top-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white tracking-tight text-base">SpendNest</span>
            <span className="block text-[10px] text-indigo-400 font-semibold tracking-wider uppercase -mt-1">
              Revenue Intelligence
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 px-3 pb-2 pt-1">
          Manager Workspace
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-semibold ${
                    item.badgeColor || (isActive ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Summary */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-xs text-slate-400 space-y-2">
        <div className="flex justify-between items-center text-slate-300 font-medium">
          <span>Active Dataset</span>
          <span className="text-emerald-400 font-mono">21 Aug 2026</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>Human Overrides</span>
          <span className="font-mono text-indigo-300 font-semibold">{overrides} active</span>
        </div>
        <div className="flex justify-between items-center text-[11px]">
          <span>Review Status</span>
          <span className="font-mono text-amber-300 font-semibold">{unreviewed} unreviewed</span>
        </div>
        <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Volopay Assignment</span>
          <span className="bg-slate-800 px-1.5 py-0.5 rounded">v1.0.0</span>
        </div>
      </div>
    </aside>
  );
};
