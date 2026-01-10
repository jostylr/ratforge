import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function divisionStrategiesTopicPage(token: string): string {
  const exercises = [
    {
      title: "Multiplication Reversal",
      description: "Find division facts from multiplication facts",
      url: `/practice/divstrat-inverse`,
      icon: "🔄",
      difficulty: 2 as const,
    },
    {
      title: "Subtract to Divide",
      description: "Use repeated subtraction to understand division",
      url: `/practice/divstrat-repeated-sub`,
      icon: "➖",
      difficulty: 2 as const,
    },
    {
      title: "Division Objects",
      description: "Virtual manipulatives for division exploration",
      url: `/practice/divstrat-manipulatives`,
      icon: "🧱",
      difficulty: 1 as const,
    },
    {
      title: "Area Division",
      description: "Find missing dimensions using area models",
      url: `/practice/divstrat-area`,
      icon: "📐",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Division Methods",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🧩</div>
          <div class="topic-info">
            <h1>Division Methods</h1>
            <p class="topic-desc">Explore different strategies for solving division problems efficiently.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Use division as inverse of multiplication</li>
            <li>Understand repeated subtraction</li>
            <li>Apply area models to division</li>
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
      .learning-goals { margin-bottom: 2rem; padding: 1rem 1.5rem; background: var(--color-bg); border-radius: var(--radius-md); }
      .learning-goals h2 { margin: 0 0 0.75rem; font-size: 1rem; }
      .learning-goals ul { margin: 0; padding-left: 1.25rem; }
      .learning-goals li { margin-bottom: 0.25rem; font-size: 0.9rem; color: var(--color-text-muted); }
      .exercise-grid { display: grid; gap: 1rem; }
      @media (min-width: 640px) { .exercise-grid { grid-template-columns: repeat(2, 1fr); } }
    `,
  });
}
