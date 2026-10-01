import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Layers,
  FolderTree,
  RotateCcw,
  Sparkles,
  BarChart3,
  Settings,
  Flame,
  CheckCircle2,
  BookmarkCheck,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';

export const Sidebar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    progressMap,
    dailyTargetIds,
    profile,
  } = useAppStore();

  const totalTopics = curriculumData.totalTopics;
  const completedTopicsCount = Object.values(progressMap).filter(
    (p) => p.status === 'interview_ready' || p.status === 'practiced'
  ).length;

  const interviewReadyCount = Object.values(progressMap).filter(
    (p) => p.status === 'interview_ready'
  ).length;

  // Calculate pending revisions
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingRevisionsCount = Object.values(progressMap).filter(
    (p) => p.status === 'needs_revision' || (p.nextRevisionAt && p.nextRevisionAt.split('T')[0] <= todayStr)
  ).length;

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      shortcut: 'D',
      badge: null,
    },
    {
      id: 'daily' as const,
      label: "Today's Target",
      icon: Calendar,
      shortcut: 'T',
      badge: dailyTargetIds.length > 0 ? dailyTargetIds.length : null,
      badgeColor: 'bg-term-green/20 text-term-green border border-term-green/30',
    },
    {
      id: 'sprints' as const,
      label: 'Sprints & Days',
      icon: Layers,
      shortcut: 'S',
      badge: `${curriculumData.totalSprints} S`,
      badgeColor: 'bg-term-panelBorder text-term-muted',
    },
    {
      id: 'subjects' as const,
      label: 'Subject Taxonomy',
      icon: FolderTree,
      shortcut: 'B',
      badge: '12',
      badgeColor: 'bg-term-panelBorder text-term-muted',
    },
    {
      id: 'revision' as const,
      label: 'Revision Queue',
      icon: RotateCcw,
      shortcut: 'R',
      badge: pendingRevisionsCount > 0 ? pendingRevisionsCount : null,
      badgeColor: 'bg-term-amber/20 text-term-amber border border-term-amber/30 animate-pulse',
    },
    {
      id: 'interview' as const,
      label: 'Interview Mode',
      icon: Sparkles,
      shortcut: 'I',
      badge: 'MOCK',
      badgeColor: 'bg-term-purple/20 text-term-purple border border-term-purple/30',
    },
    {
      id: 'analytics' as const,
      label: 'Analytics',
      icon: BarChart3,
      shortcut: 'A',
      badge: null,
    },
    {
      id: 'settings' as const,
      label: 'Settings',
      icon: Settings,
      shortcut: ',',
      badge: null,
    },
  ];

  const overallPercent = Math.round((completedTopicsCount / totalTopics) * 100) || 0;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-term-panel border-r border-term-panelBorder h-[calc(100vh-53px)] select-none">
      {/* Terminal Mode Header */}
      <div className="p-3 border-b border-term-panelBorder bg-term-panelHeader">
        <div className="text-[11px] font-mono text-term-muted flex items-center justify-between">
          <span className="text-term-green font-semibold">MODULE_NAV //</span>
          <span>TTY1</span>
        </div>
      </div>

      {/* Nav Link List */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono transition-all group ${
                isActive
                  ? 'bg-term-green/15 text-term-green border border-term-green/40 shadow-glow-green font-semibold'
                  : 'text-term-muted hover:text-term-text hover:bg-term-card hover:border hover:border-term-panelBorder border border-transparent'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-term-green' : 'text-term-muted group-hover:text-term-green'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                {item.badge !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      item.badgeColor || 'bg-term-panel text-term-muted'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <kbd className="hidden lg:inline-block text-[10px] text-term-darkMuted group-hover:text-term-muted">
                  {item.shortcut}
                </kbd>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Terminal Telemetry / Progress HUD in Sidebar */}
      <div className="p-3 border-t border-term-panelBorder bg-term-panelHeader/60 space-y-3">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-term-muted">SYSTEM_READINESS</span>
          <span className="text-term-green font-bold">{overallPercent}%</span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-term-bg h-2 rounded overflow-hidden border border-term-panelBorder">
          <div
            className="bg-term-green h-full rounded transition-all duration-500 shadow-glow-green"
            style={{ width: `${overallPercent}%` }}
          />
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="bg-term-bg/60 p-2 rounded border border-term-panelBorder">
            <div className="text-term-muted text-[10px] flex items-center space-x-1">
              <Flame className="w-3 h-3 text-term-amber" />
              <span>STREAK</span>
            </div>
            <div className="font-bold text-term-amber mt-0.5">
              {profile.streakCurrent} <span className="text-[9px] text-term-muted">DAYS</span>
            </div>
          </div>
          <div className="bg-term-bg/60 p-2 rounded border border-term-panelBorder">
            <div className="text-term-muted text-[10px] flex items-center space-x-1">
              <BookmarkCheck className="w-3 h-3 text-term-cyan" />
              <span>READY</span>
            </div>
            <div className="font-bold text-term-cyan mt-0.5">
              {interviewReadyCount} <span className="text-[9px] text-term-muted">TOPICS</span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-term-darkMuted font-mono flex items-center justify-between pt-1 border-t border-term-panelBorder/50">
          <span>PROGRESS:</span>
          <span>{completedTopicsCount} / {totalTopics}</span>
        </div>
      </div>
    </aside>
  );
};
