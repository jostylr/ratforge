import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function probabilityTopicPage(token: string): string {
  const exercises = [
    {
      title: "Likely or Not",
      description: "Categorize events as likely, unlikely, certain, or impossible",
      url: `/practice/prob-likelihood`,
      icon: "🎲",
      difficulty: 1 as const,
    },
    {
      title: "Probability Words",
      description: "Use probability vocabulary in context",
      url: `/practice/prob-language`,
      icon: "💬",
      difficulty: 1 as const,
    },
    {
      title: "Prediction Practice",
      description: "Predict outcomes from spinners and bags",
      url: `/practice/prob-predict`,
      icon: "🔮",
      difficulty: 2 as const,
    },
    {
      title: "Experiment Lab",
      description: "Virtual coin flips, dice rolls, and spinner spins",
      url: `/practice/prob-experiments`,
      icon: "🧪",
      difficulty: 2 as const,
    },
    {
      title: "Probability Scenarios",
      description: "Apply probability to real-world situations",
      url: `/practice/prob-scenarios`,
      icon: "🌦️",
      difficulty: 2 as const,
    },
    {
      title: "Probability Word Problems",
      description: "Solve story problems involving probability",
      url: `/practice/prob-word-problems`,
      icon: "📖",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Probability",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🎲</div>
          <div class="topic-info">
            <h1>Probability</h1>
            <p class="topic-desc">Understand likelihood, make predictions, and explore chance through experiments.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Understand likelihood concepts</li>
            <li>Use probability language</li>
            <li>Predict outcomes of simple events</li>
            <li>Conduct probability experiments</li>
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
