import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function fractionsDecimalsAdvancedTopicPage(token: string): string {
  const exercises = [
    {
      title: "Mixed Numbers",
      description: "Understand mixed numbers like 2½",
      url: `/practice/fracadv-mixed`,
      icon: "2½",
      difficulty: 2 as const,
    },
    {
      title: "Improper Fractions",
      description: "Work with fractions greater than 1",
      url: `/practice/fracadv-improper`,
      icon: "5/4",
      difficulty: 2 as const,
    },
    {
      title: "Compare Unlike Fractions",
      description: "Compare fractions with different denominators",
      url: `/practice/fracadv-compare`,
      icon: "⚖️",
      difficulty: 3 as const,
    },
    {
      title: "Add Unlike Fractions",
      description: "Add fractions using common denominators",
      url: `/practice/fracadv-add`,
      icon: "➕",
      difficulty: 3 as const,
    },
    {
      title: "Subtract Unlike Fractions",
      description: "Subtract fractions using common denominators",
      url: `/practice/fracadv-subtract`,
      icon: "➖",
      difficulty: 3 as const,
    },
    {
      title: "Fraction × Whole Number",
      description: "Multiply fractions by whole numbers",
      url: `/practice/fracadv-mult-whole`,
      icon: "✖️",
      difficulty: 3 as const,
    },
    {
      title: "Fraction ÷ Whole Number",
      description: "Divide fractions by whole numbers",
      url: `/practice/fracadv-div-whole`,
      icon: "➗",
      difficulty: 3 as const,
    },
    {
      title: "Decimal-Fraction Convert",
      description: "Convert between common fractions and decimals",
      url: `/practice/fracadv-convert`,
      icon: "🔄",
      difficulty: 2 as const,
    },
    {
      title: "Applied Fractions & Decimals",
      description: "Real-world problems with fractions and decimals",
      url: `/practice/fracadv-applications`,
      icon: "🌍",
      difficulty: 4 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Advanced Fractions & Decimals",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">⅔</div>
          <div class="topic-info">
            <h1>Advanced Fractions & Decimals</h1>
            <p class="topic-desc">Master mixed numbers, unlike denominators, and fraction-decimal conversions.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Convert between improper fractions and mixed numbers</li>
            <li>Compare fractions with different denominators</li>
            <li>Add and subtract with unlike denominators</li>
            <li>Multiply and divide fractions by whole numbers</li>
            <li>Connect fractions to decimal equivalents</li>
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
