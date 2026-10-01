import React, { useState } from 'react';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem } from '../../types/curriculum';
import { TopicLearningCard } from '../topics/TopicLearningCard';

export const RevisionView: React.FC = () => {
  const {
    progressMap,
    handleRevisionAction,
    selectedTopicId,
    setSelectedTopicId,
    setSelectedSprintDay,
    setCurrentView,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'due' | 'all' | 'needs_work'>('due');

  // Flatten all topics
  const allTopics: TopicItem[] = React.useMemo(() => {
    const list: TopicItem[] = [];
    curriculumData.sprints.forEach((s) => {
      s.days.forEach((d) => {
        d.topics.forEach((t) => list.push(t as TopicItem));
      });
    });
    return list;
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  // Topics due for revision today or overdue
  const dueTopics = React.useMemo(() => {
    return allTopics.filter((t) => {
      const p = progressMap[t.id];
      if (!p) return false;
      if (p.status === 'needs_revision') return true;
      if (p.nextRevisionAt && p.nextRevisionAt.split('T')[0] <= todayStr) return true;
      return false;
    });
  }, [allTopics, progressMap, todayStr]);

  // Topics flagged as needs_revision explicitly
  const needsWorkTopics = React.useMemo(() => {
    return allTopics.filter((t) => progressMap[t.id]?.status === 'needs_revision');
  }, [allTopics, progressMap]);

  // All scheduled topics (interview_ready or practiced with future date)
  const scheduledTopics = React.useMemo(() => {
    return allTopics.filter((t) => {
      const p = progressMap[t.id];
      return p && p.nextRevisionAt;
    }).sort((a, b) => {
      const dateA = progressMap[a.id]?.nextRevisionAt || '';
      const dateB = progressMap[b.id]?.nextRevisionAt || '';
      return dateA.localeCompare(dateB);
    });
  }, [allTopics, progressMap]);

  // Selected topic object
  const selectedTopic = React.useMemo(() => {
    if (!selectedTopicId) return null;
    return allTopics.find((t) => t.id === selectedTopicId) || null;
  }, [allTopics, selectedTopicId]);

  const displayList = activeTab === 'due' ? dueTopics : activeTab === 'needs_work' ? needsWorkTopics : scheduledTopics;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded bg-term-amber/10 border border-term-amber/30 text-term-amber">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-term-muted font-bold tracking-wider">
                EBBINGHAUS RETENTION ENGINE //
              </div>
              <h1 className="text-xl font-bold text-term-text flex items-center space-x-2">
                <span>SPACED REPETITION REVISION QUEUE</span>
              </h1>
              <p className="text-xs text-term-muted mt-0.5">
                Spaced review schedule (2d → 7d → 21d → 60d) to cement permanent interview recall
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded bg-term-bg border border-term-panelBorder text-xs text-term-muted">
              <span className="text-term-amber font-bold">{dueTopics.length}</span> DUE TODAY
            </div>
            <div className="px-3 py-1.5 rounded bg-term-bg border border-term-panelBorder text-xs text-term-muted">
              <span className="text-term-cyan font-bold">{scheduledTopics.length}</span> IN PIPELINE
            </div>
          </div>
        </div>

        {/* Spaced Intervals Concept Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-2.5 rounded bg-term-card/60 border border-term-panelBorder">
            <div className="text-term-muted text-[10px]">INTERVAL 1</div>
            <div className="font-bold text-term-cyan mt-0.5">2 Days After Learn</div>
            <div className="text-[10px] text-term-darkMuted">Initial consolidation</div>
          </div>

          <div className="p-2.5 rounded bg-term-card/60 border border-term-panelBorder">
            <div className="text-term-muted text-[10px]">INTERVAL 2</div>
            <div className="font-bold text-term-green mt-0.5">7 Days After Review</div>
            <div className="text-[10px] text-term-darkMuted">Working memory transfer</div>
          </div>

          <div className="p-2.5 rounded bg-term-card/60 border border-term-panelBorder">
            <div className="text-term-muted text-[10px]">INTERVAL 3</div>
            <div className="font-bold text-term-purple mt-0.5">21 Days After Review</div>
            <div className="text-[10px] text-term-darkMuted">Long-term storage</div>
          </div>

          <div className="p-2.5 rounded bg-term-card/60 border border-term-panelBorder">
            <div className="text-term-muted text-[10px]">INTERVAL 4</div>
            <div className="font-bold text-term-amber mt-0.5">60 Days Maintenance</div>
            <div className="text-[10px] text-term-darkMuted">Permanent interview readiness</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-term-panel p-2 rounded-lg border border-term-panelBorder">
        <button
          onClick={() => setActiveTab('due')}
          className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center space-x-1.5 ${
            activeTab === 'due'
              ? 'bg-term-amber/20 text-term-amber border border-term-amber/40 font-bold'
              : 'text-term-muted hover:text-term-text'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Due Today ({dueTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('needs_work')}
          className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center space-x-1.5 ${
            activeTab === 'needs_work'
              ? 'bg-term-red/20 text-term-red border border-term-red/40 font-bold'
              : 'text-term-muted hover:text-term-text'
          }`}
        >
          <span>Flagged Needs Work ({needsWorkTopics.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center space-x-1.5 ${
            activeTab === 'all'
              ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/40 font-bold'
              : 'text-term-muted hover:text-term-text'
          }`}
        >
          <span>All Scheduled ({scheduledTopics.length})</span>
        </button>
      </div>

      {/* Main Split: Revision Cards + Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedTopic ? 'lg:col-span-6 space-y-3' : 'lg:col-span-12 space-y-3'}>
          {displayList.length === 0 ? (
            <div className="p-12 text-center rounded-lg border border-dashed border-term-panelBorder bg-term-panel text-xs text-term-muted space-y-2">
              <CheckCircle2 className="w-8 h-8 text-term-green mx-auto" />
              <p className="text-sm font-semibold text-term-text">Queue is completely clear!</p>
              <p>No revision items matching this filter right now. Keep marking topics Interview Ready to schedule reviews.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayList.map((topic) => {
                const p = progressMap[topic.id] || {
                  status: 'not_started',
                  revisionIntervalDays: 2,
                  revisionCount: 0,
                  updatedAt: new Date().toISOString(),
                };
                const isSelected = selectedTopicId === topic.id;
                const isOverdue = p.nextRevisionAt && p.nextRevisionAt.split('T')[0] <= todayStr;

                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`p-4 rounded-lg border transition-all cursor-pointer space-y-3 group ${
                      isSelected
                        ? 'bg-term-panel border-term-amber/60 shadow-glow-amber'
                        : 'bg-term-panel hover:bg-term-card border-term-panelBorder'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            isOverdue
                              ? 'bg-term-amber/20 text-term-amber border border-term-amber/40 animate-pulse'
                              : 'bg-term-cyan/15 text-term-cyan border border-term-cyan/30'
                          }`}>
                            {isOverdue ? 'DUE NOW' : `IN ${p.revisionIntervalDays || 2}D`}
                          </span>
                          <span className="text-[10px] text-term-muted">{topic.subject}</span>
                          <span className="text-[10px] text-term-muted">S{topic.sprintNumber}:D{topic.dayNumber}</span>
                        </div>
                        <h3 className="text-sm font-bold text-term-text mt-1 group-hover:text-term-amber transition-colors truncate">
                          {topic.title}
                        </h3>
                      </div>

                      <div className="text-right text-[11px] text-term-muted shrink-0">
                        <div>Repetition: <span className="text-term-text font-bold">#{p.revisionCount || 0}</span></div>
                        <div className="text-[10px] text-term-darkMuted">
                          {p.nextRevisionAt ? p.nextRevisionAt.split('T')[0] : 'Today'}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons: DONE / SNOOZE / NEEDS WORK */}
                    <div className="pt-2 border-t border-term-panelBorder/50 flex items-center justify-between">
                      <span className="text-[10px] text-term-muted">
                        Click card to read study guide
                      </span>

                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleRevisionAction(topic.id, 'snooze')}
                          className="px-2.5 py-1 rounded bg-term-bg hover:bg-term-panelBorder text-term-muted text-xs border border-term-panelBorder"
                        >
                          Snooze 1d
                        </button>
                        <button
                          onClick={() => handleRevisionAction(topic.id, 'needs_work')}
                          className="px-2.5 py-1 rounded bg-term-amber/10 hover:bg-term-amber/20 border border-term-amber/40 text-term-amber text-xs"
                        >
                          Needs Work
                        </button>
                        <button
                          onClick={() => handleRevisionAction(topic.id, 'done')}
                          className="px-3 py-1 rounded bg-term-green/20 hover:bg-term-green/30 border border-term-green/50 text-term-green font-bold text-xs shadow-glow-green"
                        >
                          ✓ Done (+Interval)
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selectedTopic && (
          <div className="lg:col-span-6 h-[750px] sticky top-20">
            <TopicLearningCard
              topic={selectedTopic}
              onClose={() => setSelectedTopicId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
