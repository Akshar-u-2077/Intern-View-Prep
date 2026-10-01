import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  BookOpen,
  Code,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Filter,
  Flame,
  CheckSquare
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem } from '../../types/curriculum';

export const DailyView: React.FC = () => {
  const {
    dailyTargetIds,
    toggleTodayTarget,
    progressMap,
    setTopicStatus,
    toggleReadinessPillar,
    setSelectedTopicId,
    setSelectedSprintDay,
    setCurrentView,
    profile,
  } = useAppStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedSprintFilter, setSelectedSprintFilter] = useState<number>(0);

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

  // Today's topics
  const todayTopics = React.useMemo(() => {
    return allTopics.filter((t) => dailyTargetIds.includes(t.id));
  }, [allTopics, dailyTargetIds]);

  // Suggested candidates to add (uncompleted topics from early sprints)
  const candidateTopics = React.useMemo(() => {
    return allTopics
      .filter((t) => {
        if (dailyTargetIds.includes(t.id)) return false;
        if (selectedSprintFilter !== 0 && t.sprintNumber !== selectedSprintFilter) return false;
        if (searchFilter) {
          const q = searchFilter.toLowerCase();
          return t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
        }
        const st = progressMap[t.id]?.status;
        return !st || st === 'not_started' || st === 'learning';
      })
      .slice(0, 15);
  }, [allTopics, dailyTargetIds, selectedSprintFilter, searchFilter, progressMap]);

  const completedTodayCount = todayTopics.filter(
    (t) => progressMap[t.id]?.status === 'interview_ready' || progressMap[t.id]?.status === 'practiced'
  ).length;

  const handleOpenTopic = (topic: TopicItem) => {
    setSelectedSprintDay(topic.sprintNumber, topic.dayNumber);
    setSelectedTopicId(topic.id);
    setCurrentView('sprints');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded bg-term-green/10 border border-term-green/30 text-term-green">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-term-muted font-bold tracking-wider">
                DAILY MISSION CONTROL //
              </div>
              <h1 className="text-xl font-bold text-term-text flex items-center space-x-2">
                <span>TODAY&apos;S PREPARATION TARGETS</span>
              </h1>
              <p className="text-xs text-term-muted mt-0.5">
                Target: {profile.dailyTarget} topics/day • {completedTodayCount} of {todayTopics.length} completed today
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="px-3 py-1.5 rounded bg-term-bg border border-term-panelBorder text-xs text-term-muted">
              <span className="text-term-green font-bold">{completedTodayCount}</span> / {todayTopics.length} DONE
            </div>
          </div>
        </div>

        {/* 4 Pillars of Daily Preparation Framework */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 rounded bg-term-card/60 border border-term-panelBorder flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-term-cyan/10 text-term-cyan">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-term-muted">1. LEARN</div>
              <div className="font-bold text-term-cyan">Understand Invariants</div>
            </div>
          </div>

          <div className="p-3 rounded bg-term-card/60 border border-term-panelBorder flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-term-green/10 text-term-green">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-term-muted">2. PRACTICE</div>
              <div className="font-bold text-term-green">Dry-Run & Code</div>
            </div>
          </div>

          <div className="p-3 rounded bg-term-card/60 border border-term-panelBorder flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-term-amber/10 text-term-amber">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-term-muted">3. REVISE</div>
              <div className="font-bold text-term-amber">Spaced Spaced Repetition</div>
            </div>
          </div>

          <div className="p-3 rounded bg-term-card/60 border border-term-panelBorder flex items-center space-x-2.5">
            <div className="p-1.5 rounded bg-term-purple/10 text-term-purple">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-term-muted">4. INTERVIEW</div>
              <div className="font-bold text-term-purple">Simulate & Explain</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Split: Scheduled for Today vs Add New Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Active Schedule (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-term-muted">
            <span className="font-bold text-term-text flex items-center space-x-1.5">
              <span>ACTIVE SCHEDULE</span>
              <span className="text-term-green">({todayTopics.length})</span>
            </span>
            <span className="text-[11px]">Click title to inspect learning card</span>
          </div>

          {todayTopics.length === 0 ? (
            <div className="p-12 text-center rounded-lg border border-dashed border-term-panelBorder bg-term-panel/40 text-xs text-term-muted space-y-3">
              <p>Your today queue is empty. Choose topics from the right panel to focus on today!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTopics.map((topic) => {
                const prog = progressMap[topic.id] || {
                  status: 'not_started',
                  contentDone: false,
                  practiceDone: false,
                  recallDone: false,
                  interviewDone: false,
                  readinessScore: 0,
                };
                const isFinished = prog.status === 'interview_ready' || prog.status === 'practiced';

                return (
                  <div
                    key={topic.id}
                    className="p-3.5 rounded-lg bg-term-panel border border-term-panelBorder hover:border-term-panelBorder/80 transition-all space-y-3 group"
                  >
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div
                        className="flex items-center space-x-3 min-w-0 cursor-pointer"
                        onClick={() => handleOpenTopic(topic)}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTopicStatus(topic.id, isFinished ? 'not_started' : 'interview_ready');
                          }}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors shrink-0 ${
                            isFinished
                              ? 'bg-term-green border-term-green text-term-bg'
                              : 'border-term-muted hover:border-term-green'
                          }`}
                        >
                          {isFinished && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                        <div className="truncate">
                          <h3 className={`text-sm font-semibold truncate ${isFinished ? 'line-through text-term-muted' : 'text-term-text group-hover:text-term-green'}`}>
                            {topic.title}
                          </h3>
                          <div className="text-[11px] text-term-muted flex items-center space-x-2 mt-0.5">
                            <span>Sprint {topic.sprintNumber} : Day {topic.dayNumber}</span>
                            <span>•</span>
                            <span className="text-term-cyan">{topic.subject}</span>
                            <span>•</span>
                            <span>{topic.duration}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <button
                          onClick={() => toggleTodayTarget(topic.id)}
                          className="p-1 rounded text-term-muted hover:text-term-red transition-colors"
                          title="Remove from Today"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenTopic(topic)}
                          className="p-1 rounded text-term-muted hover:text-term-green transition-colors"
                          title="Open Topic Card"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 4 Pillars Readiness Mini Toggles */}
                    <div className="pt-2 border-t border-term-panelBorder/50 grid grid-cols-4 gap-2 text-[10px]">
                      <button
                        onClick={() => toggleReadinessPillar(topic.id, 'content')}
                        className={`py-1 px-1.5 rounded border text-center transition-all ${
                          prog.contentDone
                            ? 'bg-term-cyan/20 border-term-cyan/50 text-term-cyan font-bold'
                            : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
                        }`}
                      >
                        {prog.contentDone ? '✓ ' : ''}CONTENT
                      </button>

                      <button
                        onClick={() => toggleReadinessPillar(topic.id, 'practice')}
                        className={`py-1 px-1.5 rounded border text-center transition-all ${
                          prog.practiceDone
                            ? 'bg-term-green/20 border-term-green/50 text-term-green font-bold'
                            : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
                        }`}
                      >
                        {prog.practiceDone ? '✓ ' : ''}PRACTICE
                      </button>

                      <button
                        onClick={() => toggleReadinessPillar(topic.id, 'recall')}
                        className={`py-1 px-1.5 rounded border text-center transition-all ${
                          prog.recallDone
                            ? 'bg-term-amber/20 border-term-amber/50 text-term-amber font-bold'
                            : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
                        }`}
                      >
                        {prog.recallDone ? '✓ ' : ''}RECALL
                      </button>

                      <button
                        onClick={() => toggleReadinessPillar(topic.id, 'interview')}
                        className={`py-1 px-1.5 rounded border text-center transition-all ${
                          prog.interviewDone
                            ? 'bg-term-purple/20 border-term-purple/50 text-term-purple font-bold'
                            : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
                        }`}
                      >
                        {prog.interviewDone ? '✓ ' : ''}INTERVIEW
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Targets / Curriculum Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-term-muted">
            <span className="font-bold text-term-text">ADD TO TODAY&apos;S TARGETS</span>
            <span className="text-[11px]">Quick Queue</span>
          </div>

          <div className="p-3 rounded-lg bg-term-panel border border-term-panelBorder space-y-3">
            {/* Filters */}
            <div className="space-y-2">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search curriculum to add..."
                className="w-full px-3 py-1.5 bg-term-bg rounded border border-term-panelBorder text-xs text-term-text placeholder:text-term-darkMuted focus:outline-none focus:border-term-green/50"
              />

              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  onClick={() => setSelectedSprintFilter(0)}
                  className={`px-2 py-0.5 rounded shrink-0 border ${
                    selectedSprintFilter === 0
                      ? 'bg-term-green/20 text-term-green border-term-green/40'
                      : 'bg-term-card text-term-muted border-term-panelBorder hover:text-term-text'
                  }`}
                >
                  All Sprints
                </button>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSprintFilter(s)}
                    className={`px-2 py-0.5 rounded shrink-0 border ${
                      selectedSprintFilter === s
                        ? 'bg-term-green/20 text-term-green border-term-green/40'
                        : 'bg-term-card text-term-muted border-term-panelBorder hover:text-term-text'
                    }`}
                  >
                    Sprint {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Candidates list */}
            <div className="divide-y divide-term-panelBorder/40 max-h-[500px] overflow-y-auto">
              {candidateTopics.length === 0 ? (
                <div className="py-8 text-center text-xs text-term-muted">
                  No topics match filters
                </div>
              ) : (
                candidateTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className="py-2.5 flex items-center justify-between text-xs group"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-term-text truncate group-hover:text-term-cyan">
                        {topic.title}
                      </div>
                      <div className="text-[10px] text-term-muted flex items-center space-x-2 mt-0.5">
                        <span>S{topic.sprintNumber}:D{topic.dayNumber}</span>
                        <span>•</span>
                        <span>{topic.subject}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTodayTarget(topic.id)}
                      className="px-2.5 py-1 rounded bg-term-card hover:bg-term-green/20 border border-term-panelBorder hover:border-term-green/40 text-term-muted hover:text-term-green text-xs flex items-center space-x-1 shrink-0 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
