import type { TopicMetadata, TopicReadinessState } from '../../types/curriculum.ts';
import type { TopicEvidence } from '../../types/evidence.ts';
import type { DerivedTopicReadiness, ReadinessDerivationContext } from '../../types/readiness.ts';

const stateRank: Record<TopicReadinessState, number> = {
  not_started: 0,
  exposed: 1,
  learned: 2,
  practiced: 3,
  demonstrated: 4,
  interview_ready: 5,
};

const strengthRank: Record<TopicEvidence['strength'], number> = {
  low: 1,
  medium: 2,
  high: 3,
};

const isPositiveEvidence = (evidence: TopicEvidence) => evidence.result?.correct !== false;

const stateForEvidence = (evidence: TopicEvidence): TopicReadinessState => {
  if (evidence.type === 'baseline_assessment') return 'exposed';
  if (!isPositiveEvidence(evidence)) return 'not_started';

  if (evidence.type === 'interview' && evidence.strength === 'high') return 'interview_ready';
  if (evidence.type === 'demonstration' || (evidence.type === 'problem_solving' && evidence.strength === 'high')) return 'demonstrated';
  if (evidence.type === 'practice' && evidence.strength !== 'low') return 'practiced';
  if (evidence.type === 'learning_completion' || evidence.type === 'revision') return 'learned';
  if (evidence.type === 'manual' && evidence.strength === 'high') return 'exposed';

  return 'not_started';
};

const confidenceForEvidence = (supportingEvidence: TopicEvidence[], state: TopicReadinessState) => {
  if (supportingEvidence.length === 0) return 'low' as const;

  const strongest = Math.max(...supportingEvidence.map((evidence) => strengthRank[evidence.strength]));
  const repeatedStrongSignals = supportingEvidence.filter((evidence) => strengthRank[evidence.strength] >= 2).length >= 2;

  if (state === 'interview_ready' || (state === 'demonstrated' && repeatedStrongSignals) || strongest === 3 && supportingEvidence.length >= 2) {
    return 'high' as const;
  }

  if (supportingEvidence.length >= 2 || strongest >= 2) return 'medium' as const;
  return 'low' as const;
};

const evidenceExplanation = (state: TopicReadinessState, supportingEvidence: TopicEvidence[]) => {
  const explanations: string[] = [];
  const learningCount = supportingEvidence.filter((evidence) => evidence.type === 'learning_completion').length;
  const practiceCount = supportingEvidence.filter((evidence) => evidence.type === 'practice').length;
  const demonstrationCount = supportingEvidence.filter((evidence) => evidence.type === 'demonstration' || evidence.type === 'problem_solving').length;
  const interviewCount = supportingEvidence.filter((evidence) => evidence.type === 'interview').length;
  const baselineCount = supportingEvidence.filter((evidence) => evidence.type === 'baseline_assessment').length;

  if (learningCount > 0) explanations.push('Learning content completion evidence was recorded.');
  if (practiceCount > 0) explanations.push(`${practiceCount} successful practice evidence record${practiceCount === 1 ? '' : 's'} was recorded.`);
  if (demonstrationCount > 0) explanations.push(`${demonstrationCount} strong problem-solving or demonstration evidence record${demonstrationCount === 1 ? '' : 's'} was recorded.`);
  if (interviewCount > 0) explanations.push(`${interviewCount} successful interview evidence record${interviewCount === 1 ? '' : 's'} was recorded.`);
  if (baselineCount > 0) explanations.push('Baseline assessment evidence was recorded; an incorrect response is not treated as proof that the topic was never learned.');
  if (state === 'not_started' && explanations.length === 0) explanations.push('No positive evidence supports progress for this topic yet.');
  return explanations;
};

export const deriveTopicReadiness = (
  topicId: string,
  evidence: TopicEvidence[],
  metadata: TopicMetadata | undefined,
  context: ReadinessDerivationContext = {},
  derivedAt = new Date().toISOString(),
): DerivedTopicReadiness => {
  const topicEvidence = evidence.filter((item) => item.topicId === topicId);
  const supportingEvidence = topicEvidence.filter((item) => isPositiveEvidence(item) || item.type === 'baseline_assessment');
  const state = supportingEvidence.reduce<TopicReadinessState>(
    (highest, item) => stateRank[stateForEvidence(item)] > stateRank[highest] ? stateForEvidence(item) : highest,
    'not_started',
  );
  const readinessByTopic = context.readinessByTopic || {};
  const requiredState = context.requiredPrerequisiteState || 'learned';
  const blockingPrerequisiteIds = (metadata?.prerequisites || []).filter((prerequisiteId) => {
    const prerequisiteState = readinessByTopic[prerequisiteId]?.state || 'not_started';
    return stateRank[prerequisiteState] < stateRank[requiredState];
  });
  const explanation = evidenceExplanation(state, supportingEvidence);

  if (blockingPrerequisiteIds.length > 0) {
    explanation.push(`Prerequisite evidence is incomplete for: ${blockingPrerequisiteIds.join(', ')}.`);
  } else if (metadata?.prerequisites.length) {
    explanation.push('All required prerequisites have reached the minimum learned state.');
  }

  return {
    topicId,
    state,
    confidence: confidenceForEvidence(supportingEvidence, state),
    supportingEvidenceIds: supportingEvidence.map((item) => item.id),
    blockingPrerequisiteIds,
    explanation,
    derivedAt,
  };
};
