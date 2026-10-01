import { create } from 'zustand';
import { get, set, del } from 'idb-keyval';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  TopicStatus,
  TopicProgress,
  TopicNote,
  UserProfile,
  RevisionQueueItem,
  Subject,
  FriendProfile,
  TopicMetadata,
  TopicReadinessRecord,
  TopicReadinessState,
} from '../types/curriculum';
import { TopicEvidence, EvidenceStrength } from '../types/evidence';
import { BaselineAssessment } from '../types/assessment';
import { baselineAssessmentToEvidence } from '../domain/assessment/baselineToEvidence';
import { deriveTopicReadiness } from '../domain/readiness/deriveTopicReadiness';
import { calculateStreakState } from '../utils/streak';
import curriculumRaw from '../data/curriculum.json';
import { curriculumMetadata } from '../data/curriculumMetadata';

const STORAGE_KEYS = {
  PROGRESS: 'akxr_prep_progress_v1',
  NOTES: 'akxr_prep_notes_v1',
  PROFILE: 'akxr_prep_profile_v1',
  DAILY_TARGETS: 'akxr_prep_daily_v1',
  SYNC_QUEUE: 'akxr_sync_queue_v1',
  INTERVIEW_LOGS: 'akxr_interview_logs_v1',
  FRIENDS: 'akxr_prep_friends_v1',
  TOPIC_READINESS: 'akxr_prep_topic_readiness_v1',
  TOPIC_EVIDENCE: 'akxr_prep_topic_evidence_v1',
  BASELINE_ASSESSMENTS: 'akxr_prep_baseline_assessments_v1',
};

export type SyncState = 'synced' | 'syncing' | 'offline' | 'saved_locally';

interface InterviewAttempt {
  id: string;
  topicId: string;
  topicTitle: string;
  question: string;
  confidence: number; // 1-5
  notes?: string;
  timestamp: string;
}

interface AppState {
  // Auth & Profile
  user: any | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  syncState: SyncState;
  lastSavedMessage: string | null;

  // Progress & Notes
  progressMap: Record<string, TopicProgress>;
  notesMap: Record<string, TopicNote>;
  dailyTargetIds: string[];
  interviewAttempts: InterviewAttempt[];
  friends: FriendProfile[];
  topicMetadataMap: Record<string, TopicMetadata>;
  topicReadinessMap: Record<string, TopicReadinessRecord>;
  topicEvidenceMap: Record<string, TopicEvidence[]>;
  baselineAssessments: Record<string, BaselineAssessment>;

  // Active View Navigation
  currentView: 'dashboard' | 'daily' | 'sprints' | 'subjects' | 'revision' | 'interview' | 'analytics' | 'settings' | 'share';
  selectedSprintNumber: number;
  selectedDayNumber: number;
  selectedTopicId: string | null;
  selectedSubject: Subject | null;
  searchQuery: string;
  isCommandPaletteOpen: boolean;
  isQuickNotesOpen: boolean;

