import { layout } from "../layout";

export function aboutPage(): string {
  return layout({
    title: "About",
    content: `
      <section class="page-section">
        <h1>About RatForge</h1>
        <p class="lead">RatForge is a web-based platform for mastering arithmetic, progressing from counting through natural numbers, integers, and rational numbers.</p>
        
        <h2>Our Approach</h2>
        <ul>
          <li><strong>Visual Learning</strong> — Interactive exercises with images make abstract concepts concrete.</li>
          <li><strong>Progressive Mastery</strong> — Start simple and build complexity as skills develop.</li>
          <li><strong>Personal Journey</strong> — Your progress is tracked privately, allowing you to learn at your own pace.</li>
          <li><strong>No Sign-up Required</strong> — Start learning immediately with a bookmarkable link.</li>
        </ul>

        <h2>Technology</h2>
        <p>RatForge is built with modern web technologies:</p>
        <ul>
          <li><strong>Bun</strong> — Fast JavaScript runtime with native SQLite</li>
          <li><strong>ratmath</strong> — Precise rational number arithmetic</li>
          <li><strong>htmx</strong> — Dynamic HTML without complex JavaScript</li>
          <li><strong>Alpine.js</strong> — Lightweight reactivity for interactions</li>
        </ul>

        <h2>Privacy</h2>
        <p>Each user's learning data is stored in their own isolated database. We don't track you across sessions or share your data with third parties.</p>

        <div class="cta-section">
          <a href="/" class="btn btn-primary">← Back to Home</a>
        </div>
      </section>
    `,
  });
}
