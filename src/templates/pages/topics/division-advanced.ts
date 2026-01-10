import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function divisionAdvancedTopicPage(token: string): string {
  const exercises = [
    {
      title: "Long Division Basics",
      description: "Step-by-step long division with single-digit divisors",
      url: `/practice/divadv-long`,
      icon: "📝",
      difficulty: 3 as const,
    },
    {
      title: "Remainders",
      description: "Understand and work with division remainders",
      url: `/practice/divadv-remainders`,
      icon: "🔢",
      difficulty: 2 as const,
    },
    {
      title: "Division Estimation",
      description: "Estimate quotients to check reasonableness",
      url: `/practice/divadv-estimation`,
      icon: "🤔",
      difficulty: 3 as const,
    },
    {
      title: "Multi-Step Division",
      description: "Word problems with multiple operations",
      url: `/practice/divadv-multi-step`,
      icon: "📖",
      difficulty: 4 as const,
    },
    {
      title: "Mental Division",
      description: "Quick division strategies for mental math",
      url: `/practice/divadv-mental`,
      icon: "🧠",
      difficulty: 3 as const,
    },
    {
      title: "Decimal Answers",
      description: "Division resulting in decimal quotients",
      url: `/practice/divadv-decimal`,
      icon: "0.5",
      difficulty: 4 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Advanced Division",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">➗</div>
          <div class="topic-info">
            <h1>Advanced Division</h1>
            <p class="topic-desc">Master long division, remainders, and decimal quotients.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Master long division with single-digit divisors</li>
            <li>Work with remainders</li>
            <li>Use estimation to check answers</li>
            <li>Solve multi-step division problems</li>
            <li>Calculate decimal quotients</li>
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