  // Actions
  initializeApp: () => Promise<void>;
  setCurrentView: (view: AppState['currentView']) => void;
  setSelectedTopicId: (id: string | null) => void;
  setSelectedSprintDay: (sprint: number, day: number) => void;
  setSelectedSubject: (subject: Subject | null) => void;
  setSearchQuery: (query: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickNotesOpen: (open: boolean) => void;

  // Progress Actions
  setTopicStatus: (topicId: string, status: TopicStatus) => Promise<void>;
  toggleReadinessPillar: (topicId: string, pillar: 'content' | 'practice' | 'recall' | 'interview') => Promise<void>;
  toggleTodayTarget: (topicId: string) => Promise<void>;
  saveTopicNote: (topicId: string, content: string) => Promise<void>;
  recordTopicEvidence: (evidence: TopicEvidence) => Promise<void>;
  saveBaselineAssessment: (assessment: BaselineAssessment) => Promise<void>;
  ingestBaselineAssessment: (assessment: BaselineAssessment) => Promise<void>;

  // Revision Actions
  handleRevisionAction: (topicId: string, action: 'done' | 'snooze' | 'needs_work') => Promise<void>;

  // Interview Mode
  recordInterviewAttempt: (topicId: string, topicTitle: string, question: string, confidence: number, notes?: string) => Promise<void>;
  addFriendFromInvite: (usernameOrSlug: string, displayName?: string) => Promise<void>;

  // Settings & Profile
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  exportBackupData: () => string;
  importBackupData: (jsonString: string) => Promise<boolean>;
  resetAllProgress: () => Promise<void>;

  // Auth actions
  loginGuest: () => void;
  logout: () => Promise<void>;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'guest-user',
  username: 'akshar-hacker',
  displayName: 'Akshar // Hacker',
  shareSlug: 'akshar-prep',
  sharingEnabled: true,
  dailyTarget: 4,
  terminalIntensity: 'medium',
  reducedMotion: false,
  streakCurrent: 1,
  streakLongest: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

const deriveLegacyReadinessState = (progress: TopicProgress | undefined): TopicReadinessState => {
  if (!progress) return 'not_started';

  if (progress.status === 'interview_ready' || progress.interviewDone) return 'interview_ready';
  if (progress.status === 'practiced' || progress.practiceDone) return 'practiced';
  if (progress.status === 'learning' || progress.contentDone || progress.recallDone) return 'learned';
  if (progress.status === 'needs_revision') return 'practiced';
  return 'not_started';
};

const migrateLegacyReadiness = (progressMap: Record<string, TopicProgress>): Record<string, TopicReadinessRecord> => {
  const entries = Object.entries(progressMap);

  return entries.reduce((acc, [topicId, progress]) => {
    const state = deriveLegacyReadinessState(progress);
    acc[topicId] = {
      topicId,
      state,
      confidence: state === 'not_started' ? 'low' : 'medium',
      source: 'legacy',
      inferredFromLegacy: true,
      updatedAt: progress.updatedAt || new Date().toISOString(),
    };
    return acc;
  }, {} as Record<string, TopicReadinessRecord>);
};

const isRecord = (value: unknown): value is Record<string, any> => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const normalizeEvidenceMap = (value: unknown): Record<string, TopicEvidence[]> => {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce((acc, [topicId, records]) => {
    if (!Array.isArray(records)) return acc;
    acc[topicId] = records.filter((record): record is TopicEvidence => (
      isRecord(record) &&
      typeof record.id === 'string' &&
      typeof record.topicId === 'string' &&
      typeof record.type === 'string' &&
      typeof record.strength === 'string' &&
      typeof record.createdAt === 'string'
    ));
    return acc;
  }, {} as Record<string, TopicEvidence[]>);
};

const normalizeAssessmentMap = (value: unknown): Record<string, BaselineAssessment> => {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce((acc, [assessmentId, assessment]) => {
    if (
      isRecord(assessment) &&
      typeof assessment.id === 'string' &&
      typeof assessment.name === 'string' &&
      typeof assessment.version === 'number' &&
      Array.isArray(assessment.topicIds) &&
      Array.isArray(assessment.responses) &&
      typeof assessment.status === 'string'
    ) {
      acc[assessmentId] = assessment as BaselineAssessment;
    }
    return acc;
  }, {} as Record<string, BaselineAssessment>);
};

const normalizeReadinessMap = (value: unknown): Record<string, TopicReadinessRecord> => {
  if (!isRecord(value)) return {};

  return Object.entries(value).reduce((acc, [topicId, record]) => {
    if (
      isRecord(record) &&
      typeof record.topicId === 'string' &&
      typeof record.state === 'string' &&
      typeof record.confidence === 'string' &&
      typeof record.source === 'string' &&
      typeof record.updatedAt === 'string'
    ) {
      acc[topicId] = record as TopicReadinessRecord;
    }
    return acc;
  }, {} as Record<string, TopicReadinessRecord>);
};

const sourceForEvidence = (evidence: TopicEvidence[]): TopicReadinessRecord['source'] => {
  const latest = [...evidence].sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0];
  if (!latest) return 'manual';
  if (latest.type === 'baseline_assessment') return 'assessment';
  if (latest.type === 'interview') return 'interview';
  if (latest.type === 'practice' || latest.type === 'problem_solving' || latest.type === 'demonstration') return 'practice';
  if (latest.type === 'revision') return 'revision';
  return 'manual';
};

const deriveReadinessRecords = (
  topicIds: string[],
  evidenceMap: Record<string, TopicEvidence[]>,
  metadataMap: Record<string, TopicMetadata>,
  currentReadiness: Record<string, TopicReadinessRecord>,
): Record<string, TopicReadinessRecord> => {
  const nextReadiness = { ...currentReadiness };
  const queue = [...new Set(topicIds)];
  const allEvidence = Object.values(evidenceMap).flat();

  while (queue.length > 0) {
    const topicId = queue.shift();
    if (!topicId) continue;

    const result = deriveTopicReadiness(
      topicId,
      allEvidence,
      metadataMap[topicId],
      {
        readinessByTopic: Object.fromEntries(
          Object.entries(nextReadiness).map(([id, record]) => [id, { state: record.state }]),
        ),
      },
    );
    const topicEvidence = evidenceMap[topicId] || [];

    nextReadiness[topicId] = {
      topicId: result.topicId,
      state: result.state,
      confidence: result.confidence,
      source: sourceForEvidence(topicEvidence),
      supportingEvidenceIds: result.supportingEvidenceIds,
      blockingPrerequisiteIds: result.blockingPrerequisiteIds,
      explanation: result.explanation,
      updatedAt: result.derivedAt,
      derivedAt: result.derivedAt,
    };

    for (const dependentId of metadataMap[topicId]?.dependents || []) {
      if ((evidenceMap[dependentId] || []).length > 0 && !queue.includes(dependentId)) queue.push(dependentId);
    }
  }

  return nextReadiness;
};

const buildActivityDates = (progressMap: Record<string, TopicProgress>) => {
  return Object.values(progressMap).flatMap((entry) => {
    const activitySource = entry.completedAt || entry.updatedAt || entry.lastReviewedAt;
    if (!activitySource) return [];

    const parsed = new Date(activitySource);
    if (Number.isNaN(parsed.getTime())) return [];

    return [`${parsed.getUTCFullYear()}-${String(parsed.getUTCMonth() + 1).padStart(2, '0')}-${String(parsed.getUTCDate()).padStart(2, '0')}`];
  });
};

const refreshProfileStreak = (profile: UserProfile, progressMap: Record<string, TopicProgress>) => {
  const activityDates = buildActivityDates(progressMap);
  const streak = calculateStreakState(activityDates, profile.lastActiveDate);

  return {
    ...profile,
    streakCurrent: streak.streakCurrent,
    streakLongest: Math.max(profile.streakLongest, streak.streakLongest),
    lastActiveDate: streak.lastActiveDate,
  };
};

export const useAppStore = create<AppState>((setStore, getStore) => ({
  user: null,
  profile: DEFAULT_PROFILE,
  isAuthenticated: false,
  isLoading: true,
  syncState: 'synced',
  lastSavedMessage: null,

  progressMap: {},
  notesMap: {},
  dailyTargetIds: [],
  interviewAttempts: [],
  friends: [],
  topicMetadataMap: curriculumMetadata,
  topicReadinessMap: {},
  topicEvidenceMap: {},
  baselineAssessments: {},

  currentView: 'dashboard',
  selectedSprintNumber: 1,
  selectedDayNumber: 1,
  selectedTopicId: null,
  selectedSubject: null,
  searchQuery: '',
  isCommandPaletteOpen: false,
  isQuickNotesOpen: false,

  initializeApp: async () => {
    try {
      setStore({ isLoading: true });

      // 1. Load from IndexedDB (instant offline-first)
      const cachedProgress = (await get(STORAGE_KEYS.PROGRESS)) || {};
      const cachedNotes = (await get(STORAGE_KEYS.NOTES)) || {};
      const cachedProfile = (await get(STORAGE_KEYS.PROFILE)) || DEFAULT_PROFILE;
      const cachedDaily = (await get(STORAGE_KEYS.DAILY_TARGETS)) || [];
      const cachedAttempts = (await get(STORAGE_KEYS.INTERVIEW_LOGS)) || [];
      const cachedFriends = (await get(STORAGE_KEYS.FRIENDS)) || [];
      const cachedReadinessValue = await get(STORAGE_KEYS.TOPIC_READINESS);
      const cachedReadiness = Object.keys(normalizeReadinessMap(cachedReadinessValue)).length > 0
        ? normalizeReadinessMap(cachedReadinessValue)
        : migrateLegacyReadiness(cachedProgress);
      const cachedEvidence = normalizeEvidenceMap(await get(STORAGE_KEYS.TOPIC_EVIDENCE));
      const cachedAssessments = normalizeAssessmentMap(await get(STORAGE_KEYS.BASELINE_ASSESSMENTS));

      const normalizedProfile = refreshProfileStreak(cachedProfile, cachedProgress);

      setStore({
        progressMap: cachedProgress,
        notesMap: cachedNotes,
        profile: normalizedProfile,
        dailyTargetIds: cachedDaily,
        interviewAttempts: cachedAttempts,
        friends: cachedFriends,
        topicMetadataMap: curriculumMetadata,
        topicReadinessMap: cachedReadiness,
        topicEvidenceMap: cachedEvidence,
        baselineAssessments: cachedAssessments,
        isLoading: false,
      });

      await set(STORAGE_KEYS.PROFILE, normalizedProfile);
      await set(STORAGE_KEYS.TOPIC_READINESS, cachedReadiness);
      await set(STORAGE_KEYS.TOPIC_EVIDENCE, cachedEvidence);
      await set(STORAGE_KEYS.BASELINE_ASSESSMENTS, cachedAssessments);

      // 2. Check Supabase connection & Auth session
      if (isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setStore({
            user: session.user,
            isAuthenticated: true,
            syncState: 'syncing',
          });

          // Fetch user data from Supabase
          try {
            const userId = session.user.id;
            const { data: remoteProgress } = await supabase
              .from('topic_progress')
              .select('*')
              .eq('user_id', userId);

            const { data: remoteNotes } = await supabase
              .from('topic_notes')
              .select('*')
              .eq('user_id', userId);

            const { data: remoteProfile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle();

            if (remoteProfile) {
              const updatedProfile: UserProfile = {
                ...cachedProfile,
                id: remoteProfile.id,
                username: remoteProfile.username || cachedProfile.username,
                displayName: remoteProfile.display_name || cachedProfile.displayName,
                shareSlug: remoteProfile.share_slug || remoteProfile.username || cachedProfile.shareSlug,
                sharingEnabled: remoteProfile.sharing_enabled ?? cachedProfile.sharingEnabled,
                dailyTarget: remoteProfile.daily_target ?? cachedProfile.dailyTarget,
              };
              setStore({ profile: updatedProfile });
              await set(STORAGE_KEYS.PROFILE, updatedProfile);
            }

            if (remoteProgress && remoteProgress.length > 0) {
              const mergedProgress: Record<string, TopicProgress> = { ...cachedProgress };
              remoteProgress.forEach((rp: any) => {
                mergedProgress[rp.topic_id] = {
                  topicId: rp.topic_id,
                  status: rp.status,
                  contentDone: rp.content_done,
                  practiceDone: rp.practice_done,
                  recallDone: rp.recall_done,
                  interviewDone: rp.interview_done,
                  readinessScore: (
                    (rp.content_done ? 25 : 0) +
                    (rp.practice_done ? 25 : 0) +
                    (rp.recall_done ? 25 : 0) +
                    (rp.interview_done ? 25 : 0)
                  ),
                  completedAt: rp.completed_at,
                  confidence: rp.confidence,
                  updatedAt: rp.updated_at || new Date().toISOString(),
                };
              });
              setStore({ progressMap: mergedProgress });
              await set(STORAGE_KEYS.PROGRESS, mergedProgress);
            }

            if (remoteNotes && remoteNotes.length > 0) {
              const mergedNotes: Record<string, TopicNote> = { ...cachedNotes };
              remoteNotes.forEach((rn: any) => {
                mergedNotes[rn.topic_id] = {
                  topicId: rn.topic_id,
                  content: rn.content,
                  updatedAt: rn.updated_at || new Date().toISOString(),
                };
              });
              setStore({ notesMap: mergedNotes });
              await set(STORAGE_KEYS.NOTES, mergedNotes);
            }

            setStore({ syncState: 'synced' });
          } catch (syncErr) {
            console.warn('[AKXR] Cloud sync error, falling back to local-first cache:', syncErr);
            setStore({ syncState: 'saved_locally' });
          }
        }
      } else {
        setStore({ syncState: 'saved_locally' });
      }
    } catch (err) {
      console.error('[AKXR] Initialization failed:', err);
      setStore({ isLoading: false, syncState: 'offline' });
    }
  },

  setCurrentView: (view) => setStore({ currentView: view }),
  setSelectedTopicId: (id) => setStore({ selectedTopicId: id }),
  setSelectedSprintDay: (sprint, day) => setStore({ selectedSprintNumber: sprint, selectedDayNumber: day }),
  setSelectedSubject: (subject) => setStore({ selectedSubject: subject }),
  setSearchQuery: (query) => setStore({ searchQuery: query }),
  setCommandPaletteOpen: (open) => setStore({ isCommandPaletteOpen: open }),
  setQuickNotesOpen: (open) => setStore({ isQuickNotesOpen: open }),

  setTopicStatus: async (topicId, status) => {
    const state = getStore();
    const current = state.progressMap[topicId] || {
      topicId,
      status: 'not_started',
      contentDone: false,
      practiceDone: false,
      recallDone: false,
      interviewDone: false,
      readinessScore: 0,
      updatedAt: new Date().toISOString(),
    };

    const isFinished = status === 'interview_ready' || status === 'practiced';
    const now = new Date().toISOString();
    
    // Spaced repetition schedule if marked interview_ready
    let nextRevisionAt = current.nextRevisionAt;
    let revisionIntervalDays = current.revisionIntervalDays || 2;
    if (status === 'interview_ready') {
      const revDate = new Date();
      revDate.setDate(revDate.getDate() + 2); // 2 days first review
      nextRevisionAt = revDate.toISOString();
      revisionIntervalDays = 2;
    }

    const updated: TopicProgress = {
      ...current,
      status,
      completedAt: isFinished ? (current.completedAt || now) : undefined,
      nextRevisionAt,
      revisionIntervalDays,
      updatedAt: now,
    };

    const newMap = { ...state.progressMap, [topicId]: updated };
    const refreshedProfile = refreshProfileStreak(state.profile, newMap);

    // Instant optimistic update
    setStore({
      progressMap: newMap,
      profile: refreshedProfile,
      lastSavedMessage: '✓ STATUS UPDATED',
      syncState: 'syncing',
    });

    // Save to IndexedDB
    await set(STORAGE_KEYS.PROGRESS, newMap);
    await set(STORAGE_KEYS.PROFILE, refreshedProfile);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2000);

    // Sync to Supabase in background
    if (isSupabaseConfigured() && state.user?.id) {
      try {
        await supabase.from('topic_progress').upsert({
          user_id: state.user.id,
          topic_id: topicId,
          status,
          content_done: updated.contentDone,
          practice_done: updated.practiceDone,
          recall_done: updated.recallDone,
          interview_done: updated.interviewDone,
          completed_at: updated.completedAt,
          updated_at: now,
        });
        setStore({ syncState: 'synced' });
      } catch (err) {
        console.warn('[AKXR] Supabase sync deferred:', err);
        setStore({ syncState: 'saved_locally' });
      }
    } else {
      setStore({ syncState: 'saved_locally' });
    }
  },

  toggleReadinessPillar: async (topicId, pillar) => {
    const state = getStore();
    const current = state.progressMap[topicId] || {
      topicId,
      status: 'not_started',
      contentDone: false,
      practiceDone: false,
      recallDone: false,
      interviewDone: false,
      readinessScore: 0,
      updatedAt: new Date().toISOString(),
    };

    const newContentDone = pillar === 'content' ? !current.contentDone : current.contentDone;
    const newPracticeDone = pillar === 'practice' ? !current.practiceDone : current.practiceDone;
    const newRecallDone = pillar === 'recall' ? !current.recallDone : current.recallDone;
    const newInterviewDone = pillar === 'interview' ? !current.interviewDone : current.interviewDone;

    const newScore = (
      (newContentDone ? 25 : 0) +
      (newPracticeDone ? 25 : 0) +
      (newRecallDone ? 25 : 0) +
      (newInterviewDone ? 25 : 0)
    );

    let newStatus = current.status;
    if (newScore === 100) {
      newStatus = 'interview_ready';
    } else if (newScore >= 50 && newStatus === 'not_started') {
      newStatus = 'learning';
    } else if (newScore >= 75 && (newStatus === 'learning' || newStatus === 'not_started')) {
      newStatus = 'practiced';
    }

    const now = new Date().toISOString();
    const updated: TopicProgress = {
      ...current,
      status: newStatus,
      contentDone: newContentDone,
      practiceDone: newPracticeDone,
      recallDone: newRecallDone,
      interviewDone: newInterviewDone,
      readinessScore: newScore,
      completedAt: newScore === 100 ? (current.completedAt || now) : current.completedAt,
      updatedAt: now,
    };

    const newMap = { ...state.progressMap, [topicId]: updated };
    const refreshedProfile = refreshProfileStreak(state.profile, newMap);

    // Instant optimistic update
    setStore({
      progressMap: newMap,
      profile: refreshedProfile,
      lastSavedMessage: `✓ READINESS: ${newScore}%`,
      syncState: 'syncing',
    });

    await set(STORAGE_KEYS.PROGRESS, newMap);
    await set(STORAGE_KEYS.PROFILE, refreshedProfile);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2000);

    // Sync to Supabase in background
    if (isSupabaseConfigured() && state.user?.id) {
      try {
        await supabase.from('topic_progress').upsert({
          user_id: state.user.id,
          topic_id: topicId,
          status: newStatus,
          content_done: newContentDone,
          practice_done: newPracticeDone,
          recall_done: newRecallDone,
          interview_done: newInterviewDone,
          completed_at: updated.completedAt,
          updated_at: now,
        });
        setStore({ syncState: 'synced' });
      } catch (err) {
        setStore({ syncState: 'saved_locally' });
      }
    } else {
      setStore({ syncState: 'saved_locally' });
    }
  },

  toggleTodayTarget: async (topicId) => {
    const state = getStore();
    const exists = state.dailyTargetIds.includes(topicId);
    const updated = exists 
      ? state.dailyTargetIds.filter(id => id !== topicId)
      : [...state.dailyTargetIds, topicId];

    setStore({
      dailyTargetIds: updated,
      lastSavedMessage: exists ? 'Removed from Today' : 'Added to Today Targets',
    });

    await set(STORAGE_KEYS.DAILY_TARGETS, updated);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2000);
  },

