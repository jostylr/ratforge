import { serve } from "bun";
import { Router } from "./routes";
import { serveStatic } from "./static";
import { layout, html } from "./templates/layout";
import { homePage } from "./templates/pages/home";
import { aboutPage } from "./templates/pages/about";
import { dashboardPage } from "./templates/pages/dashboard";
import { exercisePage } from "./templates/pages/exercise";
import { practicePage } from "./templates/pages/practice";
import { createSession, getSessionFromRequest, createSessionCookie } from "./auth/session";
import { requireAuth, getSessionFromToken, type AuthenticatedRequest } from "./auth/middleware";
import { getUserIdByToken } from "./db/tokens";
import { getExercise } from "./exercises";
import { logExerciseStart, logExerciseAttempt } from "./db/events";
import type { ExerciseInstance } from "./exercises/types";

// Topic page imports
import { countingTopicPage } from "./templates/pages/topics/counting";
import { geometryTopicPage } from "./templates/pages/topics/geometry";
import { measurementTopicPage } from "./templates/pages/topics/measurement";
import { basicOperationsTopicPage } from "./templates/pages/topics/basic-operations";
import { regroupingTopicPage } from "./templates/pages/topics/regrouping";
import { patternsTopicPage } from "./templates/pages/topics/patterns";
import { multiplicationTopicPage } from "./templates/pages/topics/multiplication";
import { divisionTopicPage } from "./templates/pages/topics/division";
import { divisionStrategiesTopicPage } from "./templates/pages/topics/division-strategies";
import { fractionsTopicPage } from "./templates/pages/topics/fractions";
import { decimalsTopicPage } from "./templates/pages/topics/decimals";
import { divisionAdvancedTopicPage } from "./templates/pages/topics/division-advanced";
import { fractionsDecimalsAdvancedTopicPage } from "./templates/pages/topics/fractions-decimals-advanced";
import { probabilityTopicPage } from "./templates/pages/topics/probability";
import { dataTopicPage } from "./templates/pages/topics/data";
import { timeTopicPage } from "./templates/pages/topics/time";
import { moneyTopicPage } from "./templates/pages/topics/money";
import { algebraTopicPage } from "./templates/pages/topics/algebra";

// Import exercises to register them
import "./exercises";

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

// Practice page with all exercises
router.get("/practice", (req) => {
  const session = getSessionFromRequest(req);
  return html(practicePage(session?.token));
});

// Topic TOC pages (require auth)
const topicRoutes = [
  { path: "/counting", handler: countingTopicPage },
  { path: "/geometry", handler: geometryTopicPage },
  { path: "/measurement", handler: measurementTopicPage },
  { path: "/basic-operations", handler: basicOperationsTopicPage },
  { path: "/regrouping", handler: regroupingTopicPage },
  { path: "/patterns", handler: patternsTopicPage },
  { path: "/multiplication", handler: multiplicationTopicPage },
  { path: "/division", handler: divisionTopicPage },
  { path: "/division-strategies", handler: divisionStrategiesTopicPage },
  { path: "/fractions", handler: fractionsTopicPage },
  { path: "/decimals", handler: decimalsTopicPage },
  { path: "/division-advanced", handler: divisionAdvancedTopicPage },
  { path: "/fractions-decimals-advanced", handler: fractionsDecimalsAdvancedTopicPage },
  { path: "/probability", handler: probabilityTopicPage },
  { path: "/data", handler: dataTopicPage },
  { path: "/time", handler: timeTopicPage },
  { path: "/money", handler: moneyTopicPage },
  { path: "/algebra", handler: algebraTopicPage },
];

for (const route of topicRoutes) {
  router.get(route.path, (req) => {
    const session = getSessionFromRequest(req);
    if (!session) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/" },
      });
    }
    return html(route.handler(session.token));
  });
}

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

// Store active exercise instances (in production, use Redis or similar)
const activeInstances = new Map<string, ExerciseInstance>();

// Generic Exercise Route
router.get("/practice/:id", (req, params) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return new Response(null, {
      status: 302,
      headers: { Location: "/" },
    });
  }

  const exerciseId = params.id || "";
  const exercise = getExercise(exerciseId);

  if (!exercise) {
    return html(layout({
      title: "Exercise Not Found",
      content: `<section class="page-section text-center"><h1>Exercise not found</h1><p>ID: ${exerciseId}</p></section>`,
    }), 404);
  }

  // Generate new instance
  const instance = exercise.generate();
  activeInstances.set(instance.id, instance);

  // Log exercise start
  logExerciseStart(session.userId, {
    exerciseId: exercise.id,
    params: instance.params,
  });

  return html(exercisePage(exercise, instance, session.token));
});

// Generic Worksheet Route
router.get("/worksheet/:id", (req, params) => {
  const exerciseId = params.id || "";
  const exercise = getExercise(exerciseId);

  if (!exercise) {
    return html(layout({
      title: "Exercise Not Found",
      content: `<section class="page-section text-center"><h1>Exercise not found</h1><p>ID: ${exerciseId}</p></section>`,
    }), 404);
  }

  if (!exercise.renderWorksheet) {
    return html(layout({
      title: "Worksheet Not Available",
      content: `<section class="page-section text-center"><h1>Worksheet not available for this exercise</h1></section>`,
    }), 404);
  }

  // Render worksheet HTML directly (no layout wrapper usually, or a special print layout)
  // For now we return raw HTML but with a minimal wrapper if needed.
  // The renderWorksheet returns a fragment, we should probably wrap it in a full page structure.

  const content = exercise.renderWorksheet();

  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>${exercise.title} Worksheet</title>
        <link rel="stylesheet" href="/css/style.css">
    </head>
    <body class="worksheet-body">
        ${content}
    </body>
    </html>
  `, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
});

// API: Submit exercise answer
router.post("/api/exercise/submit", async (req) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json() as { instanceId: string; exerciseId: string; answer: unknown };
    const { instanceId, exerciseId, answer } = body;

    const instance = activeInstances.get(instanceId);
    if (!instance) {
      return new Response(JSON.stringify({ error: "Exercise instance not found or expired" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const exercise = getExercise(exerciseId);
    if (!exercise) {
      return new Response(JSON.stringify({ error: "Exercise not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = exercise.validate(instance, answer);

    // Log the attempt
    logExerciseAttempt(session.userId, {
      exerciseId,
      answer,
      correct: result.correct,
    });

    // Clean up instance if correct
    if (result.correct) {
      activeInstances.delete(instanceId);
    }

    return new Response(JSON.stringify(result), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
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
