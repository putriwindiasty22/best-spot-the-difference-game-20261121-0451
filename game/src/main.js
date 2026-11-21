// Twin Scenes — bootstrap. Wires the game to the page: HUD, both canvases,
// input and the animation loop. With ?shot=cover|mid|late&seed=N it stages a
// frozen screenshot frame and sets window.__shotReady once it is drawn.
import { Game } from './game.js';
import { renderPanel, renderOverlay } from './render.js';
import { wireInput } from './input.js';
import { stageShot } from './shots.js';
import { hashSeed } from './rng.js';
import { LEVELS, W, H } from './scenes.js';

const $ = (id) => document.getElementById(id);
const left = $('left');
const right = $('right');
const lctx = left.getContext('2d');
const rctx = right.getContext('2d');

const game = new Game();
const params = new URLSearchParams(location.search);
const shotName = params.get('shot');
const seedText = params.get('seed') ?? '1';
const shotSeed = /^\d+$/.test(seedText) ? Number(seedText) : hashSeed(seedText);

const banner = $('banner');
const hintBtn = $('hintBtn');

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function refreshHud() {
  $('levelLabel').textContent = `${game.levelIndex + 1} / ${LEVELS.length}`;
  $('sceneLabel').textContent = game.level.name;
  $('remaining').textContent = String(game.remaining);
  $('timer').textContent = fmtTime(game.timeLeft);
  $('timer').classList.toggle('low', game.timeLeft <= 20 && game.screen === 'playing');
  $('score').textContent = String(game.score);
  hintBtn.disabled = game.screen !== 'playing';
  // Rebuild the level dots only when the level changes: refreshHud runs every
  // animation frame, and rewriting the dots each time would churn the DOM.
  if (refreshHud.lastLevel !== game.levelIndex) {
    refreshHud.lastLevel = game.levelIndex;
    $('levelDots').innerHTML = LEVELS.map((_, i) => `<span class="dot${i < game.levelIndex ? ' done' : ''}${i === game.levelIndex ? ' now' : ''}"></span>`).join('');
  }
}

function setBanner(text, kind) {
  banner.textContent = text;
  banner.className = kind ?? '';
}

game.onEvent = (type, detail) => {
  if (type === 'found') {
    setBanner(`Found it! ${detail.remaining} difference${detail.remaining === 1 ? '' : 's'} left — nice eyes!`, 'good');
  } else if (type === 'wrong') {
    setBanner(`Not quite — that costs 5 seconds. Look closer!`, 'bad');
  } else if (type === 'hint') {
    setBanner(`Hint: ${detail.text}. That cost 10 seconds.`, '');
  } else if (type === 'levelclear') {
    setBanner(`Scene complete! Press Enter for the next one.`, 'good');
  } else if (type === 'gameover') {
    setBanner(`Time's up! Press R to try this scene again.`, 'bad');
  } else if (type === 'victory') {
    setBanner(`You found every difference in every scene — champion spotter!`, 'good');
  }
  refreshHud();
};

wireInput({
  left,
  right,
  hintBtn,
  game,
  onClick: (x, y) => {
    game.click(x, y);
    refreshHud();
  },
  onHint: () => {
    game.useHint();
    refreshHud();
  },
  onRestart: () => {
    game.startLevel(game.levelIndex);
    setBanner('Scene restarted — find them all before time runs out!', '');
    refreshHud();
  },
  onContinue: () => {
    if (game.screen === 'title') {
      game.startGame();
      setBanner('Click a difference in either picture. Find them all before time runs out!');
    } else if (game.screen === 'levelclear' || game.screen === 'victory') {
      game.nextLevel();
      refreshHud();
    } else if (game.screen === 'gameover') {
      game.startLevel(game.levelIndex);
      refreshHud();
    }
  },
});

function frame(now) {
  game.tick(now);
  const changed = game.allDifferenceIds;
  renderPanel(lctx, game.level, new Set(), game, now);
  renderPanel(rctx, game.level, changed, game, now);
  if (game.screen === 'title') {
    renderOverlay(lctx, ['Twin Scenes', 'Find every difference', 'Click a picture, or press Enter'], '#b3541e');
    renderOverlay(rctx, ['Twin Scenes', 'Two pictures, a few changes', 'How sharp are your eyes?'], '#b3541e');
  } else if (game.screen === 'levelclear') {
    renderOverlay(lctx, ['Scene complete!', `Score: ${game.score}`, 'Press Enter for the next scene'], '#2e7d6b');
    renderOverlay(rctx, ['Scene complete!', `Score: ${game.score}`, 'Press Enter for the next scene'], '#2e7d6b');
  } else if (game.screen === 'victory') {
    renderOverlay(lctx, ['You win!', `Final score: ${game.score}`, 'Press Enter to play again'], '#2e7d6b');
    renderOverlay(rctx, ['You win!', `Final score: ${game.score}`, 'Press Enter to play again'], '#2e7d6b');
  } else if (game.screen === 'gameover') {
    renderOverlay(lctx, ["Time's up!", `Score: ${game.score}`, 'Press R to retry this scene'], '#c0392b');
    renderOverlay(rctx, ["Time's up!", `Score: ${game.score}`, 'Press R to retry this scene'], '#c0392b');
  }
  refreshHud();
  if (shotName && !window.__shotReady) window.__shotReady = true;
  requestAnimationFrame(frame);
}

if (shotName) {
  const staged = stageShot(game, shotName, shotSeed);
  setBanner(`Level ${game.levelIndex + 1}: ${game.level.name} — ${staged.remaining} differences left to find.`, '');
  refreshHud();
} else {
  setBanner('Click a difference in either picture. Find them all before time runs out!');
  refreshHud();
}

requestAnimationFrame(frame);
