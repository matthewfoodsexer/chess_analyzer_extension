# Chess Analyzer

Chrome extension to analyze chess.com games on Lichess.

## What it does

Click the extension icon on any chess.com game page to automatically:
1. Extract the PGN from the game
2. Open Lichess paste page
3. Auto-fill the PGN
4. Click "Request a Computer Analysis"

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run build
   ```
4. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## Development

```bash
npm run dev    # Watch mode with hot reload
npm run build  # Production build
npm run type-check  # TypeScript check
```

## Project Structure

```
src/
├── manifest.ts           # Chrome extension manifest
├── background/
│   └── service-worker.ts # Handles icon click, fetches PGN from chess.com
└── content/
    ├── lichess-paste.ts  # Auto-fills PGN on paste page
    └── lichess-analysis.ts # Auto-clicks analysis button
```

## Tech Stack

- TypeScript
- Vite
- @crxjs/vite-plugin
- chess.js

## License

MIT
