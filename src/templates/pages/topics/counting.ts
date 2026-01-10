import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function countingTopicPage(token: string): string {
  const exercises = [
    {
      title: "Number Recognition",
      description: "Recognize numbers 1-20 from visual representations",
      url: `/practice/counting-recognize`,
      icon: "🔢",
      difficulty: 1 as const,
    },
    {
      title: "Object Counting",
      description: "Count groups of objects accurately",
      url: `/practice/counting-objects`,
      icon: "🎯",
      difficulty: 1 as const,
    },
    {
      title: "Number Matching",
      description: "Match number cards to groups of objects",
      url: `/practice/counting-match`,
      icon: "🔗",
      difficulty: 1 as const,
    },
    {
      title: "One-to-One Matching",
      description: "Connect objects to numbers in sequence",
      url: `/practice/counting-one-to-one`,
      icon: "↔️",
      difficulty: 1 as const,
    },
    {
      title: "More, Less, Same",
      description: "Compare quantities between two groups",
      url: `/practice/counting-compare`,
      icon: "⚖️",
      difficulty: 1 as const,
    },
    {
      title: "Containers & Objects",
      description: "Explore placement using containers",
      url: `/practice/counting-containers`,
      icon: "📦",
      difficulty: 2 as const,
    },
    {
      title: "Estimation Station",
      description: "Estimate pile sizes and bucket ranges",
      url: `/practice/counting-estimation`,
      icon: "🤔",
      difficulty: 2 as const,
    },
    {
      title: "Kittens in a Basket",
      description: "Practice counting by putting kittens in a basket",
      url: `/practice/counting-basket`,
      icon: "🐱",
      difficulty: 1 as const,
    },
    {
      title: "Flash Subitize",
      description: "Recognize quantities at a glance",
      url: `/practice/counting-subitize`,
      icon: "👀",
      difficulty: 2 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Counting & Numbers",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🔢</div>
          <div class="topic-info">
            <h1>Counting & Numbers</h1>
            <p class="topic-desc">Master the fundamentals of counting and number recognition. These exercises build the foundation for all arithmetic skills.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Recognize numbers 1-20</li>
            <li>Count objects accurately</li>
            <li>Match numbers to quantities</li>
            <li>Understand one-to-one correspondence</li>
            <li>Compare quantities (more, less, same)</li>
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
      
      .topic-page {
        max-width: 900px;
        margin: 0 auto;
      }
      
      .topic-header {
        margin-bottom: 1.5rem;
      }
      
      .back-link {
        color: var(--color-text-muted);
        text-decoration: none;
        font-size: 0.9rem;
      }
      
      .back-link:hover {
        color: var(--color-primary);
      }
      
      .topic-intro {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: var(--color-surface);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border);
      }
      
      .topic-icon-large {
        font-size: 4rem;
        flex-shrink: 0;
      }
      
      .topic-info h1 {
        margin: 0 0 0.5rem;
      }
      
      .topic-desc {
        margin: 0;
        color: var(--color-text-muted);
      }
      
      .learning-goals {
        margin-bottom: 2rem;
        padding: 1rem 1.5rem;
        background: var(--color-bg);
        border-radius: var(--radius-md);
      }
      
      .learning-goals h2 {
        margin: 0 0 0.75rem;
        font-size: 1rem;
      }
      
      .learning-goals ul {
        margin: 0;
        padding-left: 1.25rem;
      }
      
      .learning-goals li {
        margin-bottom: 0.25rem;
        font-size: 0.9rem;
        color: var(--color-text-muted);
      }
      
      .exercise-grid {
        display: grid;
        gap: 1rem;
      }
      
      @media (min-width: 640px) {
        .exercise-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  });
}
