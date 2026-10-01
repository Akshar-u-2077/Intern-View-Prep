import React from 'react';
import { LayoutDashboard, Calendar, Layers, RotateCcw, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store';

export const MobileNav: React.FC = () => {
  const { currentView, setCurrentView, dailyTargetIds, progressMap } = useAppStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingRevisionsCount = Object.values(progressMap).filter(
    (p) => p.status === 'needs_revision' || (p.nextRevisionAt && p.nextRevisionAt.split('T')[0] <= todayStr)
  ).length;

  const items = [
    { id: 'dashboard' as const, label: 'Dash', icon: LayoutDashboard },
    {
      id: 'daily' as const,
      label: 'Today',
      icon: Calendar,
      badge: dailyTargetIds.length > 0 ? dailyTargetIds.length : null,
    },
    { id: 'sprints' as const, label: 'Sprints', icon: Layers },
    {
      id: 'revision' as const,
      label: 'Revise',
      icon: RotateCcw,
      badge: pendingRevisionsCount > 0 ? pendingRevisionsCount : null,
    },
    { id: 'interview' as const, label: 'Mock', icon: Sparkles },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-term-panel/95 backdrop-blur-lg border-t border-term-panelBorder px-2 py-1.5 flex items-center justify-around safe-bottom">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-lg transition-colors text-[10px] font-mono ${
              isActive ? 'text-term-green font-bold' : 'text-term-muted hover:text-term-text'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5 mb-0.5" />
              {item.badge !== null && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 min-w-3.5 text-center text-[9px] font-bold rounded-full bg-term-green text-term-bg">
                  {item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
