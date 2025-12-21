
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

            document.addEventListener('keydown', (e) => {
                // Ignore if typing in an input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
                
                if (e.key >= '1' && e.key <= '9') {
                    submitAnswer(parseInt(e.key));
                } else if (e.key === '0') {
                    submitAnswer(10);
                }
            });
        })();
      </script>
    `;
    }
};

subitizeExercise.renderWorksheet = function (options = {}): string {
    const seed = options.seed ?? createSeed();
    const count = options.count ?? 6;
    const rng = seededRandom(seed);

    // Generate multiple problems
    const problems: { instance: ExerciseInstance; html: string }[] = [];

    for (let i = 0; i < count; i++) {
        // Create a unique seed for each problem based on main seed
        const problemSeed = Math.floor(rng() * 2147483647);
        const instance = this.generate(problemSeed);
        const state = instance.params as unknown as SubitizeState & SubitizeParams;

        // Static dots, no curtain
        const dotsHtml = state.positions.map((p, _) => `
            <div class="subitize-dot" style="left: ${p.x}%; top: ${p.y}%;"></div>
        `).join('');

        const html = `
            <div class="problem-item">
                <div class="problem-number">${i + 1}.</div>
                <div class="flash-area static-flash">
                    ${dotsHtml}
                </div>
                <div class="answer-box">
                    Answer: ________
                </div>
            </div>
        `;

        problems.push({ instance, html });
    }

    return `
        <div class="worksheet-page">
            <header class="worksheet-header">
                <h1>Subitize Practice</h1>
                <div class="meta">
                    <p>Name: ______________________</p>
                    <p>Date: ________________</p>
                    <p class="seed-info">ID: ${seed}</p>
                </div>
            </header>
            
            <div class="problems-grid">
                ${problems.map(p => p.html).join('')}
            </div>

            <footer class="worksheet-footer">
                <p>RatForge Learning • ratforge.com</p>
            </footer>
        </div>

        <style>
            @media print {
                @page { margin: 1cm; size: A4; }
                body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                nav, .sidebar, .btn { display: none !important; }
            }
            .worksheet-page {
                font-family: sans-serif;
                max-width: 21cm;
                margin: 0 auto;
                background: white;
                padding: 2cm;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .worksheet-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 2rem;
                border-bottom: 2px solid #333;
                padding-bottom: 1rem;
            }
            .worksheet-header h1 { margin: 0; font-size: 2rem; color: #333; }
            .meta p { margin: 0.5rem 0; font-size: 1.1rem; }
            .seed-info { font-size: 0.8rem; color: #999; margin-top: 1rem !important; }
            
            .problems-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
            }
            .problem-item {
                border: 1px solid #ddd;
                padding: 1rem;
                break-inside: avoid;
                border-radius: 8px;
            }
            .problem-number {
                font-weight: bold;
                margin-bottom: 0.5rem;
                font-size: 1.2rem;
            }
            .flash-area.static-flash {
                position: relative;
                width: 100%;
                height: 200px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                margin-bottom: 1rem;
            }
            .subitize-dot {
                position: absolute;
                width: 30px;
                height: 30px;
                background: #FF6B6B;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                border: 1px solid rgba(0,0,0,0.1);
            }
            .answer-box {
                font-size: 1.5rem;
                text-align: right;
                margin-top: 1rem;
                font-family: monospace;
            }
            
            .worksheet-footer {
                margin-top: 2rem;
                text-align: center;
                color: #999;
                font-size: 0.8rem;
                border-top: 1px solid #eee;
                padding-top: 1rem;
            }
        </style>
    `;
};
