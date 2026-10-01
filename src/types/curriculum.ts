export type Subject = 
  | 'DSA'
  | 'Java / OOP'
  | 'DBMS'
  | 'SQL'
  | 'Operating Systems'
  | 'Computer Networks'
  | 'LLD'
  | 'System Design'
  | 'Concurrency'
  | 'Security'
  | 'Web / APIs'
  | 'Other';

export type TopicStatus = 
  | 'not_started'
  | 'learning'
  | 'practiced'
  | 'interview_ready'
  | 'needs_revision';

export type TopicStage = 'foundation' | 'core' | 'intermediate' | 'advanced' | 'depth' | 'optional';
export type TopicReadinessState = 'not_started' | 'exposed' | 'learned' | 'practiced' | 'demonstrated' | 'interview_ready';

export interface TopicItem {
  id: string;
  sprintNumber: number;
  dayNumber: number;
  sprintId: string;
  dayId: string;
  orderIndex: number;
  title: string;
  duration: string;
  subject: Subject;
  tags: string[];
}

export interface DayItem {
  id: string;
  sprintNumber: number;
  dayNumber: number;
  title: string;
  duration: string;
  totalTopics: number;
  topics: TopicItem[];
}

export interface SprintItem {
  id: string;
  sprintNumber: number;
  title: string;
  duration: string;
  totalTopics: number;
  days: DayItem[];
}

export interface CurriculumData {
  sprints: SprintItem[];
  totalTopics: number;
  totalSprints: number;
  subjectBreakdown: Record<string, number>;
}

export interface ResourceLink {
  title: string;
  url: string;
  type: 'LEARN' | 'PRACTICE' | 'REFERENCE';
  sourceName: string;
}

export interface InterviewQuestion {
  id: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'INTERVIEW' | 'DEEP';
  question: string;
  answerHint?: string;
}

export interface StructuredLearningContent {
  topicId: string;
  topicTitle: string;
  whatIsIt: string;
  whyItMatters: string;
  coreIdeas: string[];
  whatShouldIKnow: string;
  commonQuestions: InterviewQuestion[];
  commonMistakes: string[];
  exampleIntuition: string;
  practiceProblem: {
    title: string;
    platform: string;
    url: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  };
  resources: ResourceLink[];
}

export interface TopicProgress {
  topicId: string;
  status: TopicStatus;
  contentDone: boolean;
  practiceDone: boolean;
  recallDone: boolean;
  interviewDone: boolean;
  readinessScore: number; // 0, 25, 50, 75, 100
  completedAt?: string;
  isTodayTarget?: boolean;
  nextRevisionAt?: string;
  revisionIntervalDays?: number; // 2, 7, 21, etc.
  revisionCount?: number;
  lastReviewedAt?: string;
  confidence?: number; // 1-5
  updatedAt: string;
}

export interface TopicNote {
  topicId: string;
  content: string;
  updatedAt: string;
}

export interface RevisionQueueItem {
  topicId: string;
  title: string;
  subject: Subject;
  sprintNumber: number;
  dayNumber: number;
  scheduledFor: string;
  intervalDays: number;
  repetition: number;
  overdueDays: number;
  isToday: boolean;
}

export interface TopicMetadata {
  topicId: string;
  title: string;
  subject: Subject;
  sprintNumber: number;
  dayNumber: number;
  duration: string;
  /** Curriculum-level relationships used by roadmap and readiness metadata. */
  prerequisites: string[];
  dependents: string[];
  stage: TopicStage;
  internshipRelevance: number;
  interviewRelevance: number;
  oaRelevance: number;
  technicalInterviewRelevance: number;
  generalInterviewRelevance: number;
  potentialRedundancy?: string;
  potentialSequencingIssue?: string;
  confidence: number;
  reason: string;
}

export interface TopicReadinessRecord {
  topicId: string;
  state: TopicReadinessState;
  confidence: 'low' | 'medium' | 'high';
  source: 'legacy' | 'manual' | 'assessment' | 'practice' | 'revision' | 'interview';
  inferredFromLegacy?: boolean;
  supportingEvidenceIds?: string[];
  blockingPrerequisiteIds?: string[];
  explanation?: string[];
  updatedAt: string;
  derivedAt?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  shareSlug: string;
  sharingEnabled: boolean;
  dailyTarget: number;
  terminalIntensity: 'low' | 'medium' | 'high';
  reducedMotion: boolean;
  streakCurrent: number;
  streakLongest: number;
  lastActiveDate: string;
}

export interface FriendProfile {
  id: string;
  username: string;
  displayName: string;
  shareSlug: string;
  status: 'accepted' | 'pending';
  streakCurrent: number;
  streakLongest: number;
  progressPercent: number;
  addedAt: string;
}

export interface StudySession {
  id: string;
  date: string;
  topicsCompleted: number;
  durationMinutes: number;
}
