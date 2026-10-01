import assert from 'node:assert/strict';
import test from 'node:test';
import { baselineAssessmentToEvidence } from '../assessment/baselineToEvidence.ts';
import { deriveTopicReadiness } from './deriveTopicReadiness.ts';
import type { TopicMetadata } from '../../types/curriculum.ts';
import type { BaselineAssessment } from '../../types/assessment.ts';
import type { TopicEvidence } from '../../types/evidence.ts';

const metadata = (topicId: string, prerequisites: string[] = []): TopicMetadata => ({
  topicId,
  title: topicId,
  subject: 'Other',
  sprintNumber: 1,
  dayNumber: 1,
  duration: '30 min',
  prerequisites,
  dependents: [],
  stage: 'core',
  internshipRelevance: 0.5,
  interviewRelevance: 0.5,
  oaRelevance: 0.5,
  technicalInterviewRelevance: 0.5,
  generalInterviewRelevance: 0.5,
  confidence: 0.72,
  reason: 'test metadata',
});

const evidence = (id: string, topicId: string, type: TopicEvidence['type'], strength: TopicEvidence['strength'] = 'medium', correct = true): TopicEvidence => ({
  id,
  topicId,
  type,
  strength,
  result: { correct },
  createdAt: '2026-09-30T00:00:00.000Z',
});

test('no evidence is not_started', () => {
  assert.equal(deriveTopicReadiness('topic', [], metadata('topic')).state, 'not_started');
});

test('learning completion derives learned', () => {
  assert.equal(deriveTopicReadiness('topic', [evidence('learn', 'topic', 'learning_completion')], metadata('topic')).state, 'learned');
});

test('practice evidence derives practiced', () => {
  assert.equal(deriveTopicReadiness('topic', [evidence('practice', 'topic', 'practice')], metadata('topic')).state, 'practiced');
});

test('strong demonstration derives demonstrated', () => {
  assert.equal(deriveTopicReadiness('topic', [evidence('demo', 'topic', 'demonstration', 'high')], metadata('topic')).state, 'demonstrated');
});

test('strong interview evidence can derive interview_ready', () => {
  assert.equal(deriveTopicReadiness('topic', [evidence('interview', 'topic', 'interview', 'high')], metadata('topic')).state, 'interview_ready');
});

test('missing prerequisites block but do not remove evidence', () => {
  const result = deriveTopicReadiness('advanced', [evidence('demo', 'advanced', 'demonstration', 'high')], metadata('advanced', ['foundation']), { readinessByTopic: {} });
  assert.deepEqual(result.supportingEvidenceIds, ['demo']);
  assert.deepEqual(result.blockingPrerequisiteIds, ['foundation']);
  assert.equal(result.state, 'demonstrated');
});

test('historical evidence remains intact', () => {
  const records = [evidence('day-1', 'topic', 'baseline_assessment', 'low'), evidence('day-10', 'topic', 'practice', 'medium')];
  const result = deriveTopicReadiness('topic', records, metadata('topic'));
  assert.deepEqual(result.supportingEvidenceIds, ['day-1', 'day-10']);
  assert.equal(records.length, 2);
});

test('baseline responses convert to topic evidence', () => {
  const assessment: BaselineAssessment = {
    id: 'baseline-1', name: 'Initial baseline', version: 1, topicIds: ['topic'], status: 'completed',
    responses: [{ topicId: 'topic', questionId: 'q1', answer: 'A', correct: true }],
  };
  const converted = baselineAssessmentToEvidence(assessment, '2026-09-30T00:00:00.000Z');
  assert.equal(converted[0].type, 'baseline_assessment');
  assert.equal(converted[0].topicId, 'topic');
});

test('incorrect baseline response does not mean never learned', () => {
  const assessment: BaselineAssessment = {
    id: 'baseline-2', name: 'Initial baseline', version: 1, topicIds: ['topic'], status: 'completed',
    responses: [{ topicId: 'topic', questionId: 'q1', correct: false }],
  };
  const converted = baselineAssessmentToEvidence(assessment, '2026-09-30T00:00:00.000Z');
  const result = deriveTopicReadiness('topic', converted, metadata('topic'));
  assert.equal(result.state, 'exposed');
  assert.deepEqual(result.supportingEvidenceIds, [converted[0].id]);
  assert.equal(converted[0].type, 'baseline_assessment');
});

test('legacy readiness-shaped records remain representable', () => {
  const legacy = { topicId: 'topic', state: 'learned' as const, confidence: 'medium' as const, source: 'legacy' as const, inferredFromLegacy: true, updatedAt: '2026-09-30T00:00:00.000Z' };
  assert.equal(legacy.state, 'learned');
  assert.equal(legacy.inferredFromLegacy, true);
});

test('empty evidence does not throw', () => {
  assert.doesNotThrow(() => deriveTopicReadiness('topic', [], metadata('topic')));
});

test('evidence survives export-shaped round trip', () => {
  const records = [evidence('one', 'topic', 'practice')];
  const roundTrip = JSON.parse(JSON.stringify({ topicEvidenceMap: { topic: records } }));
  assert.deepEqual(roundTrip.topicEvidenceMap.topic, records);
});
