import type { TopicReadinessState } from './curriculum.ts';

export interface DerivedTopicReadiness {
  topicId: string;
  state: TopicReadinessState;
  confidence: 'low' | 'medium' | 'high';
  supportingEvidenceIds: string[];
  blockingPrerequisiteIds: string[];
  explanation: string[];
  derivedAt: string;
}

export interface ReadinessDerivationContext {
  readinessByTopic?: Record<string, Pick<DerivedTopicReadiness, 'state'>>;
  requiredPrerequisiteState?: TopicReadinessState;
}
