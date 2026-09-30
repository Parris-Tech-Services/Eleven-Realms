import { describe, expect, it } from 'vitest';
import { createWorld, movePlayer, stepWorld } from '../src/core/world.js';

describe('world contract', () => {
  it('creates a deterministic baseline world', () => {
    const world = createWorld(1);
    expect(world.seed).toBe(1);
    expect(world.tick).toBe(0);
    expect(world.gridWidth).toBe(16);
    expect(world.gridHeight).toBe(12);
    expect(world.player).toEqual({ x: 2, y: 2 });
  });

  it('moves the player and increments the tick deterministically', () => {
    const world = createWorld(1);
    const next = stepWorld(world, 'east');
    expect(next.player).toEqual({ x: 3, y: 2 });
    expect(next.tick).toBe(1);
    expect(next.log[0]).toContain('east');
  });

  it('clips movement to the grid boundary', () => {
    const world = createWorld(1);
    world.player = { x: 15, y: 11 };
    const next = movePlayer(world, 'east');
    expect(next.player).toEqual({ x: 15, y: 11 });
  });

  it('generates deterministic walkable content and a reachable gate route', () => {
    const first = createWorld(42);
    const second = createWorld(42);

    expect(first.walls).toEqual(second.walls);
    expect(first.entities).toEqual(second.entities);
    expect(first.entities.every((entity) => !first.walls[entity.y][entity.x])).toBe(true);

    const visited = new Set(['2,2']);
    const queue = [{ x: 2, y: 2 }];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) continue;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const x = current.x + dx;
        const y = current.y + dy;
        const key = `${x},${y}`;
        if (x >= 0 && x < first.gridWidth && y >= 0 && y < first.gridHeight && !first.walls[y][x] && !visited.has(key)) {
          visited.add(key);
          queue.push({ x, y });
        }
      }
    }

    expect(visited.has('14,10')).toBe(true);
  });

  it('does not spend a turn when a locked gate blocks movement', () => {
    const world = createWorld(1);
    world.player = { x: 13, y: 10 };
    const next = stepWorld(world, 'east');

    expect(next.player).toEqual({ x: 13, y: 10 });
    expect(next.tick).toBe(0);
    expect(next.log[0]).toContain('locked');
  });
});
