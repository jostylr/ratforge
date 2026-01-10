import { layout } from "../../layout";
import { renderExerciseCard, progressStyles } from "../../../components/progress";

export function timeTopicPage(token: string): string {
  const exercises = [
    {
      title: "Hour & Half-Hour",
      description: "Tell time to the hour and half-hour",
      url: `/practice/time-hour-half`,
      icon: "🕐",
      difficulty: 1 as const,
    },
    {
      title: "Calendar Basics",
      description: "Learn days of the week and months",
      url: `/practice/time-calendar`,
      icon: "📅",
      difficulty: 1 as const,
    },
    {
      title: "Time Word Problems",
      description: "Solve elapsed time problems",
      url: `/practice/time-word-problems`,
      icon: "📖",
      difficulty: 2 as const,
    },
    {
      title: "Analog Clock Mastery",
      description: "Read analog clocks to any minute",
      url: `/practice/time-analog`,
      icon: "🕰️",
      difficulty: 2 as const,
    },
    {
      title: "Digital Time",
      description: "Read and write digital time with AM/PM",
      url: `/practice/time-digital`,
      icon: "⏰",
      difficulty: 1 as const,
    },
    {
      title: "Clock Conversion",
      description: "Convert between analog and digital time",
      url: `/practice/time-conversion`,
      icon: "🔄",
      difficulty: 2 as const,
    },
    {
      title: "Time Applications",
      description: "Use schedules and timetables",
      url: `/practice/time-applications`,
      icon: "🗓️",
      difficulty: 3 as const,
    },
    {
      title: "Sundials & History",
      description: "Explore historical timekeeping methods",
      url: `/practice/time-history`,
      icon: "☀️",
      difficulty: 2 as const,
    },
  ];

  const exerciseCards = exercises
    .map(ex => renderExerciseCard({ ...ex, isNew: true }))
    .join("");

  return layout({
    title: "Time",
    content: `
      <section class="topic-page">
        <header class="topic-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
        </header>
        
        <div class="topic-intro">
          <div class="topic-icon-large">🕐</div>
          <div class="topic-info">
            <h1>Time</h1>
            <p class="topic-desc">Learn to tell time on analog and digital clocks, work with calendars, and solve time problems.</p>
          </div>
        </div>

        <div class="learning-goals">
          <h2>Learning Goals</h2>
          <ul>
            <li>Tell time to the hour and half-hour</li>
            <li>Identify days and months</li>
            <li>Solve time-related word problems</li>
            <li>Master both analog and digital time</li>
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
