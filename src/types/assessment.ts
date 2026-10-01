export type BaselineAssessmentStatus = 'not_started' | 'in_progress' | 'completed';

export interface BaselineResponse {
  topicId: string;
  questionId: string;
  answer?: unknown;
  correct?: boolean;
  confidence?: 'low' | 'medium' | 'high';
  durationMs?: number;
}

export interface BaselineAssessment {
  id: string;
  name: string;
  version: number;
  startedAt?: string;
  completedAt?: string;
  topicIds: string[];
  responses: BaselineResponse[];
  status: BaselineAssessmentStatus;
}
