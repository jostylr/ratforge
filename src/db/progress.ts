import { getUserDb } from "./index";
import { getEvents, EventTypes } from "./events";

export interface ExerciseProgress {
  exerciseId: string;
  attempts: number;
  correct: number;
  accuracy: number;
  lastAttempt: string | null;
  completed: boolean;
  bestTime: number | null;
}

export interface UserProgress {
  totalExercises: number;
  completedExercises: number;
  totalAttempts: number;
  totalCorrect: number;
  overallAccuracy: number;
  exercises: Record<string, ExerciseProgress>;
  lastActivity: string | null;
}

export function getUserProgress(userId: string): UserProgress {
  const db = getUserDb(userId);

  // Get exercise attempt stats
  const attemptStats = db.query(`
    SELECT 
      json_extract(payload, '$.exerciseId') as exercise_id,
      COUNT(*) as attempts,
      SUM(CASE WHEN json_extract(payload, '$.correct') = 1 THEN 1 ELSE 0 END) as correct,
      MAX(timestamp) as last_attempt
    FROM events
    WHERE event_type = ?
    GROUP BY json_extract(payload, '$.exerciseId')
  `).all(EventTypes.EXERCISE_ATTEMPT) as Array<{
    exercise_id: string;
    attempts: number;
    correct: number;
    last_attempt: string;
  }>;

  // Get completed exercises with best times
  const completedStats = db.query(`
    SELECT 
      json_extract(payload, '$.exerciseId') as exercise_id,
      MIN(json_extract(payload, '$.timeMs')) as best_time
    FROM events
    WHERE event_type = ?
    GROUP BY json_extract(payload, '$.exerciseId')
  `).all(EventTypes.EXERCISE_COMPLETE) as Array<{
    exercise_id: string;
    best_time: number;
  }>;

  const completedSet = new Set(completedStats.map(s => s.exercise_id));
  const bestTimes = new Map(completedStats.map(s => [s.exercise_id, s.best_time]));

  // Build exercises map
  const exercises: Record<string, ExerciseProgress> = {};
  let totalAttempts = 0;
  let totalCorrect = 0;

  for (const stat of attemptStats) {
    const accuracy = stat.attempts > 0 ? stat.correct / stat.attempts : 0;
    exercises[stat.exercise_id] = {
      exerciseId: stat.exercise_id,
      attempts: stat.attempts,
      correct: stat.correct,
      accuracy,
      lastAttempt: stat.last_attempt,
      completed: completedSet.has(stat.exercise_id),
      bestTime: bestTimes.get(stat.exercise_id) ?? null,
    };
    totalAttempts += stat.attempts;
    totalCorrect += stat.correct;
  }

  // Get last activity
  const lastEvent = db.query(
    "SELECT timestamp FROM events ORDER BY timestamp DESC LIMIT 1"
  ).get() as { timestamp: string } | null;

  return {
    totalExercises: attemptStats.length,
    completedExercises: completedSet.size,
    totalAttempts,
    totalCorrect,
    overallAccuracy: totalAttempts > 0 ? totalCorrect / totalAttempts : 0,
    exercises,
    lastActivity: lastEvent?.timestamp ?? null,
  };
}

export function getExerciseProgress(
  userId: string,
  exerciseId: string
): ExerciseProgress | null {
  const progress = getUserProgress(userId);
  return progress.exercises[exerciseId] ?? null;
}

export function getRecentActivity(
  userId: string,
  limit = 10
): Array<{ type: string; timestamp: string; summary: string }> {
  const events = getEvents(userId, { limit });
  
  return events.map(event => {
    let summary = "";
    switch (event.event_type) {
      case EventTypes.SESSION_START:
        summary = "Started a new session";
        break;
      case EventTypes.EXERCISE_START:
        summary = `Started exercise: ${event.payload.exerciseId}`;
        break;
      case EventTypes.EXERCISE_ATTEMPT:
        summary = event.payload.correct 
          ? `Correct answer on ${event.payload.exerciseId}` 
          : `Attempted ${event.payload.exerciseId}`;
        break;
      case EventTypes.EXERCISE_COMPLETE:
        summary = `Completed ${event.payload.exerciseId}`;
        break;
      default:
        summary = event.event_type;
    }
    return {
      type: event.event_type,
      timestamp: event.timestamp,
      summary,
    };
  });
}
