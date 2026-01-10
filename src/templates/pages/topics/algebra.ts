import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function algebraTopicPage(token: string): string {
  const exercises = [
    {
      title: "Advanced Patterns",
      description: "Identify complex number patterns with rules",
      url: `/practice/algebra-patterns`,
      icon: "🔢",
      difficulty: 2 as const,
    },
    {
      title: "Number Relationships",
      description: "Understand relationships like 'A is 3 more than B'",
      url: `/practice/algebra-relationships`,
      icon: "🔗",
      difficulty: 2 as const,
    },
    {
      title: "Find the Missing Number",
      description: "Solve for unknowns: ☐ + 5 = 12",
      url: `/practice/algebra-missing`,
      icon: "❓",
      difficulty: 2 as const,
    },
    {
      title: "Create Patterns",
      description: "Build patterns from given rules",
      url: `/practice/algebra-build`,
      icon: "🏗️",
      difficulty: 2 as const,
    },
    {
      title: "Function Tables",
      description: "Find rules from input-output pairs",
      url: `/practice/algebra-functions`,
      icon: "📊",
      difficulty: 3 as const,
    },
    {
      title: "Balance Equations",
      description: "Use balance scales to understand equality",
      url: `/practice/algebra-balance`,
      icon: "⚖️",
      difficulty: 2 as const,
    },
    {
      title: "Solve Simple Equations",
      description: "Solve x + 4 = 10 style equations",
      url: `/practice/algebra-equations`,
      icon: "🧮",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Algebraic Thinking",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🧮</div>
          <div class="topic-info">
            <h1>Algebraic Thinking</h1>
            <p class="topic-desc">Develop pattern recognition and early algebra skills. Build the foundation for formal algebra.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Identify and extend number patterns</li>
            <li>Recognize relationships between numbers</li>
            <li>Solve missing number problems</li>
            <li>Understand equality with balance models</li>
            <li>Solve simple equations</li>
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
