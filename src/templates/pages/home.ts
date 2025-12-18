import { layout } from "../layout";

export function homePage(): string {
  return layout({
    title: "Home",
    content: `
      <section class="hero">
        <h1>Welcome to RatForge</h1>
        <p class="lead">Master arithmetic from counting to rational numbers through interactive practice and exploration.</p>
        <div class="cta-buttons">
          <a href="/api/auth/start" class="btn btn-primary btn-large">Start Learning</a>
          <a href="/about" class="btn btn-secondary btn-large">Learn More</a>
        </div>
      </section>

      <section class="features">
        <div class="feature-card">
          <div class="feature-icon">🔢</div>
          <h3>Counting</h3>
          <p>Build a solid foundation with visual counting exercises using fun images.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">➕</div>
          <h3>Natural Numbers</h3>
          <p>Master addition, subtraction, multiplication, and division.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">➖</div>
          <h3>Integers</h3>
          <p>Explore negative numbers and the number line.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">⅓</div>
          <h3>Rationals</h3>
          <p>Understand fractions, decimals, and their relationships.</p>
        </div>
      </section>
    `,
  });
}
