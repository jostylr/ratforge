import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function measurementTopicPage(token: string): string {
  const exercises = [
    {
      title: "More or Less",
      description: "Compare two groups and identify which has more or less",
      url: `/practice/measurement-more-less`,
      icon: "↕️",
      difficulty: 1 as const,
    },
    {
      title: "Size Ordering",
      description: "Arrange objects from smallest to largest",
      url: `/practice/measurement-order`,
      icon: "📶",
      difficulty: 2 as const,
    },
    {
      title: "Comparison Words",
      description: "Use comparative language: bigger, smaller, taller, shorter",
      url: `/practice/measurement-words`,
      icon: "💬",
      difficulty: 1 as const,
    },
    {
      title: "Quantity Terms Matching",
      description: "Match terms like many, few, none, some to visuals",
      url: `/practice/measurement-terms`,
      icon: "🏷️",
      difficulty: 2 as const,
    },
    {
      title: "Visual Comparison Lab",
      description: "Interactive sandbox for comparing and measuring objects",
      url: `/practice/measurement-lab`,
      icon: "🔬",
      difficulty: 2 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Measurement & Comparison",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">📏</div>
          <div class="topic-info">
            <h1>Measurement & Comparison</h1>
            <p class="topic-desc">Develop skills for comparing quantities and sizes using appropriate mathematical language.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Compare quantities using more/less</li>
            <li>Order objects by size</li>
            <li>Use comparative language in context</li>
            <li>Match quantities to descriptive terms</li>
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
