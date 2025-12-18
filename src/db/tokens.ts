import { Database } from "bun:sqlite";
import { join } from "path";
import { ensureDataDir } from "./index";

const DATA_DIR = join(import.meta.dir, "../../data");

let tokensDb: Database | null = null;

function getTokensDb(): Database {
  if (tokensDb) {
    return tokensDb;
  }

  ensureDataDir();
  const dbPath = join(DATA_DIR, "tokens.db");
  tokensDb = new Database(dbPath);

  // Initialize schema
  tokensDb.exec(`
    CREATE TABLE IF NOT EXISTS tokens (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON tokens(user_id);
  `);

  return tokensDb;
}

export function generateToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  for (let i = 0; i < 32; i++) {
    token += chars[randomBytes[i]! % chars.length];
  }
  return token;
}

export function generateUserId(): string {
  return crypto.randomUUID();
}

export function createUser(): { token: string; userId: string } {
  const db = getTokensDb();
  const token = generateToken();
  const userId = generateUserId();

  db.run(
    "INSERT INTO tokens (token, user_id) VALUES (?, ?)",
    [token, userId]
  );

  return { token, userId };
}

export function getUserIdByToken(token: string): string | null {
  const db = getTokensDb();
  const row = db.query("SELECT user_id FROM tokens WHERE token = ?").get(token) as { user_id: string } | null;
  return row?.user_id ?? null;
}

export function getTokenByUserId(userId: string): string | null {
  const db = getTokensDb();
  const row = db.query("SELECT token FROM tokens WHERE user_id = ?").get(userId) as { token: string } | null;
  return row?.token ?? null;
}

export function tokenExists(token: string): boolean {
  return getUserIdByToken(token) !== null;
}

export function closeTokensDb(): void {
  if (tokensDb) {
    tokensDb.close();
    tokensDb = null;
  }
}
