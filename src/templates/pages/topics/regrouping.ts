import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function regroupingTopicPage(token: string): string {
  const exercises = [
    {
      title: "Addition Facts Memorization",
      description: "Flashcard drill for single digit sums to 18",
      url: `/practice/regrouping-facts`,
      icon: "🎴",
      difficulty: 2 as const,
    },
    {
      title: "Complements to 10",
      description: "Instantly find what number adds to 10 (critical skill!)",
      url: `/practice/regrouping-complements`,
      icon: "🎯",
      difficulty: 2 as const,
    },
    {
      title: "Left-to-Right Addition",
      description: "Abacus-style addition with carrying from left to right",
      url: `/practice/regrouping-ltr-add`,
      icon: "➡️",
      difficulty: 3 as const,
    },
    {
      title: "Left-to-Right Subtraction",
      description: "Abacus-style subtraction with borrowing from left to right",
      url: `/practice/regrouping-ltr-sub`,
      icon: "⬅️",
      difficulty: 3 as const,
    },
    {
      title: "Multi-Digit Practice",
      description: "Extended practice with 3+ digit regrouping problems",
      url: `/practice/regrouping-multi`,
      icon: "🔢",
      difficulty: 4 as const,
    },
    {
      title: "Regrouping Word Problems",
      description: "Real-world scenarios requiring regrouping",
      url: `/practice/regrouping-word-problems`,
      icon: "📖",
      difficulty: 3 as const,
    },
    {
      title: "Regrouping Visualizer",
      description: "Interactive base-10 blocks showing regrouping process",
      url: `/practice/regrouping-visual`,
      icon: "🧱",
      difficulty: 2 as const,
    },
    {
      title: "Regrouping Speed Drill",
      description: "Timed practice for accuracy and speed",
      url: `/practice/regrouping-speed`,
      icon: "⏱️",
      difficulty: 4 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Regrouping Operations",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🧮</div>
          <div class="topic-info">
            <h1>Regrouping Operations</h1>
            <p class="topic-desc">Master addition and subtraction with carrying and borrowing using the efficient left-to-right abacus method.</p>
          </div>
        </div>

        <div class="method-highlight">
          <h2>🌟 The Abacus Method</h2>
          <p>Unlike traditional right-to-left arithmetic, we use the <strong>left-to-right method</strong> from Speed Mathematics Simplified:</p>
          <div class="method-example">
            <div class="example-box">
              <strong>17 + 29</strong><br>
              1. Start left: 10+20 = 30 → type "3"<br>
              2. See 7+9 > 10 → press spacebar (carry)<br>
              3. Complement of 9 is 1, so 7-1 = 6 → type "6"<br>
              4. Result: 46 ✓
            </div>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Memorize single digit addition facts</li>
            <li>Master complements to 10 (key skill!)</li>
            <li>Learn left-to-right addition with carrying</li>
            <li>Learn left-to-right subtraction with borrowing</li>
            <li>Build fluency with multi-digit regrouping</li>
          </ul>
        </div>

        <h2>Exercises</h2>
        <div class="exercise-grid">
          ${exerciseCards}
        </div>
      </section>
    `,
    pageStyles: `
      ${progressStyles}
      .topic-page { max-width: 900px; margin: 0 auto; }
      .topic-header { margin-bottom: 1.5rem; }
      .back-link { color: var(--color-text-muted); text-decoration: none; font-size: 0.9rem; }
      .back-link:hover { color: var(--color-primary); }
      .topic-intro { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; padding: 1.5rem; background: var(--color-surface); border-radius: var(--radius-lg); border: 1px solid var(--color-border); }
      .topic-icon-large { font-size: 4rem; flex-shrink: 0; }
      .topic-info h1 { margin: 0 0 0.5rem; }
      .topic-desc { margin: 0; color: var(--color-text-muted); }
      
      .method-highlight {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #fff7ed, #fef3c7);
        border-radius: var(--radius-lg);
        border: 2px solid #f59e0b;
      }
      .method-highlight h2 { margin: 0 0 0.75rem; font-size: 1.125rem; }
      .method-highlight p { margin: 0 0 1rem; }
      .method-example { display: flex; gap: 1rem; flex-wrap: wrap; }
      .example-box {
        flex: 1;
        min-width: 200px;
        padding: 1rem;
        background: white;
        border-radius: var(--radius-md);
        font-family: monospace;
        line-height: 1.6;
      }
      
      .learning-goals { margin-bottom: 2rem; padding: 1rem 1.5rem; background: var(--color-bg); border-radius: var(--radius-md); }
      .learning-goals h2 { margin: 0 0 0.75rem; font-size: 1rem; }
      .learning-goals ul { margin: 0; padding-left: 1.25rem; }
      .learning-goals li { margin-bottom: 0.25rem; font-size: 0.9rem; color: var(--color-text-muted); }
      .exercise-grid { display: grid; gap: 1rem; }
      @media (min-width: 640px) { .exercise-grid { grid-template-columns: repeat(2, 1fr); } }
    `,
  });
}
