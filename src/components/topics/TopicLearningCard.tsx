import React, { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  BookOpen,
  Code,
  CheckCircle2,
  Calendar,
  RotateCcw,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  FileText,
  Lock,
  Save,
  Check,
  Tag,
  Clock,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useAppStore } from '../../store';
import { TopicItem, TopicStatus, StructuredLearningContent } from '../../types/curriculum';
import { getStructuredLearningContent } from '../../data/learningContentResolver';
import { isLearningContent, resolveLearningContent } from '../../data/learningContentResolverV2';
import type { LearningContent } from '../../types/learningContent';
import { StructuredLearningPanel, StructuredQuestionsPanel, StructuredResourcesPanel } from './StructuredLearningPanel';

interface Props {
  topic: TopicItem;
  onClose?: () => void;
}

export const TopicLearningCard: React.FC<Props> = ({ topic, onClose }) => {
  const {
    progressMap,
    setTopicStatus,
    toggleReadinessPillar,
    toggleTodayTarget,
    dailyTargetIds,
    notesMap,
    saveTopicNote,
    handleRevisionAction,
  } = useAppStore();

  const prog = progressMap[topic.id] || {
    topicId: topic.id,
    status: 'not_started',
    contentDone: false,
    practiceDone: false,
    recallDone: false,
    interviewDone: false,
    readinessScore: 0,
    updatedAt: new Date().toISOString(),
  };

  const isToday = dailyTargetIds.includes(topic.id);
  const userNote = notesMap[topic.id]?.content || '';
  const [noteDraft, setNoteDraft] = useState(userNote);
  const [activeTab, setActiveTab] = useState<'content' | 'questions' | 'notes' | 'resources'>('content');

  useEffect(() => {
    setNoteDraft(userNote);
  }, [userNote, topic.id]);

  const learningContent = React.useMemo(() => {
    return resolveLearningContent(topic.id, topic.title, topic.subject, getStructuredLearningContent);
  }, [topic.id, topic.title, topic.subject]);
  const structuredContent: LearningContent | null = isLearningContent(learningContent) ? learningContent : null;
  const legacyLearningContent: StructuredLearningContent | null = structuredContent ? null : learningContent as StructuredLearningContent;

  const handleSaveNotes = async () => {
    await saveTopicNote(topic.id, noteDraft);
  };

  const statusOptions: Array<{ status: TopicStatus; label: string; color: string }> = [
    { status: 'not_started', label: 'NOT STARTED', color: 'border-term-panelBorder text-term-muted hover:border-term-muted' },
    { status: 'learning', label: 'LEARNING', color: 'border-term-cyan/50 text-term-cyan bg-term-cyan/10' },
    { status: 'practiced', label: 'PRACTICED', color: 'border-term-green/50 text-term-green bg-term-green/10' },
    { status: 'interview_ready', label: 'INTERVIEW READY', color: 'border-term-purple/50 text-term-purple bg-term-purple/10' },
    { status: 'needs_revision', label: 'NEEDS REVISION', color: 'border-term-amber/50 text-term-amber bg-term-amber/10' },
  ];

  return (
    <div className="bg-term-panel border border-term-panelBorder rounded-lg shadow-2xl overflow-hidden flex flex-col h-full font-mono">
      {/* Header Bar */}
      <div className="bg-term-panelHeader px-4 py-3 border-b border-term-panelBorder flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 pr-2">
          <span className="text-[10px] px-2 py-0.5 rounded uppercase font-bold bg-term-cyan/15 text-term-cyan border border-term-cyan/30 shrink-0">
            {topic.subject}
          </span>
          <span className="text-xs text-term-muted hidden sm:inline">
            Sprint {topic.sprintNumber} : Day {topic.dayNumber}
          </span>
          <span className="text-xs text-term-darkMuted hidden sm:inline">•</span>
          <span className="text-xs text-term-muted flex items-center space-x-1 shrink-0">
            <Clock className="w-3 h-3 text-term-muted" />
            <span>{topic.duration}</span>
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => toggleTodayTarget(topic.id)}
            className={`px-2.5 py-1 rounded text-xs border transition-all flex items-center space-x-1.5 ${
              isToday
                ? 'bg-term-green/20 text-term-green border-term-green/50 font-bold'
                : 'bg-term-card hover:bg-term-cardHover text-term-muted border-term-panelBorder'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span className="hidden sm:inline">{isToday ? "Today's Target" : '+ Add to Today'}</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded text-term-muted hover:text-term-text hover:bg-term-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Title & Status Bar */}
      <div className="p-4 bg-term-card/40 border-b border-term-panelBorder space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] text-term-green font-semibold tracking-wider">
              TOPIC SPECIFICATION //
            </div>
            <h2 className="text-lg md:text-xl font-bold text-term-text mt-0.5">
              {topic.title}
            </h2>
          </div>

          {/* Quick Status Selector */}
          <div className="flex items-center flex-wrap gap-1.5">
            {statusOptions.map((opt) => {
              const isSelected = prog.status === opt.status;
              return (
                <button
                  key={opt.status}
                  onClick={() => setTopicStatus(topic.id, opt.status)}
                  className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold border transition-all ${
                    isSelected
                      ? opt.color + ' shadow-panel'
                      : 'border-term-panelBorder text-term-darkMuted hover:text-term-muted bg-term-bg'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Pillars of Interview Readiness */}
        <div className="pt-2 border-t border-term-panelBorder/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs text-term-muted font-bold">READINESS:</span>
            <span className={`text-xs font-bold ${
              prog.readinessScore === 100 ? 'text-term-green' :
              prog.readinessScore >= 50 ? 'text-term-cyan' : 'text-term-amber'
            }`}>
              {prog.readinessScore}%
            </span>
            <div className="w-24 bg-term-bg h-2 rounded overflow-hidden border border-term-panelBorder">
              <div
                className={`h-full transition-all duration-300 ${
                  prog.readinessScore === 100 ? 'bg-term-green shadow-glow-green' : 'bg-term-cyan'
                }`}
                style={{ width: `${prog.readinessScore}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[10px]">
            <button
              onClick={() => toggleReadinessPillar(topic.id, 'content')}
              className={`px-2 py-1 rounded border transition-all flex items-center justify-center space-x-1 ${
                prog.contentDone
                  ? 'bg-term-cyan/20 border-term-cyan/50 text-term-cyan font-bold'
                  : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
              }`}
            >
              <span>{prog.contentDone ? '✓' : '○'}</span>
              <span>CONTENT</span>
            </button>

            <button
              onClick={() => toggleReadinessPillar(topic.id, 'practice')}
              className={`px-2 py-1 rounded border transition-all flex items-center justify-center space-x-1 ${
                prog.practiceDone
                  ? 'bg-term-green/20 border-term-green/50 text-term-green font-bold'
                  : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
              }`}
            >
              <span>{prog.practiceDone ? '✓' : '○'}</span>
              <span>PRACTICE</span>
            </button>

            <button
              onClick={() => toggleReadinessPillar(topic.id, 'recall')}
              className={`px-2 py-1 rounded border transition-all flex items-center justify-center space-x-1 ${
                prog.recallDone
                  ? 'bg-term-amber/20 border-term-amber/50 text-term-amber font-bold'
                  : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
              }`}
            >
              <span>{prog.recallDone ? '✓' : '○'}</span>
              <span>RECALL</span>
            </button>

            <button
              onClick={() => toggleReadinessPillar(topic.id, 'interview')}
              className={`px-2 py-1 rounded border transition-all flex items-center justify-center space-x-1 ${
                prog.interviewDone
                  ? 'bg-term-purple/20 border-term-purple/50 text-term-purple font-bold'
                  : 'bg-term-bg border-term-panelBorder text-term-muted hover:text-term-text'
              }`}
            >
              <span>{prog.interviewDone ? '✓' : '○'}</span>
              <span>INTERVIEW</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-term-panel px-4 border-b border-term-panelBorder flex items-center space-x-4 text-xs">
        <button
          onClick={() => setActiveTab('content')}
          className={`py-2.5 border-b-2 font-semibold transition-colors flex items-center space-x-1.5 ${
            activeTab === 'content'
              ? 'border-term-green text-term-green'
              : 'border-transparent text-term-muted hover:text-term-text'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Core Concepts</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`py-2.5 border-b-2 font-semibold transition-colors flex items-center space-x-1.5 ${
            activeTab === 'questions'
              ? 'border-term-purple text-term-purple'
              : 'border-transparent text-term-muted hover:text-term-text'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Interview Qs ({structuredContent ? (structuredContent.interviewNotes?.length || 0) + (structuredContent.quickChecks?.length || 0) : legacyLearningContent!.commonQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`py-2.5 border-b-2 font-semibold transition-colors flex items-center space-x-1.5 ${
            activeTab === 'resources'
              ? 'border-term-cyan text-term-cyan'
              : 'border-transparent text-term-muted hover:text-term-text'
          }`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Verified Resources</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2.5 border-b-2 font-semibold transition-colors flex items-center space-x-1.5 ${
            activeTab === 'notes'
              ? 'border-term-amber text-term-amber'
              : 'border-transparent text-term-muted hover:text-term-text'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>My Notes {userNote ? '●' : ''}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 text-xs leading-relaxed">
        {activeTab === 'content' && (
          structuredContent ? <StructuredLearningPanel content={structuredContent} /> : <div className="space-y-6">
            {/* What is it? */}
            <div className="space-y-1.5 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="text-[11px] font-bold text-term-green flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4" />
                <span>WHAT IS IT?</span>
              </div>
              <p className="text-term-text text-sm">
                {legacyLearningContent!.whatIsIt}
              </p>
            </div>

            {/* Why does it matter? */}
            <div className="space-y-1.5 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="text-[11px] font-bold text-term-cyan flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>WHY DOES IT MATTER IN INTERVIEWS?</span>
              </div>
              <p className="text-term-text">
                {learningContent.whyItMatters}
              </p>
            </div>

            {/* Core Ideas */}
            <div className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="text-[11px] font-bold text-term-purple flex items-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>CORE IDEAS & INVARIANTS</span>
              </div>
              <ul className="space-y-2 pl-2">
                {legacyLearningContent!.coreIdeas.map((idea, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-term-text">
                    <span className="text-term-purple font-bold">›</span>
                    <span>{idea}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What should I know? */}
            <div className="space-y-1.5 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="text-[11px] font-bold text-term-amber flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>WHAT SHOULD I CONCRETELY KNOW?</span>
              </div>
              <p className="text-term-text">
                {legacyLearningContent!.whatShouldIKnow}
              </p>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="text-[11px] font-bold text-term-red flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>COMMON INTERVIEW MISTAKES TO AVOID</span>
              </div>
              <ul className="space-y-1.5 pl-2">
                {legacyLearningContent!.commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-term-text">
                    <span className="text-term-red font-bold">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Example / Intuition */}
            <div className="space-y-1.5 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
              <div className="text-[11px] font-bold text-term-text flex items-center space-x-1.5">
                <Code className="w-4 h-4 text-term-green" />
                <span>INTUITION & DRY-RUN EXAMPLE</span>
              </div>
              <p className="text-term-text font-mono bg-term-bg p-3 rounded border border-term-panelBorder">
                {legacyLearningContent!.exampleIntuition}
              </p>
            </div>

            {/* Practice Problem */}
            <div className="p-4 rounded-lg bg-term-green/10 border border-term-green/30 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-term-green font-bold uppercase">
                  RECOMMENDED PRACTICE
                </div>
                <div className="text-sm font-bold text-term-text mt-0.5">
                  {legacyLearningContent!.practiceProblem.title}
                </div>
                <div className="text-[11px] text-term-muted">
                  Platform: {legacyLearningContent!.practiceProblem.platform} • Difficulty: {legacyLearningContent!.practiceProblem.difficulty || 'Medium'}
                </div>
              </div>
              <a
                href={legacyLearningContent!.practiceProblem.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded bg-term-green text-term-bg font-bold text-xs flex items-center space-x-1.5 hover:bg-term-greenDim transition-colors shadow-glow-green"
              >
                <span>Solve Now</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Interview Questions Tab */}
        {activeTab === 'questions' && (
          structuredContent ? <StructuredQuestionsPanel content={structuredContent} /> : <div className="space-y-4">
            <div className="text-xs text-term-muted">
              Practice answering these questions out loud as if in a live technical interview:
            </div>

            {legacyLearningContent!.commonQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="p-4 rounded-lg bg-term-card/60 border border-term-panelBorder space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                    q.level === 'BEGINNER' ? 'bg-term-green/15 text-term-green border border-term-green/30' :
                    q.level === 'INTERMEDIATE' ? 'bg-term-cyan/15 text-term-cyan border border-term-cyan/30' :
                    q.level === 'INTERVIEW' ? 'bg-term-purple/15 text-term-purple border border-term-purple/30' :
                    'bg-term-red/15 text-term-red border border-term-red/30'
                  }`}>
                    {q.level}
                  </span>
                  <span className="text-[10px] text-term-darkMuted">Q{idx + 1}</span>
                </div>

                <div className="text-sm font-semibold text-term-text">
                  {q.question}
                </div>

                {q.answerHint && (
                  <div className="pt-2 border-t border-term-panelBorder/50 text-[11px] text-term-muted">
                    <span className="text-term-cyan font-bold">Answer Blueprint: </span>
                    {q.answerHint}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          structuredContent ? <StructuredResourcesPanel content={structuredContent} /> : <div className="space-y-4">
            <div className="text-xs text-term-muted">
              Verified high-quality documentation, editorials, and specs:
            </div>

            <div className="space-y-3">
              {legacyLearningContent!.resources.map((res, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-term-card/60 border border-term-panelBorder flex items-center justify-between group hover:border-term-panelBorder/80 transition-all"
                >
                  <div className="space-y-1 min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        res.type === 'LEARN' ? 'bg-term-cyan/15 text-term-cyan border border-term-cyan/30' :
                        res.type === 'PRACTICE' ? 'bg-term-green/15 text-term-green border border-term-green/30' :
                        'bg-term-purple/15 text-term-purple border border-term-purple/30'
                      }`}>
                        {res.type}
                      </span>
                      <span className="text-[10px] text-term-muted">{res.sourceName}</span>
                    </div>
                    <div className="text-xs font-semibold text-term-text truncate group-hover:text-term-green transition-colors">
                      {res.title}
                    </div>
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded bg-term-panel hover:bg-term-card text-term-muted hover:text-term-green border border-term-panelBorder shrink-0 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between text-xs text-term-muted">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-term-red" />
                <span className="text-term-red font-semibold">PRIVATE USER NOTES</span>
                <span>(Never exposed on public share links)</span>
              </span>
              <span>Autosaves on edit</span>
            </div>

            <div className="flex-1 min-h-[250px] bg-term-bg rounded-lg border border-term-panelBorder p-3 flex flex-col">
              <textarea
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Write your custom notes, personal reflections, tricky interview traps, or memory mnemonics here..."
                className="w-full flex-1 bg-transparent resize-none font-mono text-xs text-term-text placeholder:text-term-darkMuted focus:outline-none leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[11px] text-term-muted">
                {noteDraft.length} characters written
              </span>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded bg-term-green/20 hover:bg-term-green/30 border border-term-green/50 text-term-green font-bold text-xs flex items-center space-x-1.5 transition-all shadow-glow-green"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE MY NOTES</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Spaced Repetition Footer Controls */}
      <div className="p-3 bg-term-panelHeader border-t border-term-panelBorder flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="text-[11px] text-term-muted flex items-center space-x-2">
          <span>SPACED REPETITION:</span>
          {prog.nextRevisionAt ? (
            <span className="text-term-amber">
              Due on {prog.nextRevisionAt.split('T')[0]} ({prog.revisionIntervalDays || 2}d interval)
            </span>
          ) : (
            <span>Not scheduled yet</span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleRevisionAction(topic.id, 'snooze')}
            className="px-2.5 py-1 rounded bg-term-panel hover:bg-term-card border border-term-panelBorder text-term-muted hover:text-term-text text-[11px]"
          >
            Snooze 1d
          </button>
          <button
            onClick={() => handleRevisionAction(topic.id, 'needs_work')}
            className="px-2.5 py-1 rounded bg-term-amber/15 hover:bg-term-amber/25 border border-term-amber/40 text-term-amber text-[11px]"
          >
            Needs Work
          </button>
          <button
            onClick={() => handleRevisionAction(topic.id, 'done')}
            className="px-3 py-1 rounded bg-term-green/20 hover:bg-term-green/30 border border-term-green/50 text-term-green text-[11px] font-bold shadow-glow-green"
          >
            ✓ Mark Revised
          </button>
        </div>
      </div>
    </div>
  );
};
