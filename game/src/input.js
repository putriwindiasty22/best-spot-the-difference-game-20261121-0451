// Twin Scenes — mouse and keyboard input. Clicks on either panel are mapped
// into scene coordinates and handed to the game; keys drive hint, restart and
// continue. A click also works on touch screens through pointer events.
import { W, H } from './scenes.js';

export function scenePoint(canvas, event) {
  const box = canvas.getBoundingClientRect();
  const x = ((event.clientX - box.left) / box.width) * W;
  const y = ((event.clientY - box.top) / box.height) * H;
  return { x, y };
}

export function wireInput({ left, right, hintBtn, game, onClick, onHint, onRestart, onContinue }) {
  const click = (canvas) => (event) => {
    event.preventDefault();
    const { x, y } = scenePoint(canvas, event);
    onClick(x, y);
  };
  left.addEventListener('pointerdown', click(left));
  right.addEventListener('pointerdown', click(right));
  hintBtn.addEventListener('click', onHint);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'h' || event.key === 'H') {
      event.preventDefault();
      onHint();
    } else if (event.key === 'r' || event.key === 'R') {
      onRestart();
    } else if (event.key === 'Enter') {
      onContinue();
    }
  });
}
