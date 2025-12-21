import { layout } from "../layout";
import { getUserProgress } from "../../db/progress";

export function dashboardPage(userId: string, token: string): string {
  const progress = getUserProgress(userId);

  const accuracyPercent = (progress.overallAccuracy * 100).toFixed(0);
  const hasActivity = progress.totalAttempts > 0;

  return layout({
    title: "Dashboard",
    content: `
      <section class="dashboard">
        <div class="dashboard-header">
          <h1>Your Learning Dashboard</h1>
          <p class="text-muted">Bookmark this page to return: <code>/u/${token}</code></p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">${progress.totalAttempts}</div>
            <div class="stat-label">Total Attempts</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${progress.totalCorrect}</div>
            <div class="stat-label">Correct Answers</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${accuracyPercent}%</div>
            <div class="stat-label">Accuracy</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${progress.completedExercises}</div>
            <div class="stat-label">Completed</div>
          </div>
        </div>

        <section class="exercises-section">
          <h2>Exercises</h2>
          <div class="exercise-list">
            <a href="/practice/counting-basket" class="exercise-card">
              <div class="exercise-icon">🐱</div>
              <div class="exercise-info">
                <h3>Kittens in a Basket</h3>
                <p>Practice counting by putting kittens in a basket</p>
              </div>
              <div class="exercise-status">
                ${hasActivity ? `<span class="badge">${progress.exercises["counting-basket"]?.correct ?? 0} correct</span>` : '<span class="badge badge-new">New</span>'}
              </div>
            </a>
            
            <a href="/practice/counting-subitize" class="exercise-card">
              <div class="exercise-icon">👀</div>
              <div class="exercise-info">
                <h3>Flash Subitize</h3>
                <p>Recognize quantities at a glance without counting by ones</p>
              </div>
              <div class="exercise-status">
                ${hasActivity ? `<span class="badge">${progress.exercises["counting-subitize"]?.correct ?? 0} correct</span>` : '<span class="badge badge-new">New</span>'}
              </div>
            </a>
          </div>
        </section>

        ${hasActivity ? `
        <section class="activity-section">
          <h2>Recent Progress</h2>
          <p class="text-muted">Last activity: ${progress.lastActivity ?? "None"}</p>
        </section>
        ` : `
        <section class="welcome-section">
          <div class="card text-center">
            <h2>Welcome to RatForge!</h2>
            <p>Start with the counting exercise above to begin your arithmetic journey.</p>
          </div>
        </section>
        `}
      </section>
    `,
    pageStyles: `
      .dashboard-header {
        margin-bottom: 2rem;
      }
      .dashboard-header code {
        background: var(--color-bg);
        padding: 0.25rem 0.5rem;
        border-radius: var(--radius-sm);
        font-size: 0.875rem;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 1rem;
        margin-bottom: 2rem;
      }
      .stat-card {
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        text-align: center;
      }
      .stat-value {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary);
      }
      .stat-label {
        font-size: 0.875rem;
        color: var(--color-text-muted);
        margin-top: 0.25rem;
      }
      .exercises-section, .activity-section, .welcome-section {
        margin-top: 2rem;
      }
      .exercise-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .exercise-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-lg);
        padding: 1rem 1.5rem;
        text-decoration: none;
        color: inherit;
        transition: box-shadow 0.2s, border-color 0.2s;
      }
      .exercise-card:hover {
        border-color: var(--color-primary);
        box-shadow: var(--shadow-md);
        text-decoration: none;
      }
      .exercise-icon {
        font-size: 2.5rem;
      }
      .exercise-info {
        flex: 1;
      }
      .exercise-info h3 {
        margin: 0;
        font-size: 1.125rem;
      }
      .exercise-info p {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: var(--color-text-muted);
      }
      .badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
        background: var(--color-primary);
        color: white;
      }
      .badge-new {
        background: var(--color-success);
      }
    `,
  });
}
