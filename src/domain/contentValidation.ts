import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import type { CurriculumData, Subject, TopicMetadata } from '../types/curriculum.ts';
import type { CodeExample, LearningContent } from '../types/learningContent.ts';

export type ContentValidationSeverity = 'error' | 'warning';

export interface ContentValidationIssue {
  code: string;
  severity: ContentValidationSeverity;
  topicId: string;
  message: string;
  path?: string;
}

export interface ContentValidationResult {
  valid: boolean;
  errors: ContentValidationIssue[];
  warnings: ContentValidationIssue[];
}

export type TopicContentValidator = (content: LearningContent) => ContentValidationIssue[];

export interface StructuredRegistryValidationOptions {
  curriculumMetadata: Record<string, TopicMetadata>;
  expectedSubject?: Subject;
  expectedTopicIds?: readonly string[];
  topicValidators?: Record<string, TopicContentValidator>;
}

export interface CurriculumSnapshot {
  topicIds: string[];
  topics: Record<string, {
    sprintNumber: number;
    dayNumber: number;
    orderIndex: number;
  }>;
}

const SUPPORTED_LANGUAGES = new Set(['java', 'sql', 'python', 'c', 'cpp', 'pseudocode', 'shell']);
const PLACEHOLDER_PATTERN = /\b(?:TODO|TBD|lorem ipsum|coming soon)\b|\bplaceholder\s+(?:content|text|lesson|example|value)\b/i;
const JAVA_PUBLIC_CLASS_PATTERN = /\bpublic\s+(?:final\s+)?class\s+([A-Za-z_$][\w$]*)/;

const issue = (
  severity: ContentValidationSeverity,
  code: string,
  topicId: string,
  message: string,
  path?: string,
): ContentValidationIssue => ({ severity, code, topicId, message, path });

const mergeResults = (target: ContentValidationResult, issues: ContentValidationIssue[]) => {
  for (const validationIssue of issues) {
    if (validationIssue.severity === 'error') target.errors.push(validationIssue);
    else target.warnings.push(validationIssue);
  }
  target.valid = target.errors.length === 0;
};

const hasPlaceholder = (value: string) => PLACEHOLDER_PATTERN.test(value);

const validateText = (
  value: unknown,
  topicId: string,
  code: string,
  path: string,
  label: string,
  result: ContentValidationResult,
) => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    result.errors.push(issue('error', code, topicId, `${label} must be non-empty.`, path));
    return;
  }
  if (hasPlaceholder(value)) {
    result.errors.push(issue('error', 'PLACEHOLDER_CONTENT', topicId, `${label} contains placeholder text.`, path));
  }
};

