export type EvidenceType =
  | 'baseline_assessment'
  | 'learning_completion'
  | 'practice'
  | 'problem_solving'
  | 'revision'
  | 'interview'
  | 'demonstration'
  | 'manual';

export type EvidenceStrength = 'low' | 'medium' | 'high';

export interface EvidenceResult {
  correct?: boolean;
  score?: number;
  maxScore?: number;
  percentage?: number;
}

export interface TopicEvidence {
  id: string;
  topicId: string;
  type: EvidenceType;
  strength: EvidenceStrength;
  sourceId?: string;
  result?: EvidenceResult;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
