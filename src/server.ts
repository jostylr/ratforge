import { serve } from "bun";

const PORT = process.env.PORT || 3000;

const server = serve({
  port: PORT,
  fetch(req) {
    const url = new URL(req.url);
    
    if (url.pathname === "/") {
      return new Response("RatForge", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🐀 RatForge running at http://localhost:${server.port}`);
