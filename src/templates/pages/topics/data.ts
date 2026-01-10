import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function dataTopicPage(token: string): string {
  const exercises = [
    {
      title: "Reading Bar Graphs",
      description: "Extract information from bar graphs",
      url: `/practice/data-read-bar`,
      icon: "📊",
      difficulty: 1 as const,
    },
    {
      title: "Create Bar Graphs",
      description: "Build bar graphs from data tables",
      url: `/practice/data-create-bar`,
      icon: "📈",
      difficulty: 2 as const,
    },
    {
      title: "Tables & Charts",
      description: "Read and interpret data tables",
      url: `/practice/data-tables`,
      icon: "📋",
      difficulty: 1 as const,
    },
    {
      title: "Data Comparison",
      description: "Compare multiple data sets using graphs",
      url: `/practice/data-compare`,
      icon: "⚖️",
      difficulty: 2 as const,
    },
    {
      title: "Graph Problem Solving",
      description: "Solve word problems using graph data",
      url: `/practice/data-problems`,
      icon: "🧩",
      difficulty: 3 as const,
    },
    {
      title: "Data Analysis",
      description: "Find mean, mode, range and identify trends",
      url: `/practice/data-analysis`,
      icon: "🔍",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Data & Graphs",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">📊</div>
          <div class="topic-info">
            <h1>Data & Graphs</h1>
            <p class="topic-desc">Learn to read, create, and analyze data using charts and graphs.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Read and create bar graphs</li>
            <li>Interpret data from tables</li>
            <li>Compare data using graphs</li>
            <li>Build data analysis skills</li>
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
