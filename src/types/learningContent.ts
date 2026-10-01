export type LearningResourceType = 'official_docs' | 'tutorial' | 'visual' | 'practice' | 'reference';

export interface ContentSection {
  title: string;
  explanation: string;
  example?: string;
  takeaway?: string;
}

export interface ContentExample {
  title: string;
  setup?: string;
  walkthrough: string[];
  takeaway?: string;
}

export type CodeExampleLanguage = 'java' | 'sql' | 'python' | 'c' | 'cpp' | 'pseudocode' | 'shell';

export interface CodeExample {
  language: CodeExampleLanguage;
  title: string;
  code: string;
  explanation: string;
  expectedOutput?: string;
  executionMode?: 'standalone' | 'contextual';
  filename?: string;
}

export interface QuickCheck {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface PracticeItem {
  title: string;
  prompt: string;
  expectedSkill: string;
}

export interface LearningResource {
  title: string;
  url: string;
  type: LearningResourceType;
  description: string;
  source: string;
}

export interface LearningContent {
  topicId: string;
  contentVersion: number;
  overview: string;
  whyItMatters?: string;
  /** Lesson-level learning order; this is intentionally separate from curriculum graph prerequisites. */
  prerequisites?: string[];
  sections: ContentSection[];
  examples?: ContentExample[];
  codeExamples?: CodeExample[];
  commonMistakes?: string[];
  interviewNotes?: string[];
  quickChecks?: QuickCheck[];
  practice?: PracticeItem[];
  resources?: LearningResource[];
  estimatedMinutes?: number;
  lastReviewedAt?: string;
  reviewNotes?: string;
}
