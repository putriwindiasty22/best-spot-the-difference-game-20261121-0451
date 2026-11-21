// Twin Scenes — the four hand-drawn scenes. Each scene draws itself twice: once
// plain (Picture A) and once with a set of "changed" difference ids applied
// (Picture B). Every difference has a fixed centre and radius used for clicks
// and markers, so the two panels always agree about where a difference is.
// Nothing here is copied from any existing game: all art is original canvas art.

export const W = 560;
export const H = 420;

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}
function triangle(ctx, x1, y1, x2, y2, x3, y3, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fill();
}
function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}
function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}
function cloud(ctx, x, y, s, white) {
  circle(ctx, x, y, 20 * s, white);
  circle(ctx, x + 18 * s, y + 4 * s, 15 * s, white);
  circle(ctx, x - 18 * s, y + 5 * s, 14 * s, white);
  circle(ctx, x + 4 * s, y - 10 * s, 14 * s, white);
}
function star(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? r : r * 0.45;
    ctx[i === 0 ? 'moveTo' : 'lineTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}
function pine(ctx, x, y, s, green) {
  triangle(ctx, x, y - 70 * s, x - 34 * s, y, x + 34 * s, y, green);
  triangle(ctx, x, y - 100 * s, x - 26 * s, y - 34 * s, x + 26 * s, y - 34 * s, green);
  rect(ctx, x - 6 * s, y, 12 * s, 16 * s, '#6b4a2f');
}
function bird(ctx, x, y, s) {
  ctx.strokeStyle = '#2e2a22';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

// ---------------------------------------------------------------------------
// Level 1 — Sunny Harbor. 6 differences, 120 seconds.
function drawHarbor(ctx, diffs) {
  sky(ctx, '#8ec9ee', '#d8f0ff');
  circle(ctx, 82, 72, 34, '#ffd94d');
  circle(ctx, 82, 72, 26, '#ffe98a');
  cloud(ctx, 300, 62, 1, '#ffffff');
  if (!diffs.has('cloud')) cloud(ctx, 190, 110, 0.7, '#ffffff');
  cloud(ctx, 470, 48, 0.8, '#ffffff');
  // Distant hills and sea.
  ellipse(ctx, 90, 250, 190, 46, '#7fb069');
  ellipse(ctx, 470, 252, 200, 52, '#6a9e58');
  rect(ctx, 0, 246, W, 174, '#2f7fb8');
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.moveTo(30 + i * 110, 285 + (i % 2) * 34);
    ctx.quadraticCurveTo(60 + i * 110, 278 + (i % 2) * 34, 90 + i * 110, 285 + (i % 2) * 34);
    ctx.stroke();
  }
  // Sailboat (sail colour changes).
  triangle(ctx, 150, 200, 150, 268, 196, 268, diffs.has('sail') ? '#2e6fb0' : '#d94f3d');
  triangle(ctx, 146, 214, 146, 268, 116, 268, '#f4ead8');
  rect(ctx, 148, 196, 4, 76, '#6b4a2f');
  ellipse(ctx, 156, 272, 52, 12, '#8a5a33');
  // Rowboat.
  ellipse(ctx, 330, 336, 44, 10, '#c98a3d');
  rect(ctx, 312, 322, 36, 8, '#a86f2c');
  // Buoy (vanishes in Picture B).
  if (!diffs.has('buoy')) {
    circle(ctx, 258, 352, 13, '#e85d3d');
    triangle(ctx, 258, 330, 250, 344, 266, 344, '#e85d3d');
    rect(ctx, 256, 322, 4, 10, '#2e2a22');
  }
  // A fish jumps out of the water in both pictures.
  ellipse(ctx, 205, 306, 16, 7, '#f2a541');
  triangle(ctx, 221, 306, 232, 300, 232, 312, '#f2a541');
  circle(ctx, 194, 304, 2, '#2e2a22');
  // Lighthouse on the right.
  rect(ctx, 424, 180, 52, 140, '#f4ead8');
  rect(ctx, 424, 200, 52, 18, '#d94f3d');
  rect(ctx, 424, 244, 52, 18, '#d94f3d');
  rect(ctx, 424, 288, 52, 18, '#f4ead8');
  rect(ctx, 418, 158, 64, 24, '#2e2a22');
  rect(ctx, 432, 146, 36, 14, '#ffd94d');
  rect(ctx, 448, 128, 4, 20, '#2e2a22');
  // Flag on the lighthouse (colour changes).
  triangle(ctx, 452, 128, 486, 136, 452, 144, diffs.has('flag') ? '#f2c230' : '#d94f3d');
  // Light beam (on in A, off in B).
  if (!diffs.has('beam')) {
    ctx.fillStyle = 'rgba(255, 233, 120, 0.5)';
    ctx.beginPath();
    ctx.moveTo(420, 168);
    ctx.lineTo(300, 120);
    ctx.lineTo(300, 205);
    ctx.closePath();
    ctx.fill();
  }
  // Birds (three in A, two in B).
  bird(ctx, 250, 90, 1);
  bird(ctx, 300, 70, 0.9);
  if (!diffs.has('bird')) bird(ctx, 350, 100, 1);
  rect(ctx, 0, 396, W, 24, '#e8d5a8');
}

const HARBOR = {
  name: 'Sunny Harbor',
  timeLimit: 120,
  draw: drawHarbor,
  differences: [
    { id: 'beam', x: 350, y: 162, r: 42, hint: 'The lighthouse beam' },
    { id: 'sail', x: 168, y: 236, r: 40, hint: 'The big sail' },
    { id: 'cloud', x: 190, y: 108, r: 34, hint: 'A small cloud' },
    { id: 'buoy', x: 258, y: 348, r: 26, hint: 'The red buoy' },
    { id: 'flag', x: 468, y: 136, r: 22, hint: 'The lighthouse flag' },
    { id: 'bird', x: 350, y: 100, r: 24, hint: 'A bird in the sky' },
  ],
};

// ---------------------------------------------------------------------------
// Level 2 — Forest Camp. 6 differences, 110 seconds.
function drawCamp(ctx, diffs) {
  sky(ctx, '#2b3a67', '#e88f5a');
  // Moon: full in A, crescent in B.
  circle(ctx, 480, 70, 30, '#f7ead0');
  if (diffs.has('moon')) circle(ctx, 492, 62, 26, '#2b3a67');
  star(ctx, 80, 60, 7, '#ffe98a');
  star(ctx, 170, 40, 5, '#ffe98a');
  star(ctx, 260, 80, 6, '#ffe98a');
  if (!diffs.has('star')) star(ctx, 350, 50, 6, '#ffe98a');
  star(ctx, 420, 110, 5, '#ffe98a');
  // Ground and pines.
  rect(ctx, 0, 300, W, 120, '#3d5a3a');
  pine(ctx, 70, 300, 1.1, '#2c4a2e');
  pine(ctx, 500, 300, 1.25, '#2c4a2e');
  if (!diffs.has('tree')) pine(ctx, 520, 306, 0.8, '#24402a');
  pine(ctx, 150, 308, 0.7, '#356030');
  // Tent.
  triangle(ctx, 200, 300, 290, 180, 380, 300, '#d94f3d');
  triangle(ctx, 290, 180, 330, 300, 380, 300, '#b23a2c');
  triangle(ctx, 290, 300, 290, 232, 316, 300, diffs.has('door') ? '#5a2d1e' : '#2e2a22');
  triangle(ctx, 290, 300, 290, 232, 264, 300, '#e88f5a');
  rect(ctx, 196, 298, 188, 6, '#8a2f24');
  // Campfire: tall flame in A, low flame in B.
  ellipse(ctx, 430, 330, 46, 12, '#6b4a2f');
  rect(ctx, 400, 318, 60, 9, '#8a5a33');
  rect(ctx, 405, 306, 50, 9, '#a86f2c');
  const flameH = diffs.has('flame') ? 26 : 52;
  ctx.fillStyle = '#f2701d';
  ctx.beginPath();
  ctx.moveTo(430, 306 - flameH);
  ctx.quadraticCurveTo(452, 290, 444, 306);
  ctx.quadraticCurveTo(430, 316, 416, 306);
  ctx.quadraticCurveTo(408, 290, 430, 306 - flameH);
  ctx.fill();
  circle(ctx, 430, 300, 10, '#ffd94d');
  // Backpack (vanishes in B).
  if (!diffs.has('pack')) {
    rect(ctx, 120, 300, 40, 34, '#2e6fb0');
    rect(ctx, 128, 288, 24, 14, '#2e6fb0');
    rect(ctx, 126, 310, 28, 5, '#f2c230');
  }
  // Lantern on a post (colour changes).
  rect(ctx, 520, 260, 6, 44, '#6b4a2f');
  rect(ctx, 512, 244, 22, 18, diffs.has('lantern') ? '#7fb069' : '#ffd94d');
  rect(ctx, 516, 240, 14, 5, '#2e2a22');
  // Marshmallow stick leaning on the tent.
  ctx.strokeStyle = '#6b4a2f';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(180, 336);
  ctx.lineTo(150, 286);
  ctx.stroke();
  circle(ctx, 148, 282, 7, '#fffaf0');
  circle(ctx, 156, 292, 7, '#fffaf0');
}

const CAMP = {
  name: 'Forest Camp',
  timeLimit: 110,
  draw: drawCamp,
  differences: [
    { id: 'moon', x: 480, y: 70, r: 34, hint: 'The moon' },
    { id: 'flame', x: 430, y: 276, r: 34, hint: 'The campfire flame' },
    { id: 'door', x: 290, y: 266, r: 30, hint: 'The tent door' },
    { id: 'star', x: 350, y: 50, r: 22, hint: 'A star in the sky' },
    { id: 'pack', x: 140, y: 312, r: 30, hint: 'The blue backpack' },
    { id: 'lantern', x: 523, y: 252, r: 24, hint: 'The lantern glow' },
  ],
};

// ---------------------------------------------------------------------------
// Level 3 — Desert Oasis. 7 differences, 100 seconds.
function drawOasis(ctx, diffs) {
  sky(ctx, '#ffcf7d', '#ffe9b8');
  circle(ctx, 470, 70, 36, '#ff9d2e');
  if (!diffs.has('rays')) {
    ctx.strokeStyle = '#ff9d2e';
    ctx.lineWidth = 5;
    for (let i = 0; i < 8; i += 1) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(470 + Math.cos(a) * 46, 70 + Math.sin(a) * 46);
      ctx.lineTo(470 + Math.cos(a) * 62, 70 + Math.sin(a) * 62);
      ctx.stroke();
    }
  }
  cloud(ctx, 140, 70, 0.9, '#fffaf0');
  bird(ctx, 240, 90, 1);
  if (!diffs.has('bird2')) bird(ctx, 300, 70, 0.9);
  // Dunes.
  ellipse(ctx, 120, 330, 260, 90, '#e8b25a');
  ellipse(ctx, 460, 350, 260, 100, '#d99a3d');
  rect(ctx, 0, 330, W, 90, '#e8b25a');
  // Pond.
  ellipse(ctx, 300, 360, 110, 26, '#3d9ec9');
  ellipse(ctx, 300, 358, 88, 18, diffs.has('pond') ? '#2f7fb8' : '#6ec2e8');
  // Palm tree.
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(330, 360);
  ctx.quadraticCurveTo(322, 280, 344, 226);
  ctx.stroke();
  ctx.strokeStyle = '#3d7a3a';
  ctx.lineWidth = 9;
  const fronds = [[300, 210], [330, 196], [368, 206], [386, 226], [312, 232]];
  for (const [fx, fy] of fronds) {
    ctx.beginPath();
    ctx.moveTo(344, 226);
    ctx.quadraticCurveTo((344 + fx) / 2, fy - 14, fx, fy);
    ctx.stroke();
  }
  // Coconuts: three in A, two in B.
  circle(ctx, 336, 232, 8, '#6b4a2f');
  circle(ctx, 352, 236, 8, '#6b4a2f');
  if (!diffs.has('coconut')) circle(ctx, 344, 244, 8, '#6b4a2f');
  // Cactus: two arms in A, one in B.
  rect(ctx, 110, 250, 26, 110, '#4e8a3f');
  circle(ctx, 123, 250, 13, '#4e8a3f');
  rect(ctx, 84, 280, 26, 12, '#4e8a3f');
  rect(ctx, 84, 280, 12, 40, '#4e8a3f');
  if (!diffs.has('cactus')) {
    rect(ctx, 136, 296, 26, 12, '#4e8a3f');
    rect(ctx, 150, 296, 12, 34, '#4e8a3f');
  }
  // Rocks.
  ellipse(ctx, 180, 372, 26, 12, '#9a8a72');
  if (!diffs.has('rock')) ellipse(ctx, 420, 378, 30, 13, '#9a8a72');
  // Little tent with a flag (flag colour changes).
  triangle(ctx, 470, 380, 510, 320, 550, 380, '#c98a3d');
  triangle(ctx, 510, 320, 530, 380, 550, 380, '#a86f2c');
  rect(ctx, 508, 296, 4, 26, '#6b4a2f');
  triangle(ctx, 512, 296, 536, 302, 512, 308, diffs.has('tentflag') ? '#2e6fb0' : '#d94f3d');
  // Snake in the sand (appears in B).
  if (diffs.has('snake')) {
    ctx.strokeStyle = '#7a9e3d';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(60, 392);
    ctx.quadraticCurveTo(80, 378, 100, 392);
    ctx.quadraticCurveTo(118, 404, 136, 390);
    ctx.stroke();
    circle(ctx, 58, 392, 6, '#7a9e3d');
  }
}

const OASIS = {
  name: 'Desert Oasis',
  timeLimit: 100,
  draw: drawOasis,
  differences: [
    { id: 'rays', x: 470, y: 70, r: 40, hint: 'The sun rays' },
    { id: 'cactus', x: 150, y: 310, r: 30, hint: 'The cactus arm' },
    { id: 'coconut', x: 344, y: 240, r: 22, hint: 'A coconut' },
    { id: 'pond', x: 300, y: 358, r: 40, hint: 'The pond' },
    { id: 'rock', x: 420, y: 378, r: 28, hint: 'A rock by the pond' },
    { id: 'tentflag', x: 524, y: 302, r: 22, hint: 'The tent flag' },
    { id: 'bird2', x: 300, y: 70, r: 24, hint: 'A bird in the sky' },
  ],
};

// ---------------------------------------------------------------------------
// Level 4 — Snowy Village. 8 differences, 90 seconds.
function drawVillage(ctx, diffs) {
  sky(ctx, '#1d2b4a', '#4a6a9e');
  circle(ctx, 480, 64, 28, '#f7ead0');
  circle(ctx, 472, 58, 24, '#e8dcc0');
  star(ctx, 90, 50, 6, '#ffe98a');
  star(ctx, 180, 90, 5, '#ffe98a');
  star(ctx, 280, 44, 6, '#ffe98a');
  if (!diffs.has('star2')) star(ctx, 360, 80, 6, '#ffe98a');
  star(ctx, 430, 130, 5, '#ffe98a');
  // Snow ground.
  rect(ctx, 0, 300, W, 120, '#eef4fb');
  ellipse(ctx, 100, 330, 120, 26, '#ffffff');
  ellipse(ctx, 460, 340, 130, 30, '#ffffff');
  // House 1 (left).
  rect(ctx, 60, 210, 130, 92, '#b3541e');
  triangle(ctx, 48, 212, 125, 150, 202, 212, '#7a3b2e');
  rect(ctx, 118, 168, 12, 34, '#5a2d1e');
  // Chimney smoke: present in A, gone in B.
  if (!diffs.has('smoke')) {
    circle(ctx, 124, 150, 12, 'rgba(255,255,255,0.85)');
    circle(ctx, 132, 130, 15, 'rgba(255,255,255,0.7)');
    circle(ctx, 142, 108, 18, 'rgba(255,255,255,0.55)');
  }
  // Windows: three lit in A, two in B.
  rect(ctx, 78, 236, 26, 26, '#ffd94d');
  rect(ctx, 146, 236, 26, 26, diffs.has('window') ? '#2e3a55' : '#ffd94d');
  rect(ctx, 112, 236, 26, 26, '#ffd94d');
  rect(ctx, 118, 272, 16, 30, '#5a2d1e');
  // Wreath on the door (present in A, gone in B).
  if (!diffs.has('wreath')) {
    circle(ctx, 126, 262, 12, '#3d7a3a');
    circle(ctx, 126, 262, 6, '#5a2d1e');
    circle(ctx, 126, 250, 3, '#d94f3d');
  }
  // House 2 (right).
  rect(ctx, 380, 230, 120, 72, '#2e6fb0');
  triangle(ctx, 370, 232, 440, 178, 510, 232, '#24406b');
  rect(ctx, 398, 252, 24, 24, '#ffd94d');
  rect(ctx, 458, 252, 24, 24, '#ffd94d');
  rect(ctx, 432, 272, 16, 30, '#5a2d1e');
  // Snowman.
  circle(ctx, 280, 340, 30, '#ffffff');
  circle(ctx, 280, 292, 22, '#ffffff');
  circle(ctx, 280, 256, 16, '#ffffff');
  circle(ctx, 274, 252, 2.5, '#2e2a22');
  circle(ctx, 286, 252, 2.5, '#2e2a22');
  triangle(ctx, 280, 258, 296, 262, 280, 265, '#e8702e');
  rect(ctx, 266, 232, 28, 8, diffs.has('hat') ? '#2e6fb0' : '#2e2a22');
  rect(ctx, 270, 216, 20, 18, diffs.has('hat') ? '#2e6fb0' : '#2e2a22');
  circle(ctx, 280, 292, 3, '#2e2a22');
  circle(ctx, 280, 308, 3, '#2e2a22');
  // Pines with snow.
  pine(ctx, 40, 302, 0.9, '#2c4a2e');
  if (!diffs.has('tree2')) pine(ctx, 530, 302, 0.85, '#2c4a2e');
  triangle(ctx, 40, 214, 18, 248, 62, 248, '#eef4fb');
  // Sled (present in A, gone in B).
  if (!diffs.has('sled')) {
    rect(ctx, 330, 372, 60, 8, '#b3541e');
    rect(ctx, 336, 380, 6, 8, '#5a2d1e');
    rect(ctx, 378, 380, 6, 8, '#5a2d1e');
    ctx.strokeStyle = '#5a2d1e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(330, 372);
    ctx.lineTo(318, 358);
    ctx.stroke();
  }
  // Falling snowflakes.
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  for (const [fx, fy, fr] of [[60, 120, 3], [150, 60, 2.5], [240, 140, 3], [330, 60, 2.5], [410, 100, 3], [520, 150, 2.5], [500, 40, 3]]) {
    ctx.beginPath();
    ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    ctx.fill();
  }
}

const VILLAGE = {
  name: 'Snowy Village',
  timeLimit: 90,
  draw: drawVillage,
  differences: [
    { id: 'smoke', x: 134, y: 130, r: 34, hint: 'Chimney smoke' },
    { id: 'hat', x: 280, y: 226, r: 24, hint: "The snowman's hat" },
    { id: 'window', x: 159, y: 249, r: 24, hint: 'A lit window' },
    { id: 'star2', x: 360, y: 80, r: 22, hint: 'A star in the sky' },
    { id: 'tree2', x: 530, y: 268, r: 30, hint: 'A pine tree' },
    { id: 'sled', x: 356, y: 374, r: 30, hint: 'The red sled' },
    { id: 'wreath', x: 126, y: 258, r: 22, hint: 'The wreath on the door' },
  ],
};

export const LEVELS = [HARBOR, CAMP, OASIS, VILLAGE];
