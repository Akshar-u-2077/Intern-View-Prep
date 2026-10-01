import React, { useEffect, useRef, useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  ShieldCheck,
  Lock,
  Globe,
  Flame,
  CheckCircle2,
  BookmarkCheck,
  TrendingUp,
  Layers,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem, Subject } from '../../types/curriculum';

export const ShareView: React.FC = () => {
  const { profile, progressMap, friends, updateProfile, setCurrentView, addFriendFromInvite } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const inviteHandledRef = useRef<string | null>(null);

  const shareUrl = `${window.location.origin}/#invite/${encodeURIComponent(profile.shareSlug || profile.username)}`;

  useEffect(() => {
    const rawHash = window.location.hash.replace(/^#/, '');
    const inviteMatch = rawHash.match(/^invite\/(.+)$/i);
    if (!inviteMatch) return;

    const inviteUsername = decodeURIComponent(inviteMatch[1]);
    if (!inviteUsername || inviteUsername === (profile.shareSlug || profile.username)) return;
    const key = inviteUsername.toLowerCase();
    if (inviteHandledRef.current === key) return;

    inviteHandledRef.current = key;
    addFriendFromInvite(inviteUsername, inviteUsername.replace(/[-_]/g, ' '));
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`);
  }, [profile.shareSlug, profile.username, addFriendFromInvite]);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

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

  const totalTopics = allTopics.length;

  const completedTopics = allTopics.filter(
    (t) => progressMap[t.id]?.status === 'interview_ready' || progressMap[t.id]?.status === 'practiced'
  );

  const interviewReadyTopics = allTopics.filter(
    (t) => progressMap[t.id]?.status === 'interview_ready'
  );

  const overallPercent = Math.round((completedTopics.length / totalTopics) * 100) || 0;

  // Recently completed (last 10)
  const recentlyCompleted = React.useMemo(() => {
    return allTopics
      .filter((t) => progressMap[t.id]?.completedAt)
      .sort((a, b) => {
        const dateA = progressMap[a.id]?.completedAt || '';
        const dateB = progressMap[b.id]?.completedAt || '';
        return dateB.localeCompare(dateA);
      })
      .slice(0, 8);
  }, [allTopics, progressMap]);

  // Subject stats
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

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner & Sharing Controls */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded bg-term-purple/10 border border-term-purple/30 text-term-purple">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-term-muted font-bold tracking-wider">
                PUBLIC COLLABORATION //
              </div>
              <h1 className="text-xl font-bold text-term-text flex items-center space-x-2">
                <span>READ-ONLY SHARE LINK</span>
              </h1>
              <p className="text-xs text-term-muted mt-0.5">
                Share your interview preparation journey, subject progress, and milestones with friends or recruiters
              </p>
            </div>
          </div>

          {/* Toggle Sharing On/Off */}
          <div className="flex items-center space-x-3">
            <span className="text-xs text-term-muted">Public Sharing:</span>
            <button
              onClick={() => updateProfile({ sharingEnabled: !profile.sharingEnabled })}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                profile.sharingEnabled
                  ? 'bg-term-green/20 text-term-green border-term-green/50 shadow-glow-green'
                  : 'bg-term-red/20 text-term-red border-term-red/40'
              }`}
            >
              {profile.sharingEnabled ? '● ENABLED' : '○ DISABLED'}
            </button>
          </div>
        </div>

        {/* Share Link Field & Privacy Guarantee */}
        <div className="pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 flex items-center bg-term-bg px-3 py-2 rounded border border-term-panelBorder text-xs text-term-text truncate">
              <Globe className="w-3.5 h-3.5 text-term-muted mr-2 shrink-0" />
              <span className="truncate">{shareUrl}</span>
            </div>
            <button
              onClick={handleCopy}
              disabled={!profile.sharingEnabled}
              className={`px-4 py-2 rounded text-xs font-bold border flex items-center justify-center space-x-1.5 transition-all ${
                profile.sharingEnabled
                  ? 'bg-term-purple/20 hover:bg-term-purple/30 text-term-purple border-term-purple/50 shadow-glow-purple'
                  : 'bg-term-card text-term-muted border-term-panelBorder cursor-not-allowed opacity-50'
              }`}
            >
              {copied ? <Check className="w-4 h-4 text-term-green" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SHARE LINK'}</span>
            </button>
          </div>

          <div className="p-3 rounded bg-term-card border border-term-panelBorder">
            <div className="flex items-center justify-between text-[11px] font-bold text-term-text mb-3">
              <span className="flex items-center space-x-2">
                <Flame className="w-4 h-4 text-term-amber" />
                <span>FRIEND NETWORK</span>
              </span>
              <span className="text-term-muted">{friends.length} connected</span>
            </div>

            {friends.length === 0 ? (
              <div className="text-xs text-term-muted">
                Share your invite link with a friend and it will appear here automatically when they accept.
              </div>
            ) : (
              <div className="space-y-2">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center justify-between rounded border border-term-panelBorder bg-term-bg px-3 py-2 text-xs">
                    <div>
                      <div className="font-bold text-term-text">{friend.displayName}</div>
                      <div className="text-term-muted">@{friend.username}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-term-green font-bold">{friend.progressPercent}%</div>
                      <div className="text-term-amber">{friend.streakCurrent}d streak</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Privacy Guarantee Banner */}
          <div className="p-3 rounded bg-term-green/5 border border-term-green/20 flex items-start space-x-3 text-xs text-term-muted">
            <ShieldCheck className="w-5 h-5 text-term-green shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-term-green">STRICT PRIVACY GUARANTEE</div>
              <div>
                Viewers can inspect your overall progress, completed topics, current streak, and subject breakdown.
                Your <span className="text-term-red font-bold">private notes</span>, <span className="text-term-red font-bold">personal reflections</span>, and <span className="text-term-red font-bold">interview answers</span> are strictly shielded and never exposed.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Public Preview Card */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel shadow-panel overflow-hidden">
        {/* Mock Browser Header */}
        <div className="bg-term-panelHeader px-4 py-2.5 border-b border-term-panelBorder flex items-center justify-between text-xs text-term-muted">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-term-panelBorder"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-term-panelBorder"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-term-panelBorder"></span>
            <span className="text-term-cyan ml-2 font-bold">[ PUBLIC VIEW PREVIEW ]</span>
          </div>
          <span className="text-[11px] text-term-muted font-mono">READ-ONLY ACCESS</span>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-6">
            <div>
              <div className="text-xs text-term-green font-bold tracking-wider">
                CANDIDATE //
              </div>
              <h2 className="text-2xl font-bold text-term-text mt-0.5">
                {profile.displayName || profile.username}
              </h2>
              <div className="text-xs text-term-muted mt-1 flex items-center space-x-2">
                <span>@{profile.username}</span>
                <span>•</span>
                <span>B.E. Computer Science</span>
                <span>•</span>
                <span className="text-term-green">Preparing for SDE-1 / Placements</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-3 rounded bg-term-card border border-term-panelBorder text-center min-w-24">
                <div className="text-[10px] text-term-muted">STREAK</div>
                <div className="text-base font-bold text-term-amber mt-0.5 flex items-center justify-center space-x-1">
                  <Flame className="w-4 h-4 text-term-amber" />
                  <span>{profile.streakCurrent}d</span>
                </div>
              </div>

              <div className="p-3 rounded bg-term-card border border-term-panelBorder text-center min-w-24">
                <div className="text-[10px] text-term-muted">READY</div>
                <div className="text-base font-bold text-term-cyan mt-0.5">
                  {interviewReadyTopics.length}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview Bar */}
          <div className="p-4 rounded-lg bg-term-card/60 border border-term-panelBorder space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-term-text">OVERALL CURRICULUM READINESS</span>
              <span className="text-term-green font-bold text-sm">{overallPercent}%</span>
            </div>
            <div className="w-full bg-term-bg h-3 rounded overflow-hidden border border-term-panelBorder">
              <div
                className="bg-term-green h-full rounded transition-all duration-700 shadow-glow-green"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-term-muted pt-1">
              <span>{completedTopics.length} of {totalTopics} topics mastered</span>
              <span>{interviewReadyTopics.length} verified interview ready</span>
            </div>
          </div>

          {/* Subject Mastery Grid */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-term-text flex items-center space-x-2">
              <Layers className="w-4 h-4 text-term-cyan" />
              <span>SUBJECT DOMAIN MASTERY</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {subjectStats.slice(0, 9).map((sub) => (
                <div key={sub.subject} className="p-3 rounded bg-term-card border border-term-panelBorder text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-term-text truncate">{sub.subject}</span>
                    <span className="text-term-cyan font-bold">{sub.percent}%</span>
                  </div>
                  <div className="w-full bg-term-bg h-1.5 rounded overflow-hidden border border-term-panelBorder/50">
                    <div
                      className="bg-term-cyan h-full rounded"
                      style={{ width: `${sub.percent}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-term-muted">
                    {sub.completed} / {sub.total} completed
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Completed Topics */}
          {recentlyCompleted.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-term-text flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-term-green" />
                <span>RECENTLY MASTERED TOPICS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recentlyCompleted.map((topic) => (
                  <div
                    key={topic.id}
                    className="p-2.5 rounded bg-term-card border border-term-panelBorder flex items-center justify-between text-xs"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="font-semibold text-term-text truncate">
                        {topic.title}
                      </div>
                      <div className="text-[10px] text-term-muted mt-0.5">
                        Sprint {topic.sprintNumber} • {topic.subject}
                      </div>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-term-green/10 text-term-green border border-term-green/30 font-bold shrink-0">
                      READY
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Public Footer */}
          <div className="pt-6 border-t border-term-panelBorder/50 text-center text-xs text-term-muted">
            Powered by <span className="text-term-green font-bold">AKXR // INTERVIEW PREP TERMINAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