export const validateLearningContent = (
  content: LearningContent,
  curriculumMetadata: Record<string, TopicMetadata>,
): ContentValidationResult => {
  const result: ContentValidationResult = { valid: true, errors: [], warnings: [] };
  const topicId = typeof content?.topicId === 'string' ? content.topicId : '';

  if (!topicId) {
    result.errors.push(issue('error', 'MISSING_TOPIC_ID', '', 'Structured content must have a topicId.', 'topicId'));
  } else if (!curriculumMetadata[topicId]) {
    result.errors.push(issue('error', 'UNKNOWN_TOPIC_ID', topicId, 'topicId does not exist in curriculum metadata.', 'topicId'));
  }

  if (!Number.isInteger(content?.contentVersion) || content.contentVersion < 1) {
    result.errors.push(issue('error', 'INVALID_CONTENT_VERSION', topicId, 'contentVersion must be a positive integer.', 'contentVersion'));
  }

  validateText(content?.overview, topicId, 'MISSING_OVERVIEW', 'overview', 'Overview', result);

  if (!Array.isArray(content?.sections) || content.sections.length === 0) {
    result.errors.push(issue('error', 'MISSING_SECTIONS', topicId, 'At least one content section is required.', 'sections'));
  } else {
    content.sections.forEach((section, index) => {
      validateText(section?.title, topicId, 'EMPTY_SECTION_TITLE', `sections[${index}].title`, 'Section title', result);
      validateText(section?.explanation, topicId, 'EMPTY_SECTION_EXPLANATION', `sections[${index}].explanation`, 'Section explanation', result);
      if (section?.example !== undefined) validateText(section.example, topicId, 'EMPTY_SECTION_EXAMPLE', `sections[${index}].example`, 'Section example', result);
      if (section?.takeaway !== undefined) validateText(section.takeaway, topicId, 'EMPTY_SECTION_TAKEAWAY', `sections[${index}].takeaway`, 'Section takeaway', result);
    });
  }

  if (content.whyItMatters !== undefined) validateText(content.whyItMatters, topicId, 'EMPTY_WHY_IT_MATTERS', 'whyItMatters', 'Why it matters', result);
  if (content.estimatedMinutes !== undefined && (!Number.isFinite(content.estimatedMinutes) || content.estimatedMinutes <= 0 || content.estimatedMinutes > 240)) {
    result.warnings.push(issue('warning', 'SUSPICIOUS_ESTIMATED_MINUTES', topicId, 'estimatedMinutes should be between 1 and 240.', 'estimatedMinutes'));
  }

  const prerequisites = content.prerequisites ?? [];
  const prerequisiteSet = new Set<string>();
  prerequisites.forEach((prerequisiteId, index) => {
    if (prerequisiteSet.has(prerequisiteId)) {
      result.errors.push(issue('error', 'DUPLICATE_PREREQUISITE', topicId, `Duplicate prerequisite: ${prerequisiteId}.`, `prerequisites[${index}]`));
    }
    prerequisiteSet.add(prerequisiteId);
    if (prerequisiteId === topicId) {
      result.errors.push(issue('error', 'SELF_PREREQUISITE', topicId, 'A topic cannot depend on itself.', `prerequisites[${index}]`));
    }
    if (!curriculumMetadata[prerequisiteId]) {
      result.errors.push(issue('error', 'UNKNOWN_PREREQUISITE', topicId, `Prerequisite does not exist: ${prerequisiteId}.`, `prerequisites[${index}]`));
    }
  });

  if (content.examples !== undefined) {
    if (!Array.isArray(content.examples)) {
      result.errors.push(issue('error', 'INVALID_EXAMPLES', topicId, 'examples must be an array.', 'examples'));
    } else {
      content.examples.forEach((example, index) => {
        validateText(example?.title, topicId, 'EMPTY_EXAMPLE_TITLE', `examples[${index}].title`, 'Example title', result);
        if (!Array.isArray(example?.walkthrough) || example.walkthrough.length === 0) {
          result.errors.push(issue('error', 'EMPTY_EXAMPLE_WALKTHROUGH', topicId, 'Every example needs a non-empty walkthrough.', `examples[${index}].walkthrough`));
        } else {
          example.walkthrough.forEach((step, stepIndex) => validateText(step, topicId, 'EMPTY_EXAMPLE_STEP', `examples[${index}].walkthrough[${stepIndex}]`, 'Example step', result));
        }
      });
    }
  }

  if (content.codeExamples !== undefined) {
    if (!Array.isArray(content.codeExamples)) {
      result.errors.push(issue('error', 'INVALID_CODE_EXAMPLES', topicId, 'codeExamples must be an array.', 'codeExamples'));
    } else {
      content.codeExamples.forEach((example, index) => validateCodeExample(example, topicId, index, result));
    }
  }

  if (content.commonMistakes !== undefined) content.commonMistakes.forEach((mistake, index) => validateText(mistake, topicId, 'EMPTY_COMMON_MISTAKE', `commonMistakes[${index}]`, 'Common mistake', result));
  if (content.interviewNotes !== undefined) content.interviewNotes.forEach((note, index) => validateText(note, topicId, 'EMPTY_INTERVIEW_NOTE', `interviewNotes[${index}]`, 'Interview note', result));

  if (content.quickChecks !== undefined) {
    if (!Array.isArray(content.quickChecks)) {
      result.errors.push(issue('error', 'INVALID_QUICK_CHECKS', topicId, 'quickChecks must be an array.', 'quickChecks'));
    } else {
      content.quickChecks.forEach((check, index) => {
        validateText(check?.question, topicId, 'EMPTY_QUICK_CHECK_QUESTION', `quickChecks[${index}].question`, 'Quick-check question', result);
        validateText(check?.explanation, topicId, 'EMPTY_QUICK_CHECK_EXPLANATION', `quickChecks[${index}].explanation`, 'Quick-check explanation', result);
        if (!Array.isArray(check?.options) || check.options.length < 2) {
          result.errors.push(issue('error', 'INVALID_QUICK_CHECK_OPTIONS', topicId, 'A quick check needs at least two options.', `quickChecks[${index}].options`));
        } else {
          const options = new Set(check.options);
          if (options.size !== check.options.length) result.warnings.push(issue('warning', 'DUPLICATE_QUICK_CHECK_OPTIONS', topicId, 'Quick-check options should be unique.', `quickChecks[${index}].options`));
        }
        if (Array.isArray(check?.options) && !check.options.includes(check.correctAnswer)) result.errors.push(issue('error', 'QUICK_CHECK_ANSWER_NOT_FOUND', topicId, 'correctAnswer must match one of the options.', `quickChecks[${index}].correctAnswer`));
      });
    }
  }

  if (content.practice !== undefined) {
    if (!Array.isArray(content.practice)) {
      result.errors.push(issue('error', 'INVALID_PRACTICE', topicId, 'practice must be an array.', 'practice'));
    } else {
      content.practice.forEach((practice, index) => {
        validateText(practice?.title, topicId, 'EMPTY_PRACTICE_TITLE', `practice[${index}].title`, 'Practice title', result);
        validateText(practice?.prompt, topicId, 'EMPTY_PRACTICE_PROMPT', `practice[${index}].prompt`, 'Practice prompt', result);
        validateText(practice?.expectedSkill, topicId, 'EMPTY_PRACTICE_SKILL', `practice[${index}].expectedSkill`, 'Expected skill', result);
      });
    }
  }

  if (content.resources !== undefined) {
    if (!Array.isArray(content.resources)) {
      result.errors.push(issue('error', 'INVALID_RESOURCES', topicId, 'resources must be an array.', 'resources'));
    } else {
      const resourceUrls = new Set<string>();
      content.resources.forEach((resource, index) => {
        validateText(resource?.title, topicId, 'EMPTY_RESOURCE_TITLE', `resources[${index}].title`, 'Resource title', result);
        validateText(resource?.description, topicId, 'EMPTY_RESOURCE_DESCRIPTION', `resources[${index}].description`, 'Resource description', result);
        validateText(resource?.source, topicId, 'EMPTY_RESOURCE_SOURCE', `resources[${index}].source`, 'Resource source', result);
        try {
          const url = new URL(resource.url);
          if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Unsupported protocol');
          if (resourceUrls.has(resource.url)) result.warnings.push(issue('warning', 'DUPLICATE_RESOURCE_URL', topicId, `Duplicate resource URL: ${resource.url}.`, `resources[${index}].url`));
          resourceUrls.add(resource.url);
        } catch {
          result.errors.push(issue('error', 'INVALID_RESOURCE_URL', topicId, 'Resource URL must be a valid HTTP(S) URL.', `resources[${index}].url`));
        }
      });
    }
  }

  result.valid = result.errors.length === 0;
  return result;
};

