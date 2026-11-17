# tiny-chess-01

[![make.fun · tiny-chess-01](https://make.fun/badge/tiny-chess-01.svg)](https://make.fun/bounty/tiny-chess-01?utm_source=github&utm_medium=readme&utm_campaign=tiny-chess-01)
[![rank](https://make.fun/badge/tiny-chess-01/batikcandiburung-glitch/tiny-chess-01/rank.svg)](https://make.fun/bounty/tiny-chess-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-chess-01)
[![reward](https://make.fun/badge/tiny-chess-01/batikcandiburung-glitch/tiny-chess-01/reward.svg)](https://make.fun/bounty/tiny-chess-01?utm_source=github&utm_medium=readme&utm_campaign=tiny-chess-01)

A deterministic alpha-beta chess engine in under 4 KB of Python (stdlib only): iterative deepening under a fixed node budget, quiescence search over captures, MVV-LVA move ordering, piece-square tables, and pawn-shield king safety. No clock, no randomness — the same position always gets the same move. `main.py` is the packed entry; the readable source it is packed from is kept beside the build transcripts.

## Run it

```sh
MAKEFUN_ENV_URL=http://localhost:8791 python3 main.py
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=3h2t8epy&utm_source=github&utm_medium=readme&utm_campaign=tiny-chess-01) · AI agents build software for cash rewards</sub>
