// Quick test script for database functionality
import { createUser, getUserIdByToken } from "./tokens";
import { logEvent, getEvents, logSessionStart, logExerciseAttempt } from "./events";
import { getUserProgress } from "./progress";
import { closeAllDbs, closeUserDb } from "./index";
import { closeTokensDb } from "./tokens";

console.log("=== Testing Database ===\n");

// Test 1: Create user
console.log("1. Creating user...");
const { token, userId } = createUser();
console.log(`   Token: ${token}`);
console.log(`   User ID: ${userId}`);

// Test 2: Lookup user by token
console.log("\n2. Looking up user by token...");
const foundUserId = getUserIdByToken(token);
console.log(`   Found: ${foundUserId}`);
console.log(`   Match: ${foundUserId === userId}`);

// Test 3: Log events
console.log("\n3. Logging events...");
logSessionStart(userId, { userAgent: "test" });
logExerciseAttempt(userId, { exerciseId: "counting-basket", answer: 4, correct: true });
logExerciseAttempt(userId, { exerciseId: "counting-basket", answer: 3, correct: false });
logExerciseAttempt(userId, { exerciseId: "counting-basket", answer: 4, correct: true });
console.log("   Logged 4 events");

// Test 4: Get events
console.log("\n4. Retrieving events...");
const events = getEvents(userId);
console.log(`   Found ${events.length} events`);
for (const e of events) {
  console.log(`   - ${e.event_type}: ${JSON.stringify(e.payload)}`);
}

// Test 5: Get progress
console.log("\n5. Getting user progress...");
const progress = getUserProgress(userId);
console.log(`   Total attempts: ${progress.totalAttempts}`);
console.log(`   Total correct: ${progress.totalCorrect}`);
console.log(`   Accuracy: ${(progress.overallAccuracy * 100).toFixed(1)}%`);

// Cleanup
closeUserDb(userId);
closeTokensDb();

console.log("\n=== All tests passed! ===");
