import './style.css';
import { createWorld, stepWorld } from './core/world.js';
import { GridCanvasRenderer } from './render/canvasRenderer.js';

let world = createWorld(1);
let sessionStarted = false;
const telemetry = (name: 'game_start' | 'game_finish'): void => {
  const analytics = (window as Window & { ParrisAnalytics?: { track?: (name: string) => void } }).ParrisAnalytics;
  analytics?.track?.(name);
};
const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas');
const eventLog = document.querySelector<HTMLUListElement>('#event-log');
const tickReadout = document.querySelector<HTMLElement>('#tick-readout');
const seedReadout = document.querySelector<HTMLElement>('#seed-readout');
const scoreReadout = document.querySelector<HTMLElement>('#score-readout');
const questText = document.querySelector<HTMLElement>('#quest-text');
const healthReadout = document.querySelector<HTMLElement>('#health-readout');
const relicReadout = document.querySelector<HTMLElement>('#relic-readout');
const relicProgress = document.querySelector<HTMLElement>('#relic-progress');
const stateReadout = document.querySelector<HTMLElement>('#state-readout');
const positionReadout = document.querySelector<HTMLElement>('#position-readout');
const restartButton = document.querySelector<HTMLButtonElement>('#restart-button');

if (!canvas) {
  throw new Error('Canvas element #game-canvas is required.');
}

const renderer = new GridCanvasRenderer(canvas);

function render(): void {
  renderer.draw(world);

  if (seedReadout) seedReadout.textContent = `seed: ${world.seed}`;
  if (tickReadout) tickReadout.textContent = `tick: ${world.tick}`;
  if (scoreReadout) scoreReadout.textContent = `score: ${world.score}`;
  if (positionReadout) {
    positionReadout.textContent = `X ${String(world.player.x + 1).padStart(2, '0')} / Y ${String(world.player.y + 1).padStart(2, '0')}`;
  }
  if (questText) {
    questText.textContent = world.inventory.includes('key')
      ? 'Key found! Escape through the gate.'
      : 'Find a key to unlock the gate.';
    questText.classList.toggle('complete', world.inventory.includes('key'));
  }
  if (healthReadout) healthReadout.textContent = `${'● '.repeat(world.health)}${'○ '.repeat(world.maxHealth - world.health)}`.trim();
  if (relicReadout) relicReadout.textContent = `${world.relicsFound} / 2`;
  if (relicProgress) relicProgress.style.width = `${(world.relicsFound / 2) * 100}%`;
  if (stateReadout) {
    stateReadout.textContent = world.questCompleted ? 'VICTORY' : world.gameOver ? 'LOST' : 'EXPLORING';
    stateReadout.dataset.state = world.questCompleted ? 'complete' : world.gameOver ? 'danger' : 'active';
  }
  if (eventLog) {
    eventLog.innerHTML = '';
    for (const item of world.log) {
      const li = document.createElement('li');
      li.textContent = item;
      eventLog.appendChild(li);
    }
  }
}

function move(direction: 'north' | 'south' | 'east' | 'west'): void {
  if (!sessionStarted) { sessionStarted = true; telemetry('game_start'); }
  const wasCompleted = world.questCompleted;
  world = stepWorld(world, direction);
  render();
  if (!wasCompleted && world.questCompleted) telemetry('game_finish');
}

function restart(): void {
  sessionStarted = false;
  world = createWorld(world.seed + 1);
  render();
}

render();

window.addEventListener('keydown', (event) => {
  const direction = {
    ArrowUp: 'north',
    ArrowDown: 'south',
    ArrowLeft: 'west',
    ArrowRight: 'east',
    w: 'north',
    W: 'north',
    s: 'south',
    S: 'south',
    a: 'west',
    A: 'west',
    d: 'east',
    D: 'east',
  }[event.key] as string | undefined;

  if (!direction) {
    return;
  }

  event.preventDefault();
  move(direction as 'north' | 'south' | 'east' | 'west');
});

document.querySelectorAll<HTMLButtonElement>('[data-direction]').forEach((button) => {
  button.addEventListener('click', () => {
    move(button.dataset.direction as 'north' | 'south' | 'east' | 'west');
  });
});

restartButton?.addEventListener('click', restart);


// Swipe the map in the desired direction. Pointer events work on Android and desktop.
let swipeStart: { x: number; y: number; id: number } | null = null;
canvas.addEventListener('pointerdown', (event) => {
  if (!event.isPrimary) return;
  swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
});
canvas.addEventListener('pointerup', (event) => {
  if (!swipeStart || event.pointerId !== swipeStart.id) return;
  const dx = event.clientX - swipeStart.x;
  const dy = event.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
  move(Math.abs(dx) > Math.abs(dy)
    ? (dx > 0 ? 'east' : 'west')
    : (dy > 0 ? 'south' : 'north'));
});
canvas.addEventListener('pointercancel', () => { swipeStart = null; });
