// Twin Scenes — game state and rules. One level at a time: find every
// difference before the timer runs out. A wrong click costs 5 seconds, a hint
// costs 10 seconds and points at an unfound difference for a moment.
import { LEVELS } from './scenes.js';

export const WRONG_CLICK_PENALTY = 5;
export const HINT_COST = 10;
export const POINTS_PER_FIND = 100;

export class Game {
  constructor() {
    this.levelIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.found = new Set();
    this.wrongFlashes = [];
    this.hint = null;
    this.timeLeft = LEVELS[0].timeLimit;
    this.screen = 'title';
    this.frozen = false;
    this.lastTick = 0;
    this.onEvent = null;
  }

  get level() {
    return LEVELS[this.levelIndex];
  }

  get totalDifferences() {
    return this.level.differences.length;
  }

  get remaining() {
    return this.totalDifferences - this.found.size;
  }

  get allDifferenceIds() {
    return new Set(this.level.differences.map((d) => d.id));
  }

  startLevel(index) {
    this.levelIndex = index;
    this.found = new Set();
    this.wrongFlashes = [];
    this.hint = null;
    this.timeLeft = this.level.timeLimit;
    this.screen = 'playing';
    this.lastTick = performance.now();
    this.emit('level', { level: this.levelIndex, name: this.level.name });
  }

  startGame() {
    this.score = 0;
    this.startLevel(0);
  }

  tick(now) {
    if (this.screen !== 'playing' || this.frozen) return;
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.hint) {
      this.hint.left -= dt;
      if (this.hint.left <= 0) this.hint = null;
    }
    this.wrongFlashes = this.wrongFlashes.filter((f) => now - f.at < 700);
    if (this.timeLeft <= 0) {
      this.screen = 'gameover';
      this.emit('gameover', { score: this.score, level: this.levelIndex });
    }
  }

  // A click at scene coordinates (x, y) on either panel. Returns what happened.
  click(x, y) {
    if (this.screen !== 'playing' || this.frozen) return { kind: 'ignored' };
    for (const d of this.level.differences) {
      if (this.found.has(d.id)) continue;
      const dx = x - d.x;
      const dy = y - d.y;
      if (dx * dx + dy * dy <= d.r * d.r) {
        this.found.add(d.id);
        this.streak += 1;
        const bonus = Math.ceil(this.timeLeft);
        // A streak of finds without a miss earns a small bonus per step.
        this.score += POINTS_PER_FIND + bonus + (this.streak - 1) * 10;
        if (this.remaining === 0) {
          this.screen = 'levelclear';
          this.emit('levelclear', { level: this.levelIndex, score: this.score });
        } else {
          this.emit('found', { id: d.id, remaining: this.remaining, score: this.score });
        }
        return { kind: 'found', id: d.id, remaining: this.remaining };
      }
    }
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_PENALTY);
    this.streak = 0;
    this.wrongFlashes.push({ x, y, at: performance.now() });
    this.emit('wrong', { remaining: this.remaining, timeLeft: this.timeLeft });
    return { kind: 'wrong', timeLeft: this.timeLeft };
  }

  useHint() {
    if (this.screen !== 'playing' || this.frozen) return null;
    const left = this.level.differences.filter((d) => !this.found.has(d.id));
    if (left.length === 0) return null;
    const pick = left[Math.floor(Math.random() * left.length)];
    this.timeLeft = Math.max(0, this.timeLeft - HINT_COST);
    this.hint = { id: pick.id, x: pick.x, y: pick.y, r: pick.r, left: 2.5, text: pick.hint };
    this.emit('hint', { id: pick.id, text: pick.hint });
    return this.hint;
  }

  nextLevel() {
    if (this.screen !== 'levelclear') return false;
    if (this.levelIndex + 1 >= LEVELS.length) {
      this.screen = 'victory';
      this.emit('victory', { score: this.score });
      return true;
    }
    this.startLevel(this.levelIndex + 1);
    return true;
  }

  emit(type, detail) {
    if (typeof this.onEvent === 'function') this.onEvent(type, detail);
  }
}
