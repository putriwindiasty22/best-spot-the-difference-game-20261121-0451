// Twin Scenes — canvas rendering. Draws both panels from the same scene
// definition (plain on the left, changed on the right), then the found
// markers, the hint ring and wrong-click crosses on top of both.
import { W, H } from './scenes.js';

export function renderPanel(ctx, scene, changed, game, now) {
  ctx.clearRect(0, 0, W, H);
  scene.draw(ctx, changed);
  // Found differences: a green ring with a check on both panels. A white
  // halo under the ring keeps the mark readable over any background.
  for (const d of scene.differences) {
    if (!game.found.has(d.id)) continue;
    ctx.strokeStyle = 'rgba(255, 250, 240, 0.9)';
    ctx.lineWidth = 9;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#1f9d63';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(d.x, d.y, d.r + 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#1f9d63';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(d.x - 11, d.y);
    ctx.lineTo(d.x - 3, d.y + 8);
    ctx.lineTo(d.x + 12, d.y - 8);
    ctx.stroke();
  }
  // Hint: a pulsing amber ring around one unfound difference.
  if (game.hint) {
    const pulse = 1 + 0.12 * Math.sin(now / 130);
    ctx.strokeStyle = '#f2a541';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 7]);
    ctx.beginPath();
    ctx.arc(game.hint.x, game.hint.y, (game.hint.r + 8) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Wrong clicks: a fading red cross where the player missed.
  for (const f of game.wrongFlashes) {
    const age = now - f.at;
    const alpha = Math.max(0, 1 - age / 700);
    ctx.strokeStyle = `rgba(201, 39, 39, ${alpha})`;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    const s = 12;
    ctx.beginPath();
    ctx.moveTo(f.x - s, f.y - s);
    ctx.lineTo(f.x + s, f.y + s);
    ctx.moveTo(f.x + s, f.y - s);
    ctx.lineTo(f.x - s, f.y + s);
    ctx.stroke();
  }
}

// A dim overlay with a centred message card, for title / clear / over screens.
export function renderOverlay(ctx, lines, accent) {
  ctx.fillStyle = 'rgba(20, 18, 14, 0.55)';
  ctx.fillRect(0, 0, W, H);
  const cardW = 400;
  const cardH = 44 + lines.length * 34;
  const x = (W - cardW) / 2;
  const y = (H - cardH) / 2;
  ctx.fillStyle = '#fffaf0';
  ctx.strokeStyle = accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(x, y, cardW, cardH, 14);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2e2a22';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  lines.forEach((line, i) => {
    ctx.font = i === 0 ? '900 26px "Trebuchet MS", sans-serif' : '700 17px "Trebuchet MS", sans-serif';
    ctx.fillText(line, W / 2, y + 34 + i * 34);
  });
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}
