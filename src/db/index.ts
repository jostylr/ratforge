import { Database } from "bun:sqlite";
import { join } from "path";
import { mkdirSync, existsSync } from "fs";

const DATA_DIR = join(import.meta.dir, "../../data");

// Cache of open database connections per user
const userDbCache = new Map<string, Database>();

export function ensureDataDir(): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getUserDataDir(userId: string): string {
  const userDir = join(DATA_DIR, userId);
  if (!existsSync(userDir)) {
    mkdirSync(userDir, { recursive: true });
  }
  return userDir;
}

export function getUserDb(userId: string): Database {
  // Return cached connection if exists
  const cached = userDbCache.get(userId);
  if (cached) {
    return cached;
  }

  // Create user directory and database
  const userDir = getUserDataDir(userId);
  const dbPath = join(userDir, "events.db");
  const db = new Database(dbPath);
  
  // Initialize schema
  initUserSchema(db);
  
  // Cache and return
  userDbCache.set(userId, db);
  return db;
}

function initUserSchema(db: Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      event_type TEXT NOT NULL,
      payload TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
    CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp);
  `);
}

export function closeUserDb(userId: string): void {
  const db = userDbCache.get(userId);
  if (db) {
    db.close();
    userDbCache.delete(userId);
  }
}

export function closeAllDbs(): void {
  for (const [userId, db] of userDbCache) {
    db.close();
  }
  userDbCache.clear();
}
