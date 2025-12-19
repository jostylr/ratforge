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
    min-height: 1.4em;
  }
  
  .play-area {
    display: grid;
    grid-template-columns: 1fr 250px;
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
    overflow: hidden;
  }
  
  /* Draggable kitten items */
  .kitten-item {
    position: absolute;
    width: 70px;
    height: 70px;
    cursor: grab;
    transition: transform 0.15s ease;
    z-index: 1;
    user-select: none;
    -webkit-user-select: none;
    touch-action: none;
  }
  
  .kitten-item:hover {
    transform: scale(1.1);
    z-index: 10;
  }
  
  .kitten-item.dd-selected {
    transform: scale(1.15);
    z-index: 20;
  }
  
  .kitten-item.dd-selected .kitten-icon {
    filter: drop-shadow(0 0 8px #6366f1) drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
  }
  
  .kitten-item.dd-dragging-item {
    opacity: 0.4;
  }
  
  .kitten-icon {
    width: 100%;
    height: 100%;
    filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
    pointer-events: none;
  }
  
  /* Basket drop zone */
  .basket-area {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    background: #f5f5dc;
    border-radius: var(--radius-md);
    border: 3px dashed var(--color-border);
    padding: 0.5rem;
    transition: border-color 0.2s, background-color 0.2s;
  }
  
  .basket-area.dd-zone-active,
  .basket-area.basket-hover {
    border-color: var(--color-primary);
    background: #fffacd;
    border-style: solid;
  }
  
  .basket-visual {
    position: relative;
    width: 200px;
    height: 180px;
  }
  
  .basket-back {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
  
  .basket-front {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
    pointer-events: none;
  }
  
  .basket-contents {
    position: absolute;
    top: 45px;
    left: 30px;
    right: 30px;
    bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    justify-content: center;
    gap: 2px;
    z-index: 5;
  }
  
  .kitten-in-basket {
    width: 40px;
    height: 40px;
    cursor: pointer;
    transition: transform 0.15s;
  }
  
  .kitten-in-basket:hover {
    transform: scale(1.2);
  }
  
  .kitten-icon-small {
    width: 100%;
    height: 100%;
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.3));
  }
  
  .basket-hint {
    color: var(--color-text-muted);
    font-size: 0.8rem;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  /* Drag ghost */
  .dd-ghost {
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }
  
  .dd-ghost-count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    font-size: 1.5rem;
    font-weight: bold;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  }
  
  body.dd-dragging {
    cursor: grabbing !important;
  }
  
  body.dd-dragging * {
    cursor: grabbing !important;
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
