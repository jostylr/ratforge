import { layout } from "../layout";
import type { Exercise, ExerciseInstance } from "../../exercises/types";

export function exercisePage(
  exercise: Exercise,
  instance: ExerciseInstance,
  token: string
): string {
  const exerciseHTML = exercise.renderHTML(instance);
  
  return layout({
    title: exercise.title,
    content: `
      <div class="exercise-page">
        <header class="exercise-header">
          <a href="/u/${token}" class="back-link">← Back to Dashboard</a>
          <div class="exercise-meta">
            <span class="topic-badge">${exercise.topic}</span>
            <span class="difficulty">Difficulty: ${"★".repeat(exercise.difficulty)}${"☆".repeat(5 - exercise.difficulty)}</span>
          </div>
        </header>

        <h1 class="exercise-title">${exercise.title}</h1>
        <p class="exercise-description">${exercise.description}</p>

        ${exerciseHTML}
      </div>

      <script>
        window.exerciseData = {
          instanceId: "${instance.id}",
          exerciseId: "${instance.exerciseId}",
          dashboardUrl: "/u/${token}"
        };
      </script>
    `,
    pageStyles: exerciseStyles,
  });
}

const exerciseStyles = `
  .exercise-page {
    max-width: 900px;
    margin: 0 auto;
  }
  
  .exercise-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .back-link {
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 0.9rem;
  }
  
  .back-link:hover {
    color: var(--color-primary);
  }
  
  .exercise-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
  }
  
  .topic-badge {
    background: var(--color-primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    text-transform: capitalize;
  }
  
  .difficulty {
    color: var(--color-warning);
  }
  
  .exercise-title {
    margin-bottom: 0.5rem;
  }
  
  .exercise-description {
    color: var(--color-text-muted);
    margin-bottom: 2rem;
  }
  
  .exercise-container {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
  }
  
  .exercise-prompt {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .exercise-prompt h2 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .target-number {
    color: var(--color-primary);
    font-size: 1.75rem;
    font-weight: 700;
  }
  
  .exercise-hint {
    color: var(--color-text-muted);
    font-size: 0.9rem;
  }
  
  .play-area {
    display: grid;
    grid-template-columns: 1fr 200px;
    gap: 1rem;
    min-height: 400px;
    margin-bottom: 1.5rem;
  }
  
  @media (max-width: 640px) {
    .play-area {
      grid-template-columns: 1fr;
      grid-template-rows: 300px auto;
    }
  }
  
  .kittens-area {
    position: relative;
    background: linear-gradient(to bottom, #87ceeb 0%, #98fb98 100%);
    border-radius: var(--radius-md);
    border: 2px solid var(--color-border);
  }
  
  .kitten-btn {
    position: absolute;
    width: 70px;
    height: 70px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: transform 0.2s, filter 0.2s;
    z-index: 1;
  }
  
  .kitten-btn:hover:not(:disabled) {
    transform: scale(1.15);
    z-index: 10;
  }
  
  .kitten-btn:disabled {
    cursor: default;
  }
  
  .kitten-btn.in-basket {
    filter: grayscale(0.5) opacity(0.4);
    transform: scale(0.8);
  }
  
  .kitten-icon {
    width: 100%;
    height: 100%;
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
  }
  
  .basket-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #f5f5dc;
    border-radius: var(--radius-md);
    border: 2px dashed var(--color-border);
    padding: 1rem;
  }
  
  .basket {
    text-align: center;
  }
  
  .basket-icon {
    width: 150px;
    height: 100px;
  }
  
  .basket-count {
    margin-top: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-text);
  }
  
  .exercise-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .feedback-area {
    margin-top: 1rem;
  }
  
  .feedback-area .alert {
    text-align: center;
    font-size: 1.125rem;
  }
  
  .next-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 1rem;
  }
  
  [x-cloak] {
    display: none !important;
  }
`;
