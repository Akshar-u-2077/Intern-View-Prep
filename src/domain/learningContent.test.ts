import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { dsaFoundationContent, structuredDsaTopicIds } from '../data/dsaFoundationContent.ts';
import { javaFoundationContent, structuredJavaTopicIds } from '../data/javaFoundationContent.ts';
import { curriculumMetadata } from '../data/curriculumMetadata.ts';
import { isLearningContent, resolveLearningContent } from '../data/learningContentResolverV2.ts';
import { StructuredLearningPanel, StructuredQuestionsPanel } from '../components/topics/StructuredLearningPanel.tsx';
import type { LearningContent } from '../types/learningContent.ts';
import type { StructuredLearningContent } from '../types/curriculum.ts';

const topicIds = new Set(structuredJavaTopicIds);
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
    assert.equal(topicIds.has(topicId), true);
    const resolved = resolveLearningContent(topicId, content.overview, 'Java / OOP', legacyFallback);
    assert.equal(isLearningContent(resolved), true);
    assert.equal(resolved.topicId, topicId);
  });
}

test('unknown topic falls back to the legacy resolver', () => {
  const resolved = resolveLearningContent('unknown-topic', 'Unknown Topic', 'DSA', legacyFallback);
  if (isLearningContent(resolved)) throw new Error('Unknown topic unexpectedly resolved to structured content');
  assert.equal(resolved.topicId, 'unknown-topic');
  assert.equal(resolved.commonQuestions.length > 0, true);
});

