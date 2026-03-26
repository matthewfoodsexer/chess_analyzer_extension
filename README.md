# Chess Analyzer

Analyze chess.com games on Lichess with one click.

## How it works

1. Open any chess.com game page
2. Click the extension icon
3. Done — Lichess opens with the game loaded and analysis started

## Installation

```bash
npm install
npm run build
```

Then in Chrome:
1. Go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Development

```bash
npm run dev          # Watch mode
npm run build        # Production build
npm run type-check   # Type check
```

## Architecture

```
src/
├── manifest.ts              # Extension manifest
├── background/
│   └── service-worker.ts    # Icon click → fetch PGN → open Lichess
└── content/
    ├── lichess-paste.ts     # Auto-fill PGN
    └── lichess-analysis.ts  # Auto-start analysis
```

## Tech

- TypeScript + Vite + @crxjs/vite-plugin
- chess.js for UCI → PGN conversion

## License

MIT