const validateCodeExample = (example: CodeExample, topicId: string, index: number, result: ContentValidationResult) => {
  validateText(example?.title, topicId, 'EMPTY_CODE_TITLE', `codeExamples[${index}].title`, 'Code-example title', result);
  validateText(example?.code, topicId, 'EMPTY_CODE', `codeExamples[${index}].code`, 'Code example', result);
  validateText(example?.explanation, topicId, 'EMPTY_CODE_EXPLANATION', `codeExamples[${index}].explanation`, 'Code-example explanation', result);
  if (!SUPPORTED_LANGUAGES.has(example?.language)) result.errors.push(issue('error', 'UNSUPPORTED_CODE_LANGUAGE', topicId, `Unsupported code language: ${example?.language}.`, `codeExamples[${index}].language`));
  if (example?.executionMode !== undefined && !['standalone', 'contextual'].includes(example.executionMode)) result.errors.push(issue('error', 'INVALID_EXECUTION_MODE', topicId, 'executionMode must be standalone or contextual.', `codeExamples[${index}].executionMode`));
  if (example?.filename !== undefined && example.executionMode === 'contextual') result.errors.push(issue('error', 'CONTEXTUAL_FILENAME', topicId, 'Contextual examples should not declare a standalone filename.', `codeExamples[${index}].filename`));
};

