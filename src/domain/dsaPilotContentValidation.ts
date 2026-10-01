import type { ContentValidationIssue, TopicContentValidator } from './contentValidation.ts';
import type { LearningContent } from '../types/learningContent.ts';

const textFor = (content: LearningContent) => JSON.stringify(content).toLowerCase();

const requireTerms = (topicId: string, terms: string[], label: string): TopicContentValidator => (content) => {
  const text = textFor(content);
  const missing = terms.filter((term) => !text.includes(term.toLowerCase()));
  return missing.length === 0
    ? []
    : [{
      code: 'DSA_REQUIRED_CONCEPT_MISSING',
      severity: 'error',
      topicId,
      message: `${label} is missing required concept markers: ${missing.join(', ')}.`,
    } satisfies ContentValidationIssue];
};

export const dsaPilotContentValidators: Record<string, TopicContentValidator> = {
  's1_d1_t1_majority-element-i': requireTerms('s1_d1_t1_majority-element-i', ['boyer-moore', 'candidate', 'count', 'n / 2', 'verification'], 'Majority Element-I'),
  's1_d2_t4_kadanes-algorithm': requireTerms('s1_d2_t4_kadanes-algorithm', ['currentbest', 'globalbest', 'all-negative', 'contiguous', 'o(n)'], 'Kadane’s Algorithm'),
  's1_d2_t8_majority-element-ii': requireTerms('s1_d2_t8_majority-element-ii', ['two candidate', 'n / 3', 'second pass', 'cancellation', 'both values occur once'], 'Majority Element-II'),
  's1_d3_t2_maximum-product-subarray-in-an': requireTerms('s1_d3_t2_maximum-product-subarray-in-an', ['currentmax', 'currentmin', 'negative', 'zero', 'o(n)'], 'Maximum Product Subarray'),
  's1_d4_t3_sort-an-array-of-0s-1s-and-2s': requireTerms('s1_d4_t3_sort-an-array-of-0s-1s-and-2s', ['low', 'mid', 'high', 'unknown', 'do not advance mid', 'o(n)'], 'Dutch National Flag'),
};
