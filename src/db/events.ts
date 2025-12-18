import { getUserDb } from "./index";

export interface Event {
  id: number;
  timestamp: string;
  event_type: string;
  payload: Record<string, unknown>;
  version: number;
}

export interface EventRow {
  id: number;
  timestamp: string;
  event_type: string;
  payload: string;
  version: number;
}

export function logEvent(
  userId: string,
  eventType: string,
  payload: Record<string, unknown>
): number {
  const db = getUserDb(userId);
  const result = db.run(
    "INSERT INTO events (event_type, payload) VALUES (?, ?)",
    [eventType, JSON.stringify(payload)]
  );
  return Number(result.lastInsertRowid);
}

export function getEvents(
  userId: string,
  options: {
    since?: string;
    eventType?: string;
    limit?: number;
  } = {}
): Event[] {
  const db = getUserDb(userId);
  
  let query = "SELECT * FROM events WHERE 1=1";
  const params: (string | number)[] = [];

  if (options.since) {
    query += " AND timestamp > ?";
    params.push(options.since);
  }

  if (options.eventType) {
    query += " AND event_type = ?";
    params.push(options.eventType);
  }

  query += " ORDER BY timestamp ASC";

  if (options.limit) {
    query += " LIMIT ?";
    params.push(options.limit);
  }

  const rows = db.query(query).all(...params) as EventRow[];
  
  return rows.map((row) => ({
    ...row,
    payload: JSON.parse(row.payload),
  }));
}

export function getLatestEvent(
  userId: string,
  eventType: string
): Event | null {
  const db = getUserDb(userId);
  const row = db.query(
    "SELECT * FROM events WHERE event_type = ? ORDER BY timestamp DESC LIMIT 1"
  ).get(eventType) as EventRow | null;

  if (!row) return null;

  return {
    ...row,
    payload: JSON.parse(row.payload),
  };
}

export function countEvents(
  userId: string,
  eventType?: string
): number {
  const db = getUserDb(userId);
  
  if (eventType) {
    const row = db.query(
      "SELECT COUNT(*) as count FROM events WHERE event_type = ?"
    ).get(eventType) as { count: number };
    return row.count;
  }

  const row = db.query("SELECT COUNT(*) as count FROM events").get() as { count: number };
  return row.count;
}

// Common event types
export const EventTypes = {
  SESSION_START: "session_start",
  EXERCISE_START: "exercise_start",
  EXERCISE_ATTEMPT: "exercise_attempt",
  EXERCISE_COMPLETE: "exercise_complete",
  PROGRESS_UNLOCK: "progress_unlock",
} as const;

// Helper functions for common events
export function logSessionStart(
  userId: string,
  data: { userAgent?: string; referrer?: string }
): number {
  return logEvent(userId, EventTypes.SESSION_START, data);
}

export function logExerciseStart(
  userId: string,
  data: { exerciseId: string; params: Record<string, unknown> }
): number {
  return logEvent(userId, EventTypes.EXERCISE_START, data);
}

export function logExerciseAttempt(
  userId: string,
  data: { exerciseId: string; answer: unknown; correct: boolean; timeMs?: number }
): number {
  return logEvent(userId, EventTypes.EXERCISE_ATTEMPT, data);
}

export function logExerciseComplete(
  userId: string,
  data: { exerciseId: string; score: number; totalAttempts: number; timeMs: number }
): number {
  return logEvent(userId, EventTypes.EXERCISE_COMPLETE, data);
}
