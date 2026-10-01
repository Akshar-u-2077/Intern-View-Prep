import React, { useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Code, ExternalLink, Lightbulb, Sparkles } from 'lucide-react';
import { curriculumMetadata } from '../../data/curriculumMetadata';
import type { LearningContent } from '../../types/learningContent';

interface Props {
  content: LearningContent;
}

const formatPrerequisiteName = (prerequisiteId: string) => {
  const metadata = curriculumMetadata[prerequisiteId];
  if (metadata?.title) return metadata.title;
  return prerequisiteId
    .replace(/^[a-z0-9]+_[a-z0-9]+_[a-z0-9]+_[a-z0-9]+_/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const StructuredLearningPanel: React.FC<Props> = ({ content }) => (
  <div className="space-y-6">
    <div className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
      <div className="text-[11px] font-bold text-term-green flex items-center space-x-1.5"><BookOpen className="w-4 h-4" /><span>OVERVIEW</span></div>
      <p className="text-term-text text-sm">{content.overview}</p>
    </div>

    {content.whyItMatters && <div className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
      <div className="text-[11px] font-bold text-term-cyan flex items-center space-x-1.5"><Sparkles className="w-4 h-4" /><span>WHY IT MATTERS</span></div>
      <p className="text-term-text">{content.whyItMatters}</p>
    </div>}

    {content.prerequisites && content.prerequisites.length > 0 && (
      <div className="text-[11px] text-term-muted border-l-2 border-term-amber pl-3">
        Prerequisites: {content.prerequisites.map(formatPrerequisiteName).join(', ')}
      </div>
    )}

    {content.sections.map((section) => <section key={section.title} className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
      <h3 className="text-[11px] font-bold text-term-purple flex items-center space-x-1.5"><Lightbulb className="w-4 h-4" /><span>{section.title}</span></h3>
      <p className="text-term-text">{section.explanation}</p>
      {section.example && <p className="text-term-cyan font-mono bg-term-bg p-3 rounded border border-term-panelBorder whitespace-pre-wrap">{section.example}</p>}
      {section.takeaway && <p className="text-term-amber text-[11px]"><strong>Key takeaway:</strong> {section.takeaway}</p>}
    </section>)}

    {content.examples?.map((example) => <section key={example.title} className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
      <h3 className="text-[11px] font-bold text-term-text">WORKED EXAMPLE // {example.title}</h3>
      {example.setup && <p className="text-term-muted">{example.setup}</p>}
      <ol className="list-decimal pl-5 space-y-1 text-term-text">{example.walkthrough.map((step) => <li key={step}>{step}</li>)}</ol>
      {example.takeaway && <p className="text-term-amber text-[11px]"><strong>Key takeaway:</strong> {example.takeaway}</p>}
    </section>)}

    {content.codeExamples?.map((example) => <section key={example.title} className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
      <h3 className="text-[11px] font-bold text-term-green flex items-center space-x-1.5"><Code className="w-4 h-4" /><span>{example.title}</span></h3>
      <pre className="overflow-x-auto bg-term-bg p-3 rounded border border-term-panelBorder text-term-text text-[11px]"><code>{example.code}</code></pre>
      <p className="text-term-muted">{example.explanation}</p>
      {example.expectedOutput && <p className="text-term-cyan text-[11px]">Expected output: {example.expectedOutput}</p>}
    </section>)}

    {content.commonMistakes && <section className="space-y-2 bg-term-card/60 p-4 rounded-lg border border-term-panelBorder">
      <h3 className="text-[11px] font-bold text-term-red flex items-center space-x-1.5"><AlertTriangle className="w-4 h-4" /><span>COMMON MISTAKES</span></h3>
      <ul className="space-y-1.5 pl-2">{content.commonMistakes.map((mistake) => <li key={mistake} className="flex items-start space-x-2 text-term-text"><span className="text-term-red font-bold">x</span><span>{mistake}</span></li>)}</ul>
    </section>}

    {content.practice?.map((practice) => <section key={practice.title} className="space-y-2 p-4 rounded-lg bg-term-green/10 border border-term-green/30">
      <h3 className="text-[11px] font-bold text-term-green">PRACTICE PROMPT // {practice.title}</h3>
      <p className="text-term-text">{practice.prompt}</p>
      <p className="text-term-muted text-[11px]">Expected skill: {practice.expectedSkill}</p>
    </section>)}

    <div className="text-[10px] text-term-darkMuted">Content version {content.contentVersion} · reviewed {content.lastReviewedAt || 'not yet reviewed'}</div>
  </div>
);

export const StructuredQuestionsPanel: React.FC<Props> = ({ content }) => {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-4">
      {content.interviewNotes?.map((note) => <div key={note} className="p-4 rounded-lg bg-term-card/60 border border-term-panelBorder text-term-text">{note}</div>)}
      {content.quickChecks?.map((check, index) => {
        const checkId = `${check.question}-${index}`;
        const isRevealed = !!revealed[checkId];

        return (
          <div key={check.question} className="p-4 rounded-lg bg-term-card/60 border border-term-panelBorder space-y-2">
            <div className="text-sm font-semibold text-term-text">{check.question}</div>
            <ul className="space-y-1 text-term-muted">{check.options.map((option) => <li key={option}>{option}</li>)}</ul>
            <button
              type="button"
              onClick={() => setRevealed((current) => ({ ...current, [checkId]: !current[checkId] }))}
              className="mt-2 px-2 py-1.5 rounded border border-term-panelBorder bg-term-bg text-[10px] uppercase tracking-wide text-term-cyan hover:border-term-cyan/50"
            >
              {isRevealed ? 'Hide answer' : 'Show answer'}
            </button>
            {isRevealed && (
              <div className="pt-2 border-t border-term-panelBorder/50 text-[11px] text-term-cyan">
                <strong>Answer:</strong> {check.correctAnswer}. {check.explanation}
              </div>
            )}
          </div>
        );
      })}
      {!content.interviewNotes?.length && !content.quickChecks?.length && <div className="text-xs text-term-muted">No structured interview checks authored yet.</div>}
    </div>
  );
};

export const StructuredResourcesPanel: React.FC<Props> = ({ content }) => (
  <div className="space-y-3">
    {content.resources?.map((resource) => <div key={resource.url} className="p-3.5 rounded-lg bg-term-card/60 border border-term-panelBorder flex items-center justify-between">
      <div className="space-y-1 min-w-0 pr-3"><div className="text-[9px] text-term-cyan font-bold uppercase">{resource.type} · {resource.source}</div><div className="text-xs font-semibold text-term-text">{resource.title}</div><div className="text-[11px] text-term-muted">{resource.description}</div></div>
      <a href={resource.url} target="_blank" rel="noreferrer" className="p-2 rounded bg-term-panel hover:bg-term-card text-term-muted hover:text-term-green border border-term-panelBorder shrink-0"><ExternalLink className="w-4 h-4" /></a>
    </div>)}
    {!content.resources?.length && <div className="text-xs text-term-muted">No structured resources authored yet.</div>}
  </div>
);
