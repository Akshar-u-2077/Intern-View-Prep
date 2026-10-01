import React, { useState } from 'react';
import {
  Layers,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Clock,
  BookOpen,
  Filter,
  Search,
  CheckSquare,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem, SprintItem, DayItem, TopicStatus } from '../../types/curriculum';
import { TopicLearningCard } from '../topics/TopicLearningCard';

export const SprintsView: React.FC = () => {
  const {
    selectedSprintNumber,
    selectedDayNumber,
    selectedTopicId,
    setSelectedSprintDay,
    setSelectedTopicId,
    progressMap,
    setTopicStatus,
    toggleTodayTarget,
    dailyTargetIds,
  } = useAppStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Currently selected sprint
  const currentSprint = curriculumData.sprints.find(
    (s) => s.sprintNumber === selectedSprintNumber
  ) || curriculumData.sprints[0];

  // Currently selected topic item
  const selectedTopic = React.useMemo(() => {
    if (!selectedTopicId) return null;
    for (const s of curriculumData.sprints) {
      for (const d of s.days) {
        const found = d.topics.find((t) => t.id === selectedTopicId);
        if (found) return found as TopicItem;
      }
    }
    return null;
  }, [selectedTopicId]);

  // Sprint completion calculation
  const getSprintCompletion = (sprint: typeof curriculumData.sprints[0]) => {
    let total = 0;
    let completed = 0;
    sprint.days.forEach((d) => {
      d.topics.forEach((t) => {
        total++;
        const st = progressMap[t.id]?.status;
        if (st === 'interview_ready' || st === 'practiced') {
          completed++;
        }
      });
    });
    return {
      total,
      completed,
      percent: Math.round((completed / (total || 1)) * 100) || 0,
    };
  };

  const currentSprintStats = getSprintCompletion(currentSprint);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Sprint Header & Tabs */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded bg-term-cyan/10 border border-term-cyan/30 text-term-cyan">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-term-muted font-bold tracking-wider">
                CURRICULUM ENGINE //
              </div>
              <h1 className="text-xl font-bold text-term-text flex items-center space-x-2">
                <span>{currentSprint.title}</span>
                <span className="text-xs font-normal text-term-muted px-2 py-0.5 rounded bg-term-bg border border-term-panelBorder">
                  {currentSprint.duration}
                </span>
              </h1>
              <p className="text-xs text-term-muted mt-0.5">
                {currentSprint.days.length} Days • {currentSprintStats.completed} / {currentSprintStats.total} Topics Done ({currentSprintStats.percent}%)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-xs text-term-muted">
              <span>SPRINT PROGRESS</span>
              <span className="text-term-cyan font-bold">{currentSprintStats.percent}%</span>
            </div>
            <div className="w-full bg-term-bg h-2 rounded overflow-hidden border border-term-panelBorder">
              <div
                className="bg-term-cyan h-full rounded transition-all duration-500 shadow-glow-cyan"
                style={{ width: `${currentSprintStats.percent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sprint Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-4 pb-1">
          {curriculumData.sprints.map((sprint) => {
            const isSelected = sprint.sprintNumber === selectedSprintNumber;
            const stats = getSprintCompletion(sprint);
            return (
              <button
                key={sprint.id}
                onClick={() => {
                  setSelectedSprintDay(sprint.sprintNumber, 1);
                  setSelectedTopicId(null);
                }}
                className={`px-3 py-2 rounded-lg border text-xs whitespace-nowrap transition-all flex flex-col items-start ${
                  isSelected
                    ? 'bg-term-cyan/15 text-term-cyan border-term-cyan/50 font-bold shadow-glow-cyan'
                    : 'bg-term-card hover:bg-term-panelBorder text-term-muted border-term-panelBorder hover:text-term-text'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>Sprint {sprint.sprintNumber}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-term-cyan' : 'text-term-darkMuted'}`}>
                    {stats.percent}%
                  </span>
                </div>
                <div className="text-[10px] text-term-darkMuted font-normal">
                  {sprint.duration}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Days & Topics (Left) + Topic Learning Card (Right / Drawer) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Days & Topic List */}
        <div className={selectedTopic ? 'lg:col-span-6 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Day Navigation & Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-term-panel p-3 rounded-lg border border-term-panelBorder">
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
              {currentSprint.days.map((day) => {
                const isSelected = day.dayNumber === selectedDayNumber;
                return (
                  <button
                    key={day.id}
                    onClick={() => {
                      setSelectedSprintDay(selectedSprintNumber, day.dayNumber);
                    }}
                    className={`px-3 py-1.5 rounded text-xs transition-all shrink-0 ${
                      isSelected
                        ? 'bg-term-green/20 text-term-green border border-term-green/40 font-bold'
                        : 'bg-term-bg hover:bg-term-card text-term-muted border border-term-panelBorder hover:text-term-text'
                    }`}
                  >
                    Day {day.dayNumber} ({day.topics.length})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Filter day's topics..."
                className="px-2.5 py-1 bg-term-bg rounded border border-term-panelBorder text-xs text-term-text placeholder:text-term-darkMuted focus:outline-none"
              />
            </div>
          </div>

          {/* Topics in Selected Day */}
          {currentSprint.days
            .filter((d) => d.dayNumber === selectedDayNumber)
            .map((day) => {
              const filteredTopics = day.topics.filter((t) => {
                if (!searchFilter) return true;
                const q = searchFilter.toLowerCase();
                return t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
              });

              return (
                <div key={day.id} className="space-y-2.5">
                  <div className="flex items-center justify-between px-1 text-xs text-term-muted">
                    <span className="font-bold text-term-text">
                      {day.title} • {day.duration}
                    </span>
                    <span>{filteredTopics.length} Topics</span>
                  </div>

                  <div className="space-y-2">
                    {filteredTopics.map((topic) => {
                      const prog = progressMap[topic.id] || {
                        status: 'not_started',
                        contentDone: false,
                        practiceDone: false,
                        recallDone: false,
                        interviewDone: false,
                        readinessScore: 0,
                      };
                      const isFinished = prog.status === 'interview_ready' || prog.status === 'practiced';
                      const isSelected = selectedTopicId === topic.id;
                      const isToday = dailyTargetIds.includes(topic.id);

                      return (
                        <div
                          key={topic.id}
                          onClick={() => setSelectedTopicId(topic.id)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                            isSelected
                              ? 'bg-term-panel border-term-green/60 shadow-glow-green'
                              : 'bg-term-panel hover:bg-term-card hover:border-term-panelBorder/90 border-term-panelBorder'
                          }`}
                        >
                          <div className="flex items-center space-x-3 min-w-0 pr-2">
                            {/* Instant Toggle Checkbox */}
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
                              <div className="flex items-center space-x-2">
                                <span className={`text-xs font-semibold truncate ${
                                  isFinished ? 'line-through text-term-muted' : 'text-term-text group-hover:text-term-green'
                                }`}>
                                  {topic.title}
                                </span>
                                {isToday && (
                                  <span className="px-1 py-0.2 rounded text-[9px] bg-term-green/10 text-term-green border border-term-green/30 shrink-0">
                                    TODAY
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-term-muted flex items-center space-x-2 mt-0.5">
                                <span className="text-term-cyan">{topic.subject}</span>
                                <span>•</span>
                                <span>{topic.duration}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Pillar Indicators & Status Pill */}
                          <div className="flex items-center space-x-3 shrink-0">
                            {/* Readiness Pill */}
                            <div className="hidden sm:flex items-center space-x-1 text-[10px]">
                              <span className={`w-2 h-2 rounded-full ${prog.contentDone ? 'bg-term-cyan' : 'bg-term-panelBorder'}`} title="Content" />
                              <span className={`w-2 h-2 rounded-full ${prog.practiceDone ? 'bg-term-green' : 'bg-term-panelBorder'}`} title="Practice" />
                              <span className={`w-2 h-2 rounded-full ${prog.recallDone ? 'bg-term-amber' : 'bg-term-panelBorder'}`} title="Recall" />
                              <span className={`w-2 h-2 rounded-full ${prog.interviewDone ? 'bg-term-purple' : 'bg-term-panelBorder'}`} title="Interview" />
                            </div>

                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              prog.status === 'interview_ready' ? 'bg-term-purple/20 text-term-purple border border-term-purple/30' :
                              prog.status === 'practiced' ? 'bg-term-green/20 text-term-green border border-term-green/30' :
                              prog.status === 'learning' ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/30' :
                              prog.status === 'needs_revision' ? 'bg-term-amber/20 text-term-amber border border-term-amber/30' :
                              'text-term-darkMuted bg-term-bg border border-term-panelBorder'
                            }`}>
                              {prog.status.replace('_', ' ')}
                            </span>

                            <ChevronRight className="w-4 h-4 text-term-muted group-hover:text-term-green transition-transform" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Right Side: Topic Learning Card (Split Screen) */}
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
