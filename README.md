# Crypto Payment Solutions

Single-page bilingual (中文 / English) presentation for crypto payment adoption-friction analysis.

## Features

- Preserves original analysis content and page structure.
- Same-page language switch (top-right `中文` / `EN`).
- Tabs for overview, friction, wallet vs card, fee myth, and verdict.
- Built with React + Vite for easy Vercel hosting.

## Local Development

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (default: `http://localhost:5173`).

## Build

```bash
npm run build
```

Build output will be generated in `dist/`.

## Lint

```bash
npm run lint
```

## Deploy to Vercel

1. Push this project to GitHub.
2. In Vercel, create a new project from the repository.
3. Framework preset: **Vite** (auto-detected in most cases).
4. Build command: `npm run build`
5. Output directory: `dist`

## Project Structure

- `payment_comparison.jsx`: main business presentation component (all domain content).
- `main.jsx`: app entry.
- `index.html`: Vite host page.