export const validateStructuredRegistry = (
  entries: Iterable<LearningContent>,
  options: StructuredRegistryValidationOptions,
): ContentValidationResult => {
  const result: ContentValidationResult = { valid: true, errors: [], warnings: [] };
  const contents = [...entries];
  const byId = new Map<string, LearningContent>();

  contents.forEach((content, index) => {
    if (byId.has(content.topicId)) result.errors.push(issue('error', 'DUPLICATE_REGISTRY_TOPIC', content.topicId, 'A structured registry contains a duplicate topic ID.', `entries[${index}]`));
    byId.set(content.topicId, content);
    const contentResult = validateLearningContent(content, options.curriculumMetadata);
    result.errors.push(...contentResult.errors);
    result.warnings.push(...contentResult.warnings);
    const metadata = options.curriculumMetadata[content.topicId];
    if (metadata && options.expectedSubject && metadata.subject !== options.expectedSubject) result.errors.push(issue('error', 'REGISTRY_SUBJECT_MISMATCH', content.topicId, `Registry topic belongs to ${metadata.subject}, not ${options.expectedSubject}.`, 'topicId'));
    const validator = options.topicValidators?.[content.topicId];
    if (validator) mergeResults(result, validator(content));
  });

  if (options.expectedTopicIds) {
    const expected = new Set(options.expectedTopicIds);
    for (const topicId of expected) if (!byId.has(topicId)) result.errors.push(issue('error', 'MISSING_REGISTRY_TOPIC', topicId, 'Expected structured topic is missing from the registry.'));
    for (const topicId of byId.keys()) if (!expected.has(topicId)) result.errors.push(issue('error', 'UNEXPECTED_REGISTRY_TOPIC', topicId, 'Registry contains a topic outside the approved set.'));
  }

  const prerequisiteGraph = new Map(contents.map((content) => [content.topicId, content.prerequisites ?? []]));
  const visiting = new Set<string>();
  const visited = new Set<string>();
  const visit = (topicId: string) => {
    if (visiting.has(topicId)) {
      result.errors.push(issue('error', 'PREREQUISITE_CYCLE', topicId, 'Structured prerequisite cycle detected.'));
      return;
    }
    if (visited.has(topicId)) return;
    visiting.add(topicId);
    for (const prerequisiteId of prerequisiteGraph.get(topicId) ?? []) if (prerequisiteGraph.has(prerequisiteId)) visit(prerequisiteId);
    visiting.delete(topicId);
    visited.add(topicId);
  };
  for (const topicId of prerequisiteGraph.keys()) visit(topicId);

  const overviews = new Map<string, string>();
  const practicePrompts = new Map<string, string>();
  for (const content of contents) {
    if (overviews.has(content.overview)) result.warnings.push(issue('warning', 'REPEATED_OVERVIEW', content.topicId, `Overview matches ${overviews.get(content.overview)}.`, 'overview'));
    else overviews.set(content.overview, content.topicId);
    for (const practice of content.practice ?? []) {
      if (practicePrompts.has(practice.prompt)) result.warnings.push(issue('warning', 'REPEATED_PRACTICE_PROMPT', content.topicId, `Practice prompt matches ${practicePrompts.get(practice.prompt)}.`, 'practice'));
      else practicePrompts.set(practice.prompt, content.topicId);
    }
  }

  result.valid = result.errors.length === 0;
  return result;
};

