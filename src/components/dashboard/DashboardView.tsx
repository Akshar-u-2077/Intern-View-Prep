import React from 'react';
import {
  Flame,
  CheckCircle2,
  BookmarkCheck,
  AlertTriangle,
  ArrowRight,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Calendar,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem, Subject } from '../../types/curriculum';

export const DashboardView: React.FC = () => {
  const {
    progressMap,
    dailyTargetIds,
    profile,
    setCurrentView,
    setSelectedTopicId,
    setSelectedSprintDay,
    setSelectedSubject,
    setTopicStatus,
    toggleTodayTarget,
  } = useAppStore();

  // Flatten all topics for calculations
  const allTopics: TopicItem[] = React.useMemo(() => {
    const list: TopicItem[] = [];
    curriculumData.sprints.forEach((s) => {
      s.days.forEach((d) => {
        d.topics.forEach((t) => list.push(t as TopicItem));
      });
    });
    return list;
  }, []);

  const totalTopics = allTopics.length;

  // Calculated counts
  const completedTopics = allTopics.filter(
    (t) => progressMap[t.id]?.status === 'interview_ready' || progressMap[t.id]?.status === 'practiced'
  );
  const interviewReadyTopics = allTopics.filter(
    (t) => progressMap[t.id]?.status === 'interview_ready'
  );
  const learningTopics = allTopics.filter(
    (t) => progressMap[t.id]?.status === 'learning'
  );
  const needsRevisionTopics = allTopics.filter(
    (t) => progressMap[t.id]?.status === 'needs_revision'
  );

  const overallPercent = Math.round((completedTopics.length / totalTopics) * 100) || 0;

  // Find Current Objective: first sprint/day with uncompleted topics
  const currentObjective = React.useMemo(() => {
    for (const sprint of curriculumData.sprints) {
      for (const day of sprint.days) {
        const hasUncompleted = day.topics.some(
          (t) => {
            const st = progressMap[t.id]?.status;
            return !st || st === 'not_started' || st === 'learning';
          }
        );
        if (hasUncompleted) {
          return {
            sprintNumber: sprint.sprintNumber,
            dayNumber: day.dayNumber,
            dayTitle: day.title,
            sprintTitle: sprint.title,
            firstTopic: day.topics.find(
              (t) => !progressMap[t.id] || progressMap[t.id].status === 'not_started' || progressMap[t.id].status === 'learning'
            ) as TopicItem || day.topics[0] as TopicItem,
          };
        }
      }
    }
    return {
      sprintNumber: 1,
      dayNumber: 1,
      dayTitle: 'Day 1',
      sprintTitle: 'Sprint 1',
      firstTopic: allTopics[0],
    };
  }, [allTopics, progressMap]);

  // Today's topics objects
  const todayTopics = React.useMemo(() => {
    return allTopics.filter((t) => dailyTargetIds.includes(t.id));
  }, [allTopics, dailyTargetIds]);

  // Pending revisions list
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingRevisions = React.useMemo(() => {
    return allTopics.filter((t) => {
      const p = progressMap[t.id];
      if (!p) return false;
      if (p.status === 'needs_revision') return true;
      if (p.nextRevisionAt && p.nextRevisionAt.split('T')[0] <= todayStr) return true;
      return false;
    }).slice(0, 5);
  }, [allTopics, progressMap, todayStr]);

  // Subject statistics calculation
  const subjectStats = React.useMemo(() => {
    const map: Record<Subject, { total: number; completed: number }> = {} as any;
    allTopics.forEach((t) => {
      if (!map[t.subject]) map[t.subject] = { total: 0, completed: 0 };
      map[t.subject].total++;
      const st = progressMap[t.id]?.status;
      if (st === 'interview_ready' || st === 'practiced') {
        map[t.subject].completed++;
      }
    });
    return Object.entries(map).map(([subject, data]) => ({
      subject: subject as Subject,
      total: data.total,
      completed: data.completed,
      percent: Math.round((data.completed / data.total) * 100) || 0,
    })).sort((a, b) => b.total - a.total);
  }, [allTopics, progressMap]);

  // Generate ASCII progress bar
  const renderAsciiProgressBar = (percent: number, length = 20) => {
    const filledCount = Math.round((percent / 100) * length);
    const emptyCount = length - filledCount;
    return '█'.repeat(filledCount) + '░'.repeat(emptyCount);
  };

  const handleOpenTopic = (topic: TopicItem) => {
    setSelectedSprintDay(topic.sprintNumber, topic.dayNumber);
    setSelectedTopicId(topic.id);
    setCurrentView('sprints');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-12">
      {/* Hacker Terminal HUD Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel shadow-panel overflow-hidden">
        <div className="bg-term-panelHeader px-4 py-2 border-b border-term-panelBorder flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-term-red/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-term-amber/80"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-term-green/80"></span>
            <span className="text-term-muted ml-2 font-semibold">
              AKXR // INTERVIEW PREP TERMINAL
            </span>
          </div>
          <div className="text-term-green flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-term-green animate-ping"></span>
            <span>STATUS: ONLINE</span>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          {/* Main Top Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* OVERALL PROGRESS */}
            <div className="lg:col-span-2 space-y-3 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-term-muted font-bold tracking-wider">
                  OVERALL PREPARATION PROGRESS
                </span>
                <span className="text-term-green font-bold text-base">
                  {overallPercent}%
                </span>
              </div>

              {/* ASCII + Modern Neon Progress Bar */}
              <div className="space-y-1">
                <div className="w-full bg-term-bg h-3 rounded overflow-hidden border border-term-panelBorder">
                  <div
                    className="h-full bg-gradient-to-r from-term-greenDim to-term-green shadow-glow-green transition-all duration-700 rounded"
                    style={{ width: `${overallPercent}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-term-muted tracking-widest hidden sm:block">
                  [{renderAsciiProgressBar(overallPercent, 32)}] {overallPercent}%
                </div>
              </div>

              {/* Breakdown stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-term-panelBorder/50 text-xs font-mono">
                <div>
                  <div className="text-term-muted text-[10px]">TOTAL TOPICS</div>
                  <div className="font-bold text-term-text">{totalTopics}</div>
                </div>
                <div>
                  <div className="text-term-muted text-[10px]">COMPLETED</div>
                  <div className="font-bold text-term-green">{completedTopics.length}</div>
                </div>
                <div>
                  <div className="text-term-muted text-[10px]">IN PROGRESS</div>
                  <div className="font-bold text-term-cyan">{learningTopics.length}</div>
                </div>
                <div>
                  <div className="text-term-muted text-[10px]">READY FOR INTERVIEW</div>
                  <div className="font-bold text-term-purple">{interviewReadyTopics.length}</div>
                </div>
              </div>
            </div>

            {/* CURRENT OBJECTIVE */}
            <div className="bg-term-card/60 p-4 rounded-lg border border-term-panelBorder flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] font-mono text-term-muted font-bold tracking-wider flex items-center justify-between">
                  <span>CURRENT OBJECTIVE</span>
                  <span className="text-term-cyan">SPRINT {currentObjective.sprintNumber}</span>
                </div>
                <div className="mt-2 text-sm font-mono font-bold text-term-text flex items-center space-x-1.5">
                  <span className="text-term-green">{'>'}</span>
                  <span>SPRINT_{String(currentObjective.sprintNumber).padStart(2, '0')} // DAY_{String(currentObjective.dayNumber).padStart(2, '0')}</span>
                </div>
                <p className="mt-1 text-xs font-mono text-term-muted line-clamp-2">
                  Next target: <span className="text-term-cyan">{currentObjective.firstTopic?.title}</span>
                </p>
              </div>

              <button
                onClick={() => handleOpenTopic(currentObjective.firstTopic)}
                className="w-full mt-2 py-2 px-3 rounded bg-term-green/15 hover:bg-term-green/25 border border-term-green/40 text-term-green text-xs font-mono font-bold flex items-center justify-center space-x-2 transition-all shadow-glow-green"
              >
                <Play className="w-3.5 h-3.5 fill-term-green" />
                <span>RESUME SPRINT {currentObjective.sprintNumber}</span>
              </button>
            </div>
          </div>

          {/* Vitals & Telemetry Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-term-card/40 p-3 rounded border border-term-panelBorder flex items-center space-x-3">
              <div className="p-2 rounded bg-term-amber/10 border border-term-amber/30 text-term-amber">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-term-muted">STREAK</div>
                <div className="text-sm font-mono font-bold text-term-amber">
                  {profile.streakCurrent} <span className="text-xs font-normal">DAYS</span>
                </div>
              </div>
            </div>

            <div className="bg-term-card/40 p-3 rounded border border-term-panelBorder flex items-center space-x-3">
              <div className="p-2 rounded bg-term-green/10 border border-term-green/30 text-term-green">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-term-muted">TOPICS DONE</div>
                <div className="text-sm font-mono font-bold text-term-green">
                  {completedTopics.length} <span className="text-xs text-term-muted font-normal">/ {totalTopics}</span>
                </div>
              </div>
            </div>

            <div className="bg-term-card/40 p-3 rounded border border-term-panelBorder flex items-center space-x-3">
              <div className="p-2 rounded bg-term-cyan/10 border border-term-cyan/30 text-term-cyan">
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-term-muted">INTERVIEW READY</div>
                <div className="text-sm font-mono font-bold text-term-cyan">
                  {interviewReadyTopics.length} <span className="text-xs text-term-muted font-normal">TOPICS</span>
                </div>
              </div>
            </div>

            <div className="bg-term-card/40 p-3 rounded border border-term-panelBorder flex items-center space-x-3">
              <div className="p-2 rounded bg-term-purple/10 border border-term-purple/30 text-term-purple">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-mono text-term-muted">REVISION QUEUE</div>
                <div className="text-sm font-mono font-bold text-term-purple">
                  {pendingRevisions.length} <span className="text-xs text-term-muted font-normal">PENDING</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today & Revision Split Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TODAY'S TARGETS */}
            <div className="bg-term-card/60 rounded-lg border border-term-panelBorder p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-term-text">
                  <Calendar className="w-4 h-4 text-term-green" />
                  <span>TODAY&apos;S FOCUS TARGETS</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-term-green/10 text-term-green border border-term-green/30">
                    {todayTopics.length} ACTIVE
                  </span>
                </div>
                <button
                  onClick={() => setCurrentView('daily')}
                  className="text-xs font-mono text-term-muted hover:text-term-green flex items-center space-x-1"
                >
                  <span>Open Daily Mode</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {todayTopics.length === 0 ? (
                <div className="p-6 text-center rounded border border-dashed border-term-panelBorder text-xs font-mono text-term-muted space-y-2">
                  <p>No topics scheduled for today yet.</p>
                  <button
                    onClick={() => setCurrentView('daily')}
                    className="px-3 py-1.5 rounded bg-term-panel hover:bg-term-panelBorder text-term-green border border-term-green/30"
                  >
                    + Pick Today&apos;s Targets
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTopics.map((topic) => {
                    const isDone = progressMap[topic.id]?.status === 'interview_ready' || progressMap[topic.id]?.status === 'practiced';
                    return (
                      <div
                        key={topic.id}
                        className="flex items-center justify-between p-2.5 rounded bg-term-panel hover:bg-term-cardHover border border-term-panelBorder text-xs font-mono transition-all group"
                      >
                        <div
                          className="flex items-center space-x-2.5 min-w-0 cursor-pointer"
                          onClick={() => handleOpenTopic(topic)}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTopicStatus(topic.id, isDone ? 'not_started' : 'interview_ready');
                            }}
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-term-green border-term-green text-term-bg'
                                : 'border-term-muted group-hover:border-term-green'
                            }`}
                          >
                            {isDone && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                          </button>
                          <span className={`truncate ${isDone ? 'line-through text-term-muted' : 'text-term-text'}`}>
                            {topic.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[10px] text-term-muted px-1.5 py-0.5 rounded bg-term-bg border border-term-panelBorder">
                            {topic.subject}
                          </span>
                          <button
                            onClick={() => handleOpenTopic(topic)}
                            className="text-term-muted hover:text-term-green"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* REVISION QUEUE SNIPPET */}
            <div className="bg-term-card/60 rounded-lg border border-term-panelBorder p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-term-text">
                  <RotateCcw className="w-4 h-4 text-term-amber" />
                  <span>SPACED REPETITION QUEUE</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-term-amber/10 text-term-amber border border-term-amber/30">
                    {pendingRevisions.length} DUE
                  </span>
                </div>
                <button
                  onClick={() => setCurrentView('revision')}
                  className="text-xs font-mono text-term-muted hover:text-term-amber flex items-center space-x-1"
                >
                  <span>Full Queue</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {pendingRevisions.length === 0 ? (
                <div className="p-6 text-center rounded border border-dashed border-term-panelBorder text-xs font-mono text-term-muted">
                  <p>All caught up on spaced repetition! No reviews due today.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingRevisions.map((topic) => (
                    <div
                      key={topic.id}
                      onClick={() => handleOpenTopic(topic)}
                      className="flex items-center justify-between p-2.5 rounded bg-term-panel hover:bg-term-cardHover border border-term-panelBorder text-xs font-mono transition-all cursor-pointer group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <AlertTriangle className="w-3.5 h-3.5 text-term-amber shrink-0 animate-pulse" />
                        <span className="text-term-text group-hover:text-term-amber truncate">
                          {topic.title}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="text-[10px] text-term-muted">
                          S{topic.sprintNumber}:D{topic.dayNumber}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-term-muted group-hover:text-term-amber" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SUBJECT MASTERY OVERVIEW */}
          <div className="bg-term-card/60 rounded-lg border border-term-panelBorder p-4 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-term-text flex items-center space-x-2">
                <Layers className="w-4 h-4 text-term-cyan" />
                <span>SUBJECT TAXONOMY BREAKDOWN</span>
              </span>
              <button
                onClick={() => setCurrentView('subjects')}
                className="text-term-muted hover:text-term-cyan flex items-center space-x-1"
              >
                <span>View All 12 Subjects</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {subjectStats.map((item) => (
                <div
                  key={item.subject}
                  onClick={() => {
                    setSelectedSubject(item.subject);
                    setCurrentView('subjects');
                  }}
                  className="p-3 rounded bg-term-panel hover:bg-term-cardHover border border-term-panelBorder hover:border-term-cyan/40 transition-all cursor-pointer text-xs font-mono group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-term-text group-hover:text-term-cyan truncate">
                      {item.subject}
                    </span>
                    <span className="text-term-cyan font-bold">{item.percent}%</span>
                  </div>

                  <div className="w-full bg-term-bg h-1.5 rounded overflow-hidden mt-2 border border-term-panelBorder">
                    <div
                      className="bg-term-cyan h-full rounded transition-all duration-500"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-term-muted mt-1.5">
                    <span>{item.completed} / {item.total} done</span>
                    <span className="text-term-darkMuted group-hover:text-term-muted">Explore →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Hacker Terminal Keyboard Shortcuts Footer */}
          <div className="p-3 bg-term-panelHeader/60 rounded border border-term-panelBorder/70 text-[11px] font-mono text-term-muted flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <span className="text-term-green font-bold">HOTKEYS //</span>
              <span><kbd className="px-1 py-0.5 rounded bg-term-bg border border-term-panelBorder text-term-text">SPACE</kbd> Toggle Done</span>
              <span><kbd className="px-1 py-0.5 rounded bg-term-bg border border-term-panelBorder text-term-text">R</kbd> Revision</span>
              <span><kbd className="px-1 py-0.5 rounded bg-term-bg border border-term-panelBorder text-term-text">I</kbd> Mock Mode</span>
              <span><kbd className="px-1 py-0.5 rounded bg-term-bg border border-term-panelBorder text-term-text">N</kbd> Notes</span>
              <span><kbd className="px-1 py-0.5 rounded bg-term-bg border border-term-panelBorder text-term-text">/</kbd> Search</span>
            </div>
            <div className="text-[10px] text-term-darkMuted">
              AKXR OPERATING SYSTEM • PERSISTENCE ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
