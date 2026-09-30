import type { Direction, WorldState, Entity } from './contracts.js';
import { DeterministicRng } from './rng.js';

export const GRID_WIDTH = 16;
export const GRID_HEIGHT = 12;
export const MAX_HEALTH = 3;
const START = { x: 2, y: 2 };
const GATE = { x: 14, y: 10 };

function createWalls(rng: DeterministicRng): boolean[][] {
  const walls: boolean[][] = [];
  for (let y = 0; y < GRID_HEIGHT; y += 1) {
    walls[y] = [];
    for (let x = 0; x < GRID_WIDTH; x += 1) {
      walls[y][x] = rng.int(0, 100) < 25;
    }
  }

  // Carve a dependable route so every generated seed remains beatable.
  for (let x = START.x; x <= GATE.x; x += 1) {
    walls[START.y][x] = false;
  }
  for (let y = START.y; y <= GATE.y; y += 1) {
    walls[y][GATE.x] = false;
  }
  walls[START.y][START.x] = false;
  walls[GATE.y][GATE.x] = false;
  return walls;
}

function pathPositions(): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];
  for (let x = START.x + 2; x < GATE.x; x += 1) {
    positions.push({ x, y: START.y });
  }
  for (let y = START.y + 1; y < GATE.y; y += 1) {
    positions.push({ x: GATE.x, y });
  }
  return positions;
}

function takePathPosition(
  rng: DeterministicRng,
  available: Array<{ x: number; y: number }>,
  predicate: (position: { x: number; y: number }) => boolean = () => true,
): { x: number; y: number } {
  const candidates = available
    .map((position, index) => ({ position, index }))
    .filter(({ position }) => predicate(position));
  const selected = candidates[rng.int(0, candidates.length - 1)];
  const index = available.indexOf(selected.position);
  available.splice(index, 1);
  return selected.position;
}

export function createWorld(seed = 1, score = 0, inventory: string[] = [], health = MAX_HEALTH): WorldState {
  const rng = new DeterministicRng(seed);
  const walls = createWalls(rng);
  const available = pathPositions();
  const key = takePathPosition(rng, available);
  const relicOne = takePathPosition(rng, available);
  const relicTwo = takePathPosition(rng, available);
  const hazard = takePathPosition(rng, available);
  const safeEnemySpawn = (position: { x: number; y: number }) => position.x >= 7 || position.y > START.y + 1;
  const enemyOne = takePathPosition(rng, available, safeEnemySpawn);
  const enemyTwo = takePathPosition(rng, available, safeEnemySpawn);

  const entities: Entity[] = [
    { id: 'gate-1', type: 'gate', x: GATE.x, y: GATE.y, collected: false },
    { id: 'key-1', type: 'key', x: key.x, y: key.y, collected: false },
    { id: 'relic-1', type: 'relic', x: relicOne.x, y: relicOne.y, collected: false },
    { id: 'relic-2', type: 'relic', x: relicTwo.x, y: relicTwo.y, collected: false },
    { id: 'hazard-1', type: 'hazard', x: hazard.x, y: hazard.y, collected: false },
    { id: 'enemy-1', type: 'enemy', x: enemyOne.x, y: enemyOne.y, collected: false },
    { id: 'enemy-2', type: 'enemy', x: enemyTwo.x, y: enemyTwo.y, collected: false },
  ];

  for (let i = 0; i < 6; i++) {
    const coin = takePathPosition(rng, available);
    entities.push({ id: `coin-${i}`, type: 'coin', x: coin.x, y: coin.y, collected: false });
  }

  return {
    seed,
    tick: 0,
    width: 640,
    height: 480,
    gridWidth: GRID_WIDTH,
    gridHeight: GRID_HEIGHT,
    player: { ...START },
    entities,
    walls,
    inventory,
    score,
    health,
    maxHealth: MAX_HEALTH,
    relicsFound: 0,
    questCompleted: false,
    gameOver: false,
    log: [`Realm ${seed} entrance opens. A clear route leads east.`],
  };
}

