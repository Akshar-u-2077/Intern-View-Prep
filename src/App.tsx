import React, { useEffect } from 'react';
import { useAppStore } from './store';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickNotesModal } from './components/layout/QuickNotesModal';
import { DashboardView } from './components/dashboard/DashboardView';
import { DailyView } from './components/daily/DailyView';
import { SprintsView } from './components/sprints/SprintsView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { RevisionView } from './components/revision/RevisionView';
import { InterviewModeView } from './components/interview/InterviewModeView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ShareView } from './components/share/ShareView';
import { SettingsView } from './components/settings/SettingsView';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  const { currentView, initializeApp, isLoading } = useAppStore();

  useKeyboardShortcuts();

  useEffect(() => {
    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-term-bg text-term-text font-mono flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded bg-term-panel border border-term-green/50 flex items-center justify-center text-term-green shadow-glow-green animate-pulse">
          <span className="text-xl font-bold">{'>_'}</span>
        </div>
        <div className="text-xs text-term-green font-bold tracking-widest animate-pulse">
          BOOTING AKXR INTERVIEW PREP TERMINAL...
        </div>
        <div className="text-[10px] text-term-muted">
          Loading 712 topics, IndexedDB cache & offline persistence engine...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-term-bg text-term-text font-mono flex flex-col antialiased selection:bg-term-green/20 selection:text-term-green">
      {/* Scanline background overlay */}
      <div className="scanlines fixed inset-0 z-50 pointer-events-none opacity-30"></div>

      {/* Top Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto min-h-screen">
          {currentView === 'dashboard' && <DashboardView />}
          {currentView === 'daily' && <DailyView />}
          {currentView === 'sprints' && <SprintsView />}
          {currentView === 'subjects' && <SubjectsView />}
          {currentView === 'revision' && <RevisionView />}
          {currentView === 'interview' && <InterviewModeView />}
          {currentView === 'analytics' && <AnalyticsView />}
          {currentView === 'share' && <ShareView />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Global Command Palette */}
      <CommandPalette />

      {/* Quick Scratchpad Modal */}
      <QuickNotesModal />
    </div>
  );
}
