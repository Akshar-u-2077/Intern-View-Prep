import type { LearningContent } from '../types/learningContent';

const JAVA_BASICS = 's1_d1_t2_java-basics';
const MAJORITY_ELEMENT_I = 's1_d1_t1_majority-element-i';
const KADANES_ALGORITHM = 's1_d2_t4_kadanes-algorithm';

export const dsaFoundationContent: Record<string, LearningContent> = {
  's1_d5_t1_3-sum': {
    topicId: 's1_d1_t1_majority-element-i',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 35,
    overview: 'Given an array, find the value that appears strictly more than half of the time. The problem guarantees that such a majority value exists, so the goal is to identify it without sorting the entire array or storing a frequency table.',
    whyItMatters: 'This is the classic Boyer-Moore majority vote pattern. It shows how a cancellation argument can replace extra memory: matching values strengthen a candidate, while different values cancel one vote from each side.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [2, 2, 1, 1, 1, 2, 2], the answer is 2 because it appears four times out of seven. The majority guarantee matters: without it, the candidate found by cancellation would still need a verification pass before being returned.',
        example: 'Input: [2, 2, 1, 1, 1, 2, 2]\nOutput: 2',
        takeaway: 'We need a value with more than n / 2 occurrences, not merely the most frequent value.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'A frequency map counts every value in one pass and then finds a count above n / 2. That takes O(n) time but O(n) extra space. Sorting also takes O(n log n) time and changes the array or requires a copy.',
        example: 'Map<Integer, Integer> counts = new HashMap<>();',
        takeaway: 'The majority guarantee lets us avoid both a map and sorting.'
      },
      {
        title: 'Cancellation observation',
        explanation: 'Pair one occurrence of a candidate with one different value. A pair contributes no net majority vote. Because the true majority has more occurrences than all other values combined, removing different-value pairs cannot remove every occurrence of the true majority.',
        example: '2, 2, 1, 1, 1, 2, 2\nThe 1 votes cancel some 2 votes, but 2 still has votes left.',
        takeaway: 'Different values cancel one another; the value with a strict majority survives every possible cancellation.'
      },
      {
        title: 'Candidate and count invariant',
        explanation: 'Maintain candidate as the value currently backed by the uncancelled group and count as that group’s balance. When count is zero, the next value starts a new candidate group. Matching the candidate increments count; a different value decrements it.',
        example: 'if (count == 0) candidate = value;\ncount += value == candidate ? 1 : -1;',
        takeaway: 'At every step, count measures the surviving support for candidate after conceptual cancellations.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [2, 2, 1, 1, 1, 2, 2], the state progresses as (candidate, count): (2,1), (2,2), (2,1), (2,0), (1,1), (1,0), (2,1). The final candidate is 2. Notice that the temporary candidate 1 is allowed; the invariant is restored when the balance reaches zero.',
        example: 'value:     2  2  1  1  1  2  2\ncandidate: 2  2  2  2  1  1  2\ncount:     1  2  1  0  1  0  1',
        takeaway: 'The candidate can change several times without losing the majority guarantee.'
      },
      {
        title: 'Java implementation details',
        explanation: 'The implementation uses primitive int state and makes one pass over the array. If the problem does not guarantee a majority, count the final candidate in a second pass and reject it when its frequency is not greater than n / 2.',
        example: 'The pilot implementation relies on the stated majority guarantee and returns the final candidate.',
        takeaway: 'Know whether the input contract provides the guarantee before omitting verification.'
      },
      {
        title: 'Complexity and pitfalls',
        explanation: 'The algorithm runs in O(n) time and O(1) auxiliary space. It is not a solution for “most frequent” when no majority is guaranteed, and it should not be confused with a frequency map that records every value.',
        takeaway: 'Linear time with constant auxiliary space comes from the guarantee plus cancellation.'
      }
    ],
    examples: [{
      title: 'Boyer-Moore state trace',
      setup: 'Trace the candidate and balance for [2, 2, 1, 1, 1, 2, 2].',
      walkthrough: [
        'Read 2: count is zero, so candidate becomes 2 and count becomes 1.',
        'Read 2: it matches, so count becomes 2.',
        'Read 1: it differs, so count becomes 1.',
        'Read 1: it differs again, so count becomes 0; the previous support is cancelled.',
        'Read 1: count is zero, so candidate becomes 1 and count becomes 1.',
        'Read 2: it differs, so count becomes 0.',
        'Read 2: candidate becomes 2 and count becomes 1; the guaranteed majority is the final candidate.'
      ],
      takeaway: 'The counter is a cancellation balance, not the total frequency of the candidate.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'MajorityElementI.java',
      title: 'Boyer-Moore majority vote',
      code: ['public class MajorityElementI {', '    static int majorityElement(int[] values) {', '        int candidate = 0;', '        int count = 0;', '', '        for (int value : values) {', '            if (count == 0) {', '                candidate = value;', '            }', '            count += value == candidate ? 1 : -1;', '        }', '', '        return candidate;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {2, 2, 1, 1, 1, 2, 2};', '        System.out.println(majorityElement(values));', '    }', '}'].join('\n'),
      explanation: 'The count records the balance of the current candidate after cancelling different values. The problem guarantee makes the final candidate the majority value. Without that guarantee, add a second pass to verify its frequency.',
      expectedOutput: '2'
    }],
    commonMistakes: ['Using a frequency map when the problem asks for constant extra space.', 'Thinking count is the candidate’s total frequency instead of its uncancelled balance.', 'Returning the candidate without a verification pass when the problem does not guarantee a majority.', 'Confusing a strict majority, more than n / 2, with the most frequent value.'],
    interviewNotes: ['State the Boyer-Moore invariant: count is the support left after cancelling candidate/non-candidate pairs.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain why a strict majority cannot be completely cancelled by all other values combined.', 'Follow-up: how would you verify the candidate when the majority guarantee is removed?', 'Common trap: treating the algorithm as a general mode-finding algorithm.'],
    quickChecks: [{
      question: 'What does count represent in Boyer-Moore majority vote?',
      options: ['The total number of times candidate has appeared', 'The balance after cancelling different values', 'The array index of candidate', 'The number of distinct values'],
      correctAnswer: 'The balance after cancelling different values',
      explanation: 'The counter tracks uncancelled support, so it can decrease even after the candidate has appeared several times.'
    }, {
      question: 'When is a second verification pass necessary?',
      options: ['Always, even when a majority is guaranteed', 'When the input does not guarantee a value above n / 2', 'Only when the array is sorted', 'Only when count becomes negative'],
      correctAnswer: 'When the input does not guarantee a value above n / 2',
      explanation: 'Without the guarantee, the final candidate may only be a survivor of cancellation and still fail the majority threshold.'
    }, {
      question: 'Why can a true majority survive cancellation?',
      options: ['It is always the first value', 'It has more occurrences than all other values combined', 'It is numerically largest', 'Sorting puts it in the middle'],
      correctAnswer: 'It has more occurrences than all other values combined',
      explanation: 'Each cancellation removes at most one majority occurrence and one non-majority occurrence, so the strict majority cannot be eliminated.'
    }],
    practice: [{
      title: 'Practice: add majority verification',
      prompt: 'Implement majorityElementVerified(int[] values) using Boyer-Moore followed by a second pass. Return the candidate only when its count is greater than values.length / 2; otherwise return a sentinel such as -1. Test a valid majority, a no-majority input, and a single-element input.',
      expectedSkill: 'Applying the cancellation invariant and separating candidate selection from threshold verification.'
    }],
    resources: [
      { title: 'Majority Element', url: 'https://leetcode.com/problems/majority-element/', type: 'practice', description: 'Exact interview problem used to practice the majority guarantee and Boyer-Moore solution.', source: 'LeetCode' },
      { title: 'Boyer-Moore Majority Voting Algorithm', url: 'https://www.geeksforgeeks.org/boyer-moore-majority-voting-algorithm/', type: 'tutorial', description: 'Focused explanation of candidate cancellation and the majority vote algorithm.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d2_t4_kadanes-algorithm': {
    topicId: 's1_d2_t4_kadanes-algorithm',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 35,
    overview: 'Find the contiguous subarray with the largest sum. Contiguous means the chosen elements occupy one uninterrupted range; skipping elements to form a subsequence is a different problem.',
    whyItMatters: 'Kadane’s Algorithm demonstrates a reusable running-state pattern: at each value, either extend the best subarray ending immediately before it or start a new subarray at the current value.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the best contiguous range is [4, -1, 2, 1] with sum 6. The range cannot skip -1 even though skipping it would form a different non-contiguous selection.',
        example: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nBest subarray: [4, -1, 2, 1]\nOutput: 6',
        takeaway: 'The answer is a contiguous interval, so every decision must preserve adjacency.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start and end pair and accumulate each range. With a running sum per start this takes O(n^2) time and O(1) extra space. Recomputing every range sum from scratch would be O(n^3).',
        example: 'for each start: extend end and update the range sum',
        takeaway: 'The repeated work is reconsidering the same prefix of a range after its sum has already become unhelpful.'
      },
      {
        title: 'Start fresh or extend',
        explanation: 'For a subarray ending at the current value, the only useful choices are to start at the current value or extend the best subarray that ended at the previous position. Any earlier prefix is already summarized by that previous best.',
        example: 'currentBest = max(value, currentBest + value);',
        takeaway: 'A negative accumulated prefix can be discarded when the current value is a better starting point.'
      },
      {
        title: 'Running state and invariant',
        explanation: 'currentBest is the largest sum of any non-empty subarray ending exactly at the current index. globalBest is the largest currentBest seen anywhere. Keeping these two values is sufficient because future ranges can only extend the immediately previous ending position.',
        example: 'currentBest = Math.max(value, currentBest + value);\nglobalBest = Math.max(globalBest, currentBest);',
        takeaway: 'The state remembers both the best ending here and the best answer seen overall.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the current/global pairs are (-2,-2), (1,1), (-2,1), (4,4), (3,4), (5,5), (6,6), (1,6), (5,6). The answer is 6.',
        example: 'value:        -2   1  -3   4  -1   2   1  -5   4\ncurrentBest: -2   1  -2   4   3   5   6   1   5\nglobalBest:  -2   1   1   4   4   5   6   6   6',
        takeaway: 'The global answer does not have to end at the final element.'
      },
      {
        title: 'All-negative arrays',
        explanation: 'Initialize both values from the first array element, not zero. For [-8, -3, -6], the correct answer is -3. Starting globalBest at zero would incorrectly claim that an empty subarray with sum zero is allowed.',
        example: 'int currentBest = values[0];\nint globalBest = values[0];',
        takeaway: 'Kadane’s version here requires a non-empty subarray, so zero is not a safe default.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm makes one pass and uses O(1) auxiliary space. Use int when the problem constraints fit int; otherwise use long for sums to avoid overflow. If the actual range is required, store the best start and end whenever globalBest improves.',
        takeaway: 'The optimized sum is O(n) time and O(1) auxiliary space, with initialization and numeric type chosen from the contract.'
      }
    ],
    examples: [{
      title: 'Current best versus global best',
      setup: 'Trace the sum state for [-2, 1, -3, 4, -1, 2, 1, -5, 4].',
      walkthrough: [
        'At -2, the only non-empty subarray ending here has sum -2, so both values are -2.',
        'At 1, starting fresh gives 1, which beats extending -2 to -1.',
        'At 4, the best ending here is 4 because the previous current best is negative.',
        'At -1, extend 4 to get 3; the global best remains 4.',
        'At 2 and then 1, extending produces 5 and 6, so the global best becomes 6.',
        'The later -5 reduces the ending sum to 1, but the earlier global answer 6 is preserved.'
      ],
      takeaway: 'Current state serves future extensions; global state preserves the best completed answer.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'KadanesAlgorithm.java',
      title: 'Maximum subarray sum with Kadane’s Algorithm',
      code: ['public class KadanesAlgorithm {', '    static int maxSubarraySum(int[] values) {', '        int currentBest = values[0];', '        int globalBest = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            currentBest = Math.max(values[index], currentBest + values[index]);', '            globalBest = Math.max(globalBest, currentBest);', '        }', '', '        return globalBest;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {-2, 1, -3, 4, -1, 2, 1, -5, 4};', '        System.out.println(maxSubarraySum(values));', '    }', '}'].join('\n'),
      explanation: 'currentBest stores the best non-empty subarray ending at the current index. globalBest stores the best ending sum seen at any index. Initializing from values[0] keeps all-negative arrays correct.',
      expectedOutput: '6'
    }],
    commonMistakes: ['Initializing the answer to 0 and accidentally allowing an empty subarray when the problem requires a non-empty one.', 'Confusing a contiguous subarray with a subsequence that may skip elements.', 'Tracking only the current sum and losing the best result found earlier.', 'Using int when the input constraints allow the running sum to overflow.'],
    interviewNotes: ['State the invariant: currentBest is the best non-empty sum ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain the fresh-start decision as discarding a negative prefix.', 'Follow-up: how would you return the actual start and end indices?', 'Common trap: initializing globalBest to zero for an all-negative input.'],
    quickChecks: [{
      question: 'What does currentBest represent in Kadane’s Algorithm?',
      options: ['The best sum anywhere in the full array', 'The best non-empty sum ending at the current index', 'The number of positive values seen', 'The sum of every value seen so far'],
      correctAnswer: 'The best non-empty sum ending at the current index',
      explanation: 'Keeping the best ending at the current position lets the next value decide whether to extend or restart.'
    }, {
      question: 'Why should globalBest not start at zero for a non-empty subarray problem?',
      options: ['Zero cannot be stored in an int', 'An all-negative array may have a negative answer', 'The first value is always positive', 'It would make the loop O(n squared)'],
      correctAnswer: 'An all-negative array may have a negative answer',
      explanation: 'For [-8, -3], the correct answer is -3, not zero from an empty selection.'
    }, {
      question: 'What decision does each value trigger?',
      options: ['Sort or reverse the array', 'Start a new range or extend the previous best ending range', 'Add the value to every prior range', 'Choose the smallest value globally'],
      correctAnswer: 'Start a new range or extend the previous best ending range',
      explanation: 'Those are the only two contiguous subarrays that can end at the current value while preserving the optimal ending state.'
    }],
    practice: [{
      title: 'Practice: return the best range',
      prompt: 'Extend Kadane’s Algorithm so it returns the start and end indices of the best non-empty subarray, not only its sum. Dry-run your index updates on [-2, 1, -3, 4, -1, 2, 1, -5, 4] and on [-5, -2, -8].',
      expectedSkill: 'Maintaining a running DP state while preserving the actual range and handling all-negative input.'
    }],
    resources: [
      { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', type: 'practice', description: 'Exact problem for applying Kadane’s Algorithm and checking all-negative behavior.', source: 'LeetCode' },
      { title: 'Kadane’s Algorithm', url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray-kadanes-algorithm/', type: 'tutorial', description: 'Focused explanation of the running best-ending-here state.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d2_t8_majority-element-ii': {
    topicId: 's1_d2_t8_majority-element-ii',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find every value that appears strictly more than n / 3 times in an integer array. Unlike Majority Element-I, there may be zero, one, or two valid answers.',
    whyItMatters: 'This extends Boyer-Moore cancellation from one possible majority candidate to two candidate slots. It demonstrates how a threshold limits the number of values that can survive as candidates.',
    prerequisites: [MAJORITY_ELEMENT_I],
    sections: [
      {
        title: 'Problem framing and threshold',
        explanation: 'For n elements, a value must occur at least floor(n / 3) + 1 times. For [3, 2, 3], the answer is [3]. For [1, 2], both values occur once, and 1 > 2 / 3, so both values satisfy the > n / 3 condition and the answer is [1, 2].',
        example: 'Input: [1, 2, 1, 2, 1, 2, 3]\nThreshold: n / 3 = 2\nOutput: [1, 2]',
        takeaway: 'The threshold is strictly greater than n / 3, not greater than or equal to it.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'A frequency map counts every value and then filters counts above n / 3. This is O(n) time and O(n) space. Sorting is O(n log n). The challenge is to keep the same linear time with constant auxiliary state.',
        takeaway: 'The optimized approach keeps only candidates that could still cross the threshold.'
      },
      {
        title: 'Why two candidates are sufficient',
        explanation: 'There cannot be three different values each appearing more than n / 3 times, because their combined counts would exceed n. Therefore at most two values can qualify, so two candidate/counter slots are enough to represent every possible answer.',
        example: 'Three values each with more than n / 3 occurrences would require more than n positions.',
        takeaway: 'The threshold determines the number of candidate slots: for n / k, at most k - 1 values can qualify.'
      },
      {
        title: 'Cancellation with two slots',
        explanation: 'For each value, increase the matching candidate, fill an empty slot, or decrement both counters when both slots contain different candidates. Decrementing all three distinct values removes a group that cannot contain a net value above n / 3.',
        example: 'if neither slot matches and both counts are positive, countOne-- and countTwo--;',
        takeaway: 'The first pass finds possible candidates, not final answers.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [1, 2, 1, 2, 1, 2, 3], the slots evolve as (1,0), (1,1;2,1), (1,2;2,1), (1,2;2,2), (1,3;2,2), (1,3;2,3), then value 3 decrements both to (1,2;2,2). The second pass confirms both 1 and 2 occur three times, above 7 / 3.',
        example: 'After first pass: candidateOne = 1, candidateTwo = 2\nSecond pass: count(1) = 3, count(2) = 3',
        takeaway: 'A candidate can survive cancellation without actually crossing n / 3, so verification is mandatory.'
      },
      {
        title: 'Second verification pass',
        explanation: 'Count candidateOne and candidateTwo in a fresh pass, then add only values whose counts are greater than n / 3. Check candidateTwo separately from candidateOne so one value is not counted twice.',
        takeaway: 'The first pass is a filter; the second pass enforces the problem’s exact threshold.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm uses two passes, so it runs in O(n) time and O(1) auxiliary space, excluding the output list. Use a result list because there may be zero, one, or two answers.',
        takeaway: 'Two candidate slots plus verification replace an O(n) frequency map.'
      }
    ],
    examples: [{
      title: 'Two-slot cancellation trace',
      setup: 'Trace [1, 2, 1, 2, 1, 2, 3] using two candidates.',
      walkthrough: [
        'Read 1: the first slot is empty, so candidateOne becomes 1 with count 1.',
        'Read 2: the second slot becomes 2 with count 1.',
        'The next 1 and 2 strengthen their matching counters to 2.',
        'The next 1 and 2 strengthen them to 3.',
        'Read 3: it matches neither candidate, so both counters are decremented together.',
        'The first pass leaves 1 and 2 as candidates; the second pass confirms both exceed n / 3.'
      ],
      takeaway: 'The second pass is what separates possible candidates from actual answers.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'MajorityElementII.java',
      title: 'Boyer-Moore with two candidate slots',
      code: ['import java.util.ArrayList;', 'import java.util.List;', '', 'public class MajorityElementII {', '    static List<Integer> majorityElements(int[] values) {', '        int candidateOne = 0;', '        int candidateTwo = 1;', '        int countOne = 0;', '        int countTwo = 0;', '', '        for (int value : values) {', '            if (value == candidateOne) {', '                countOne++;', '            } else if (value == candidateTwo) {', '                countTwo++;', '            } else if (countOne == 0) {', '                candidateOne = value;', '                countOne = 1;', '            } else if (countTwo == 0) {', '                candidateTwo = value;', '                countTwo = 1;', '            } else {', '                countOne--;', '                countTwo--;', '            }', '        }', '', '        int occurrencesOne = 0;', '        int occurrencesTwo = 0;', '        for (int value : values) {', '            if (value == candidateOne) occurrencesOne++;', '            if (value == candidateTwo) occurrencesTwo++;', '        }', '', '        List<Integer> result = new ArrayList<>();', '        if (occurrencesOne > values.length / 3) result.add(candidateOne);', '        if (candidateTwo != candidateOne && occurrencesTwo > values.length / 3) result.add(candidateTwo);', '        return result;', '    }', '', '    public static void main(String[] args) {', '        System.out.println(majorityElements(new int[] {1, 2, 1, 2, 1, 2, 3}));', '    }', '}'].join('\n'),
      explanation: 'The first pass maintains two possible candidates because at most two values can exceed n / 3. The second pass counts both candidates and applies the strict threshold before returning results.',
      expectedOutput: '[1, 2]'
    }],
    commonMistakes: ['Using only one candidate slot as in Majority Element-I.', 'Using n / 2 instead of n / 3 as the threshold.', 'Returning candidates from the first pass without verification.', 'Adding the same candidate twice when both slots converge to one value.'],
    interviewNotes: ['Explain why at most two values can occur more than n / 3 times.', 'State the two-pass complexity: O(n) time and O(1) auxiliary space apart from output.', 'Describe cancellation of three different values when both counters are occupied.', 'Follow-up: generalize the candidate count for values appearing more than n / k times.', 'Common trap: treating first-pass candidates as guaranteed answers.'],
    quickChecks: [{
      question: 'Why are two candidate slots enough for the n / 3 threshold?',
      options: ['The array is always sorted', 'Three values above n / 3 would require more than n positions', 'There are only two possible integers', 'The second pass removes all other values'],
      correctAnswer: 'Three values above n / 3 would require more than n positions',
      explanation: 'At most two values can cross a strict one-third threshold.'
    }, {
      question: 'What does the second pass do?',
      options: ['Sort the candidates', 'Verify candidate frequencies against n / 3', 'Create two more candidates', 'Reduce time complexity to O(log n)'],
      correctAnswer: 'Verify candidate frequencies against n / 3',
      explanation: 'The first pass only identifies possible survivors; exact counts are needed before returning them.'
    }, {
      question: 'What happens when a value matches neither candidate and both counters are positive?',
      options: ['Replace both candidates immediately', 'Increment both counters', 'Decrement both counters', 'Stop because the value is invalid'],
      correctAnswer: 'Decrement both counters',
      explanation: 'The value conceptually cancels one occurrence from each occupied candidate group.'
    }],
    practice: [{
      title: 'Practice: generalize the threshold',
      prompt: 'Implement a method for values appearing more than n / k times using k - 1 candidate slots, or first write a careful dry run for k = 4. Explain why the number of slots is k - 1 and include a verification pass.',
      expectedSkill: 'Generalizing cancellation-based candidate selection and separating candidate discovery from exact counting.'
    }],
    resources: [
      { title: 'Majority Element II', url: 'https://leetcode.com/problems/majority-element-ii/', type: 'practice', description: 'Exact problem for the two-candidate Boyer-Moore extension and verification pass.', source: 'LeetCode' },
      { title: 'Majority Element II Explanation', url: 'https://www.geeksforgeeks.org/majority-element-ii/', type: 'tutorial', description: 'Focused explanation of the n / 3 threshold and two-candidate cancellation.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d3_t2_maximum-product-subarray-in-an': {
    topicId: 's1_d3_t2_maximum-product-subarray-in-an',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest product. Unlike maximum subarray sum, a negative value can turn a very small negative product into the largest positive product when multiplied by another negative value.',
    whyItMatters: 'This problem teaches why one running state is not enough when an operation can reverse ordering. Tracking both the maximum and minimum product ending at the current position preserves the two values that a future negative number may need.',
    prerequisites: [KADANES_ALGORITHM],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [2, 3, -2, 4], the best contiguous product is 6 from [2, 3]. For [-2, 3, -4], the answer is 24 because the full range contains two negatives.',
        example: 'Input: [2, 3, -2, 4]\nOutput: 6',
        takeaway: 'The best range must remain contiguous, but its sign can change as values are multiplied.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start index, multiply while extending the end, and keep the largest product. This is O(n^2) time and O(1) extra space. A frequency map or sorting cannot capture the order-sensitive product behavior.',
        takeaway: 'The repeated work is evaluating many ranges that share the same ending product prefixes.'
      },
      {
        title: 'Why maximum product differs from maximum sum',
        explanation: 'For sums, a negative running sum is always harmful to a future positive addition. For products, the smallest negative product may become the largest positive product after multiplying by a negative value. Therefore, a negative input swaps the roles of the current maximum and minimum.',
        example: 'currentMax = -2, currentMin = -6, value = -4\nnewMax may be (-6) * (-4) = 24',
        takeaway: 'Multiplication can reverse order, so preserve both extremes.'
      },
      {
        title: 'Maximum and minimum ending here',
        explanation: 'At each value, the new maximum and minimum can come from the value alone, the previous maximum times the value, or the previous minimum times the value. If the value is negative, swap the previous max and min before calculating so the formulas stay simple.',
        example: 'maxEnding = max(value, previousMax * value)\nminEnding = min(value, previousMin * value)',
        takeaway: 'The pair (maxEnding, minEnding) is the sufficient state for the next position.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [2, 3, -2, 4], the state begins (2,2), becomes (6,6), then after -2 becomes (-2,-12), and finally becomes (4,-48). The global maximum remains 6. For [-2, 3, -4], the states are (-2,-2), (3,-6), then (24,-12), exposing why the minimum must be retained.',
        example: 'Input: [-2, 3, -4]\nvalue -2 -> max -2, min -2\nvalue 3  -> max 3, min -6\nvalue -4 -> max 24, min -12',
        takeaway: 'The minimum state can become the final maximum after a later negative value.'
      },
      {
        title: 'Zero and all-negative inputs',
        explanation: 'Zero can restart a product because any range crossing zero has product zero. The max/min recurrence naturally considers the value itself, so a value after zero starts a new range. Initialize from the first value so arrays such as [-3, -2, -5] return -2 rather than zero.',
        takeaway: 'Do not initialize the answer to zero when the required subarray is non-empty.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm runs in O(n) time and O(1) auxiliary space. Use long instead of int when constraints allow products to exceed the int range. Tracking the actual range requires additional start/end bookkeeping.',
        takeaway: 'The optimized solution keeps two scalar states instead of every possible product range.'
      }
    ],
    examples: [{
      title: 'Negative values reverse the useful state',
      setup: 'Trace [-2, 3, -4].',
      walkthrough: [
        'At -2, both maximum and minimum ending products are -2.',
        'At 3, start fresh with 3 for the maximum, while extending -2 gives -6 for the minimum.',
        'At -4, the previous minimum -6 becomes valuable because (-6) * (-4) = 24.',
        'The global answer is therefore 24 from the entire array.'
      ],
      takeaway: 'Tracking only the previous maximum would miss the product that becomes optimal after the second negative.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'MaximumProductSubarray.java',
      title: 'Maximum product subarray with max/min state',
      code: ['public class MaximumProductSubarray {', '    static int maxProduct(int[] values) {', '        int currentMax = values[0];', '        int currentMin = values[0];', '        int answer = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            int value = values[index];', '            if (value < 0) {', '                int temporary = currentMax;', '                currentMax = currentMin;', '                currentMin = temporary;', '            }', '', '            currentMax = Math.max(value, currentMax * value);', '            currentMin = Math.min(value, currentMin * value);', '            answer = Math.max(answer, currentMax);', '        }', '', '        return answer;', '    }', '', '    public static void main(String[] args) {', '        System.out.println(maxProduct(new int[] {-2, 3, -4}));', '    }', '}'].join('\n'),
      explanation: 'The negative-value swap preserves the previous minimum as the candidate for the new maximum. Considering value alone also handles zeros and starts a new product range after an unhelpful prefix.',
      expectedOutput: '24'
    }],
    commonMistakes: ['Tracking only the maximum product and losing a useful negative minimum.', 'Initializing the answer to zero and failing on all-negative arrays.', 'Treating zero as an ordinary positive or negative value instead of allowing a restart.', 'Forgetting that negative times negative can produce the new maximum.'],
    interviewNotes: ['State the invariant: currentMax and currentMin are the extreme products ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain why the previous minimum is required when the current value is negative.', 'Follow-up: how would you return the actual subarray boundaries?', 'Common trap: copying Kadane’s one-state sum solution without adding the minimum product state.'],
    quickChecks: [{
      question: 'Why must the algorithm track a minimum product as well as a maximum?',
      options: ['The array must be sorted first', 'A negative value can turn the minimum negative product into the maximum positive product', 'Minimum values are always the answer', 'Products cannot be compared directly'],
      correctAnswer: 'A negative value can turn the minimum negative product into the maximum positive product',
      explanation: 'For [-2, 3, -4], the previous minimum -6 becomes 24 after multiplying by -4.'
    }, {
      question: 'What does considering value by itself in the recurrence handle?',
      options: ['Only duplicate values', 'Restarting after zero or an unhelpful prefix', 'Sorting the input', 'The second verification pass'],
      correctAnswer: 'Restarting after zero or an unhelpful prefix',
      explanation: 'The current value can begin a new contiguous range instead of extending the previous product.'
    }, {
      question: 'What is the safe initialization for a non-empty product problem?',
      options: ['currentMax = 0 and answer = 0', 'Initialize from the first array value', 'Initialize from the largest value after sorting', 'Initialize both states to 1'],
      correctAnswer: 'Initialize from the first array value',
      explanation: 'This preserves correct negative answers and avoids inventing an empty product of zero.'
    }],
    practice: [{
      title: 'Practice: return product range boundaries',
      prompt: 'Extend the max/min product algorithm to return the start and end indices of the maximum-product subarray. Test [2, 3, -2, 4], [-2, 3, -4], [0, -2], and [-3, -2, -5]. Explain how a negative-value swap affects the index state.',
      expectedSkill: 'Maintaining paired extrema while preserving the actual contiguous range through sign changes and zeros.'
    }],
    resources: [
      { title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', type: 'practice', description: 'Exact problem for testing negative products, zero restarts, and all-negative input.', source: 'LeetCode' },
      { title: 'Maximum Product Subarray', url: 'https://www.geeksforgeeks.org/maximum-product-subarray/', type: 'tutorial', description: 'Focused explanation of tracking maximum and minimum products ending at each position.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d4_t3_sort-an-array-of-0s-1s-and-2s': {
    topicId: 's1_d4_t3_sort-an-array-of-0s-1s-and-2s',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 35,
    overview: 'Sort an array containing only 0, 1, and 2 in-place. The Dutch National Flag algorithm partitions the array into completed 0s, unknown values, and completed 2s while scanning only once.',
    whyItMatters: 'This is a compact example of an in-place partition invariant. It demonstrates how three pointers can replace comparison sorting when the value domain has exactly three known categories.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'Given [2, 0, 2, 1, 1, 0], produce [0, 0, 1, 1, 2, 2]. The input contains only three values, so using a general comparison sort works but misses the stronger O(n) one-pass structure.',
        example: 'Input: [2, 0, 2, 1, 1, 0]\nOutput: [0, 0, 1, 1, 2, 2]',
        takeaway: 'The restricted value set lets us classify each value directly.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Counting 0s, 1s, and 2s and then overwriting the array takes two passes and O(1) extra space. Calling a comparison sort takes O(n log n) time. The Dutch National Flag method performs the partition in one O(n) pass.',
        takeaway: 'The optimized method uses the values themselves to place elements during one scan.'
      },
      {
        title: 'Three regions and pointer meanings',
        explanation: 'low is the first position that may not be 0, mid is the first unknown position, and high is the last position that may not be 2. The regions are: indices below low are 0, indices from low to mid - 1 are 1, indices from mid to high are unknown, and indices above high are 2.',
        example: '0-region | 1-region | unknown region | 2-region\n[0 .. low-1] [low .. mid-1] [mid .. high] [high+1 .. end]',
        takeaway: 'The loop is safe only while this four-region invariant remains true.'
      },
      {
        title: 'Classification and swaps',
        explanation: 'If values[mid] is 0, swap it with low and advance both low and mid. If it is 1, it is already in the middle region, so advance mid. If it is 2, swap it with high and decrement high, but do not advance mid because the value moved from high is still unknown.',
        takeaway: 'A swap with high requires reprocessing mid; a swap with low moves a known 0 into place.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'Start with [2, 0, 2, 1, 1, 0], low=0, mid=0, high=5. The first 2 swaps with index 5, leaving 0 at mid; swap 0 with low and advance both. The next 2 swaps with index 4 and is reprocessed. The 1s advance mid. The final 0 moves left, producing [0, 0, 1, 1, 2, 2].',
        example: 'Start: [2, 0, 2, 1, 1, 0], low=0, mid=0, high=5\nAfter 2 swap: [0, 0, 2, 1, 1, 2], mid stays 0\nAfter 0 swap: [0, 0, 2, 1, 1, 2], low=1, mid=1\nContinue until mid > high.',
        takeaway: 'The pointer movement follows the guarantee of the value just placed, not the fact that a swap occurred.'
      },
      {
        title: 'Java implementation details',
        explanation: 'The implementation swaps in the original array and uses no auxiliary array. Validate or rely on the problem contract that every value is 0, 1, or 2; another value would violate the three-case invariant.',
        takeaway: 'In-place means the input array is rearranged and no sorted copy is created.'
      },
      {
        title: 'Complexity and pitfalls',
        explanation: 'Each pointer moves only forward or inward, so the algorithm runs in O(n) time and O(1) auxiliary space. The most common bug is incrementing mid after swapping with high and skipping the unclassified value that arrived from the right.',
        takeaway: 'The unknown region shrinks every iteration, while each pointer moves at most n positions.'
      }
    ],
    examples: [{
      title: 'Dutch National Flag pointer trace',
      setup: 'Trace [2, 0, 2, 1, 1, 0] using low, mid, and high.',
      walkthrough: [
        'Initially low=0, mid=0, high=5; all positions are unknown.',
        'mid sees 2, so swap with high. high becomes 4, but mid stays 0 to inspect the moved 0.',
        'mid sees 0, so swap with low and advance low and mid to 1.',
        'mid sees 0 again, so it is already the next 0 region value; advance both pointers.',
        'mid sees 2, swap with high and decrement high; mid stays for reinspection.',
        'mid sees 1 values and advances through the 1 region until the unknown region is empty.'
      ],
      takeaway: 'The no-mid-increment rule after a high swap is the key correctness detail.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'SortColors.java',
      title: 'Dutch National Flag partition',
      code: ['import java.util.Arrays;', '', 'public class SortColors {', '    static void sortColors(int[] values) {', '        int low = 0;', '        int mid = 0;', '        int high = values.length - 1;', '', '        while (mid <= high) {', '            if (values[mid] == 0) {', '                swap(values, low, mid);', '                low++;', '                mid++;', '            } else if (values[mid] == 1) {', '                mid++;', '            } else if (values[mid] == 2) {', '                swap(values, mid, high);', '                high--;', '            } else {', '                throw new IllegalArgumentException("Values must be 0, 1, or 2");', '            }', '        }', '    }', '', '    static void swap(int[] values, int first, int second) {', '        int temporary = values[first];', '        values[first] = values[second];', '        values[second] = temporary;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {2, 0, 2, 1, 1, 0};', '        sortColors(values);', '        System.out.println(Arrays.toString(values));', '    }', '}'].join('\n'),
      explanation: 'low closes the 0 region, mid scans the unknown region, and high closes the 2 region. After swapping a 2 with high, mid is not incremented because the incoming value has not been classified yet.',
      expectedOutput: '[0, 0, 1, 1, 2, 2]'
    }],
    commonMistakes: ['Incrementing mid after swapping with high and skipping the incoming unknown value.', 'Using the wrong loop condition and leaving the final unknown position unprocessed.', 'Breaking the invariant that values below low are 0 and values above high are 2.', 'Using a general sort or extra array when the task specifically tests in-place linear partitioning.'],
    interviewNotes: ['State the four-region invariant and explain what each pointer means.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain why mid advances after a 0 or 1 but not after a 2 swap.', 'Follow-up: how does this partition relate to quicksort’s three-way partitioning?', 'Common trap: assuming every swap classifies both positions.'],
    quickChecks: [{
      question: 'Why is mid not incremented after swapping values[mid] with values[high]?',
      options: ['The array is already sorted', 'The value moved from high is still unclassified', 'high must increase first', '2 values cannot be swapped'],
      correctAnswer: 'The value moved from high is still unclassified',
      explanation: 'The incoming value may be 0, 1, or 2, so mid must inspect it before advancing.'
    }, {
      question: 'Which region is unknown during the scan?',
      options: ['Indices 0 through low - 1', 'Indices low through mid - 1', 'Indices mid through high', 'Indices high + 1 through the end'],
      correctAnswer: 'Indices mid through high',
      explanation: 'The algorithm has not yet classified values in the inclusive mid-to-high range.'
    }, {
      question: 'What happens when values[mid] is 1?',
      options: ['Swap with low and decrement low', 'Swap with high and decrement high', 'Advance mid because 1 belongs in the middle region', 'Restart the scan'],
      correctAnswer: 'Advance mid because 1 belongs in the middle region',
      explanation: 'A 1 is already in the desired middle category, so no swap is necessary.'
    }],
    practice: [{
      title: 'Practice: prove the three-region invariant',
      prompt: 'Implement sortColors(int[] values), then annotate your loop with the guarantees for the regions below low, between low and mid, between mid and high, and above high. Dry-run [2, 0, 1, 2, 1, 0] and explain every pointer movement.',
      expectedSkill: 'Applying an in-place partition invariant and choosing pointer movement based on what a swap guarantees.'
    }],
    resources: [
      { title: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', type: 'practice', description: 'Exact Dutch National Flag problem requiring in-place linear-time partitioning.', source: 'LeetCode' },
      { title: 'Dutch National Flag Problem', url: 'https://www.geeksforgeeks.org/sort-an-array-of-0s-1s-2s/', type: 'tutorial', description: 'Focused explanation of the low, mid, and high partition invariant.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t1_3-sum': {
    topicId: 's1_d5_t1_3-sum',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest sum. Contiguous means the chosen elements occupy one uninterrupted range; skipping elements to form a subsequence is a different problem.',
    whyItMatters: 'Kadane’s Algorithm demonstrates a reusable running-state pattern: at each value, either extend the best subarray ending immediately before it or start a new subarray at the current value.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the best contiguous range is [4, -1, 2, 1] with sum 6. The range cannot skip -1 even though skipping it would form a different non-contiguous selection.',
        example: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nBest subarray: [4, -1, 2, 1]\nOutput: 6',
        takeaway: 'The answer is a contiguous interval, so every decision must preserve adjacency.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start and end pair and accumulate each range. With a running sum per start this takes O(n^2) time and O(1) extra space. Recomputing every range sum from scratch would be O(n^3).',
        example: 'for each start: extend end and update the range sum',
        takeaway: 'The repeated work is reconsidering the same prefix of a range after its sum has already become unhelpful.'
      },
      {
        title: 'Start fresh or extend',
        explanation: 'For a subarray ending at the current value, the only useful choices are to start at the current value or extend the best subarray that ended at the previous position. Any earlier prefix is already summarized by that previous best.',
        example: 'currentBest = max(value, currentBest + value);',
        takeaway: 'A negative accumulated prefix can be discarded when the current value is a better starting point.'
      },
      {
        title: 'Running state and invariant',
        explanation: 'currentBest is the largest sum of any non-empty subarray ending exactly at the current index. globalBest is the largest currentBest seen anywhere. Keeping these two values is sufficient because future ranges can only extend the immediately previous ending position.',
        example: 'currentBest = Math.max(value, currentBest + value);\nglobalBest = Math.max(globalBest, currentBest);',
        takeaway: 'The state remembers both the best ending here and the best answer seen overall.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the current/global pairs are (-2,-2), (1,1), (-2,1), (4,4), (3,4), (5,5), (6,6), (1,6), (5,6). The answer is 6.',
        example: 'value:        -2   1  -3   4  -1   2   1  -5   4\ncurrentBest: -2   1  -2   4   3   5   6   1   5\nglobalBest:  -2   1   1   4   4   5   6   6   6',
        takeaway: 'The global answer does not have to end at the final element.'
      },
      {
        title: 'All-negative arrays',
        explanation: 'Initialize both values from the first array element, not zero. For [-8, -3, -6], the correct answer is -3. Starting globalBest at zero would incorrectly claim that an empty subarray with sum zero is allowed.',
        example: 'int currentBest = values[0];\nint globalBest = values[0];',
        takeaway: 'Kadane’s version here requires a non-empty subarray, so zero is not a safe default.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm makes one pass and uses O(1) auxiliary space. Use int when the problem constraints fit int; otherwise use long for sums to avoid overflow. If the actual range is required, store the best start and end whenever globalBest improves.',
        takeaway: 'The optimized sum is O(n) time and O(1) auxiliary space, with initialization and numeric type chosen from the contract.'
      }
    ],
    examples: [{
      title: 'Current best versus global best',
      setup: 'Trace the sum state for [-2, 1, -3, 4, -1, 2, 1, -5, 4].',
      walkthrough: [
        'At -2, the only non-empty subarray ending here has sum -2, so both values are -2.',
        'At 1, starting fresh gives 1, which beats extending -2 to -1.',
        'At 4, the best ending here is 4 because the previous current best is negative.',
        'At -1, extend 4 to get 3; the global best remains 4.',
        'At 2 and then 1, extending produces 5 and 6, so the global best becomes 6.',
        'The later -5 reduces the ending sum to 1, but the earlier global answer 6 is preserved.'
      ],
      takeaway: 'Current state serves future extensions; global state preserves the best completed answer.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'KadanesAlgorithm.java',
      title: 'Maximum subarray sum with Kadane’s Algorithm',
      code: ['public class KadanesAlgorithm {', '    static int maxSubarraySum(int[] values) {', '        int currentBest = values[0];', '        int globalBest = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            currentBest = Math.max(values[index], currentBest + values[index]);', '            globalBest = Math.max(globalBest, currentBest);', '        }', '', '        return globalBest;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {-2, 1, -3, 4, -1, 2, 1, -5, 4};', '        System.out.println(maxSubarraySum(values));', '    }', '}'].join('\n'),
      explanation: 'currentBest stores the best non-empty subarray ending at the current index. globalBest stores the best ending sum seen at any index. Initializing from values[0] keeps all-negative arrays correct.',
      expectedOutput: '6'
    }],
    commonMistakes: ['Initializing the answer to 0 and accidentally allowing an empty subarray when the problem requires a non-empty one.', 'Confusing a contiguous subarray with a subsequence that may skip elements.', 'Tracking only the current sum and losing the best result found earlier.', 'Using int when the input constraints allow the running sum to overflow.'],
    interviewNotes: ['State the invariant: currentBest is the best non-empty sum ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain the fresh-start decision as discarding a negative prefix.', 'Follow-up: how would you return the actual start and end indices?', 'Common trap: initializing globalBest to zero for an all-negative input.'],
    quickChecks: [{
      question: 'What does currentBest represent in Kadane’s Algorithm?',
      options: ['The best sum anywhere in the full array', 'The best non-empty sum ending at the current index', 'The number of positive values seen', 'The sum of every value seen so far'],
      correctAnswer: 'The best non-empty sum ending at the current index',
      explanation: 'Keeping the best ending at the current position lets the next value decide whether to extend or restart.'
    }, {
      question: 'Why should globalBest not start at zero for a non-empty subarray problem?',
      options: ['Zero cannot be stored in an int', 'An all-negative array may have a negative answer', 'The first value is always positive', 'It would make the loop O(n squared)'],
      correctAnswer: 'An all-negative array may have a negative answer',
      explanation: 'For [-8, -3], the correct answer is -3, not zero from an empty selection.'
    }, {
      question: 'What decision does each value trigger?',
      options: ['Sort or reverse the array', 'Start a new range or extend the previous best ending range', 'Add the value to every prior range', 'Choose the smallest value globally'],
      correctAnswer: 'Start a new range or extend the previous best ending range',
      explanation: 'Those are the only two contiguous subarrays that can end at the current value while preserving the optimal ending state.'
    }],
    practice: [{
      title: 'Practice: return the best range',
      prompt: 'Extend Kadane’s Algorithm so it returns the start and end indices of the best non-empty subarray, not only its sum. Dry-run your index updates on [-2, 1, -3, 4, -1, 2, 1, -5, 4] and on [-5, -2, -8].',
      expectedSkill: 'Maintaining a running DP state while preserving the actual range and handling all-negative input.'
    }],
    resources: [
      { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', type: 'practice', description: 'Exact problem for applying Kadane’s Algorithm and checking all-negative behavior.', source: 'LeetCode' },
      { title: 'Kadane’s Algorithm', url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray-kadanes-algorithm/', type: 'tutorial', description: 'Focused explanation of the running best-ending-here state.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t2_3-product': {
    topicId: 's1_d5_t2_3-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest product. Unlike maximum subarray sum, a negative value can turn a very small negative product into the largest positive product when multiplied by another negative value.',
    whyItMatters: 'This problem teaches why one running state is not enough when an operation can reverse ordering. Tracking both the maximum and minimum product ending at the current position preserves the two values that a future negative number may need.',
    prerequisites: [KADANES_ALGORITHM],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [2, 3, -2, 4], the best contiguous product is 6 from [2, 3]. For [-2, 3, -4], the answer is 24 because the full range contains two negatives.',
        example: 'Input: [2, 3, -2, 4]\nOutput: 6',
        takeaway: 'The best range must remain contiguous, but its sign can change as values are multiplied.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start index, multiply while extending the end, and keep the largest product. This is O(n^2) time and O(1) extra space. A frequency map or sorting cannot capture the order-sensitive product behavior.',
        takeaway: 'The repeated work is evaluating many ranges that share the same ending product prefixes.'
      },
      {
        title: 'Why maximum product differs from maximum sum',
        explanation: 'For sums, a negative running sum is always harmful to a future positive addition. For products, the smallest negative product may become the largest positive product after multiplying by a negative value. Therefore, a negative input swaps the roles of the current maximum and minimum.',
        example: 'currentMax = -2, currentMin = -6, value = -4\nnewMax may be (-6) * (-4) = 24',
        takeaway: 'Multiplication can reverse order, so preserve both extremes.'
      },
      {
        title: 'Maximum and minimum ending here',
        explanation: 'At each value, the new maximum and minimum can come from the value alone, the previous maximum times the value, or the previous minimum times the value. If the value is negative, swap the previous max and min before calculating so the formulas stay simple.',
        example: 'maxEnding = max(value, previousMax * value)\nminEnding = min(value, previousMin * value)',
        takeaway: 'The pair (maxEnding, minEnding) is the sufficient state for the next position.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [2, 3, -2, 4], the state begins (2,2), becomes (6,6), then after -2 becomes (-2,-12), and finally becomes (4,-48). The global maximum remains 6. For [-2, 3, -4], the states are (-2,-2), (3,-6), then (24,-12), exposing why the minimum must be retained.',
        example: 'Input: [-2, 3, -4]\nvalue -2 -> max -2, min -2\nvalue 3  -> max 3, min -6\nvalue -4 -> max 24, min -12',
        takeaway: 'The minimum state can become the final maximum after a later negative value.'
      },
      {
        title: 'Zero and all-negative inputs',
        explanation: 'Zero can restart a product because any range crossing zero has product zero. The max/min recurrence naturally considers the value itself, so a value after zero starts a new range. Initialize from the first value so arrays such as [-3, -2, -5] return -2 rather than zero.',
        takeaway: 'Do not initialize the answer to zero when the required subarray is non-empty.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm runs in O(n) time and O(1) auxiliary space. Use long instead of int when constraints allow products to exceed the int range. Tracking the actual range requires additional start/end bookkeeping.',
        takeaway: 'The optimized solution keeps two scalar states instead of every possible product range.'
      }
    ],
    examples: [{
      title: 'Negative values reverse the useful state',
      setup: 'Trace [-2, 3, -4].',
      walkthrough: [
        'At -2, both maximum and minimum ending products are -2.',
        'At 3, start fresh with 3 for the maximum, while extending -2 gives -6 for the minimum.',
        'At -4, the previous minimum -6 becomes valuable because (-6) * (-4) = 24.',
        'The global answer is therefore 24 from the entire array.'
      ],
      takeaway: 'Tracking only the previous maximum would miss the product that becomes optimal after the second negative.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'MaximumProductSubarray.java',
      title: 'Maximum product subarray with max/min state',
      code: ['public class MaximumProductSubarray {', '    static int maxProduct(int[] values) {', '        int currentMax = values[0];', '        int currentMin = values[0];', '        int answer = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            int value = values[index];', '            if (value < 0) {', '                int temporary = currentMax;', '                currentMax = currentMin;', '                currentMin = temporary;', '            }', '', '            currentMax = Math.max(value, currentMax * value);', '            currentMin = Math.min(value, currentMin * value);', '            answer = Math.max(answer, currentMax);', '        }', '', '        return answer;', '    }', '', '    public static void main(String[] args) {', '        System.out.println(maxProduct(new int[] {-2, 3, -4}));', '    }', '}'].join('\n'),
      explanation: 'The negative-value swap preserves the previous minimum as the candidate for the new maximum. Considering value alone also handles zeros and starts a new product range after an unhelpful prefix.',
      expectedOutput: '24'
    }],
    commonMistakes: ['Tracking only the maximum product and losing a useful negative minimum.', 'Initializing the answer to zero and failing on all-negative arrays.', 'Treating zero as an ordinary positive or negative value instead of allowing a restart.', 'Forgetting that negative times negative can produce the new maximum.'],
    interviewNotes: ['State the invariant: currentMax and currentMin are the extreme products ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain why the previous minimum is required when the current value is negative.', 'Follow-up: how would you return the actual subarray boundaries?', 'Common trap: copying Kadane’s one-state sum solution without adding the minimum product state.'],
    quickChecks: [{
      question: 'Why must the algorithm track a minimum product as well as a maximum?',
      options: ['The array must be sorted first', 'A negative value can turn the minimum negative product into the maximum positive product', 'Minimum values are always the answer', 'Products cannot be compared directly'],
      correctAnswer: 'A negative value can turn the minimum negative product into the maximum positive product',
      explanation: 'For [-2, 3, -4], the previous minimum -6 becomes 24 after multiplying by -4.'
    }, {
      question: 'What does considering value by itself in the recurrence handle?',
      options: ['Only duplicate values', 'Restarting after zero or an unhelpful prefix', 'Sorting the input', 'The second verification pass'],
      correctAnswer: 'Restarting after zero or an unhelpful prefix',
      explanation: 'The current value can begin a new contiguous range instead of extending the previous product.'
    }, {
      question: 'What is the safe initialization for a non-empty product problem?',
      options: ['currentMax = 0 and answer = 0', 'Initialize from the first array value', 'Initialize from the largest value after sorting', 'Initialize both states to 1'],
      correctAnswer: 'Initialize from the first array value',
      explanation: 'This preserves correct negative answers and avoids inventing an empty product of zero.'
    }],
    practice: [{
      title: 'Practice: return product range boundaries',
      prompt: 'Extend the max/min product algorithm to return the start and end indices of the maximum-product subarray. Test [2, 3, -2, 4], [-2, 3, -4], [0, -2], and [-3, -2, -5]. Explain how a negative-value swap affects the index state.',
      expectedSkill: 'Maintaining paired extrema while preserving the actual contiguous range through sign changes and zeros.'
    }],
    resources: [
      { title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', type: 'practice', description: 'Exact problem for testing negative products, zero restarts, and all-negative input.', source: 'LeetCode' },
      { title: 'Maximum Product Subarray', url: 'https://www.geeksforgeeks.org/maximum-product-subarray/', type: 'tutorial', description: 'Focused explanation of tracking maximum and minimum products ending at each position.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t3_3-sum-product': {
    topicId: 's1_d5_t3_3-sum-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest sum. Contiguous means the chosen elements occupy one uninterrupted range; skipping elements to form a subsequence is a different problem.',
    whyItMatters: 'Kadane’s Algorithm demonstrates a reusable running-state pattern: at each value, either extend the best subarray ending immediately before it or start a new subarray at the current value.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the best contiguous range is [4, -1, 2, 1] with sum 6. The range cannot skip -1 even though skipping it would form a different non-contiguous selection.',
        example: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nBest subarray: [4, -1, 2, 1]\nOutput: 6',
        takeaway: 'The answer is a contiguous interval, so every decision must preserve adjacency.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start and end pair and accumulate each range. With a running sum per start this takes O(n^2) time and O(1) extra space. Recomputing every range sum from scratch would be O(n^3).',
        example: 'for each start: extend end and update the range sum',
        takeaway: 'The repeated work is reconsidering the same prefix of a range after its sum has already become unhelpful.'
      },
      {
        title: 'Start fresh or extend',
        explanation: 'For a subarray ending at the current value, the only useful choices are to start at the current value or extend the best subarray that ended at the previous position. Any earlier prefix is already summarized by that previous best.',
        example: 'currentBest = max(value, currentBest + value);',
        takeaway: 'A negative accumulated prefix can be discarded when the current value is a better starting point.'
      },
      {
        title: 'Running state and invariant',
        explanation: 'currentBest is the largest sum of any non-empty subarray ending exactly at the current index. globalBest is the largest currentBest seen anywhere. Keeping these two values is sufficient because future ranges can only extend the immediately previous ending position.',
        example: 'currentBest = Math.max(value, currentBest + value);\nglobalBest = Math.max(globalBest, currentBest);',
        takeaway: 'The state remembers both the best ending here and the best answer seen overall.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the current/global pairs are (-2,-2), (1,1), (-2,1), (4,4), (3,4), (5,5), (6,6), (1,6), (5,6). The answer is 6.',
        example: 'value:        -2   1  -3   4  -1   2   1  -5   4\ncurrentBest: -2   1  -2   4   3   5   6   1   5\nglobalBest:  -2   1   1   4   4   5   6   6   6',
        takeaway: 'The global answer does not have to end at the final element.'
      },
      {
        title: 'All-negative arrays',
        explanation: 'Initialize both values from the first array element, not zero. For [-8, -3, -6], the correct answer is -3. Starting globalBest at zero would incorrectly claim that an empty subarray with sum zero is allowed.',
        example: 'int currentBest = values[0];\nint globalBest = values[0];',
        takeaway: 'Kadane’s version here requires a non-empty subarray, so zero is not a safe default.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm makes one pass and uses O(1) auxiliary space. Use int when the problem constraints fit int; otherwise use long for sums to avoid overflow. If the actual range is required, store the best start and end whenever globalBest improves.',
        takeaway: 'The optimized sum is O(n) time and O(1) auxiliary space, with initialization and numeric type chosen from the contract.'
      }
    ],
    examples: [{
      title: 'Current best versus global best',
      setup: 'Trace the sum state for [-2, 1, -3, 4, -1, 2, 1, -5, 4].',
      walkthrough: [
        'At -2, the only non-empty subarray ending here has sum -2, so both values are -2.',
        'At 1, starting fresh gives 1, which beats extending -2 to -1.',
        'At 4, the best ending here is 4 because the previous current best is negative.',
        'At -1, extend 4 to get 3; the global best remains 4.',
        'At 2 and then 1, extending produces 5 and 6, so the global best becomes 6.',
        'The later -5 reduces the ending sum to 1, but the earlier global answer 6 is preserved.'
      ],
      takeaway: 'Current state serves future extensions; global state preserves the best completed answer.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'KadanesAlgorithm.java',
      title: 'Maximum subarray sum with Kadane’s Algorithm',
      code: ['public class KadanesAlgorithm {', '    static int maxSubarraySum(int[] values) {', '        int currentBest = values[0];', '        int globalBest = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            currentBest = Math.max(values[index], currentBest + values[index]);', '            globalBest = Math.max(globalBest, currentBest);', '        }', '', '        return globalBest;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {-2, 1, -3, 4, -1, 2, 1, -5, 4};', '        System.out.println(maxSubarraySum(values));', '    }', '}'].join('\n'),
      explanation: 'currentBest stores the best non-empty subarray ending at the current index. globalBest stores the best ending sum seen at any index. Initializing from values[0] keeps all-negative arrays correct.',
      expectedOutput: '6'
    }],
    commonMistakes: ['Initializing the answer to 0 and accidentally allowing an empty subarray when the problem requires a non-empty one.', 'Confusing a contiguous subarray with a subsequence that may skip elements.', 'Tracking only the current sum and losing the best result found earlier.', 'Using int when the input constraints allow the running sum to overflow.'],
    interviewNotes: ['State the invariant: currentBest is the best non-empty sum ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain the fresh-start decision as discarding a negative prefix.', 'Follow-up: how would you return the actual start and end indices?', 'Common trap: initializing globalBest to zero for an all-negative input.'],
    quickChecks: [{
      question: 'What does currentBest represent in Kadane’s Algorithm?',
      options: ['The best sum anywhere in the full array', 'The best non-empty sum ending at the current index', 'The number of positive values seen', 'The sum of every value seen so far'],
      correctAnswer: 'The best non-empty sum ending at the current index',
      explanation: 'Keeping the best ending at the current position lets the next value decide whether to extend or restart.'
    }, {
      question: 'Why should globalBest not start at zero for a non-empty subarray problem?',
      options: ['Zero cannot be stored in an int', 'An all-negative array may have a negative answer', 'The first value is always positive', 'It would make the loop O(n squared)'],
      correctAnswer: 'An all-negative array may have a negative answer',
      explanation: 'For [-8, -3], the correct answer is -3, not zero from an empty selection.'
    }, {
      question: 'What decision does each value trigger?',
      options: ['Sort or reverse the array', 'Start a new range or extend the previous best ending range', 'Add the value to every prior range', 'Choose the smallest value globally'],
      correctAnswer: 'Start a new range or extend the previous best ending range',
      explanation: 'Those are the only two contiguous subarrays that can end at the current value while preserving the optimal ending state.'
    }],
    practice: [{
      title: 'Practice: return the best range',
      prompt: 'Extend Kadane’s Algorithm so it returns the start and end indices of the best non-empty subarray, not only its sum. Dry-run your index updates on [-2, 1, -3, 4, -1, 2, 1, -5, 4] and on [-5, -2, -8].',
      expectedSkill: 'Maintaining a running DP state while preserving the actual range and handling all-negative input.'
    }],
    resources: [
      { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', type: 'practice', description: 'Exact problem for applying Kadane’s Algorithm and checking all-negative behavior.', source: 'LeetCode' },
      { title: 'Kadane’s Algorithm', url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray-kadanes-algorithm/', type: 'tutorial', description: 'Focused explanation of the running best-ending-here state.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t4_3-product': {
    topicId: 's1_d5_t4_3-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest product. Unlike maximum subarray sum, a negative value can turn a very small negative product into the largest positive product when multiplied by another negative value.',
    whyItMatters: 'This problem teaches why one running state is not enough when an operation can reverse ordering. Tracking both the maximum and minimum product ending at the current position preserves the two values that a future negative number may need.',
    prerequisites: [KADANES_ALGORITHM],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [2, 3, -2, 4], the best contiguous product is 6 from [2, 3]. For [-2, 3, -4], the answer is 24 because the full range contains two negatives.',
        example: 'Input: [2, 3, -2, 4]\nOutput: 6',
        takeaway: 'The best range must remain contiguous, but its sign can change as values are multiplied.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start index, multiply while extending the end, and keep the largest product. This is O(n^2) time and O(1) extra space. A frequency map or sorting cannot capture the order-sensitive product behavior.',
        takeaway: 'The repeated work is evaluating many ranges that share the same ending product prefixes.'
      },
      {
        title: 'Why maximum product differs from maximum sum',
        explanation: 'For sums, a negative running sum is always harmful to a future positive addition. For products, the smallest negative product may become the largest positive product after multiplying by a negative value. Therefore, a negative input swaps the roles of the current maximum and minimum.',
        example: 'currentMax = -2, currentMin = -6, value = -4\nnewMax may be (-6) * (-4) = 24',
        takeaway: 'Multiplication can reverse order, so preserve both extremes.'
      },
      {
        title: 'Maximum and minimum ending here',
        explanation: 'At each value, the new maximum and minimum can come from the value alone, the previous maximum times the value, or the previous minimum times the value. If the value is negative, swap the previous max and min before calculating so the formulas stay simple.',
        example: 'maxEnding = max(value, previousMax * value)\nminEnding = min(value, previousMin * value)',
        takeaway: 'The pair (maxEnding, minEnding) is the sufficient state for the next position.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [2, 3, -2, 4], the state begins (2,2), becomes (6,6), then after -2 becomes (-2,-12), and finally becomes (4,-48). The global maximum remains 6. For [-2, 3, -4], the states are (-2,-2), (3,-6), then (24,-12), exposing why the minimum must be retained.',
        example: 'Input: [-2, 3, -4]\nvalue -2 -> max -2, min -2\nvalue 3  -> max 3, min -6\nvalue -4 -> max 24, min -12',
        takeaway: 'The minimum state can become the final maximum after a later negative value.'
      },
      {
        title: 'Zero and all-negative inputs',
        explanation: 'Zero can restart a product because any range crossing zero has product zero. The max/min recurrence naturally considers the value itself, so a value after zero starts a new range. Initialize from the first value so arrays such as [-3, -2, -5] return -2 rather than zero.',
        takeaway: 'Do not initialize the answer to zero when the required subarray is non-empty.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm runs in O(n) time and O(1) auxiliary space. Use long instead of int when constraints allow products to exceed the int range. Tracking the actual range requires additional start/end bookkeeping.',
        takeaway: 'The optimized solution keeps two scalar states instead of every possible product range.'
      }
    ],
    examples: [{
      title: 'Negative values reverse the useful state',
      setup: 'Trace [-2, 3, -4].',
      walkthrough: [
        'At -2, both maximum and minimum ending products are -2.',
        'At 3, start fresh with 3 for the maximum, while extending -2 gives -6 for the minimum.',
        'At -4, the previous minimum -6 becomes valuable because (-6) * (-4) = 24.',
        'The global answer is therefore 24 from the entire array.'
      ],
      takeaway: 'Tracking only the previous maximum would miss the product that becomes optimal after the second negative.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'MaximumProductSubarray.java',
      title: 'Maximum product subarray with max/min state',
      code: ['public class MaximumProductSubarray {', '    static int maxProduct(int[] values) {', '        int currentMax = values[0];', '        int currentMin = values[0];', '        int answer = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            int value = values[index];', '            if (value < 0) {', '                int temporary = currentMax;', '                currentMax = currentMin;', '                currentMin = temporary;', '            }', '', '            currentMax = Math.max(value, currentMax * value);', '            currentMin = Math.min(value, currentMin * value);', '            answer = Math.max(answer, currentMax);', '        }', '', '        return answer;', '    }', '', '    public static void main(String[] args) {', '        System.out.println(maxProduct(new int[] {-2, 3, -4}));', '    }', '}'].join('\n'),
      explanation: 'The negative-value swap preserves the previous minimum as the candidate for the new maximum. Considering value alone also handles zeros and starts a new product range after an unhelpful prefix.',
      expectedOutput: '24'
    }],
    commonMistakes: ['Tracking only the maximum product and losing a useful negative minimum.', 'Initializing the answer to zero and failing on all-negative arrays.', 'Treating zero as an ordinary positive or negative value instead of allowing a restart.', 'Forgetting that negative times negative can produce the new maximum.'],
    interviewNotes: ['State the invariant: currentMax and currentMin are the extreme products ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain why the previous minimum is required when the current value is negative.', 'Follow-up: how would you return the actual subarray boundaries?', 'Common trap: copying Kadane’s one-state sum solution without adding the minimum product state.'],
    quickChecks: [{
      question: 'Why must the algorithm track a minimum product as well as a maximum?',
      options: ['The array must be sorted first', 'A negative value can turn the minimum negative product into the maximum positive product', 'Minimum values are always the answer', 'Products cannot be compared directly'],
      correctAnswer: 'A negative value can turn the minimum negative product into the maximum positive product',
      explanation: 'For [-2, 3, -4], the previous minimum -6 becomes 24 after multiplying by -4.'
    }, {
      question: 'What does considering value by itself in the recurrence handle?',
      options: ['Only duplicate values', 'Restarting after zero or an unhelpful prefix', 'Sorting the input', 'The second verification pass'],
      correctAnswer: 'Restarting after zero or an unhelpful prefix',
      explanation: 'The current value can begin a new contiguous range instead of extending the previous product.'
    }, {
      question: 'What is the safe initialization for a non-empty product problem?',
      options: ['currentMax = 0 and answer = 0', 'Initialize from the first array value', 'Initialize from the largest value after sorting', 'Initialize both states to 1'],
      correctAnswer: 'Initialize from the first array value',
      explanation: 'This preserves correct negative answers and avoids inventing an empty product of zero.'
    }],
    practice: [{
      title: 'Practice: return product range boundaries',
      prompt: 'Extend the max/min product algorithm to return the start and end indices of the maximum-product subarray. Test [2, 3, -2, 4], [-2, 3, -4], [0, -2], and [-3, -2, -5]. Explain how a negative-value swap affects the index state.',
      expectedSkill: 'Maintaining paired extrema while preserving the actual contiguous range through sign changes and zeros.'
    }],
    resources: [
      { title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', type: 'practice', description: 'Exact problem for testing negative products, zero restarts, and all-negative input.', source: 'LeetCode' },
      { title: 'Maximum Product Subarray', url: 'https://www.geeksforgeeks.org/maximum-product-subarray/', type: 'tutorial', description: 'Focused explanation of tracking maximum and minimum products ending at each position.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t5_3-sum-product': {
    topicId: 's1_d5_t5_3-sum-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest sum. Contiguous means the chosen elements occupy one uninterrupted range; skipping elements to form a subsequence is a different problem.',
    whyItMatters: 'Kadane’s Algorithm demonstrates a reusable running-state pattern: at each value, either extend the best subarray ending immediately before it or start a new subarray at the current value.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the best contiguous range is [4, -1, 2, 1] with sum 6. The range cannot skip -1 even though skipping it would form a different non-contiguous selection.',
        example: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nBest subarray: [4, -1, 2, 1]\nOutput: 6',
        takeaway: 'The answer is a contiguous interval, so every decision must preserve adjacency.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start and end pair and accumulate each range. With a running sum per start this takes O(n^2) time and O(1) extra space. Recomputing every range sum from scratch would be O(n^3).',
        example: 'for each start: extend end and update the range sum',
        takeaway: 'The repeated work is reconsidering the same prefix of a range after its sum has already become unhelpful.'
      },
      {
        title: 'Start fresh or extend',
        explanation: 'For a subarray ending at the current value, the only useful choices are to start at the current value or extend the best subarray that ended at the previous position. Any earlier prefix is already summarized by that previous best.',
        example: 'currentBest = max(value, currentBest + value);',
        takeaway: 'A negative accumulated prefix can be discarded when the current value is a better starting point.'
      },
      {
        title: 'Running state and invariant',
        explanation: 'currentBest is the largest sum of any non-empty subarray ending exactly at the current index. globalBest is the largest currentBest seen anywhere. Keeping these two values is sufficient because future ranges can only extend the immediately previous ending position.',
        example: 'currentBest = Math.max(value, currentBest + value);\nglobalBest = Math.max(globalBest, currentBest);',
        takeaway: 'The state remembers both the best ending here and the best answer seen overall.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the current/global pairs are (-2,-2), (1,1), (-2,1), (4,4), (3,4), (5,5), (6,6), (1,6), (5,6). The answer is 6.',
        example: 'value:        -2   1  -3   4  -1   2   1  -5   4\ncurrentBest: -2   1  -2   4   3   5   6   1   5\nglobalBest:  -2   1   1   4   4   5   6   6   6',
        takeaway: 'The global answer does not have to end at the final element.'
      },
      {
        title: 'All-negative arrays',
        explanation: 'Initialize both values from the first array element, not zero. For [-8, -3, -6], the correct answer is -3. Starting globalBest at zero would incorrectly claim that an empty subarray with sum zero is allowed.',
        example: 'int currentBest = values[0];\nint globalBest = values[0];',
        takeaway: 'Kadane’s version here requires a non-empty subarray, so zero is not a safe default.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm makes one pass and uses O(1) auxiliary space. Use int when the problem constraints fit int; otherwise use long for sums to avoid overflow. If the actual range is required, store the best start and end whenever globalBest improves.',
        takeaway: 'The optimized sum is O(n) time and O(1) auxiliary space, with initialization and numeric type chosen from the contract.'
      }
    ],
    examples: [{
      title: 'Current best versus global best',
      setup: 'Trace the sum state for [-2, 1, -3, 4, -1, 2, 1, -5, 4].',
      walkthrough: [
        'At -2, the only non-empty subarray ending here has sum -2, so both values are -2.',
        'At 1, starting fresh gives 1, which beats extending -2 to -1.',
        'At 4, the best ending here is 4 because the previous current best is negative.',
        'At -1, extend 4 to get 3; the global best remains 4.',
        'At 2 and then 1, extending produces 5 and 6, so the global best becomes 6.',
        'The later -5 reduces the ending sum to 1, but the earlier global answer 6 is preserved.'
      ],
      takeaway: 'Current state serves future extensions; global state preserves the best completed answer.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'KadanesAlgorithm.java',
      title: 'Maximum subarray sum with Kadane’s Algorithm',
      code: ['public class KadanesAlgorithm {', '    static int maxSubarraySum(int[] values) {', '        int currentBest = values[0];', '        int globalBest = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            currentBest = Math.max(values[index], currentBest + values[index]);', '            globalBest = Math.max(globalBest, currentBest);', '        }', '', '        return globalBest;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {-2, 1, -3, 4, -1, 2, 1, -5, 4};', '        System.out.println(maxSubarraySum(values));', '    }', '}'].join('\n'),
      explanation: 'currentBest stores the best non-empty subarray ending at the current index. globalBest stores the best ending sum seen at any index. Initializing from values[0] keeps all-negative arrays correct.',
      expectedOutput: '6'
    }],
    commonMistakes: ['Initializing the answer to 0 and accidentally allowing an empty subarray when the problem requires a non-empty one.', 'Confusing a contiguous subarray with a subsequence that may skip elements.', 'Tracking only the current sum and losing the best result found earlier.', 'Using int when the input constraints allow the running sum to overflow.'],
    interviewNotes: ['State the invariant: currentBest is the best non-empty sum ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain the fresh-start decision as discarding a negative prefix.', 'Follow-up: how would you return the actual start and end indices?', 'Common trap: initializing globalBest to zero for an all-negative input.'],
    quickChecks: [{
      question: 'What does currentBest represent in Kadane’s Algorithm?',
      options: ['The best sum anywhere in the full array', 'The best non-empty sum ending at the current index', 'The number of positive values seen', 'The sum of every value seen so far'],
      correctAnswer: 'The best non-empty sum ending at the current index',
      explanation: 'Keeping the best ending at the current position lets the next value decide whether to extend or restart.'
    }, {
      question: 'Why should globalBest not start at zero for a non-empty subarray problem?',
      options: ['Zero cannot be stored in an int', 'An all-negative array may have a negative answer', 'The first value is always positive', 'It would make the loop O(n squared)'],
      correctAnswer: 'An all-negative array may have a negative answer',
      explanation: 'For [-8, -3], the correct answer is -3, not zero from an empty selection.'
    }, {
      question: 'What decision does each value trigger?',
      options: ['Sort or reverse the array', 'Start a new range or extend the previous best ending range', 'Add the value to every prior range', 'Choose the smallest value globally'],
      correctAnswer: 'Start a new range or extend the previous best ending range',
      explanation: 'Those are the only two contiguous subarrays that can end at the current value while preserving the optimal ending state.'
    }],
    practice: [{
      title: 'Practice: return the best range',
      prompt: 'Extend Kadane’s Algorithm so it returns the start and end indices of the best non-empty subarray, not only its sum. Dry-run your index updates on [-2, 1, -3, 4, -1, 2, 1, -5, 4] and on [-5, -2, -8].',
      expectedSkill: 'Maintaining a running DP state while preserving the actual range and handling all-negative input.'
    }],
    resources: [
      { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', type: 'practice', description: 'Exact problem for applying Kadane’s Algorithm and checking all-negative behavior.', source: 'LeetCode' },
      { title: 'Kadane’s Algorithm', url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray-kadanes-algorithm/', type: 'tutorial', description: 'Focused explanation of the running best-ending-here state.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t6_3-product': {
    topicId: 's1_d5_t6_3-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest product. Unlike maximum subarray sum, a negative value can turn a very small negative product into the largest positive product when multiplied by another negative value.',
    whyItMatters: 'This problem teaches why one running state is not enough when an operation can reverse ordering. Tracking both the maximum and minimum product ending at the current position preserves the two values that a future negative number may need.',
    prerequisites: [KADANES_ALGORITHM],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [2, 3, -2, 4], the best contiguous product is 6 from [2, 3]. For [-2, 3, -4], the answer is 24 because the full range contains two negatives.',
        example: 'Input: [2, 3, -2, 4]\nOutput: 6',
        takeaway: 'The best range must remain contiguous, but its sign can change as values are multiplied.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start index, multiply while extending the end, and keep the largest product. This is O(n^2) time and O(1) extra space. A frequency map or sorting cannot capture the order-sensitive product behavior.',
        takeaway: 'The repeated work is evaluating many ranges that share the same ending product prefixes.'
      },
      {
        title: 'Why maximum product differs from maximum sum',
        explanation: 'For sums, a negative running sum is always harmful to a future positive addition. For products, the smallest negative product may become the largest positive product after multiplying by a negative value. Therefore, a negative input swaps the roles of the current maximum and minimum.',
        example: 'currentMax = -2, currentMin = -6, value = -4\nnewMax may be (-6) * (-4) = 24',
        takeaway: 'Multiplication can reverse order, so preserve both extremes.'
      },
      {
        title: 'Maximum and minimum ending here',
        explanation: 'At each value, the new maximum and minimum can come from the value alone, the previous maximum times the value, or the previous minimum times the value. If the value is negative, swap the previous max and min before calculating so the formulas stay simple.',
        example: 'maxEnding = max(value, previousMax * value)\nminEnding = min(value, previousMin * value)',
        takeaway: 'The pair (maxEnding, minEnding) is the sufficient state for the next position.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [2, 3, -2, 4], the state begins (2,2), becomes (6,6), then after -2 becomes (-2,-12), and finally becomes (4,-48). The global maximum remains 6. For [-2, 3, -4], the states are (-2,-2), (3,-6), then (24,-12), exposing why the minimum must be retained.',
        example: 'Input: [-2, 3, -4]\nvalue -2 -> max -2, min -2\nvalue 3  -> max 3, min -6\nvalue -4 -> max 24, min -12',
        takeaway: 'The minimum state can become the final maximum after a later negative value.'
      },
      {
        title: 'Zero and all-negative inputs',
        explanation: 'Zero can restart a product because any range crossing zero has product zero. The max/min recurrence naturally considers the value itself, so a value after zero starts a new range. Initialize from the first value so arrays such as [-3, -2, -5] return -2 rather than zero.',
        takeaway: 'Do not initialize the answer to zero when the required subarray is non-empty.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm runs in O(n) time and O(1) auxiliary space. Use long instead of int when constraints allow products to exceed the int range. Tracking the actual range requires additional start/end bookkeeping.',
        takeaway: 'The optimized solution keeps two scalar states instead of every possible product range.'
      }
    ],
    examples: [{
      title: 'Negative values reverse the useful state',
      setup: 'Trace [-2, 3, -4].',
      walkthrough: [
        'At -2, both maximum and minimum ending products are -2.',
        'At 3, start fresh with 3 for the maximum, while extending -2 gives -6 for the minimum.',
        'At -4, the previous minimum -6 becomes valuable because (-6) * (-4) = 24.',
        'The global answer is therefore 24 from the entire array.'
      ],
      takeaway: 'Tracking only the previous maximum would miss the product that becomes optimal after the second negative.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'MaximumProductSubarray.java',
      title: 'Maximum product subarray with max/min state',
      code: ['public class MaximumProductSubarray {', '    static int maxProduct(int[] values) {', '        int currentMax = values[0];', '        int currentMin = values[0];', '        int answer = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            int value = values[index];', '            if (value < 0) {', '                int temporary = currentMax;', '                currentMax = currentMin;', '                currentMin = temporary;', '            }', '', '            currentMax = Math.max(value, currentMax * value);', '            currentMin = Math.min(value, currentMin * value);', '            answer = Math.max(answer, currentMax);', '        }', '', '        return answer;', '    }', '', '    public static void main(String[] args) {', '        System.out.println(maxProduct(new int[] {-2, 3, -4}));', '    }', '}'].join('\n'),
      explanation: 'The negative-value swap preserves the previous minimum as the candidate for the new maximum. Considering value alone also handles zeros and starts a new product range after an unhelpful prefix.',
      expectedOutput: '24'
    }],
    commonMistakes: ['Tracking only the maximum product and losing a useful negative minimum.', 'Initializing the answer to zero and failing on all-negative arrays.', 'Treating zero as an ordinary positive or negative value instead of allowing a restart.', 'Forgetting that negative times negative can produce the new maximum.'],
    interviewNotes: ['State the invariant: currentMax and currentMin are the extreme products ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain why the previous minimum is required when the current value is negative.', 'Follow-up: how would you return the actual subarray boundaries?', 'Common trap: copying Kadane’s one-state sum solution without adding the minimum product state.'],
    quickChecks: [{
      question: 'Why must the algorithm track a minimum product as well as a maximum?',
      options: ['The array must be sorted first', 'A negative value can turn the minimum negative product into the maximum positive product', 'Minimum values are always the answer', 'Products cannot be compared directly'],
      correctAnswer: 'A negative value can turn the minimum negative product into the maximum positive product',
      explanation: 'For [-2, 3, -4], the previous minimum -6 becomes 24 after multiplying by -4.'
    }, {
      question: 'What does considering value by itself in the recurrence handle?',
      options: ['Only duplicate values', 'Restarting after zero or an unhelpful prefix', 'Sorting the input', 'The second verification pass'],
      correctAnswer: 'Restarting after zero or an unhelpful prefix',
      explanation: 'The current value can begin a new contiguous range instead of extending the previous product.'
    }, {
      question: 'What is the safe initialization for a non-empty product problem?',
      options: ['currentMax = 0 and answer = 0', 'Initialize from the first array value', 'Initialize from the largest value after sorting', 'Initialize both states to 1'],
      correctAnswer: 'Initialize from the first array value',
      explanation: 'This preserves correct negative answers and avoids inventing an empty product of zero.'
    }],
    practice: [{
      title: 'Practice: return product range boundaries',
      prompt: 'Extend the max/min product algorithm to return the start and end indices of the maximum-product subarray. Test [2, 3, -2, 4], [-2, 3, -4], [0, -2], and [-3, -2, -5]. Explain how a negative-value swap affects the index state.',
      expectedSkill: 'Maintaining paired extrema while preserving the actual contiguous range through sign changes and zeros.'
    }],
    resources: [
      { title: 'Maximum Product Subarray', url: 'https://leetcode.com/problems/maximum-product-subarray/', type: 'practice', description: 'Exact problem for testing negative products, zero restarts, and all-negative input.', source: 'LeetCode' },
      { title: 'Maximum Product Subarray', url: 'https://www.geeksforgeeks.org/maximum-product-subarray/', type: 'tutorial', description: 'Focused explanation of tracking maximum and minimum products ending at each position.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t7_3-sum-product': {
    topicId: 's1_d5_t7_3-sum-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest sum. Contiguous means the chosen elements occupy one uninterrupted range; skipping elements to form a subsequence is a different problem.',
    whyItMatters: 'Kadane’s Algorithm demonstrates a reusable running-state pattern: at each value, either extend the best subarray ending immediately before it or start a new subarray at the current value.',
    prerequisites: [JAVA_BASICS],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the best contiguous range is [4, -1, 2, 1] with sum 6. The range cannot skip -1 even though skipping it would form a different non-contiguous selection.',
        example: 'Input: [-2, 1, -3, 4, -1, 2, 1, -5, 4]\nBest subarray: [4, -1, 2, 1]\nOutput: 6',
        takeaway: 'The answer is a contiguous interval, so every decision must preserve adjacency.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start and end pair and accumulate each range. With a running sum per start this takes O(n^2) time and O(1) extra space. Recomputing every range sum from scratch would be O(n^3).',
        example: 'for each start: extend end and update the range sum',
        takeaway: 'The repeated work is reconsidering the same prefix of a range after its sum has already become unhelpful.'
      },
      {
        title: 'Start fresh or extend',
        explanation: 'For a subarray ending at the current value, the only useful choices are to start at the current value or extend the best subarray that ended at the previous position. Any earlier prefix is already summarized by that previous best.',
        example: 'currentBest = max(value, currentBest + value);',
        takeaway: 'A negative accumulated prefix can be discarded when the current value is a better starting point.'
      },
      {
        title: 'Running state and invariant',
        explanation: 'currentBest is the largest sum of any non-empty subarray ending exactly at the current index. globalBest is the largest currentBest seen anywhere. Keeping these two values is sufficient because future ranges can only extend the immediately previous ending position.',
        example: 'currentBest = Math.max(value, currentBest + value);\nglobalBest = Math.max(globalBest, currentBest);',
        takeaway: 'The state remembers both the best ending here and the best answer seen overall.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [-2, 1, -3, 4, -1, 2, 1, -5, 4], the current/global pairs are (-2,-2), (1,1), (-2,1), (4,4), (3,4), (5,5), (6,6), (1,6), (5,6). The answer is 6.',
        example: 'value:        -2   1  -3   4  -1   2   1  -5   4\ncurrentBest: -2   1  -2   4   3   5   6   1   5\nglobalBest:  -2   1   1   4   4   5   6   6   6',
        takeaway: 'The global answer does not have to end at the final element.'
      },
      {
        title: 'All-negative arrays',
        explanation: 'Initialize both values from the first array element, not zero. For [-8, -3, -6], the correct answer is -3. Starting globalBest at zero would incorrectly claim that an empty subarray with sum zero is allowed.',
        example: 'int currentBest = values[0];\nint globalBest = values[0];',
        takeaway: 'Kadane’s version here requires a non-empty subarray, so zero is not a safe default.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm makes one pass and uses O(1) auxiliary space. Use int when the problem constraints fit int; otherwise use long for sums to avoid overflow. If the actual range is required, store the best start and end whenever globalBest improves.',
        takeaway: 'The optimized sum is O(n) time and O(1) auxiliary space, with initialization and numeric type chosen from the contract.'
      }
    ],
    examples: [{
      title: 'Current best versus global best',
      setup: 'Trace the sum state for [-2, 1, -3, 4, -1, 2, 1, -5, 4].',
      walkthrough: [
        'At -2, the only non-empty subarray ending here has sum -2, so both values are -2.',
        'At 1, starting fresh gives 1, which beats extending -2 to -1.',
        'At 4, the best ending here is 4 because the previous current best is negative.',
        'At -1, extend 4 to get 3; the global best remains 4.',
        'At 2 and then 1, extending produces 5 and 6, so the global best becomes 6.',
        'The later -5 reduces the ending sum to 1, but the earlier global answer 6 is preserved.'
      ],
      takeaway: 'Current state serves future extensions; global state preserves the best completed answer.'
    }],
    codeExamples: [{
      language: 'java',
      executionMode: 'standalone',
      filename: 'KadanesAlgorithm.java',
      title: 'Maximum subarray sum with Kadane’s Algorithm',
      code: ['public class KadanesAlgorithm {', '    static int maxSubarraySum(int[] values) {', '        int currentBest = values[0];', '        int globalBest = values[0];', '', '        for (int index = 1; index < values.length; index++) {', '            currentBest = Math.max(values[index], currentBest + values[index]);', '            globalBest = Math.max(globalBest, currentBest);', '        }', '', '        return globalBest;', '    }', '', '    public static void main(String[] args) {', '        int[] values = {-2, 1, -3, 4, -1, 2, 1, -5, 4};', '        System.out.println(maxSubarraySum(values));', '    }', '}'].join('\n'),
      explanation: 'currentBest stores the best non-empty subarray ending at the current index. globalBest stores the best ending sum seen at any index. Initializing from values[0] keeps all-negative arrays correct.',
      expectedOutput: '6'
    }],
    commonMistakes: ['Initializing the answer to 0 and accidentally allowing an empty subarray when the problem requires a non-empty one.', 'Confusing a contiguous subarray with a subsequence that may skip elements.', 'Tracking only the current sum and losing the best result found earlier.', 'Using int when the input constraints allow the running sum to overflow.'],
    interviewNotes: ['State the invariant: currentBest is the best non-empty sum ending at the current index.', 'Expected complexity is O(n) time and O(1) auxiliary space.', 'Explain the fresh-start decision as discarding a negative prefix.', 'Follow-up: how would you return the actual start and end indices?', 'Common trap: initializing globalBest to zero for an all-negative input.'],
    quickChecks: [{
      question: 'What does currentBest represent in Kadane’s Algorithm?',
      options: ['The best sum anywhere in the full array', 'The best non-empty sum ending at the current index', 'The number of positive values seen', 'The sum of every value seen so far'],
      correctAnswer: 'The best non-empty sum ending at the current index',
      explanation: 'Keeping the best ending at the current position lets the next value decide whether to extend or restart.'
    }, {
      question: 'Why should globalBest not start at zero for a non-empty subarray problem?',
      options: ['Zero cannot be stored in an int', 'An all-negative array may have a negative answer', 'The first value is always positive', 'It would make the loop O(n squared)'],
      correctAnswer: 'An all-negative array may have a negative answer',
      explanation: 'For [-8, -3], the correct answer is -3, not zero from an empty selection.'
    }, {
      question: 'What decision does each value trigger?',
      options: ['Sort or reverse the array', 'Start a new range or extend the previous best ending range', 'Add the value to every prior range', 'Choose the smallest value globally'],
      correctAnswer: 'Start a new range or extend the previous best ending range',
      explanation: 'Those are the only two contiguous subarrays that can end at the current value while preserving the optimal ending state.'
    }],
    practice: [{
      title: 'Practice: return the best range',
      prompt: 'Extend Kadane’s Algorithm so it returns the start and end indices of the best non-empty subarray, not only its sum. Dry-run your index updates on [-2, 1, -3, 4, -1, 2, 1, -5, 4] and on [-5, -2, -8].',
      expectedSkill: 'Maintaining a running DP state while preserving the actual range and handling all-negative input.'
    }],
    resources: [
      { title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', type: 'practice', description: 'Exact problem for applying Kadane’s Algorithm and checking all-negative behavior.', source: 'LeetCode' },
      { title: 'Kadane’s Algorithm', url: 'https://www.geeksforgeeks.org/largest-sum-contiguous-subarray-kadanes-algorithm/', type: 'tutorial', description: 'Focused explanation of the running best-ending-here state.', source: 'GeeksforGeeks' }
    ]
  },
  's1_d5_t8_3-product': {
    topicId: 's1_d5_t8_3-product',
    contentVersion: 1,
    lastReviewedAt: '2026-10-01',
    estimatedMinutes: 40,
    overview: 'Find the contiguous subarray with the largest product. Unlike maximum subarray sum, a negative value can turn a very small negative product into the largest positive product when multiplied by another negative value.',
    whyItMatters: 'This problem teaches why one running state is not enough when an operation can reverse ordering. Tracking both the maximum and minimum product ending at the current position preserves the two values that a future negative number may need.',
    prerequisites: [KADANES_ALGORITHM],
    sections: [
      {
        title: 'Problem framing',
        explanation: 'For [2, 3, -2, 4], the best contiguous product is 6 from [2, 3]. For [-2, 3, -4], the answer is 24 because the full range contains two negatives.',
        example: 'Input: [2, 3, -2, 4]\nOutput: 6',
        takeaway: 'The best range must remain contiguous, but its sign can change as values are multiplied.'
      },
      {
        title: 'Brute force and its cost',
        explanation: 'Enumerate every start index, multiply while extending the end, and keep the largest product. This is O(n^2) time and O(1) extra space. A frequency map or sorting cannot capture the order-sensitive product behavior.',
        takeaway: 'The repeated work is evaluating many ranges that share the same ending product prefixes.'
      },
      {
        title: 'Why maximum product differs from maximum sum',
        explanation: 'For sums, a negative running sum is always harmful to a future positive addition. For products, the smallest negative product may become the largest positive product after multiplying by a negative value. Therefore, a negative input swaps the roles of the current maximum and minimum.',
        example: 'currentMax = -2, currentMin = -6, value = -4\nnewMax may be (-6) * (-4) = 24',
        takeaway: 'Multiplication can reverse order, so preserve both extremes.'
      },
      {
        title: 'Maximum and minimum ending here',
        explanation: 'At each value, the new maximum and minimum can come from the value alone, the previous maximum times the value, or the previous minimum times the value. If the value is negative, swap the previous max and min before calculating so the formulas stay simple.',
        example: 'maxEnding = max(value, previousMax * value)\nminEnding = min(value, previousMin * value)',
        takeaway: 'The pair (maxEnding, minEnding) is the sufficient state for the next position.'
      },
      {
        title: 'Worked walkthrough',
        explanation: 'For [2, 3, -2, 4], the state begins (2,2), becomes (6,6), then after -2 becomes (-2,-12), and finally becomes (4,-48). The global maximum remains 6. For [-2, 3, -4], the states are (-2,-2), (3,-6), then (24,-12), exposing why the minimum must be retained.',
        example: 'Input: [-2, 3, -4]\nvalue -2 -> max -2, min -2\nvalue 3  -> max 3, min -6\nvalue -4 -> max 24, min -12',
        takeaway: 'The minimum state can become the final maximum after a later negative value.'
      },
      {
        title: 'Zero and all-negative inputs',
        explanation: 'Zero can restart a product because any range crossing zero has product zero. The max/min recurrence naturally considers the value itself, so a value after zero starts a new range. Initialize from the first value so arrays such as [-3, -2, -5] return -2 rather than zero.',
        takeaway: 'Do not initialize the answer to zero when the required subarray is non-empty.'
      },
      {
        title: 'Complexity and Java details',
        explanation: 'The algorithm runs in O(n) time and O(1) auxiliary space. Use long