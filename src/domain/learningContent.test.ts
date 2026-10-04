import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { dsaFoundationContent, structuredDsaTopicIds } from '../data/dsaFoundationContent.ts';
import { javaFoundationContent, structuredJavaTopicIds } from '../data/javaFoundationContent.ts';
import { isLearningContent, resolveLearningContent } from '../data/learningContentResolverV2.ts';
import type { LearningContent } from '../types/learningContent.ts';
import type { StructuredLearningContent } from '../types/curriculum.ts';

const javaTopicIds = new Set(structuredJavaTopicIds);
const dsaTopicIds = new Set(structuredDsaTopicIds);
const legacyFallback = (topicId: string, title: string): StructuredLearningContent => ({
  topicId,
  topicTitle: title,
  whatIsIt: `${title} legacy explanation`,
  whyItMatters: 'legacy',
  coreIdeas: ['legacy'],
  whatShouldIKnow: 'legacy',
  commonQuestions: [{ id: 'q1', level: 'BEGINNER', question: 'legacy question' }],
  commonMistakes: ['legacy'],
  exampleIntuition: 'legacy',
  practiceProblem: { title: 'legacy', platform: 'legacy', url: 'https://example.com' },
  resources: [],
});

for (const [topicId, content] of Object.entries(javaFoundationContent)) {
  test(`structured Java topic resolves by ID: ${topicId}`, () => {
    assert.equal(javaTopicIds.has(topicId), true);
    assert.equal(isLearningContent(resolveLearningContent(topicId, content.overview, 'Java / OOP', legacyFallback)), true);
  });
}

test('DSA pilot topics resolve through the subject-local structured registry', () => {
  const expectedTopicIds = [
    's1_d5_t1_3-sum',
    's1_d5_t11_next-permutation',
    's1_d5_t18_4-sum',
    's1_d6_t7_merge-two-sorted-arrays-withou',
    's1_d6_t13_trapping-rainwater',
  ];

  assert.deepEqual(structuredDsaTopicIds, expectedTopicIds);
  assert.equal(structuredDsaTopicIds.length, 5);

  for (const topicId of expectedTopicIds) {
    const content = dsaFoundationContent[topicId];
    assert.ok(content, `Content missing for ${topicId}`);
    assert.equal(dsaTopicIds.has(topicId), true, `${topicId} not in dsaTopicIds`);
    assert.equal(content.sections.length > 0, true);
    
    assert.equal(isLearningContent(resolveLearningContent(topicId, 'Any Title', 'DSA', legacyFallback)), true);
  }
});
