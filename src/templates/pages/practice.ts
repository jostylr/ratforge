import { layout } from "../layout";

export function practicePage(token?: string): string {
  const dashboardUrl = token ? `/u/${token}` : '/';
  
  const exercises = [
    { category: "Counting", items: [
      { id: "counting-basket", title: "Kittens in a Basket", desc: "Drag kittens to practice counting" },
      { id: "counting-subitize", title: "Subitizing", desc: "Quickly recognize quantities" },
      { id: "counting-recognize", title: "Recognize Numbers", desc: "Match quantities to numerals" },
      { id: "counting-objects", title: "Count Objects", desc: "Count various objects" },
      { id: "counting-compare", title: "Compare Quantities", desc: "Compare two groups" },
    ]},
    { category: "Basic Operations", items: [
      { id: "basic-add-10", title: "Add Within 10", desc: "Simple addition facts" },
      { id: "basic-subtract-10", title: "Subtract Within 10", desc: "Simple subtraction facts" },
      { id: "basic-number-bonds", title: "Number Bonds", desc: "Part-part-whole relationships" },
      { id: "basic-doubles", title: "Doubles & Near Doubles", desc: "Double facts strategy" },
      { id: "basic-word-problems", title: "Word Problems", desc: "Addition & subtraction stories" },
    ]},
    { category: "Regrouping", items: [
      { id: "regrouping-complements", title: "Complements of 10", desc: "Make 10 strategy" },
      { id: "regrouping-ltr-add", title: "Left-to-Right Addition", desc: "Add from the left" },
      { id: "regrouping-ltr-sub", title: "Left-to-Right Subtraction", desc: "Subtract from the left" },
    ]},
    { category: "Multiplication", items: [
      { id: "mult-arrays", title: "Arrays", desc: "Visualize multiplication" },
      { id: "mult-tables", title: "Times Tables", desc: "Multiplication facts" },
      { id: "mult-box", title: "Box Method", desc: "Area model multiplication" },
      { id: "mult-word-problems", title: "Word Problems", desc: "Real-world multiplication" },
    ]},
    { category: "Division", items: [
      { id: "div-sharing", title: "Fair Sharing", desc: "Divide equally" },
      { id: "div-facts", title: "Division Facts", desc: "Division facts practice" },
    ]},
    { category: "Fractions", items: [
      { id: "frac-parts", title: "Parts of a Whole", desc: "Identify fractions" },
      { id: "frac-compare", title: "Compare Fractions", desc: "Which is greater?" },
      { id: "frac-equivalent", title: "Equivalent Fractions", desc: "Find equal fractions" },
    ]},
    { category: "Decimals", items: [
      { id: "dec-tenths", title: "Tenths", desc: "Understand tenths" },
      { id: "dec-place-value", title: "Place Value", desc: "Decimal place values" },
    ]},
    { category: "Time", items: [
      { id: "time-hour-half", title: "Hour & Half Hour", desc: "Read clocks" },
      { id: "time-elapsed", title: "Elapsed Time", desc: "Calculate time passed" },
    ]},
    { category: "Money", items: [
      { id: "money-counting", title: "Counting Money", desc: "Count coins and bills" },
    ]},
    { category: "Patterns", items: [
      { id: "patterns-skip-2", title: "Skip Counting", desc: "Count by 2s, 5s, 10s" },
      { id: "patterns-shapes", title: "Shape Patterns", desc: "Find missing shapes" },
    ]},
    { category: "Algebra", items: [
      { id: "algebra-missing", title: "Missing Number", desc: "Find the unknown" },
    ]},
    { category: "Geometry", items: [
      { id: "geometry-shapes", title: "Identify Shapes", desc: "Name 2D shapes" },
    ]},
    { category: "Data", items: [
      { id: "data-bar-graph", title: "Bar Graphs", desc: "Read bar graphs" },
    ]},
    { category: "Probability", items: [
      { id: "prob-coin", title: "Coin Flip", desc: "Basic probability" },
    ]},
    { category: "Measurement", items: [
      { id: "measure-length", title: "Measure Length", desc: "Use a ruler" },
    ]},
    { category: "Place Value", items: [
      { id: "place-expanded", title: "Expanded Form", desc: "Hundreds, tens, ones" },
    ]},
  ];

  const categoryHTML = exercises.map(cat => `
    <div class="category-section">
      <h2 class="category-title">${cat.category}</h2>
      <div class="exercise-grid">
        ${cat.items.map(ex => `
          <a href="/practice/${ex.id}" class="exercise-card">
            <h3>${ex.title}</h3>
            <p>${ex.desc}</p>
          </a>
        `).join('')}
      </div>
    </div>
  `).join('');

  return layout({
    title: "All Exercises - Math Practice",
    content: `
      <div class="practice-page">
        <header class="page-header">
          <h1>📚 All Exercises</h1>
          <p>Choose an exercise to practice</p>
          <a href="${dashboardUrl}" class="btn btn-secondary">← Back to Dashboard</a>
        </header>
        
        <div class="categories-container">
          ${categoryHTML}
        </div>
      </div>
      
      <style>
        .practice-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        .page-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .page-header h1 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: var(--color-text-muted);
          margin-bottom: 1rem;
        }
        .categories-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        .category-section {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          padding: 1.5rem;
        }
        .category-title {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid var(--color-border);
        }
        .exercise-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .exercise-card {
          display: block;
          padding: 1rem;
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
        }
        .exercise-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .exercise-card h3 {
          font-size: 1rem;
          margin-bottom: 0.25rem;
          color: var(--color-primary);
        }
        .exercise-card p {
          font-size: 0.875rem;
          color: var(--color-text-muted);
          margin: 0;
        }
      </style>
    `,
  });
}
