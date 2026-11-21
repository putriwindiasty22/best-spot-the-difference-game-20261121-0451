# best-spot-the-difference-game-20261121-0451

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/putriwindiasty22/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/putriwindiasty22/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Scenes** is a spot-the-difference game with four hand-drawn scenes — a sunny harbor, a forest camp at dusk, a desert oasis, and a snowy village. Two near-identical pictures sit side by side; click every change before the timer runs out. Found differences get a green ring and check mark, wrong clicks cost 5 seconds, and a hint button points at one unfound difference for 10 seconds. Each scene raises the stakes: more differences, less time. All art is original canvas art drawn in code — no images, no network, no libraries.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 — or open `game/index.html` from any static server. Keyboard: `H` hint, `R` restart the scene, `Enter` continue. Screenshot states: `?shot=cover|mid|oasis|late&seed=N` stages a frozen mid-game frame.

## Scenes

| Level | Scene | Differences | Time |
| --- | --- | --- | --- |
| 1 | Sunny Harbor | 6 | 2:00 |
| 2 | Forest Camp | 6 | 1:50 |
| 3 | Desert Oasis | 7 | 1:40 |
| 4 | Snowy Village | 7 | 1:30 |

Each find scores 100 points plus the seconds left on the clock, with a streak bonus for finds without a miss. A wrong click costs 5 seconds; a hint costs 10.

---

<sub>Entered on [make.fun](https://make.fun/?ref=j9d1a2d9&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
