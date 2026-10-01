import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Flame,
  CheckCircle2,
  BookmarkCheck,
  RotateCcw,
  Layers,
  Calendar,
  Clock,
  Award
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem, Subject } from '../../types/curriculum';

export const AnalyticsView: React.FC = () => {
  const { progressMap, profile, interviewAttempts } = useAppStore();

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
  const completed = allTopics.filter(t => { const st = progressMap[t.id]?.status; return st === 'interview_ready' || st === 'practiced'; }).length;
  const learning = allTopics.filter(t => progressMap[t.id]?.status === 'learning').length;
  const interviewReady = allTopics.filter(t => progressMap[t.id]?.status === 'interview_ready').length;
  const needsRevision = allTopics.filter(t => progressMap[t.id]?.status === 'needs_revision').length;
  const notStarted = totalTopics - completed - learning - needsRevision;

  // By Subject
  const subjectStats = React.useMemo(() => {
    const map: Record<Subject, { total: number; completed: number; ready: number }> = {} as any;
    allTopics.forEach((t) => {
      if (!map[t.subject]) map[t.subject] = { total: 0, completed: 0, ready: 0 };
      map[t.subject].total++;
      const p = progressMap[t.id];
      if (p?.status === 'interview_ready' || p?.status === 'practiced') map[t.subject].completed++;
      if (p?.status === 'interview_ready') map[t.subject].ready++;
    });
    return Object.entries(map).map(([sub, data]) => ({
      subject: sub,
      ...data,
      percent: Math.round((data.completed / data.total) * 100) || 0,
    })).sort((a, b) => b.total - a.total);
  }, [allTopics, progressMap]);

  // By Sprint
  const sprintStats = curriculumData.sprints.map((sprint) => {
    let total = 0;
    let done = 0;
    sprint.days.forEach((d) => {
      d.topics.forEach((t) => {
        total++;
        const st = progressMap[t.id]?.status;
        if (st === 'interview_ready' || st === 'practiced') done++;
      });
    });
    return {
      sprintNumber: sprint.sprintNumber,
      total,
      done,
      percent: Math.round((done / (total || 1)) * 100) || 0,
    };
  });

  const renderAsciiBar = (percent: number, len = 20) => {
    const filled = Math.round((percent / 100) * len);
    return '█'.repeat(filled) + '░'.repeat(len - filled);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex items-center space-x-3 border-b border-term-panelBorder pb-4">
          <div className="p-2.5 rounded bg-term-cyan/10 border border-term-cyan/30 text-term-cyan">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-term-muted font-bold tracking-wider">METRICS_ENGINE //</div>
            <h1 className="text-xl font-bold text-term-text">PREPARATION ANALYTICS</h1>
            <p className="text-xs text-term-muted mt-0.5">Quantified readiness across all domains</p>
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-4">
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">TOTAL</div>
            <div className="text-lg font-bold text-term-text">{totalTopics}</div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">COMPLETED</div>
            <div className="text-lg font-bold text-term-green">{completed}</div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">LEARNING</div>
            <div className="text-lg font-bold text-term-cyan">{learning}</div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">INTERVIEW READY</div>
            <div className="text-lg font-bold text-term-purple">{interviewReady}</div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">NEEDS REVISION</div>
            <div className="text-lg font-bold text-term-amber">{needsRevision}</div>
          </div>
        </div>
      </div>

      {/* Subject Breakdown ASCII Chart */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-text flex items-center space-x-2">
          <Layers className="w-4 h-4 text-term-cyan" />
          <span>SUBJECT DOMAIN ANALYSIS</span>
        </div>

        <div className="space-y-2">
          {subjectStats.map((sub) => (
            <div key={sub.subject} className="flex items-center space-x-3 text-xs">
              <span className="w-32 text-term-muted truncate text-right">{sub.subject}</span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="w-full bg-term-bg h-2 rounded overflow-hidden border border-term-panelBorder">
                  <div
                    className="bg-term-cyan h-full rounded transition-all duration-500"
                    style={{ width: `${sub.percent}%` }}
                  />
                </div>
                <span className="w-8 text-right text-term-cyan font-bold shrink-0">{sub.percent}%</span>
              </div>
              <span className="text-[10px] text-term-muted w-16 text-right shrink-0">
                {sub.completed}/{sub.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Sprint Completion Chart */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-text flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-term-green" />
          <span>SPRINT-BY-SPRINT COMPLETION</span>
        </div>

        <div className="space-y-3">
          {sprintStats.map((s) => (
            <div key={s.sprintNumber} className="flex items-center space-x-3 text-xs">
              <span className="w-20 text-term-muted">Sprint {s.sprintNumber}</span>
              <div className="flex-1 flex items-center space-x-2">
                <div className="w-full bg-term-bg h-2.5 rounded overflow-hidden border border-term-panelBorder">
                  <div
                    className={`h-full rounded transition-all duration-500 ${
                      s.percent === 100 ? 'bg-term-green shadow-glow-green' : 'bg-term-green/70'
                    }`}
                    style={{ width: `${s.percent}%` }}
                  />
                </div>
                <span className={`w-8 text-right font-bold shrink-0 ${s.percent === 100 ? 'text-term-green' : 'text-term-muted'}`}>
                  {s.percent}%
                </span>
              </div>
              <span className="text-[10px] text-term-muted w-16 text-right shrink-0">
                {s.done}/{s.total}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interview Mode Stats */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="text-xs font-bold text-term-text flex items-center space-x-2">
          <Award className="w-4 h-4 text-term-purple" />
          <span>MOCK INTERVIEW PERFORMANCE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">TOTAL ATTEMPTS</div>
            <div className="text-lg font-bold text-term-text">{interviewAttempts.length}</div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">AVG CONFIDENCE</div>
            <div className="text-lg font-bold text-term-purple">
              {interviewAttempts.length > 0
                ? (interviewAttempts.reduce((s, a) => s + a.confidence, 0) / interviewAttempts.length).toFixed(1)
                : '—'
              }/5
            </div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">HIGH CONFIDENCE (4+)</div>
            <div className="text-lg font-bold text-term-green">
              {interviewAttempts.filter(a => a.confidence >= 4).length}
            </div>
          </div>
          <div className="bg-term-card/60 p-3 rounded border border-term-panelBorder text-center">
            <div className="text-[10px] text-term-muted">CURRENT STREAK</div>
            <div className="text-lg font-bold text-term-amber flex items-center justify-center space-x-1">
              <Flame className="w-5 h-5" />
              <span>{profile.streakCurrent}d</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
