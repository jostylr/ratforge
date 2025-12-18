import { serve } from "bun";
import { Router } from "./routes";
import { serveStatic } from "./static";
import { layout, html } from "./templates/layout";
import { homePage } from "./templates/pages/home";
import { aboutPage } from "./templates/pages/about";

const PORT = process.env.PORT || 3000;

const router = new Router();

// Pages
router.get("/", () => html(homePage()));
router.get("/about", () => html(aboutPage()));

// Placeholder for auth start (will implement in Phase 4)
router.get("/api/auth/start", () => {
  return new Response("Auth not implemented yet", { status: 501 });
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