export function movePlayer(world: WorldState, direction: Direction): WorldState {
  if (world.questCompleted || world.gameOver) {
    return world;
  }

  const delta = {
    north: { x: 0, y: -1 },
    south: { x: 0, y: 1 },
    east: { x: 1, y: 0 },
    west: { x: -1, y: 0 },
  }[direction];

  let nextX = Math.max(0, Math.min(world.gridWidth - 1, world.player.x + delta.x));
  let nextY = Math.max(0, Math.min(world.gridHeight - 1, world.player.y + delta.y));

  if (world.walls[nextY][nextX]) {
    nextX = world.player.x;
    nextY = world.player.y;
  }

  // Check gate lock before consuming a turn.
  const gate = world.entities.find(e => e.type === 'gate' && e.x === nextX && e.y === nextY);
  if (gate && !world.inventory.includes('key')) {
    nextX = world.player.x;
    nextY = world.player.y;
    world.log = ['The gate is locked! Find a key.'].concat(world.log).slice(0, 4);
    return world;
  }

  world.player.x = nextX;
  world.player.y = nextY;
  world.tick += 1;

  let newLogs = [`Realm signal: ${direction} tick ${world.tick}`];

  for (const entity of world.entities) {
    if (!entity.collected && entity.x === nextX && entity.y === nextY) {
      if (entity.type === 'coin') {
        entity.collected = true;
        world.score += 10;
        newLogs.unshift('You found a coin!');
      } else if (entity.type === 'key') {
        entity.collected = true;
        world.inventory.push('key');
        newLogs.unshift('You found a Key! The gate is unlocked.');
      } else if (entity.type === 'relic') {
        entity.collected = true;
        world.score += 25;
        world.relicsFound += 1;
        newLogs.unshift(`Ancient relic recovered (${world.relicsFound}/2).`);
      } else if (entity.type === 'hazard') {
        world.health = Math.max(0, world.health - 1);
        newLogs.unshift(`The realm bites back. Health ${world.health}/${world.maxHealth}.`);
        if (world.health === 0) {
          world.gameOver = true;
          newLogs.unshift('The realm claimed you. Restart to try again.');
        }
      } else if (entity.type === 'gate') {
        newLogs.unshift('You passed through the gate!');
        // Generate new level and return entirely new world state!
        return createWorld(world.seed + 1, world.score, [], world.health);
      }
    }
  }

  // Move enemies
  for (const entity of world.entities) {
    if (entity.type === 'enemy' && !entity.collected) {
      // Move at half speed (every other tick) to be less aggressive
      if (world.tick % 2 === 0) {
        let ex = entity.x;
        let ey = entity.y;
        
        // Only chase the player if they are relatively close (within 6 tiles)
        if (Math.abs(world.player.x - ex) + Math.abs(world.player.y - ey) <= 6) {
          if (Math.abs(world.player.x - ex) > Math.abs(world.player.y - ey)) {
            ex += world.player.x > ex ? 1 : -1;
          } else {
            ey += world.player.y > ey ? 1 : -1;
          }
        }
        
        if (!world.walls[ey][ex]) {
          entity.x = ex;
          entity.y = ey;
        }
      }

      if (entity.x === world.player.x && entity.y === world.player.y) {
        world.health = Math.max(0, world.health - 1);
        newLogs.unshift(`An enemy struck you! Health ${world.health}/${world.maxHealth}.`);
        if (world.health === 0) {
          world.gameOver = true;
          newLogs.unshift('The realm claimed you. Restart to try again.');
        }
      }
    }
  }

  world.log = newLogs.concat(world.log).slice(0, 4);

  return world;
}

export function stepWorld(world: WorldState, direction: Direction): WorldState {
  return movePlayer(world, direction);
}
