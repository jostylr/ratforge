import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function multiplicationTopicPage(token: string): string {
  const exercises = [
    {
      title: "Repeated Addition",
      description: "See multiplication as adding equal groups",
      url: `/practice/mult-repeated`,
      icon: "➕",
      difficulty: 1 as const,
    },
    {
      title: "Array Builder",
      description: "Build and visualize multiplication arrays",
      url: `/practice/mult-arrays`,
      icon: "⬛",
      difficulty: 2 as const,
    },
    {
      title: "Multiplication Objects",
      description: "Use virtual manipulatives to explore grouping",
      url: `/practice/mult-manipulatives`,
      icon: "🧱",
      difficulty: 1 as const,
    },
    {
      title: "Times Tables",
      description: "Interactive multiplication table practice",
      url: `/practice/mult-tables`,
      icon: "📊",
      difficulty: 2 as const,
    },
    {
      title: "Fact Families",
      description: "Practice facts by family with spaced repetition",
      url: `/practice/mult-families`,
      icon: "👨‍👩‍👧‍👦",
      difficulty: 2 as const,
    },
    {
      title: "Box Method Basics",
      description: "Learn the 2×2 box method for two-digit multiplication",
      url: `/practice/mult-box-intro`,
      icon: "📦",
      difficulty: 3 as const,
    },
    {
      title: "Box Method Practice",
      description: "Practice two-digit multiplication with the box method",
      url: `/practice/mult-box-practice`,
      icon: "✏️",
      difficulty: 3 as const,
    },
    {
      title: "Advanced Box Method",
      description: "Extended box method with subscript notation for larger numbers",
      url: `/practice/mult-box-advanced`,
      icon: "🎓",
      difficulty: 4 as const,
    },
    {
      title: "Decimal Box Method",
      description: "Apply box method to decimal multiplication",
      url: `/practice/mult-decimal-box`,
      icon: "🔢",
      difficulty: 4 as const,
    },
    {
      title: "Multiplication Word Problems",
      description: "Real-world problems using multiplication",
      url: `/practice/mult-word-problems`,
      icon: "📖",
      difficulty: 3 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Multiplication Methods",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">✖️</div>
          <div class="topic-info">
            <h1>Multiplication Methods</h1>
            <p class="topic-desc">Master multiplication from basic facts to multi-digit problems using the powerful box method.</p>
          </div>
        </div>

        <div class="method-highlight">
          <h2>🌟 The Box Method</h2>
          <p>Break numbers into parts and multiply in a grid. Perfect for multi-digit multiplication!</p>
          <div class="method-example">
            <div class="example-box">
              <strong>83 × 52</strong><br>
              <table class="box-demo">
                <tr><th></th><th>80</th><th>3</th></tr>
                <tr><th>50</th><td>4000</td><td>150</td></tr>
                <tr><th>2</th><td>160</td><td>6</td></tr>
              </table>
              Sum: 4000 + 150 + 160 + 6 = <strong>4316</strong>
            </div>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Understand multiplication as repeated addition</li>
            <li>Build fluency with multiplication tables</li>
            <li>Master the box method for multi-digit multiplication</li>
            <li>Apply subscript notation for decimals</li>
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
      
      .method-highlight {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: linear-gradient(135deg, #ede9fe, #ddd6fe);
        border-radius: var(--radius-lg);
        border: 2px solid #8b5cf6;
      }
      .method-highlight h2 { margin: 0 0 0.75rem; font-size: 1.125rem; }
      .method-highlight p { margin: 0 0 1rem; }
      .method-example { display: flex; gap: 1rem; flex-wrap: wrap; }
      .example-box {
        flex: 1;
        min-width: 200px;
        padding: 1rem;
        background: white;
        border-radius: var(--radius-md);
        font-family: monospace;
        line-height: 1.6;
      }
      .box-demo {
        margin: 0.5rem 0;
        border-collapse: collapse;
      }
      .box-demo th, .box-demo td {
        border: 1px solid #ccc;
        padding: 0.25rem 0.5rem;
        text-align: center;
      }
      .box-demo th { background: #f3f4f6; }
      
      .learning-goals { margin-bottom: 2rem; padding: 1rem 1.5rem; background: var(--color-bg); border-radius: var(--radius-md); }
      .learning-goals h2 { margin: 0 0 0.75rem; font-size: 1rem; }
      .learning-goals ul { margin: 0; padding-left: 1.25rem; }
      .learning-goals li { margin-bottom: 0.25rem; font-size: 0.9rem; color: var(--color-text-muted); }
      .exercise-grid { display: grid; gap: 1rem; }
      @media (min-width: 640px) { .exercise-grid { grid-template-columns: repeat(2, 1fr); } }
    `,
  });
}
