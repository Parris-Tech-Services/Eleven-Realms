import type { CanvasRenderer, WorldState } from '../core/contracts.js';

export class GridCanvasRenderer implements CanvasRenderer {
  constructor(private canvas: HTMLCanvasElement) {}

  draw(world: WorldState): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, world.width, world.height);
    ctx.fillStyle = '#081b1b';
    ctx.fillRect(0, 0, world.width, world.height);

    const cellWidth = world.width / world.gridWidth;
    const cellHeight = world.height / world.gridHeight;

    const isVisible = (tx: number, ty: number) => {
      const dx = tx - world.player.x;
      const dy = ty - world.player.y;
      return Math.sqrt(dx * dx + dy * dy) <= 4.5;
    };

    for (let y = 0; y < world.gridHeight; y += 1) {
      for (let x = 0; x < world.gridWidth; x += 1) {
        if (!world.discovered[y][x]) {
          // Subtle grid beneath fog makes the map readable on a small screen
          // without revealing unexplored walls, hazards or rewards.
          ctx.fillStyle = (x + y) % 2 === 0 ? '#0a1c20' : '#08181d';
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          ctx.strokeStyle = 'rgba(140, 195, 173, 0.07)';
          ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          continue;
        }

        const visible = isVisible(x, y);

        if (world.walls[y][x]) {
          ctx.fillStyle = visible ? '#05111c' : '#02060a';
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          ctx.strokeStyle = visible ? '#02070c' : '#010305';
          ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        } else {
          const color = (x + y) % 2 === 0 ? (visible ? '#102a2b' : '#061314') : (visible ? '#0b202a' : '#040d12');
          ctx.fillStyle = color;
          ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
          ctx.strokeStyle = visible ? 'rgba(132, 217, 183, 0.08)' : 'rgba(132, 217, 183, 0.03)';
          ctx.strokeRect(x * cellWidth, y * cellHeight, cellWidth, cellHeight);
        }
      }
    }

    ctx.shadowColor = '#78f6bc';
    ctx.shadowBlur = 18;
    ctx.fillStyle = '#9affb8';
    ctx.beginPath();
    ctx.arc(world.player.x * cellWidth + cellWidth / 2, world.player.y * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    for (const entity of world.entities) {
      if (entity.collected || !isVisible(entity.x, entity.y)) continue;

      if (entity.type === 'coin') {
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.arc(
          entity.x * cellWidth + cellWidth / 2,
          entity.y * cellHeight + cellHeight / 2,
          Math.min(cellWidth, cellHeight) / 4,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (entity.type === 'relic') {
        ctx.fillStyle = '#b78cff';
        ctx.strokeStyle = '#f0d8ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(entity.x * cellWidth + cellWidth / 2, entity.y * cellHeight + 5);
        ctx.lineTo(entity.x * cellWidth + cellWidth - 6, entity.y * cellHeight + cellHeight / 2);
        ctx.lineTo(entity.x * cellWidth + cellWidth / 2, entity.y * cellHeight + cellHeight - 5);
        ctx.lineTo(entity.x * cellWidth + 6, entity.y * cellHeight + cellHeight / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (entity.type === 'key') {
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.arc(entity.x * cellWidth + cellWidth / 2, entity.y * cellHeight + cellHeight / 2, Math.min(cellWidth, cellHeight) / 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (entity.type === 'gate') {
        const isLocked = !world.inventory.includes('key');
        ctx.fillStyle = isLocked ? '#ff3333' : '#ff6d9d';
        ctx.strokeStyle = isLocked ? '#ff9999' : '#ffd1df';
        ctx.lineWidth = 2;
        ctx.strokeRect(entity.x * cellWidth + 6, entity.y * cellHeight + 4, cellWidth - 12, cellHeight - 8);
        ctx.fillRect(entity.x * cellWidth + cellWidth / 2 - 3, entity.y * cellHeight + 10, 6, cellHeight - 20);
      } else if (entity.type === 'enemy') {
        ctx.fillStyle = '#ff4400';
        ctx.beginPath();
        ctx.moveTo(entity.x * cellWidth + cellWidth / 2, entity.y * cellHeight + 4);
        ctx.lineTo(entity.x * cellWidth + cellWidth - 4, entity.y * cellHeight + cellHeight - 4);
        ctx.lineTo(entity.x * cellWidth + 4, entity.y * cellHeight + cellHeight - 4);
        ctx.closePath();
        ctx.fill();
      } else if (entity.type === 'hazard') {
        ctx.fillStyle = '#ff765f';
        ctx.beginPath();
        ctx.moveTo(entity.x * cellWidth + cellWidth / 2, entity.y * cellHeight + 5);
        ctx.lineTo(entity.x * cellWidth + cellWidth - 6, entity.y * cellHeight + cellHeight - 6);
        ctx.lineTo(entity.x * cellWidth + 6, entity.y * cellHeight + cellHeight - 6);
        ctx.closePath();
        ctx.fill();
      }
    }

    ctx.strokeStyle = '#d6ffe9';
    ctx.strokeRect(0, 0, world.width, world.height);
  }
}
