import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function divisionTopicPage(token: string): string {
  const exercises = [
    {
      title: "Fair Sharing",
      description: "Divide items equally among groups",
      url: `/practice/div-sharing`,
      icon: "🤝",
      difficulty: 1 as const,
    },
    {
      title: "Making Groups",
      description: "See how many groups of a size you can make",
      url: `/practice/div-grouping`,
      icon: "👥",
      difficulty: 1 as const,
    },
    {
      title: "Division Visualizer",
      description: "Use array and area models for division",
      url: `/practice/div-visual`,
      icon: "📊",
      difficulty: 2 as const,
    },
    {
      title: "Division Facts",
      description: "Practice basic division facts within 100",
      url: `/practice/div-facts`,
      icon: "🎴",
      difficulty: 2 as const,
    },
    {
      title: "Division Word Problems",
      description: "Solve real-world division scenarios",
      url: `/practice/div-word-problems`,
      icon: "📖",
      difficulty: 2 as const,
    },
    {
      title: "Division Fluency Drill",
      description: "Timed division fact practice",
      url: `/practice/div-fluency`,
      icon: "⚡",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Division Basics",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">➗</div>
          <div class="topic-info">
            <h1>Division Basics</h1>
            <p class="topic-desc">Learn division through sharing and grouping. Connect division to multiplication as its inverse.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Understand division as sharing and grouping</li>
            <li>Use visual models for division</li>
            <li>Practice basic division facts</li>
            <li>Connect division to multiplication</li>
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
