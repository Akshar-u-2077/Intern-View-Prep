import { javaFoundationContent } from './javaFoundationContent.ts';
import { dsaFoundationContent } from './dsaFoundationContent.ts';
import type { Subject, StructuredLearningContent } from '../types/curriculum.ts';
import type { LearningContent } from '../types/learningContent.ts';

export type ResolvedLearningContent = StructuredLearningContent | LearningContent;
export type LegacyContentResolver = (topicId: string, title: string, subject: Subject) => StructuredLearningContent;

export const isLearningContent = (content: ResolvedLearningContent): content is LearningContent => 'sections' in content;

export const resolveLearningContent = (
  topicId: string,
  title: string,
  subject: Subject,
  legacyResolver: LegacyContentResolver,
): ResolvedLearningContent => {
  if (subject === 'Java / OOP' && javaFoundationContent[topicId]) {
    return javaFoundationContent[topicId];
  }

  if (subject === 'DSA' && dsaFoundationContent[topicId]) {
    return dsaFoundationContent[topicId];
  }

  return legacyResolver(topicId, title, subject);
};
