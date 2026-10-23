import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, NavItem } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './features/dashboard/Dashboard';
import { ConversationInbox } from './features/inbox/ConversationInbox';
import { FollowupQueue } from './features/followup/FollowupQueue';
import { ManagerBrief } from './features/brief/ManagerBrief';
import { ImportManager } from './features/imports/ImportManager';
import { DataQuality } from './features/data-quality/DataQuality';
import { ExportManager } from './features/exports/ExportManager';
import { AboutMetrics } from './features/settings/AboutMetrics';
import { ConversationDetail } from './features/conversation-detail/ConversationDetail';

const PAGE_TITLES: Record<NavItem, string> = {
  overview: 'Overview & Analytics Dashboard',
  inbox: 'Conversation Inbox',
  queue: 'Manager Follow-up Queue',
  brief: 'Manager Daily Intelligence Brief',
  imports: 'Imports & Data Quality Replay',
  'data-quality': 'Data Quality & Trust Reference',
  exports: 'Exports & Delivery Manifest',
  about: 'Settings / About Metrics'
};

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavItem>('overview');
  const [inboxPresetFilter, setInboxPresetFilter] = useState<any>(null);

  const handleNavigateToInboxWithPreset = (preset?: any) => {
    setInboxPresetFilter(preset || null);
    setCurrentTab('inbox');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Left Sidebar */}
      <Sidebar currentTab={currentTab} onSelectTab={(tab) => {
        setInboxPresetFilter(null);
        setCurrentTab(tab);
      }} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopNav
          currentPageTitle={PAGE_TITLES[currentTab]}
          onNavigateToImports={() => setCurrentTab('imports')}
        />

        <main className="flex-1 overflow-y-auto px-6 py-6">
          {currentTab === 'overview' && (
            <Dashboard onNavigateToInbox={handleNavigateToInboxWithPreset} />
          )}
          {currentTab === 'inbox' && (
            <ConversationInbox initialFilter={inboxPresetFilter} />
          )}
          {currentTab === 'queue' && <FollowupQueue />}
          {currentTab === 'brief' && <ManagerBrief />}
          {currentTab === 'imports' && <ImportManager />}
          {currentTab === 'data-quality' && <DataQuality />}
          {currentTab === 'exports' && <ExportManager />}
          {currentTab === 'about' && <AboutMetrics />}
        </main>
      </div>

      {/* Global Conversation Detail Drawer / Modal */}
      <ConversationDetail />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;
