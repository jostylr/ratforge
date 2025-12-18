import { serve } from "bun";
import { Router } from "./routes";
import { serveStatic } from "./static";
import { layout, html } from "./templates/layout";
import { homePage } from "./templates/pages/home";
import { aboutPage } from "./templates/pages/about";
import { dashboardPage } from "./templates/pages/dashboard";
import { createSession, getSessionFromRequest, createSessionCookie } from "./auth/session";
import { requireAuth, getSessionFromToken, type AuthenticatedRequest } from "./auth/middleware";
import { getUserIdByToken } from "./db/tokens";

const PORT = process.env.PORT || 3000;

const router = new Router();

// Public pages
router.get("/", (req) => {
  // If user has session, redirect to dashboard
  const session = getSessionFromRequest(req);
  if (session) {
    return new Response(null, {
      status: 302,
      headers: { Location: `/u/${session.token}` },
    });
  }
  return html(homePage());
});

router.get("/about", () => html(aboutPage()));

// Auth: Start new session (passwordless)
router.get("/api/auth/start", (req) => {
  const { session, cookie } = createSession(req);
  return new Response(null, {
    status: 302,
    headers: {
      Location: `/u/${session.token}`,
      "Set-Cookie": cookie,
    },
  });
});

// Auth: Logout
router.get("/api/auth/logout", () => {
  return new Response(null, {
    status: 302,
    headers: {
      Location: "/",
      "Set-Cookie": "ratforge_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0",
    },
  });
});

// Dashboard via token URL (passwordless access)
router.get("/u/:token", (req, params) => {
  const token = params.token ?? "";
  const session = getSessionFromToken(token);
  
  if (!session) {
    return html(
      layout({
        title: "Invalid Link",
        content: `
          <section class="page-section text-center">
            <h1>Invalid or Expired Link</h1>
            <p class="lead">This learning link is not valid.</p>
            <a href="/" class="btn btn-primary">Start Fresh</a>
          </section>
        `,
      }),
      404
    );
  }
  
  // Set cookie so they stay logged in
  const cookie = createSessionCookie(session.token);
  
  return new Response(dashboardPage(session.userId, session.token), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": cookie,
    },
  });
});

const server = serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // Try static files first
    const staticResponse = await serveStatic(pathname);
    if (staticResponse) {
      return staticResponse;
    }

    // Try router
    const match = router.match(req.method, pathname);
    if (match) {
      return match.handler(req, match.params);
    }

    // 404
    return html(
      layout({
        title: "Not Found",
        content: `
          <section class="page-section text-center">
            <h1>404 — Page Not Found</h1>
            <p class="lead">The page you're looking for doesn't exist.</p>
            <a href="/" class="btn btn-primary">Go Home</a>
          </section>
        `,
      }),
      404
    );
  },
});

console.log(`🐀 RatForge running at http://localhost:${server.port}`);
