import { getSessionFromRequest, type Session } from "./session";
import { getUserIdByToken } from "../db/tokens";
import { html } from "../templates/layout";
import { layout } from "../templates/layout";

export interface AuthenticatedRequest extends Request {
  session: Session;
}

export function requireAuth(
  handler: (req: AuthenticatedRequest, params: Record<string, string>) => Response | Promise<Response>
) {
  return (req: Request, params: Record<string, string>): Response | Promise<Response> => {
    const session = getSessionFromRequest(req);
    
    if (!session) {
      // Redirect to home page for unauthenticated users
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }
    
    // Attach session to request
    (req as AuthenticatedRequest).session = session;
    return handler(req as AuthenticatedRequest, params);
  };
}

export function getSessionFromToken(token: string): Session | null {
  const userId = getUserIdByToken(token);
  if (!userId) return null;
  return { userId, token };
}

export function optionalAuth(
  handler: (req: Request, params: Record<string, string>, session: Session | null) => Response | Promise<Response>
) {
  return (req: Request, params: Record<string, string>): Response | Promise<Response> => {
    const session = getSessionFromRequest(req);
    return handler(req, params, session);
  };
}
