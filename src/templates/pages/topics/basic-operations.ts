import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function basicOperationsTopicPage(token: string): string {
  const exercises = [
    {
      title: "Adding to 10",
      description: "Visual addition with objects combining together",
      url: `/practice/basic-add-10`,
      icon: "➕",
      difficulty: 1 as const,
    },
    {
      title: "Subtracting to 10",
      description: "Visual subtraction with objects being taken away",
      url: `/practice/basic-subtract-10`,
      icon: "➖",
      difficulty: 1 as const,
    },
    {
      title: "Putting Together",
      description: "Story-based addition by combining groups",
      url: `/practice/basic-putting-together`,
      icon: "🤝",
      difficulty: 1 as const,
    },
    {
      title: "Taking Apart",
      description: "Story-based subtraction by removing items",
      url: `/practice/basic-taking-apart`,
      icon: "✂️",
      difficulty: 1 as const,
    },
    {
      title: "Number Bonds",
      description: "Interactive number bond diagrams to 10",
      url: `/practice/basic-number-bonds`,
      icon: "🔗",
      difficulty: 2 as const,
    },
    {
      title: "Word Problems (Basic)",
      description: "Simple word problems with visual support",
      url: `/practice/basic-word-problems`,
      icon: "📖",
      difficulty: 2 as const,
    },
    {
      title: "Order Doesn't Matter",
      description: "Learn the commutative property of addition",
      url: `/practice/basic-commutative`,
      icon: "🔄",
      difficulty: 2 as const,
    },
    {
      title: "Mental Math Basics",
      description: "Quick strategies for mental calculation",
      url: `/practice/basic-mental-math`,
      icon: "🧠",
      difficulty: 2 as const,
    },
    {
      title: "Fact Fluency Drill",
      description: "Rapid-fire fact practice with speed tracking",
      url: `/practice/basic-fluency`,
      icon: "⚡",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Basic Addition & Subtraction",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">➕</div>
          <div class="topic-info">
            <h1>Basic Addition & Subtraction</h1>
            <p class="topic-desc">Build a strong foundation in addition and subtraction within 10. Master number bonds and develop mental math fluency.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Add and subtract within 10 using objects or drawings</li>
            <li>Understand addition as putting together, subtraction as taking apart</li>
            <li>Use number bonds to 10</li>
            <li>Understand commutative property of addition</li>
            <li>Build fluency with basic facts</li>
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
