import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import curriculumRaw from '../data/curriculum.json';
import { dsaFoundationContent, structuredDsaTopicIds } from '../data/dsaFoundationContent.ts';
import { javaFoundationContent, structuredJavaTopicIds } from '../data/javaFoundationContent.ts';
import { curriculumMetadata } from '../data/curriculumMetadata.ts';
import { dsaPilotContentValidators } from './dsaPilotContentValidation.ts';
import {
  compareCurriculumSnapshots,
  createCurriculumSnapshot,
  hashCurriculumSnapshot,
  validateLearningContent,
  validateStandaloneJavaExamples,
  validateStructuredRegistry,
} from './contentValidation.ts';
import type { CurriculumData } from '../types/curriculum.ts';
import type { LearningContent } from '../types/learningContent.ts';

const curriculum = curriculumRaw as CurriculumData;
const CURRICULUM_SNAPSHOT_HASH = '7856353c03c11d88db676558b403039076abf44b7317564e303662ed76d42d0f';
const javaEntries = Object.values(javaFoundationContent);
const dsaEntries = Object.values(dsaFoundationContent);
const javaOptions = { curriculumMetadata, expectedSubject: 'Java / OOP' as const, expectedTopicIds: structuredJavaTopicIds };
const dsaOptions = { curriculumMetadata, expectedSubject: 'DSA' as const, expectedTopicIds: structuredDsaTopicIds, topicValidators: dsaPilotContentValidators };

const cloneContent = (content: LearningContent, changes: Partial<LearningContent>): LearningContent => ({ ...content, ...changes });
const hasCode = (result: { errors: { code: string }[] }, code: string) => result.errors.some((validationIssue) => validationIssue.code === code);

const assertValid = (result: { valid: boolean; errors: unknown[] }, label: string) => {
  assert.equal(result.valid, true, `${label} failed: ${JSON.stringify(result.errors)}`);
  assert.equal(result.errors.length, 0, `${label} returned errors`);
};

test('all current Java and DSA structured registries pass validation', () => {
  assertValid(validateStructuredRegistry(javaEntries, javaOptions), 'Java registry');
  assertValid(validateStructuredRegistry(dsaEntries, dsaOptions), 'DSA registry');
});

test('standalone Java examples in current structured registries compile', (testContext) => {
  if (spawnSync('javac', ['-version'], { encoding: 'utf8' }).error) testContext.skip('javac is unavailable');
  assertValid(validateStandaloneJavaExamples(dsaEntries), 'DSA Java compilation');
});

test('validator catches missing topics, prerequisites, cycles, and duplicate registry entries', () => {
  const valid = dsaFoundationContent[structuredDsaTopicIds[0]];
  const missingTopic = validateLearningContent(cloneContent(valid, { topicId: 'missing-topic' }), curriculumMetadata);
  assert.equal(hasCode(missingTopic, 'UNKNOWN_TOPIC_ID'), true);

  const invalidPrerequisite = validateLearningContent(cloneContent(valid, { prerequisites: ['missing-prerequisite'] }), curriculumMetadata);
  assert.equal(hasCode(invalidPrerequisite, 'UNKNOWN_PREREQUISITE'), true);

  const second = dsaFoundationContent[structuredDsaTopicIds[1]];
  const cycleResult = validateStructuredRegistry([
    cloneContent(valid, { prerequisites: [second.topicId] }),
    cloneContent(second, { prerequisites: [valid.topicId] }),
  ], { curriculumMetadata });
  assert.equal(hasCode(cycleResult, 'PREREQUISITE_CYCLE'), true);

  const duplicateResult = validateStructuredRegistry([valid, valid], { curriculumMetadata });
  assert.equal(hasCode(duplicateResult, 'DUPLICATE_REGISTRY_TOPIC'), true);
});

