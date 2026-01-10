import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function moneyTopicPage(token: string): string {
  const exercises = [
    {
      title: "Coin & Bill ID",
      description: "Identify coins and bills by sight",
      url: `/practice/money-identify`,
      icon: "💵",
      difficulty: 1 as const,
    },
    {
      title: "Counting Money",
      description: "Count collections of coins and bills",
      url: `/practice/money-counting`,
      icon: "🪙",
      difficulty: 1 as const,
    },
    {
      title: "Making Change",
      description: "Calculate correct change from purchases",
      url: `/practice/money-change`,
      icon: "💰",
      difficulty: 2 as const,
    },
    {
      title: "Money Word Problems",
      description: "Solve shopping and savings scenarios",
      url: `/practice/money-word-problems`,
      icon: "📖",
      difficulty: 2 as const,
    },
    {
      title: "Shopping Practice",
      description: "Virtual store simulation with budgets",
      url: `/practice/money-shopping`,
      icon: "🛒",
      difficulty: 2 as const,
    },
    {
      title: "Simple Budgeting",
      description: "Plan spending across categories",
      url: `/practice/money-budgeting`,
      icon: "📊",
      difficulty: 3 as const,
    },
    {
      title: "Money Choices",
      description: "Make financial decisions: save or spend?",
      url: `/practice/money-decisions`,
      icon: "🤔",
      difficulty: 3 as const,
    },
    {
      title: "Financial Literacy",
      description: "Practical money management skills",
      url: `/practice/money-literacy`,
      icon: "🎓",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Money",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">💵</div>
          <div class="topic-info">
            <h1>Money</h1>
            <p class="topic-desc">Learn to identify, count, and work with money. Build financial literacy skills.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Identify coins and bills</li>
            <li>Count money amounts</li>
            <li>Make change</li>
            <li>Solve money word problems</li>
            <li>Build financial literacy skills</li>
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