test('structured content has required fields and valid quick checks', () => {
  for (const content of Object.values(javaFoundationContent)) {
    assert.equal(typeof content.contentVersion, 'number');
    assert.equal(content.sections.length > 0, true);
    for (const check of content.quickChecks || []) {
      assert.equal(check.options.length >= 2, true);
      assert.equal(check.options.includes(check.correctAnswer), true);
      assert.equal(check.explanation.length > 0, true);
    }
    for (const resource of content.resources || []) {
      assert.equal(resource.title.length > 0, true);
      assert.equal(/^https:\/\//.test(resource.url), true);
      assert.equal(resource.type.length > 0, true);
      assert.equal(resource.source.length > 0, true);
    }
  }
});

test('Phase 3C.2 Java core topics resolve to structured content', () => {
  const phase3c2TopicIds = [
    's1_d5_t20_attributes-and-methods',
    's2_d7_t12_interfaces',
    's3_d1_t5_static-keyword',
    's3_d6_t14_exception-handling',
  ];

  for (const topicId of phase3c2TopicIds) {
    assert.equal(topicIds.has(topicId), true, `Missing structured lesson: ${topicId}`);
    const content = javaFoundationContent[topicId];
    assert.ok(content, `Content missing for ${topicId}`);
    const resolved = resolveLearningContent(topicId, content.overview, 'Java / OOP', legacyFallback);
    assert.equal(isLearningContent(resolved), true);
    assert.equal(resolved.topicId, topicId);
  }
});

test('Phase 3C.4 revision keeps the Java/OOP prerequisite graph conceptually valid and adds missing practice prompts', () => {
  const attributesAndMethods = javaFoundationContent['s1_d5_t20_attributes-and-methods'];
  const interfaces = javaFoundationContent['s2_d7_t12_interfaces'];
  const classesAndObjects = javaFoundationContent['s1_d5_t3_classes-and-objects'];
  const constructors = javaFoundationContent['s1_d6_t16_constructors'];
  const accessModifiers = javaFoundationContent['s2_d1_t5_access-modifiers'];
  const inheritance = javaFoundationContent['s2_d3_t5_inheritance'];

  assert.equal(attributesAndMethods.prerequisites?.includes('s1_d6_t16_constructors'), false);
  assert.equal(interfaces.prerequisites?.includes('s2_d3_t5_inheritance'), false);

  assert.equal(Array.isArray(classesAndObjects.practice), true);
  assert.equal(Array.isArray(constructors.practice), true);
  assert.equal(Array.isArray(accessModifiers.practice), true);
  assert.equal(Array.isArray(inheritance.practice), true);

  assert.equal(attributesAndMethods.prerequisites?.includes('s1_d5_t3_classes-and-objects'), true);
  assert.equal(interfaces.prerequisites?.includes('s2_d1_t5_access-modifiers'), true);
});

test('Object Cloning resolves to structured content and includes deep-copy guidance', () => {
  const topicId = 's3_d5_t11_object-cloning';
  const content = javaFoundationContent[topicId];

  assert.equal(topicIds.has(topicId), true, `Missing structured lesson: ${topicId}`);
  assert.ok(content, `Content missing for ${topicId}`);
  assert.equal(content.prerequisites?.includes('s1_d5_t20_attributes-and-methods'), true);
  assert.equal(content.practice?.length && content.practice.length > 0, true);
  assert.equal(content.quickChecks?.length && content.quickChecks.length > 0, true);
  assert.equal(content.codeExamples?.length && content.codeExamples.length > 0, true);

  const resolved = resolveLearningContent(topicId, content.overview, 'Java / OOP', legacyFallback);
  assert.equal(isLearningContent(resolved), true);
  assert.equal(resolved.topicId, topicId);
  assert.equal(content.sections.some((section) => section.title.toLowerCase().includes('shallow') || section.title.toLowerCase().includes('deep')), true);
});

test('Generics resolves to structured content with typed examples and wildcard practice', () => {
  const topicId = 's3_d6_t24_generics';
  const content = javaFoundationContent[topicId];

  assert.equal(topicIds.has(topicId), true, `Missing structured lesson: ${topicId}`);
  assert.ok(content, `Content missing for ${topicId}`);
  assert.deepEqual(content.prerequisites, [
    's1_d5_t3_classes-and-objects',
    's1_d5_t20_attributes-and-methods',
    's2_d7_t12_interfaces',
  ]);
  assert.equal(content.practice?.length && content.practice.length > 0, true);
  assert.equal(content.quickChecks?.length && content.quickChecks.length > 0, true);
  assert.equal(content.codeExamples?.length && content.codeExamples.length >= 5, true);
  assert.equal(content.sections.some((section) => section.title === 'Invariance and type safety'), true);
  assert.equal(content.sections.some((section) => section.title === 'PECS: Producer Extends, Consumer Super'), true);

  const resolved = resolveLearningContent(topicId, content.overview, 'Java / OOP', legacyFallback);
  assert.equal(isLearningContent(resolved), true);
  assert.equal(resolved.topicId, topicId);
});

test('DSA pilot topics resolve through the subject-local structured registry', () => {
  const expectedTopicIds = [
    's1_d1_t1_majority-element-i',
    's1_d2_t4_kadanes-algorithm',
    's1_d2_t8_majority-element-ii',
    's1_d3_t2_maximum-product-subarray-in-an',
    's1_d4_t3_sort-an-array-of-0s-1s-and-2s',
  ];

  assert.deepEqual(structuredDsaTopicIds, expectedTopicIds);
  assert.equal(structuredDsaTopicIds.length, 5);

  for (const topicId of expectedTopicIds) {
    const content = dsaFoundationContent[topicId];
    assert.equal(curriculumMetadata[topicId]?.subject, 'DSA');
    assert.ok(content, `Content missing for ${topicId}`);
    assert.equal(dsaTopicIds.has(topicId), true);
    assert.equal(content.sections.length > 0, true);
    assert.equal(content.examples?.length && content.examples.length > 0, true);
    assert.equal(content.codeExamples?.length && content.codeExamples.length > 0, true);
    assert.equal(content.commonMistakes?.length && content.commonMistakes.length > 0, true);
    assert.equal(content.interviewNotes?.length && content.interviewNotes.length > 0, true);
    assert.equal(content.quickChecks?.length && content.quickChecks.length >= 3, true);
    assert.equal(content.practice?.length && content.practice.length > 0, true);
    assert.equal(content.resources?.length && content.resources.length > 0, true);

    for (const example of content.codeExamples ?? []) {
      assert.equal(example.language, 'java');
      assert.equal(example.executionMode, 'standalone');
      assert.equal(typeof example.filename, 'string');
    }

    const resolved = resolveLearningContent(topicId, content.overview, 'DSA', legacyFallback);
    assert.equal(isLearningContent(resolved), true);
    assert.equal(resolved.topicId, topicId);
  }
});

test('DSA pilot prerequisites resolve and remain acyclic without broadening the registry', () => {
  const graph = new Map(Object.entries(dsaFoundationContent).map(([topicId, content]) => [topicId, content.prerequisites ?? []]));

  for (const [topicId, prerequisites] of graph) {
    for (const prerequisiteId of prerequisites) {
      assert.equal(Boolean(curriculumMetadata[prerequisiteId]), true, `Unknown prerequisite ${prerequisiteId} for ${topicId}`);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (topicId: string) => {
    if (visiting.has(topicId)) throw new Error(`DSA prerequisite cycle detected at ${topicId}`);
    if (visited.has(topicId)) return;
    visiting.add(topicId);
    for (const prerequisiteId of graph.get(topicId) ?? []) visit(prerequisiteId);
    visiting.delete(topicId);
    visited.add(topicId);
  };

  for (const topicId of graph.keys()) visit(topicId);
  assert.deepEqual(structuredDsaTopicIds, [
    's1_d1_t1_majority-element-i',
    's1_d2_t4_kadanes-algorithm',
    's1_d2_t8_majority-element-ii',
    's1_d3_t2_maximum-product-subarray-in-an',
    's1_d4_t3_sort-an-array-of-0s-1s-and-2s',
  ]);
});

test('structured prerequisites are lesson-owned, valid curriculum IDs, and acyclic', () => {
  const graph = new Map(Object.entries(javaFoundationContent).map(([topicId, content]) => [topicId, content.prerequisites ?? []]));

  for (const [topicId, prerequisites] of graph) {
    for (const prerequisiteId of prerequisites) {
      assert.equal(Boolean(curriculumMetadata[prerequisiteId]), true, `Unknown prerequisite ${prerequisiteId} for ${topicId}`);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (topicId: string) => {
    if (visiting.has(topicId)) throw new Error(`Prerequisite cycle detected at ${topicId}`);
    if (visited.has(topicId)) return;
    visiting.add(topicId);
    for (const prerequisiteId of graph.get(topicId) ?? []) visit(prerequisiteId);
    visiting.delete(topicId);
    visited.add(topicId);
  };

  for (const topicId of graph.keys()) visit(topicId);

  assert.equal(curriculumMetadata['s3_d6_t24_generics'].prerequisites.length, 0);
  assert.equal(javaFoundationContent['s3_d6_t24_generics'].prerequisites?.length, 3);
});

test('Java stages distinguish foundation, core, intermediate, and advanced topics', () => {
  assert.equal(curriculumMetadata['s1_d1_t2_java-basics'].stage, 'foundation');
  assert.equal(curriculumMetadata['s2_d3_t5_inheritance'].stage, 'core');
  assert.equal(curriculumMetadata['s3_d6_t14_exception-handling'].stage, 'intermediate');
  assert.equal(curriculumMetadata['s3_d5_t11_object-cloning'].stage, 'advanced');
  assert.equal(curriculumMetadata['s3_d6_t24_generics'].stage, 'advanced');
  assert.equal(curriculumMetadata['s3_d5_t12_minimum-window-substring'].stage, 'intermediate');
});

test('code examples declare subject-agnostic language and execution context', () => {
  for (const content of Object.values(javaFoundationContent)) {
    for (const example of content.codeExamples ?? []) {
      assert.equal(example.language, 'java');
      assert.equal(['standalone', 'contextual'].includes(example.executionMode ?? ''), true);
    }
  }

  assert.equal(javaFoundationContent['s1_d1_t2_java-basics'].codeExamples?.[0].filename, 'Basics.java');
  assert.equal(javaFoundationContent['s1_d4_t5_installation-and-tools'].codeExamples?.[0].filename, 'Hello.java');
  assert.equal(javaFoundationContent['s1_d6_t16_constructors'].codeExamples?.[0].executionMode, 'contextual');
  assert.equal(javaFoundationContent['s2_d5_t15_polymorphism'].codeExamples?.[0].executionMode, 'contextual');
});

test('structured content does not alter curriculum data', () => {
  assert.equal(topicIds.size, 14);
  assert.equal(dsaTopicIds.size, 5);
});

test('legacy non-Java resolution remains unchanged', () => {
  const before = legacyFallback('s2_d4_t4_find-peak-element', 'Find Peak Element');
  const resolved = resolveLearningContent('s2_d4_t4_find-peak-element', 'Find Peak Element', 'DSA', legacyFallback);
  if (isLearningContent(resolved)) throw new Error('Legacy DSA topic unexpectedly resolved to structured content');
  assert.deepEqual(resolved, before);
});

test('optional structured fields can be absent without breaking the model', () => {
  const minimal: LearningContent = {
    topicId: 'minimal',
    contentVersion: 1,
    overview: 'A minimal valid structured lesson.',
    sections: [{ title: 'One idea', explanation: 'One explanation.' }],
  };
  assert.doesNotThrow(() => JSON.stringify(minimal));
});

test('quick checks keep answers hidden until the learner chooses to reveal them', () => {
  const content: LearningContent = {
    topicId: 's1_d1_t2_java-basics',
    contentVersion: 1,
    overview: 'Java values and variables.',
    prerequisites: ['s1_d1_t2_java-basics'],
    sections: [{ title: 'Values', explanation: 'Java variables have a type.' }],
    quickChecks: [{
      question: 'Which is a reference variable?',
      options: ['A primitive int', 'A variable pointing to a heap object', 'A bytecode file', 'A method name'],
      correctAnswer: 'Heap reference',
      explanation: 'References point to object instances in heap memory.'
    }],
  };

  const markup = renderToStaticMarkup(React.createElement(StructuredQuestionsPanel, { content }));
  assert.equal(markup.includes('<strong>Answer:</strong>'), false);
  assert.equal(markup.includes('References point to object instances in heap memory.'), false);
  assert.equal(markup.includes('Show answer'), true);
});

test('structured practice rendering supports zero, one, and multiple practice items', () => {
  const base: LearningContent = {
    topicId: 'practice-rendering',
    contentVersion: 1,
    overview: 'Practice rendering test.',
    sections: [{ title: 'Practice', explanation: 'Practice rendering.' }],
  };

  const zeroMarkup = renderToStaticMarkup(React.createElement(StructuredLearningPanel, { content: { ...base, practice: [] } }));
  assert.equal(zeroMarkup.includes('PRACTICE PROMPT //'), false);

  const oneMarkup = renderToStaticMarkup(React.createElement(StructuredLearningPanel, {
    content: {
      ...base,
      practice: [{ title: 'One task', prompt: 'Do one task.', expectedSkill: 'One skill.' }],
    },
  }));
  assert.equal(oneMarkup.includes('PRACTICE PROMPT // One task'), true);

  const multipleMarkup = renderToStaticMarkup(React.createElement(StructuredLearningPanel, {
    content: {
      ...base,
      practice: [
        { title: 'First task', prompt: 'Do the first task.', expectedSkill: 'First skill.' },
        { title: 'Second task', prompt: 'Do the second task.', expectedSkill: 'Second skill.' },
      ],
    },
  }));
  assert.equal(multipleMarkup.includes('PRACTICE PROMPT // First task'), true);
  assert.equal(multipleMarkup.includes('PRACTICE PROMPT // Second task'), true);
});

test('structured prerequisite IDs render as readable topic names', () => {
  const content: LearningContent = {
    topicId: 's1_d5_t3_classes-and-objects',
    contentVersion: 1,
    overview: 'Classes and objects are the core of OOP.',
    prerequisites: ['s1_d4_t7_what-is-oop'],
    sections: [{ title: 'Class blueprint', explanation: 'A class defines the shape of an object.' }],
  };

  const markup = renderToStaticMarkup(React.createElement(StructuredLearningPanel, { content }));
  assert.equal(markup.includes('s1_d4_t7_what-is-oop'), false);
  assert.equal(markup.includes('What Is OOP?'), true);
});
