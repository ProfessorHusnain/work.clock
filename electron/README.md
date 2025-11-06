# Electron Backend

This directory contains the Electron main and preload processes written in TypeScript.

## Structure

- `main.ts` - Electron main process (window management, app lifecycle)
- `preload.ts` - Preload script for secure IPC communication

## Building

The TypeScript files are compiled to JavaScript in the `dist/electron/` directory.

```bash
npm run build:electron
```

## Development

The TypeScript compiler runs in watch mode during development:

```bash
npm run dev
```

