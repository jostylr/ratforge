export interface TopicProgress {
  topic: string;
  completed: number;
  total: number;
  accuracy: number;
}

export function renderProgressBar(progress: number, label?: string): string {
  const percent = Math.round(progress * 100);
  return `
    <div class="progress-bar-container">
      ${label ? `<span class="progress-label">${label}</span>` : ''}
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
      <span class="progress-percent">${percent}%</span>
    </div>
  `;
}

export function renderTopicCard(options: {
  title: string;
  description: string;
  url: string;
  icon: string;
  exerciseCount: number;
  completedCount?: number;
}): string {
  const { title, description, url, icon, exerciseCount, completedCount = 0 } = options;
  const progress = exerciseCount > 0 ? completedCount / exerciseCount : 0;
  
  return `
    <a href="${url}" class="topic-card">
      <div class="topic-icon">${icon}</div>
      <div class="topic-content">
        <h3 class="topic-title">${title}</h3>
        <p class="topic-description">${description}</p>
        <div class="topic-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${Math.round(progress * 100)}%"></div>
          </div>
          <span class="topic-stats">${completedCount}/${exerciseCount} exercises</span>
        </div>
      </div>
      <div class="topic-arrow">→</div>
    </a>
  `;
}

export function renderExerciseCard(options: {
  title: string;
  description: string;
  url: string;
  icon: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  isNew?: boolean;
  completedCount?: number;
}): string {
  const { title, description, url, icon, difficulty, isNew = false, completedCount = 0 } = options;
  
  return `
    <a href="${url}" class="exercise-card">
      <div class="exercise-icon">${icon}</div>
      <div class="exercise-content">
        <h4 class="exercise-title">${title}</h4>
        <p class="exercise-desc">${description}</p>
        <div class="exercise-meta">
          <span class="difficulty">${'★'.repeat(difficulty)}${'☆'.repeat(5 - difficulty)}</span>
          ${isNew ? '<span class="badge badge-new">New</span>' : `<span class="badge">${completedCount} completed</span>`}
        </div>
      </div>
    </a>
  `;
}

export const progressStyles = `
  .progress-bar-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .progress-label {
    font-size: 0.875rem;
    color: var(--color-text-muted);
    min-width: 60px;
  }
  
  .progress-bar {
    flex: 1;
    height: 8px;
    background: var(--color-bg);
    border-radius: 4px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: var(--color-primary);
    border-radius: 4px;
    transition: width 0.3s ease;
  }
  
  .progress-percent {
    font-size: 0.875rem;
    font-weight: 600;
    min-width: 40px;
    text-align: right;
  }
  
  .topic-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }
  
  .topic-card:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  
  .topic-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }
  
  .topic-content {
    flex: 1;
    min-width: 0;
  }
  
  .topic-title {
    margin: 0 0 0.25rem;
    font-size: 1.125rem;
  }
  
  .topic-description {
    margin: 0 0 0.5rem;
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }
  
  .topic-progress {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .topic-progress .progress-bar {
    max-width: 150px;
  }
  
  .topic-stats {
    font-size: 0.75rem;
    color: var(--color-text-muted);
    white-space: nowrap;
  }
  
  .topic-arrow {
    font-size: 1.5rem;
    color: var(--color-text-muted);
    transition: transform 0.2s;
  }
  
  .topic-card:hover .topic-arrow {
    transform: translateX(4px);
    color: var(--color-primary);
  }
  
  .exercise-card {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    text-decoration: none;
    color: inherit;
    transition: all 0.2s;
  }
  
  .exercise-card:hover {
    border-color: var(--color-primary);
    box-shadow: var(--shadow-sm);
  }
  
  .exercise-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }
  
  .exercise-content {
    flex: 1;
    min-width: 0;
  }
  
  .exercise-title {
    margin: 0 0 0.25rem;
    font-size: 1rem;
  }
  
  .exercise-desc {
    margin: 0 0 0.5rem;
    font-size: 0.8rem;
    color: var(--color-text-muted);
  }
  
  .exercise-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
  }
  
  .difficulty {
    color: var(--color-warning);
  }
  
  .badge {
    display: inline-block;
    padding: 0.2rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 500;
    background: var(--color-primary);
    color: white;
  }
  
  .badge-new {
    background: var(--color-success);
  }
`;
