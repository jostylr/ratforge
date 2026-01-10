import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function fractionsTopicPage(token: string): string {
  const exercises = [
    {
      title: "Understanding Fractions",
      description: "Learn fractions as parts of a whole",
      url: `/practice/frac-parts`,
      icon: "🥧",
      difficulty: 1 as const,
    },
    {
      title: "Fraction Comparison",
      description: "Compare fractions using visual models",
      url: `/practice/frac-compare`,
      icon: "⚖️",
      difficulty: 2 as const,
    },
    {
      title: "Halves and Quarters",
      description: "Master common fractions: 1/2, 1/4, 3/4",
      url: `/practice/frac-halves-quarters`,
      icon: "🍕",
      difficulty: 1 as const,
    },
    {
      title: "Fractions Around Us",
      description: "Find fractions in real-world contexts",
      url: `/practice/frac-real-world`,
      icon: "🌍",
      difficulty: 2 as const,
    },
    {
      title: "Equivalent Fractions",
      description: "Discover that 1/2 = 2/4 = 4/8",
      url: `/practice/frac-equivalent`,
      icon: "🟰",
      difficulty: 2 as const,
    },
    {
      title: "Adding Fractions",
      description: "Add fractions with like denominators",
      url: `/practice/frac-add`,
      icon: "➕",
      difficulty: 2 as const,
    },
    {
      title: "Subtracting Fractions",
      description: "Subtract fractions with like denominators",
      url: `/practice/frac-subtract`,
      icon: "➖",
      difficulty: 2 as const,
    },
    {
      title: "Fraction Word Problems",
      description: "Solve story problems with fractions",
      url: `/practice/frac-word-problems`,
      icon: "📖",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Fractions",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">½</div>
          <div class="topic-info">
            <h1>Fractions</h1>
            <p class="topic-desc">Understand fractions as parts of a whole, compare them, and perform basic operations.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Understand fractions as parts of a whole</li>
            <li>Identify and compare fractions</li>
            <li>Find equivalent fractions</li>
            <li>Add and subtract with like denominators</li>
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
