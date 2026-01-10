import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function patternsTopicPage(token: string): string {
  const exercises = [
    {
      title: "Pattern Finder",
      description: "Identify patterns in number sequences",
      url: `/practice/patterns-identify`,
      icon: "🔍",
      difficulty: 2 as const,
    },
    {
      title: "Pattern Extender",
      description: "Continue number patterns with the next values",
      url: `/practice/patterns-extend`,
      icon: "➡️",
      difficulty: 2 as const,
    },
    {
      title: "Repeating Patterns",
      description: "Work with ABAB and ABCABC style patterns",
      url: `/practice/patterns-repeating`,
      icon: "🔁",
      difficulty: 1 as const,
    },
    {
      title: "First, Second, Third",
      description: "Learn ordinal numbers and positions",
      url: `/practice/patterns-ordinal`,
      icon: "🥇",
      difficulty: 1 as const,
    },
    {
      title: "Count by 2s",
      description: "Skip counting by 2s on the number line",
      url: `/practice/patterns-skip-2`,
      icon: "2️⃣",
      difficulty: 1 as const,
    },
    {
      title: "Count by 5s",
      description: "Skip counting by 5s with hand visuals",
      url: `/practice/patterns-skip-5`,
      icon: "5️⃣",
      difficulty: 1 as const,
    },
    {
      title: "Count by 10s",
      description: "Skip counting by 10s on the hundred chart",
      url: `/practice/patterns-skip-10`,
      icon: "🔟",
      difficulty: 1 as const,
    },
    {
      title: "Patterns to Multiplication",
      description: "See how repeated addition becomes multiplication",
      url: `/practice/patterns-mult`,
      icon: "✖️",
      difficulty: 2 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Patterns & Sequences",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🔢</div>
          <div class="topic-info">
            <h1>Patterns & Sequences</h1>
            <p class="topic-desc">Discover patterns in numbers and learn skip counting as a foundation for multiplication.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Identify and extend simple number patterns</li>
            <li>Recognize repeating patterns</li>
            <li>Understand ordinal numbers</li>
            <li>Practice skip counting by 2s, 5s, and 10s</li>
            <li>Connect patterns to multiplication</li>
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