  saveTopicNote: async (topicId, content) => {
    const state = getStore();
    const now = new Date().toISOString();
    const updatedNote: TopicNote = {
      topicId,
      content,
      updatedAt: now,
    };

    const newMap = { ...state.notesMap, [topicId]: updatedNote };

    setStore({
      notesMap: newMap,
      lastSavedMessage: '✓ NOTES SAVED SECURELY',
      syncState: 'syncing',
    });

    await set(STORAGE_KEYS.NOTES, newMap);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2000);

    if (isSupabaseConfigured() && state.user?.id) {
      try {
        await supabase.from('topic_notes').upsert({
          user_id: state.user.id,
          topic_id: topicId,
          content,
          updated_at: now,
        });
        setStore({ syncState: 'synced' });
      } catch (err) {
        setStore({ syncState: 'saved_locally' });
      }
    } else {
      setStore({ syncState: 'saved_locally' });
    }
  },

  recordTopicEvidence: async (evidence) => {
    const state = getStore();
    const currentRecords = state.topicEvidenceMap[evidence.topicId] || [];
    if (currentRecords.some((record) => record.id === evidence.id)) return;

    const updatedEvidenceMap = {
      ...state.topicEvidenceMap,
      [evidence.topicId]: [...currentRecords, evidence],
    };
    const updatedReadinessMap = deriveReadinessRecords(
      [evidence.topicId],
      updatedEvidenceMap,
      state.topicMetadataMap,
      state.topicReadinessMap,
    );

    setStore({
      topicEvidenceMap: updatedEvidenceMap,
      topicReadinessMap: updatedReadinessMap,
    });

    await set(STORAGE_KEYS.TOPIC_EVIDENCE, updatedEvidenceMap);
    await set(STORAGE_KEYS.TOPIC_READINESS, updatedReadinessMap);
  },

  saveBaselineAssessment: async (assessment) => {
    const state = getStore();
    const updatedAssessments = {
      ...state.baselineAssessments,
      [assessment.id]: assessment,
    };

    setStore({ baselineAssessments: updatedAssessments });
    await set(STORAGE_KEYS.BASELINE_ASSESSMENTS, updatedAssessments);
  },

  ingestBaselineAssessment: async (assessment) => {
    await getStore().saveBaselineAssessment(assessment);

    const evidenceRecords = baselineAssessmentToEvidence(assessment);
    for (const evidence of evidenceRecords) {
      await getStore().recordTopicEvidence(evidence);
    }
  },

  handleRevisionAction: async (topicId, action) => {
    const state = getStore();
    const current = state.progressMap[topicId];
    if (!current) return;

    let nextDays = 2;
    let nextStatus = current.status;
    const now = new Date();

    if (action === 'done') {
      // Advance spaced repetition: 2d -> 7d -> 21d -> 60d
      const currentInterval = current.revisionIntervalDays || 2;
      if (currentInterval <= 2) nextDays = 7;
      else if (currentInterval <= 7) nextDays = 21;
      else nextDays = 60;
      nextStatus = 'interview_ready';
    } else if (action === 'snooze') {
      nextDays = 1; // remind tomorrow
    } else if (action === 'needs_work') {
      nextDays = 1;
      nextStatus = 'needs_revision';
    }

    const nextDate = new Date();
    nextDate.setDate(now.getDate() + nextDays);

    const updated: TopicProgress = {
      ...current,
      status: nextStatus,
      revisionIntervalDays: nextDays,
      revisionCount: (current.revisionCount || 0) + (action === 'done' ? 1 : 0),
      nextRevisionAt: nextDate.toISOString(),
      lastReviewedAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    const newMap = { ...state.progressMap, [topicId]: updated };
    const refreshedProfile = refreshProfileStreak(state.profile, newMap);
    setStore({
      progressMap: newMap,
      profile: refreshedProfile,
      lastSavedMessage: action === 'done' ? `✓ REVISED! Next in ${nextDays}d` : `Revision scheduled in ${nextDays}d`,
    });

    await set(STORAGE_KEYS.PROGRESS, newMap);
    await set(STORAGE_KEYS.PROFILE, refreshedProfile);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2500);
  },

  recordInterviewAttempt: async (topicId, topicTitle, question, confidence, notes) => {
    const state = getStore();
    const attempt: InterviewAttempt = {
      id: `attempt_${Date.now()}`,
      topicId,
      topicTitle,
      question,
      confidence,
      notes,
      timestamp: new Date().toISOString(),
    };

    const updatedAttempts = [attempt, ...state.interviewAttempts];
    const refreshedProfile = refreshProfileStreak(state.profile, {
      ...state.progressMap,
      [topicId]: {
        ...(state.progressMap[topicId] || {
          topicId,
          status: 'not_started',
          contentDone: false,
          practiceDone: false,
          recallDone: false,
          interviewDone: false,
          readinessScore: 0,
          updatedAt: new Date().toISOString(),
        }),
        updatedAt: new Date().toISOString(),
      },
    });

    setStore({
      interviewAttempts: updatedAttempts,
      profile: refreshedProfile,
      lastSavedMessage: `✓ MOCK ATTEMPT RECORDED: Confidence ${confidence}/5`,
    });

    await set(STORAGE_KEYS.INTERVIEW_LOGS, updatedAttempts);
    await set(STORAGE_KEYS.PROFILE, refreshedProfile);

    await getStore().recordTopicEvidence({
      id: `interview_${attempt.id}`,
      topicId,
      type: 'interview',
      strength: (confidence >= 4 ? 'high' : confidence >= 3 ? 'medium' : 'low') as EvidenceStrength,
      sourceId: attempt.id,
      result: { score: confidence, maxScore: 5 },
      metadata: { question, notes },
      createdAt: attempt.timestamp,
    });

    // If confidence is high, update readiness
    if (confidence >= 4) {
      await getStore().toggleReadinessPillar(topicId, 'interview');
    }

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2500);
  },

  addFriendFromInvite: async (usernameOrSlug, displayName) => {
    const state = getStore();
    const cleaned = (usernameOrSlug || '').trim();
    if (!cleaned) return;

    const normalized = cleaned.toLowerCase();
    const alreadyExists = state.friends.some(
      (friend) => friend.username.toLowerCase() === normalized || friend.shareSlug.toLowerCase() === normalized
    );
    if (alreadyExists) return;

    const friend: FriendProfile = {
      id: `friend_${Date.now()}`,
      username: cleaned,
      displayName: displayName || cleaned,
      shareSlug: cleaned,
      status: 'accepted',
      streakCurrent: 0,
      streakLongest: 0,
      progressPercent: 0,
      addedAt: new Date().toISOString(),
    };

    const updatedFriends = [friend, ...state.friends];
    const refreshedProfile = refreshProfileStreak(state.profile, state.progressMap);
    setStore({
      friends: updatedFriends,
      profile: refreshedProfile,
      lastSavedMessage: '✓ FRIEND LINK ACCEPTED',
    });

    await set(STORAGE_KEYS.FRIENDS, updatedFriends);
    await set(STORAGE_KEYS.PROFILE, refreshedProfile);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2200);
  },

  updateProfile: async (updates) => {
    const state = getStore();
    const updated = { ...state.profile, ...updates };
    setStore({
      profile: updated,
      lastSavedMessage: '✓ SETTINGS SAVED',
    });

    await set(STORAGE_KEYS.PROFILE, updated);

    setTimeout(() => {
      setStore({ lastSavedMessage: null });
    }, 2000);

    if (isSupabaseConfigured() && state.user?.id) {
      try {
        await supabase.from('profiles').upsert({
          id: state.user.id,
          username: updated.username,
          display_name: updated.displayName,
          share_slug: updated.shareSlug,
          sharing_enabled: updated.sharingEnabled,
          daily_target: updated.dailyTarget,
          terminal_intensity: updated.terminalIntensity,
          reduced_motion: updated.reducedMotion,
        });
      } catch (e) {
        console.warn('Profile sync failed', e);
      }
    }
  },

  exportBackupData: () => {
    const state = getStore();
    const backup = {
      version: '1.2',
      exportedAt: new Date().toISOString(),
      profile: state.profile,
      progressMap: state.progressMap,
      notesMap: state.notesMap,
      dailyTargetIds: state.dailyTargetIds,
      interviewAttempts: state.interviewAttempts,
      topicMetadataMap: state.topicMetadataMap,
      topicReadinessMap: state.topicReadinessMap,
      topicEvidenceMap: state.topicEvidenceMap,
      baselineAssessments: state.baselineAssessments,
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupData: async (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!isRecord(data) || !isRecord(data.progressMap)) throw new Error('Invalid backup schema');

      const importedProgress = data.progressMap as Record<string, TopicProgress>;
      const importedReadiness = normalizeReadinessMap(data.topicReadinessMap);
      const migratedReadiness = Object.keys(importedReadiness).length > 0
        ? importedReadiness
        : migrateLegacyReadiness(importedProgress);
      const importedEvidence = normalizeEvidenceMap(data.topicEvidenceMap);
      const importedAssessments = normalizeAssessmentMap(data.baselineAssessments);

      setStore({
        progressMap: importedProgress,
        notesMap: isRecord(data.notesMap) ? data.notesMap as Record<string, TopicNote> : {},
        dailyTargetIds: Array.isArray(data.dailyTargetIds) ? data.dailyTargetIds : [],
        interviewAttempts: Array.isArray(data.interviewAttempts) ? data.interviewAttempts : [],
        topicMetadataMap: data.topicMetadataMap || curriculumMetadata,
        topicReadinessMap: migratedReadiness,
        topicEvidenceMap: importedEvidence,
        baselineAssessments: importedAssessments,
        profile: { ...getStore().profile, ...(data.profile || {}) },
        lastSavedMessage: '✓ DATA IMPORTED SUCCESSFULLY',
      });

      await set(STORAGE_KEYS.PROGRESS, importedProgress);
      await set(STORAGE_KEYS.NOTES, isRecord(data.notesMap) ? data.notesMap : {});
      await set(STORAGE_KEYS.DAILY_TARGETS, Array.isArray(data.dailyTargetIds) ? data.dailyTargetIds : []);
      await set(STORAGE_KEYS.INTERVIEW_LOGS, Array.isArray(data.interviewAttempts) ? data.interviewAttempts : []);
      await set(STORAGE_KEYS.TOPIC_READINESS, migratedReadiness);
      await set(STORAGE_KEYS.TOPIC_EVIDENCE, importedEvidence);
      await set(STORAGE_KEYS.BASELINE_ASSESSMENTS, importedAssessments);

      return true;
    } catch (err) {
      console.error('Import failed:', err);
      return false;
    }
  },

  resetAllProgress: async () => {
    setStore({
      progressMap: {},
      notesMap: {},
      dailyTargetIds: [],
      interviewAttempts: [],
      topicReadinessMap: {},
      topicEvidenceMap: {},
      baselineAssessments: {},
      lastSavedMessage: '✓ PROGRESS RESET CONFIRMED',
    });

    await set(STORAGE_KEYS.PROGRESS, {});
    await set(STORAGE_KEYS.NOTES, {});
    await set(STORAGE_KEYS.DAILY_TARGETS, []);
    await set(STORAGE_KEYS.INTERVIEW_LOGS, []);
    await set(STORAGE_KEYS.TOPIC_READINESS, {});
    await set(STORAGE_KEYS.TOPIC_EVIDENCE, {});
    await set(STORAGE_KEYS.BASELINE_ASSESSMENTS, {});
  },

  loginGuest: () => {
    setStore({
      user: { id: 'guest-user', email: 'student@cs.prep' },
      isAuthenticated: true,
      lastSavedMessage: 'ONLINE // SESSION ACTIVE',
    });
  },

  logout: async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setStore({
      user: null,
      isAuthenticated: false,
      lastSavedMessage: 'DISCONNECTED // SESSION ENDED',
    });
  },
}));
