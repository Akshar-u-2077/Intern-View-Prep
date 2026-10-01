import React, { useState } from 'react';
import {
  FolderTree,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem, Subject, TopicStatus } from '../../types/curriculum';
import { TopicLearningCard } from '../topics/TopicLearningCard';

const ALL_SUBJECTS: Subject[] = [
  'DSA',
  'Java / OOP',
  'DBMS',
  'SQL',
  'Operating Systems',
  'Computer Networks',
  'LLD',
  'System Design',
  'Concurrency',
  'Security',
  'Web / APIs',
  'Other',
];

export const SubjectsView: React.FC = () => {
  const {
    selectedSubject,
    setSelectedSubject,
    selectedTopicId,
    setSelectedTopicId,
    progressMap,
    setTopicStatus,
  } = useAppStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [activeSubject, setActiveSubject] = useState<Subject>(selectedSubject || 'DSA');

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

  // Filter topics for the active subject
  const subjectTopics = React.useMemo(() => {
    return allTopics.filter((t) => {
      if (t.subject !== activeSubject) return false;
      if (searchFilter) {
        const q = searchFilter.toLowerCase();
        return t.title.toLowerCase().includes(q);
      }
      return true;
    });
  }, [allTopics, activeSubject, searchFilter]);

  // Selected topic object
  const selectedTopic = React.useMemo(() => {
    if (!selectedTopicId) return null;
    return allTopics.find((t) => t.id === selectedTopicId) || null;
  }, [allTopics, selectedTopicId]);

  // Calculate stats per subject
  const subjectStats = React.useMemo(() => {
    const stats: Record<Subject, { total: number; completed: number; ready: number }> = {} as any;
    ALL_SUBJECTS.forEach((sub) => {
      stats[sub] = { total: 0, completed: 0, ready: 0 };
    });

    allTopics.forEach((t) => {
      if (!stats[t.subject]) stats[t.subject] = { total: 0, completed: 0, ready: 0 };
      stats[t.subject].total++;
      const p = progressMap[t.id];
      if (p?.status === 'interview_ready' || p?.status === 'practiced') {
        stats[t.subject].completed++;
      }
      if (p?.status === 'interview_ready') {
        stats[t.subject].ready++;
      }
    });

    return stats;
  }, [allTopics, progressMap]);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded bg-term-purple/10 border border-term-purple/30 text-term-purple">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-term-muted font-bold tracking-wider">
                DOMAIN TAXONOMY //
              </div>
              <h1 className="text-xl font-bold text-term-text flex items-center space-x-2">
                <span>SUBJECT MASTERY DASHBOARD</span>
              </h1>
              <p className="text-xs text-term-muted mt-0.5">
                Organized cross-cutting view across 12 core computer science areas
              </p>
            </div>
          </div>

          <div className="text-xs text-term-muted bg-term-bg px-3 py-1.5 rounded border border-term-panelBorder">
            ACTIVE SUBJECT: <span className="text-term-purple font-bold">{activeSubject}</span> ({subjectStats[activeSubject]?.completed || 0}/{subjectStats[activeSubject]?.total || 0})
          </div>
        </div>

        {/* Subject Pills / Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-4">
          {ALL_SUBJECTS.map((sub) => {
            const isSelected = activeSubject === sub;
            const data = subjectStats[sub] || { total: 0, completed: 0, ready: 0 };
            const percent = Math.round((data.completed / (data.total || 1)) * 100) || 0;

            return (
              <button
                key={sub}
                onClick={() => {
                  setActiveSubject(sub);
                  setSelectedSubject(sub);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-term-purple/20 text-term-purple border-term-purple/50 shadow-glow-purple font-bold'
                    : 'bg-term-card hover:bg-term-panelBorder/70 text-term-muted border-term-panelBorder hover:text-term-text'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs truncate">{sub}</span>
                  <span className="text-[10px] font-mono">{percent}%</span>
                </div>
                <div className="w-full bg-term-bg h-1 rounded overflow-hidden mt-1.5 border border-term-panelBorder/50">
                  <div
                    className="bg-term-purple h-full rounded transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-[9px] text-term-darkMuted mt-1">
                  {data.completed}/{data.total} topics
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Topics List + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={selectedTopic ? 'lg:col-span-6 space-y-3' : 'lg:col-span-12 space-y-3'}>
          <div className="flex items-center justify-between bg-term-panel p-3 rounded-lg border border-term-panelBorder">
            <span className="text-xs text-term-muted font-bold">
              {activeSubject} TOPICS ({subjectTopics.length})
            </span>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={`Filter ${activeSubject} topics...`}
              className="px-2.5 py-1 bg-term-bg rounded border border-term-panelBorder text-xs text-term-text placeholder:text-term-darkMuted focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            {subjectTopics.map((topic) => {
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

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-term-panel border-term-purple/60 shadow-glow-purple'
                      : 'bg-term-panel hover:bg-term-card border-term-panelBorder'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 pr-2">
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
                      <div className={`text-xs font-semibold truncate ${
                        isFinished ? 'line-through text-term-muted' : 'text-term-text group-hover:text-term-purple'
                      }`}>
                        {topic.title}
                      </div>
                      <div className="text-[10px] text-term-muted flex items-center space-x-2 mt-0.5">
                        <span>Sprint {topic.sprintNumber} : Day {topic.dayNumber}</span>
                        <span>•</span>
                        <span>{topic.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      prog.status === 'interview_ready' ? 'bg-term-purple/20 text-term-purple border border-term-purple/30' :
                      prog.status === 'practiced' ? 'bg-term-green/20 text-term-green border border-term-green/30' :
                      prog.status === 'learning' ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/30' :
                      'text-term-darkMuted bg-term-bg border border-term-panelBorder'
                    }`}>
                      {prog.status.replace('_', ' ')}
                    </span>

                    <ChevronRight className="w-4 h-4 text-term-muted group-hover:text-term-purple" />
                  </div>
                </div>
              );
            })}
          </div>
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
