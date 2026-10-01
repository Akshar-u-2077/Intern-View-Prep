import curriculumRaw from './curriculum.json';
import { Subject, TopicMetadata } from '../types/curriculum';

const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const getStageForTopic = (title: string, subject: Subject): TopicMetadata['stage'] => {
  const normalized = normalizeTitle(title);

  if (subject === 'Java / OOP') {
    if (normalized.includes('object cloning') || normalized.includes('generics')) return 'advanced';
    if (normalized.includes('exception handling')) return 'intermediate';
    if (
      normalized.includes('access modifiers') ||
      normalized.includes('attributes and methods') ||
      normalized.includes('inheritance') ||
      normalized.includes('polymorphism') ||
      normalized.includes('interfaces') ||
      normalized.includes('static keyword')
    ) {
      return 'core';
    }
    return 'foundation';
  }

  if (normalized.includes('inheritance') || normalized.includes('polymorphism')) {
    return 'core';
  }

  if (subject === 'SQL' || subject === 'DBMS') {
    return normalized.includes('window') || normalized.includes('join') || normalized.includes('subquery') ? 'intermediate' : 'core';
  }

  if (subject === 'DSA') {
    return normalized.includes('majority') || normalized.includes('kadane') ? 'core' : 'intermediate';
  }

  if (subject === 'Operating Systems' || subject === 'Computer Networks') {
    return normalized.includes('why') || normalized.includes('what happens') ? 'foundation' : 'intermediate';
  }

  if (subject === 'LLD' || subject === 'System Design') {
    return 'advanced';
  }

  if (subject === 'Concurrency' || subject === 'Security') {
    return 'intermediate';
  }

  return 'depth';
};

const getTopicRelevance = (title: string, subject: Subject) => {
  const normalized = normalizeTitle(title);
  const isJavaFoundation = subject === 'Java / OOP';
  const isSqlOrDbms = subject === 'SQL' || subject === 'DBMS';
  const isDsa = subject === 'DSA';
  const isSystem = subject === 'Operating Systems' || subject === 'Computer Networks' || subject === 'LLD' || subject === 'System Design';

  if (isJavaFoundation) {
    return {
      internshipRelevance: 0.96,
      interviewRelevance: 0.94,
      oaRelevance: 0.35,
      technicalInterviewRelevance: 0.96,
      generalInterviewRelevance: 0.82,
    };
  }

  if (isSqlOrDbms) {
    return {
      internshipRelevance: 0.89,
      interviewRelevance: 0.88,
      oaRelevance: 0.42,
      technicalInterviewRelevance: 0.9,
      generalInterviewRelevance: 0.7,
    };
  }

  if (isDsa) {
    return {
      internshipRelevance: 0.95,
      interviewRelevance: 0.93,
      oaRelevance: 0.97,
      technicalInterviewRelevance: 0.89,
      generalInterviewRelevance: 0.62,
    };
  }

  if (isSystem) {
    return {
      internshipRelevance: 0.8,
      interviewRelevance: 0.86,
      oaRelevance: 0.38,
      technicalInterviewRelevance: 0.84,
      generalInterviewRelevance: 0.7,
    };
  }

  if (normalized.includes('design') || normalized.includes('pattern')) {
    return {
      internshipRelevance: 0.82,
      interviewRelevance: 0.88,
      oaRelevance: 0.25,
      technicalInterviewRelevance: 0.9,
      generalInterviewRelevance: 0.72,
    };
  }

  return {
    internshipRelevance: 0.7,
    interviewRelevance: 0.75,
    oaRelevance: 0.35,
    technicalInterviewRelevance: 0.7,
    generalInterviewRelevance: 0.7,
  };
};

const knownPrerequisiteMap: Record<string, string[]> = {
  'java basics': [],
  'what is oop': ['java basics'],
  'inheritance': ['what is oop'],
  'polymorphism': ['inheritance', 'what is oop'],
  'introduction to sql': [],
  'why sql exists': ['introduction to sql'],
  'why do we need an operating system': [],
  'operating system as a manager': ['why do we need an operating system'],
  'why networks exists': [],
  'clients servers and peers': ['why networks exists'],
  'how data moves in packets': ['why networks exists', 'clients servers and peers'],
  'introduction to low level design': [],
  'majority element i': ['java basics'],
  'majority element ii': ['majority element i'],
  'kadane s algorithm': [],
};

export const curriculumMetadata: Record<string, TopicMetadata> = {};

const topicLookup = new Map<string, string>();

for (const sprint of curriculumRaw.sprints) {
  for (const day of sprint.days) {
    for (const topic of day.topics) {
      topicLookup.set(normalizeTitle(topic.title), topic.id);
    }
  }
}

for (const sprint of curriculumRaw.sprints) {
  for (const day of sprint.days) {
    for (const topic of day.topics) {
      const titleKey = normalizeTitle(topic.title);
      const prerequisites = (knownPrerequisiteMap[titleKey] || [])
        .map((name) => topicLookup.get(normalizeTitle(name)))
        .filter((value): value is string => Boolean(value));

      const dependents = [] as string[];

      const relevance = getTopicRelevance(topic.title, topic.subject as Subject);
      const stage = getStageForTopic(topic.title, topic.subject as Subject);

      const metadata: TopicMetadata = {
        topicId: topic.id,
        title: topic.title,
        subject: topic.subject as Subject,
        sprintNumber: topic.sprintNumber,
        dayNumber: topic.dayNumber,
        duration: topic.duration,
        prerequisites,
        dependents,
        stage,
        internshipRelevance: relevance.internshipRelevance,
        interviewRelevance: relevance.interviewRelevance,
        oaRelevance: relevance.oaRelevance,
        technicalInterviewRelevance: relevance.technicalInterviewRelevance,
        generalInterviewRelevance: relevance.generalInterviewRelevance,
        confidence: 0.72,
        reason: `This topic is classified as ${stage} based on the current internship-prep curriculum and its dependency position within the roadmap.`,
      };

      curriculumMetadata[topic.id] = metadata;
    }
  }
}

for (const metadata of Object.values(curriculumMetadata)) {
  for (const prerequisiteId of metadata.prerequisites) {
    const prerequisite = curriculumMetadata[prerequisiteId];
    if (prerequisite) {
      if (!prerequisite.dependents.includes(metadata.topicId)) {
        prerequisite.dependents.push(metadata.topicId);
      }
    }
  }
}

export const curriculumMetadataSummary = {
  totalTopics: Object.keys(curriculumMetadata).length,
  foundationTopics: Object.values(curriculumMetadata).filter((topic) => topic.stage === 'foundation').length,
  coreTopics: Object.values(curriculumMetadata).filter((topic) => topic.stage === 'core').length,
  intermediateTopics: Object.values(curriculumMetadata).filter((topic) => topic.stage === 'intermediate').length,
  advancedTopics: Object.values(curriculumMetadata).filter((topic) => topic.stage === 'advanced').length,
  depthTopics: Object.values(curriculumMetadata).filter((topic) => topic.stage === 'depth').length,
};

export const curriculumStageOrder: TopicMetadata['stage'][] = ['foundation', 'core', 'intermediate', 'advanced', 'depth', 'optional'];
