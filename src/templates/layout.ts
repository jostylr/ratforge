export interface LayoutOptions {
  title: string;
  content: string;
  pageStyles?: string;
}

export function layout({ title, content, pageStyles }: LayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - RatForge</title>
  <link rel="stylesheet" href="/css/main.css">
  ${pageStyles ? `<style>${pageStyles}</style>` : ""}
  <script src="/js/htmx.min.js" defer></script>
  <script src="/js/app.js"></script>
  <script src="/js/alpine.min.js" defer></script>
</head>
<body>
  <nav class="navbar">
    <a href="/" class="logo">🐀 RatForge</a>
    <div class="nav-links">
      <a href="/about">About</a>
    </div>
  </nav>
  <main class="container">
    ${content}
  </main>
  <footer class="footer">
    <p>RatForge — Master arithmetic from counting to rationals</p>
  </footer>
</body>
</html>`;
}

export function html(content: string, status = 200): Response {
  return new Response(content, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
