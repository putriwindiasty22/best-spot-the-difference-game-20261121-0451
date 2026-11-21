// Twin Scenes — deterministic screenshot scenes for ?shot=cover|mid|late.
// Each scene plays the real game forward from a fresh level and marks some
// differences found, so the frame is a genuine mid-game state: two panels
// side by side, green markers on the found differences, several still
// unfound, and the remaining counter showing. The timer is frozen and the
// same seed always stages the same frame.
import { LEVELS } from './scenes.js';

const SHOTS = {
  cover: { level: 0, found: 3, secondsLeft: 92 },
  mid: { level: 1, found: 2, secondsLeft: 74 },
  oasis: { level: 2, found: 4, secondsLeft: 61 },
  late: { level: 3, found: 5, secondsLeft: 38 },
};

export function stageShot(game, name, seed) {
  const shot = SHOTS[name] ?? SHOTS.cover;
  const level = LEVELS[shot.level];
  game.startLevel(shot.level);
  game.frozen = true;
  game.timeLeft = shot.secondsLeft;
  // Mark the first N differences found, in level order, so the markers are
  // spread across the picture instead of clustered in one corner.
  const order = level.differences.map((d) => d.id);
  const step = Math.max(1, Math.floor(order.length / shot.found));
  const picked = [];
  for (let i = 0; i < shot.found && picked.length < order.length; i += 1) {
    picked.push(order[(i * step + (seed % 2)) % order.length]);
  }
  game.found = new Set(picked);
  game.screen = 'playing';
  return { level: level.name, found: picked.length, remaining: level.differences.length - picked.length };
}
