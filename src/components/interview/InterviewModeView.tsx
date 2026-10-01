import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Shuffle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  History,
  Award,
  ChevronRight,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useAppStore } from '../../store';
import curriculumData from '../../data/curriculum.json';
import { TopicItem, Subject, InterviewQuestion } from '../../types/curriculum';
import { getStructuredLearningContent } from '../../data/learningContentResolver';

export const InterviewModeView: React.FC = () => {
  const {
    progressMap,
    interviewAttempts,
    recordInterviewAttempt,
    setSelectedTopicId,
    setSelectedSprintDay,
    setCurrentView,
  } = useAppStore();

  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [currentTopic, setCurrentTopic] = useState<TopicItem | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewQuestion | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [userAnswerNotes, setUserAnswerNotes] = useState('');

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

  // Filter pool: completed or learning topics, or fallback to all topics if none completed yet!
  const candidatePool = React.useMemo(() => {
    let pool = allTopics.filter((t) => {
      if (selectedSubjectFilter !== 'ALL' && t.subject !== selectedSubjectFilter) {
        return false;
      }
      const st = progressMap[t.id]?.status;
      return st === 'interview_ready' || st === 'practiced' || st === 'learning';
    });

    // If candidate has completed nothing in that filter, allow all topics so user can practice mock interviews anytime
    if (pool.length === 0) {
      pool = allTopics.filter((t) => {
        if (selectedSubjectFilter !== 'ALL' && t.subject !== selectedSubjectFilter) {
          return false;
        }
        return true;
      });
    }

    return pool;
  }, [allTopics, progressMap, selectedSubjectFilter]);

  // Pick random question
  const pickRandomQuestion = () => {
    if (candidatePool.length === 0) return;
    const randomTopic = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    const content = getStructuredLearningContent(randomTopic.id, randomTopic.title, randomTopic.subject);
    const questions = content.commonQuestions;
    const randomQ = questions[Math.floor(Math.random() * questions.length)] || {
      id: 'default',
      level: 'INTERVIEW',
      question: `Explain the fundamental concept, trade-offs, and invariants of ${randomTopic.title}.`,
      answerHint: content.whatIsIt
    };

    setCurrentTopic(randomTopic);
    setCurrentQuestion(randomQ);
    setIsRevealed(false);
    setUserAnswerNotes('');
  };

  useEffect(() => {
    pickRandomQuestion();
  }, [selectedSubjectFilter]);

  const handleConfidenceSubmit = async (score: number) => {
    if (!currentTopic || !currentQuestion) return;
    await recordInterviewAttempt(
      currentTopic.id,
      currentTopic.title,
      currentQuestion.question,
      score,
      userAnswerNotes
    );
    pickRandomQuestion();
  };

  const currentTopicContent = currentTopic 
    ? getStructuredLearningContent(currentTopic.id, currentTopic.title, currentTopic.subject)
    : null;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 md:pb-12 font-mono">
      {/* Top Banner */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 shadow-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-term-panelBorder pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded bg-term-purple/10 border border-term-purple/30 text-term-purple">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-term-muted font-bold tracking-wider">
                MOCK INTERVIEW SIMULATOR //
              </div>
              <h1 className="text-xl font-bold text-term-text flex items-center space-x-2">
                <span>ACTIVE RECALL & EXPLANATION MODE</span>
              </h1>
              <p className="text-xs text-term-muted mt-0.5">
                Simulates live technical interviews: answer aloud, inspect rubric, rate confidence (1-5)
              </p>
            </div>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="bg-term-bg border border-term-panelBorder rounded px-3 py-1.5 text-xs text-term-text focus:outline-none focus:border-term-purple/50"
            >
              <option value="ALL">All Completed Subjects</option>
              <option value="DSA">DSA</option>
              <option value="SQL">SQL</option>
              <option value="DBMS">DBMS</option>
              <option value="Operating Systems">Operating Systems</option>
              <option value="Computer Networks">Computer Networks</option>
              <option value="LLD">LLD</option>
              <option value="Concurrency">Concurrency</option>
              <option value="System Design">System Design</option>
              <option value="Java / OOP">Java / OOP</option>
            </select>

            <button
              onClick={pickRandomQuestion}
              className="px-3 py-1.5 rounded bg-term-purple/20 hover:bg-term-purple/30 border border-term-purple/40 text-term-purple text-xs font-bold flex items-center space-x-1.5 transition-all shadow-glow-purple"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Next Q</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cyberpunk Interview Terminal Card */}
      {currentTopic && currentQuestion && (
        <div className="border border-term-purple/40 rounded-lg bg-term-panel shadow-panel overflow-hidden">
          {/* Card Terminal Header */}
          <div className="bg-term-panelHeader px-4 py-2.5 border-b border-term-panelBorder flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 text-term-muted">
              <span className="w-2 h-2 rounded-full bg-term-purple animate-ping"></span>
              <span className="text-term-purple font-bold">MOCK_QUESTION //</span>
              <span className="text-term-cyan font-bold">{currentTopic.subject}</span>
              <span>•</span>
              <span className="text-term-text truncate">{currentTopic.title}</span>
            </div>

            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
              currentQuestion.level === 'BEGINNER' ? 'bg-term-green/20 text-term-green border border-term-green/30' :
              currentQuestion.level === 'INTERMEDIATE' ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/30' :
              currentQuestion.level === 'INTERVIEW' ? 'bg-term-purple/20 text-term-purple border border-term-purple/30' :
              'bg-term-red/20 text-term-red border border-term-red/30'
            }`}>
              {currentQuestion.level}
            </span>
          </div>

          {/* Question Body */}
          <div className="p-6 md:p-8 space-y-6 text-center">
            <div className="text-xs text-term-muted uppercase tracking-wider font-bold">
              [ TECHNICAL INTERVIEW QUESTION ]
            </div>

            <div className="text-lg md:text-2xl font-bold text-term-text max-w-2xl mx-auto leading-relaxed">
              &quot;{currentQuestion.question}&quot;
            </div>

            <p className="text-xs text-term-muted max-w-md mx-auto">
              Speak your answer out loud for 60-90 seconds. Outline your mental model, edge cases, and trade-offs before revealing the answer blueprint.
            </p>

            {/* Answer Blueprint Reveal Section */}
            {!isRevealed ? (
              <div className="pt-4">
                <button
                  onClick={() => setIsRevealed(true)}
                  className="px-6 py-2.5 rounded-lg bg-term-purple/20 hover:bg-term-purple/30 border border-term-purple/50 text-term-purple font-bold text-sm inline-flex items-center space-x-2 transition-all shadow-glow-purple"
                >
                  <Eye className="w-4 h-4" />
                  <span>[ REVEAL ANSWER BLUEPRINT ]</span>
                </button>
              </div>
            ) : (
              <div className="pt-4 text-left space-y-4 animate-in fade-in">
                <div className="p-4 rounded-lg bg-term-card border border-term-panelBorder space-y-3">
                  <div className="text-xs font-bold text-term-green flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>IDEAL INTERVIEW ANSWER BLUEPRINT:</span>
                  </div>
                  <p className="text-xs text-term-text leading-relaxed">
                    {currentQuestion.answerHint || currentTopicContent?.whatIsIt}
                  </p>

                  {currentTopicContent && (
                    <div className="pt-2 border-t border-term-panelBorder/50 space-y-1.5 text-xs">
                      <div className="text-[10px] text-term-cyan font-bold uppercase">
                        CRUCIAL TECHNICAL INVARIANTS:
                      </div>
                      <ul className="space-y-1 pl-2 text-term-muted">
                        {currentTopicContent.coreIdeas.slice(0, 3).map((idea, idx) => (
                          <li key={idx} className="flex items-start space-x-1.5">
                            <span className="text-term-cyan">›</span>
                            <span>{idea}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Self Confidence Scoring: 1 to 5 */}
                <div className="p-4 rounded-lg bg-term-panelHeader border border-term-panelBorder space-y-3 text-center">
                  <div className="text-xs text-term-muted font-bold">
                    HOW CONFIDENT WAS YOUR VERBAL EXPLANATION?
                  </div>

                  <div className="grid grid-cols-5 gap-2 max-w-lg mx-auto">
                    {[
                      { score: 1, label: 'Blank', color: 'hover:border-term-red hover:bg-term-red/10 text-term-red' },
                      { score: 2, label: 'Shaky', color: 'hover:border-term-amber hover:bg-term-amber/10 text-term-amber' },
                      { score: 3, label: 'Decent', color: 'hover:border-term-cyan hover:bg-term-cyan/10 text-term-cyan' },
                      { score: 4, label: 'Strong', color: 'hover:border-term-green hover:bg-term-green/10 text-term-green' },
                      { score: 5, label: 'Flawless', color: 'hover:border-term-purple hover:bg-term-purple/10 text-term-purple' },
                    ].map((item) => (
                      <button
                        key={item.score}
                        onClick={() => handleConfidenceSubmit(item.score)}
                        className={`p-2.5 rounded border border-term-panelBorder bg-term-card flex flex-col items-center justify-center transition-all ${item.color}`}
                      >
                        <span className="text-lg font-bold">{item.score}</span>
                        <span className="text-[9px] uppercase font-semibold">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] text-term-muted pt-1">
                    Rating 4 or 5 automatically marks the &quot;INTERVIEW&quot; readiness pillar for this topic!
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recent Attempts History */}
      <div className="border border-term-panelBorder rounded-lg bg-term-panel p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-term-text flex items-center space-x-2">
            <History className="w-4 h-4 text-term-cyan" />
            <span>RECENT MOCK ATTEMPTS ({interviewAttempts.length})</span>
          </span>
          <span className="text-term-muted text-[11px]">Recorded in local database</span>
        </div>

        {interviewAttempts.length === 0 ? (
          <div className="p-8 text-center text-xs text-term-muted border border-dashed border-term-panelBorder rounded">
            No mock interview attempts recorded yet. Answer the question above and rate your confidence to build your interview track record!
          </div>
        ) : (
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {interviewAttempts.slice(0, 10).map((att) => (
              <div
                key={att.id}
                className="p-3 rounded bg-term-card border border-term-panelBorder flex items-center justify-between text-xs"
              >
                <div className="min-w-0 pr-3">
                  <div className="font-semibold text-term-text truncate">
                    {att.topicTitle}
                  </div>
                  <div className="text-[11px] text-term-muted truncate mt-0.5">
                    &quot;{att.question}&quot;
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      att.confidence >= 4 ? 'bg-term-green/20 text-term-green border border-term-green/30' :
                      att.confidence === 3 ? 'bg-term-cyan/20 text-term-cyan border border-term-cyan/30' :
                      'bg-term-amber/20 text-term-amber border border-term-amber/30'
                    }`}>
                      Confidence {att.confidence}/5
                    </span>
                    <div className="text-[9px] text-term-darkMuted mt-0.5">
                      {att.timestamp.split('T')[0]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
