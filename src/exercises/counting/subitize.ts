
import {
    type Exercise,
    type ExerciseInstance,
    type ValidationResult,
    createSeed,
    seededRandom,
    randomInt
} from "../types";

interface SubitizeParams {
    n_range: [number, number];
    arrangement: 'random' | 'dice' | 'ten_frame';
    exposure_ms: number;
}

interface SubitizeState {
    count: number;
    positions: Array<{ x: number, y: number }>;
    arrangement: string;
}

export const subitizeExercise: Exercise = {
    id: "counting-subitize",
    topic: "counting",
    title: "Flash Subitize",
    description: "Recognize quantities at a glance without counting by ones.",
    difficulty: 1,

    generate(seed?: number): ExerciseInstance {
        const s = seed ?? createSeed();
        const rng = seededRandom(s);

        // Default params
        const params: SubitizeParams = {
            n_range: [1, 6], // start small
            arrangement: 'random',
            exposure_ms: 1000,
        };

        const count = randomInt(params.n_range[0], params.n_range[1], rng);

        // Generate positions
        // Simple random placement in a 0-100 coordinate space
        const positions: Array<{ x: number, y: number }> = []; const minDistance = 15; // minimum distance percentage to avoid overlap

        for (let i = 0; i < count; i++) {
            let x, y, tooClose;
            let attempts = 0;
            do {
                x = 10 + Math.floor(rng() * 80);
                y = 10 + Math.floor(rng() * 80);
                tooClose = false;
                for (const p of positions) {
                    const dx = p.x - x;
                    const dy = p.y - y;
                    if (Math.sqrt(dx * dx + dy * dy) < minDistance) {
                        tooClose = true;
                        break;
                    }
                }
                attempts++;
            } while (tooClose && attempts < 50);
            positions.push({ x, y });
        }

        const state: SubitizeState = {
            count,
            positions,
            arrangement: params.arrangement
        };

        return {
            id: crypto.randomUUID(),
            exerciseId: this.id,
            seed: s,
            params: { ...params, ...state },
            correctAnswer: count,
            createdAt: new Date().toISOString(),
        };
    },

    validate(instance: ExerciseInstance, answer: unknown): ValidationResult {
        const correctLink = instance.correctAnswer as number;
        const userAns = Number(answer);

        if (userAns === correctLink) {
            return { correct: true, feedback: "Correct! Nice eyes!" };
        }
        return { correct: false, feedback: `Not quite. There were ${correctLink} items.` };
    },

    renderHTML(instance: ExerciseInstance): string {
        const state = instance.params as unknown as SubitizeState & SubitizeParams;

        const dotsHtml = state.positions.map((p, i) => `
      <div class="subitize-dot" style="left: ${p.x}%; top: ${p.y}%;"></div>
    `).join('');

        return `
      <div class="subitize-container">
        <div id="flash-area" class="flash-area">
            ${dotsHtml}
            <div id="curtain" class="curtain" style="display: none;">
                <div class="curtain-content">?</div>
            </div>
        </div>
        
        <div class="controls mt-4">
            <p class="instruction">How many did you see?</p>
            <div class="number-pad">
                ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => `
                    <button class="btn btn-lg btn-outline-primary number-btn" onclick="submitAnswer(${n})">${n}</button>
                `).join('')}
            </div>
        </div>
      </div>

      <style>
        .subitize-container {
            max-width: 600px;
            margin: 0 auto;
            text-align: center;
        }
        .flash-area {
            position: relative;
            width: 100%;
            height: 400px;
            background: #f8f9fa;
            border: 2px solid #dee2e6;
            border-radius: 12px;
            overflow: hidden;
            margin-bottom: 2rem;
        }
        .subitize-dot {
            position: absolute;
            width: 40px;
            height: 40px;
            background: #FF6B6B;
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        }
        .curtain {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: #e9ecef;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 5rem;
            color: #adb5bd;
            z-index: 10;
        }
        .number-pad {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            max-width: 400px;
            margin: 0 auto;
        }
        .number-btn {
            aspect-ratio: 1;
            font-size: 1.5rem;
            font-weight: bold;
        }
      </style>

      <script>
        (function() {
            const exposure = ${state.exposure_ms || 1000};
            
            setTimeout(() => {
                const curtain = document.getElementById('curtain');
                if (curtain) {
                    curtain.style.display = 'flex';
                }
            }, exposure);

            window.submitAnswer = async function(n) {
                const res = await fetch('/api/exercise/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        instanceId: '${instance.id}',
                        exerciseId: '${instance.exerciseId}',
                        answer: n
                    })
                });
                const data = await res.json();
                
                if (data.correct) {
                    showToast('Correct!', 'success');
                    setTimeout(() => location.reload(), 1500);
                } else {
                    showToast(data.feedback || 'Try again', 'error');
                }
            };

            function showToast(msg, type) {
                // Simple alert for now, can be upgraded
                const div = document.createElement('div');
                div.className = 'alert alert-' + (type === 'success' ? 'success' : 'danger');
                div.style.position = 'fixed';
                div.style.top = '20px';
                div.style.left = '50%';
                div.style.transform = 'translateX(-50%)';
                div.style.zIndex = '9999';
                div.textContent = msg;
                document.body.appendChild(div);
                setTimeout(() => div.remove(), 2000);
            }
        })();
      </script>
    `;
    }
};
