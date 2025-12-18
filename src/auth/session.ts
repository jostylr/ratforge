import { createUser, getUserIdByToken } from "../db/tokens";
import { logSessionStart } from "../db/events";

const COOKIE_NAME = "ratforge_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export interface Session {
  userId: string;
  token: string;
}

export function parseSessionCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(";").map(c => c.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === COOKIE_NAME && value) {
      return value;
    }
  }
  return null;
}

export function getSessionFromRequest(req: Request): Session | null {
  const cookieHeader = req.headers.get("cookie");
  const token = parseSessionCookie(cookieHeader);
  
  if (!token) return null;
  
  const userId = getUserIdByToken(token);
  if (!userId) return null;
  
  return { userId, token };
}

export function createSession(req: Request): { session: Session; cookie: string } {
  const { token, userId } = createUser();
  
  // Log session start event
  const userAgent = req.headers.get("user-agent") || undefined;
  const referrer = req.headers.get("referer") || undefined;
  logSessionStart(userId, { userAgent, referrer });
  
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
  
  return {
    session: { userId, token },
    cookie,
  };
}

export function createSessionCookie(token: string): string {
  return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

export function clearSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