test('validator catches malformed sections, languages, URLs, placeholders, quick checks, and practice', () => {
  const valid = dsaFoundationContent[structuredDsaTopicIds[0]];
  const emptySection = validateLearningContent(cloneContent(valid, { sections: [{ title: '', explanation: '' }] }), curriculumMetadata);
  assert.equal(hasCode(emptySection, 'EMPTY_SECTION_TITLE'), true);
  assert.equal(hasCode(emptySection, 'EMPTY_SECTION_EXPLANATION'), true);

  const unsupportedLanguage = validateLearningContent(cloneContent(valid, { codeExamples: [{ ...valid.codeExamples![0], language: 'ruby' as never }] }), curriculumMetadata);
  assert.equal(hasCode(unsupportedLanguage, 'UNSUPPORTED_CODE_LANGUAGE'), true);

  const invalidUrl = validateLearningContent(cloneContent(valid, { resources: [{ ...valid.resources![0], url: 'not-a-url' }] }), curriculumMetadata);
  assert.equal(hasCode(invalidUrl, 'INVALID_RESOURCE_URL'), true);

  const placeholder = validateLearningContent(cloneContent(valid, { overview: 'TODO: write this lesson' }), curriculumMetadata);
  assert.equal(hasCode(placeholder, 'PLACEHOLDER_CONTENT'), true);

  const malformedCheck = validateLearningContent(cloneContent(valid, { quickChecks: [{ ...valid.quickChecks![0], options: ['one'], correctAnswer: 'missing' }] }), curriculumMetadata);
  assert.equal(hasCode(malformedCheck, 'INVALID_QUICK_CHECK_OPTIONS'), true);
  assert.equal(hasCode(malformedCheck, 'QUICK_CHECK_ANSWER_NOT_FOUND'), true);

  const emptyPractice = validateLearningContent(cloneContent(valid, { practice: [{ title: '', prompt: '', expectedSkill: '' }] }), curriculumMetadata);
  assert.equal(hasCode(emptyPractice, 'EMPTY_PRACTICE_TITLE'), true);
  assert.equal(hasCode(emptyPractice, 'EMPTY_PRACTICE_PROMPT'), true);
});

test('validator catches standalone Java compilation failures', (testContext) => {
  if (spawnSync('javac', ['-version'], { encoding: 'utf8' }).error) testContext.skip('javac is unavailable');
  const source = javaFoundationContent[structuredJavaTopicIds[0]];
  const broken: LearningContent = cloneContent(source, {
    topicId: source.topicId,
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'Broken.java',
      title: 'Broken example',
      code: 'public class Broken {',
      explanation: 'Compilation failure fixture.',
    }],
  });
  const result = validateStandaloneJavaExamples([broken]);
  assert.equal(hasCode(result, 'JAVA_COMPILE_FAILED'), true);
});

test('curriculum snapshot comparison catches count, ordering, and position drift', () => {
  const baseline = createCurriculumSnapshot(curriculum);
  assert.equal(hashCurriculumSnapshot(baseline), CURRICULUM_SNAPSHOT_HASH);
  assertValid(compareCurriculumSnapshots(baseline, createCurriculumSnapshot(curriculum)), 'Unchanged curriculum');

  const changed = structuredClone(baseline);
  changed.topicIds = [...changed.topicIds].reverse();
  const result = compareCurriculumSnapshots(baseline, changed);
  assert.equal(hasCode(result, 'CURRICULUM_ORDER_CHANGED'), true);
});

test('DSA topic hooks catch missing algorithm-specific markers', () => {
  const content = dsaFoundationContent['s1_d2_t8_majority-element-ii'];
  const result = validateStructuredRegistry([
    cloneContent(content, { sections: content.sections.map((section, index) => index === 0 ? { ...section, explanation: 'A threshold example.' } : section), overview: 'A generic overview.' }),
  ], { curriculumMetadata, topicValidators: dsaPilotContentValidators });
  assert.equal(hasCode(result, 'DSA_REQUIRED_CONCEPT_MISSING'), true);
});
