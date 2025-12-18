import { describe, test, expect, afterAll } from "bun:test";
import { createUser, getUserIdByToken } from "./tokens";
import { getEvents, logSessionStart, logExerciseAttempt } from "./events";
import { getUserProgress } from "./progress";
import { closeUserDb } from "./index";
import { closeTokensDb } from "./tokens";

describe("Database", () => {
  let token: string;
  let userId: string;

  afterAll(() => {
    if (userId) closeUserDb(userId);
    closeTokensDb();
  });

  test("creates user with token", () => {
    const result = createUser();
    token = result.token;
    userId = result.userId;
    
    expect(token).toHaveLength(32);
    expect(userId).toMatch(/^[0-9a-f-]{36}$/);
  });

  test("looks up user by token", () => {
    const foundUserId = getUserIdByToken(token);
    expect(foundUserId).toBe(userId);
  });

  test("returns null for invalid token", () => {
    const result = getUserIdByToken("invalid-token");
    expect(result).toBeNull();
  });

  test("logs and retrieves events", () => {
    logSessionStart(userId, { userAgent: "test" });
    logExerciseAttempt(userId, { exerciseId: "counting-basket", answer: 4, correct: true });
    logExerciseAttempt(userId, { exerciseId: "counting-basket", answer: 3, correct: false });
    logExerciseAttempt(userId, { exerciseId: "counting-basket", answer: 4, correct: true });

    const events = getEvents(userId);
    expect(events.length).toBe(4);
    expect(events[0]?.event_type).toBe("session_start");
    expect(events[1]?.event_type).toBe("exercise_attempt");
  });

  test("computes user progress", () => {
    const progress = getUserProgress(userId);
    
    expect(progress.totalAttempts).toBe(3);
    expect(progress.totalCorrect).toBe(2);
    expect(progress.overallAccuracy).toBeCloseTo(0.667, 2);
  });
});