export const createCurriculumSnapshot = (curriculum: CurriculumData): CurriculumSnapshot => {
  const topics: CurriculumSnapshot['topics'] = {};
  const topicIds: string[] = [];
  for (const sprint of curriculum.sprints) for (const day of sprint.days) for (const topic of day.topics) {
    topicIds.push(topic.id);
    topics[topic.id] = { sprintNumber: topic.sprintNumber, dayNumber: topic.dayNumber, orderIndex: topic.orderIndex };
  }
  return { topicIds, topics };
};

export const hashCurriculumSnapshot = (snapshot: CurriculumSnapshot) => createHash('sha256').update(JSON.stringify(snapshot)).digest('hex');

export const compareCurriculumSnapshots = (expected: CurriculumSnapshot, actual: CurriculumSnapshot): ContentValidationResult => {
  const result: ContentValidationResult = { valid: true, errors: [], warnings: [] };
  if (expected.topicIds.length !== actual.topicIds.length) result.errors.push(issue('error', 'CURRICULUM_TOPIC_COUNT_CHANGED', 'curriculum', 'Curriculum topic count changed.'));
  if (expected.topicIds.join('|') !== actual.topicIds.join('|')) result.errors.push(issue('error', 'CURRICULUM_ORDER_CHANGED', 'curriculum', 'Curriculum topic IDs or ordering changed.'));
  for (const topicId of expected.topicIds) {
    if (!actual.topics[topicId]) result.errors.push(issue('error', 'CURRICULUM_TOPIC_REMOVED', topicId, 'Curriculum topic was removed.'));
    else if (JSON.stringify(expected.topics[topicId]) !== JSON.stringify(actual.topics[topicId])) result.errors.push(issue('error', 'CURRICULUM_TOPIC_POSITION_CHANGED', topicId, 'Curriculum topic sprint/day/order changed.'));
  }
  result.valid = result.errors.length === 0;
  return result;
};

export const validateStandaloneJavaExamples = (contents: Iterable<LearningContent>): ContentValidationResult => {
  const result: ContentValidationResult = { valid: true, errors: [], warnings: [] };
  const javacCheck = spawnSync('javac', ['-version'], { encoding: 'utf8' });
  if (javacCheck.error) {
    result.warnings.push(issue('warning', 'JAVAC_UNAVAILABLE', 'java', 'javac is unavailable; standalone Java examples were not compiled.'));
    result.valid = true;
    return result;
  }

  const root = mkdtempSync(join(tmpdir(), 'structured-content-java-'));
  try {
    for (const content of contents) for (const [index, example] of (content.codeExamples ?? []).entries()) {
      if (example.language !== 'java' || example.executionMode === 'contextual') continue;
      const publicClass = example.code.match(JAVA_PUBLIC_CLASS_PATTERN)?.[1];
      const filename = basename(example.filename ?? (publicClass ? `${publicClass}.java` : 'Example.java'));
      const directory = join(root, `${content.topicId}-${index}`);
      const filePath = join(directory, filename);
      const sourceDirectory = join(root, `${content.topicId}-${index}`);
      mkdirSync(sourceDirectory);
      writeFileSync(filePath, example.code, 'utf8');
      const compilation = spawnSync('javac', [filePath], { encoding: 'utf8', timeout: 30_000 });
      if (compilation.status !== 0) {
        const message = compilation.error?.message || compilation.stderr || compilation.stdout || 'javac failed';
        result.errors.push(issue('error', 'JAVA_COMPILE_FAILED', content.topicId, message.trim(), `codeExamples[${index}].code`));
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
  result.valid = result.errors.length === 0;
  return result;
};

