import type { BaselineAssessment } from '../../types/assessment.ts';
import type { TopicEvidence } from '../../types/evidence.ts';

export const baselineAssessmentToEvidence = (
  assessment: BaselineAssessment,
  createdAt = assessment.completedAt || new Date().toISOString(),
): TopicEvidence[] => assessment.responses.map((response, index) => ({
  id: `baseline_${assessment.id}_${response.questionId}_${index}`,
  topicId: response.topicId,
  type: 'baseline_assessment',
  strength: response.correct === true ? 'medium' : 'low',
  sourceId: assessment.id,
  result: response.correct === undefined ? undefined : { correct: response.correct },
  metadata: {
    assessmentName: assessment.name,
    assessmentVersion: assessment.version,
    questionId: response.questionId,
    confidence: response.confidence,
    durationMs: response.durationMs,
    answer: response.answer,
  },
  createdAt,
}));
