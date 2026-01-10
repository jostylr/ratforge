import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function decimalsTopicPage(token: string): string {
  const exercises = [
    {
      title: "Understanding Decimals",
      description: "Learn decimals as parts of a whole using grids",
      url: `/practice/dec-parts`,
      icon: "🔢",
      difficulty: 2 as const,
    },
    {
      title: "Decimals to Fractions",
      description: "Convert between decimals and fractions",
      url: `/practice/dec-fractions`,
      icon: "🔄",
      difficulty: 2 as const,
    },
    {
      title: "Tenths",
      description: "Work with one decimal place: 0.1 to 0.9",
      url: `/practice/dec-tenths`,
      icon: "1️⃣",
      difficulty: 1 as const,
    },
    {
      title: "Hundredths",
      description: "Work with two decimal places: 0.01 to 0.99",
      url: `/practice/dec-hundredths`,
      icon: "💯",
      difficulty: 2 as const,
    },
    {
      title: "Comparing Decimals",
      description: "Identify greater, lesser, or equal decimals",
      url: `/practice/dec-compare`,
      icon: "⚖️",
      difficulty: 2 as const,
    },
    {
      title: "Ordering Decimals",
      description: "Arrange decimals from least to greatest",
      url: `/practice/dec-order`,
      icon: "📶",
      difficulty: 2 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Decimals",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">0.5</div>
          <div class="topic-info">
            <h1>Decimals</h1>
            <p class="topic-desc">Understand decimals as parts of a whole and their connection to fractions and place value.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Understand decimals as parts of a whole</li>
            <li>Connect decimals to fractions</li>
            <li>Work with tenths and hundredths</li>
            <li>Compare and order decimals</li>
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
      .topic-icon-large { font-size: 3rem; flex-shrink: 0; font-weight: bold; color: var(--color-primary); }
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
