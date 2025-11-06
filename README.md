# World Clock

> Electron + Next.js desktop application for displaying world clocks across different timezones

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Desktop**: Electron 39 with TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **Theme**: next-themes with light/dark mode support

## Features

### 🕐 Analog Clocks
- Beautiful analog clocks with real-time updates
- Three size options: Extra Small, Small, and Large
- Dynamic responsive grid layout

### 🌍 Timezone Management
- Add unlimited timezones to track
- Search from a comprehensive database of world timezones
- Download additional timezones on-demand from public API
- Real-time UTC offset calculation
- Automatic DST (Daylight Saving Time) detection and indicator

### 🎨 Appearance
- Dark mode / Light mode support
- Smooth animations and transitions
- Hover effects and interactive UI
- Modern shadcn/ui components

### 💾 Data Persistence
- Context-aware storage (localStorage for web, Electron IPC for desktop)
- Automatic saving of preferences (clock size, selected timezones, custom labels, label visibility)
- Offline-first architecture

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd world.clock

# Install dependencies
npm install
```

### Development

Run the development server with hot reload for both Next.js and Electron:

```bash
npm run dev
```

This will:
1. Compile Electron TypeScript files (with watch mode)
2. Start Next.js dev server at `http://localhost:3000`
3. Launch Electron app with DevTools

### Building

Build the application for distribution:

```bash
# Clean previous builds
npm run prebuild

# Build both frontend and electron
npm run build

# Create distribution packages
npm run dist              # All platforms
npm run dist:win          # Windows only
npm run dist:mac          # macOS only
npm run dist:linux        # Linux only
```

### Available Scripts

- `npm run dev` - Start development environment
- `npm run build` - Build frontend and electron backend
- `npm run build:electron` - Compile TypeScript electron files
- `npm run build:frontend` - Build Next.js static export
- `npm run prebuild` - Clean build directories
- `npm run clean` - Deep clean (including node_modules cache)
- `npm run dist` - Build and package for all platforms
- `npm run lint` - Run ESLint

## Project Structure

```
world.clock/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── header.tsx        # App header
│   ├── mode-toggle.tsx   # Theme switcher
│   ├── providers/        # Context providers
│   └── ui/               # shadcn/ui components
├── electron/             # Electron TypeScript source
│   ├── main.ts          # Main process
│   └── preload.ts       # Preload script
├── dist/                # Compiled electron files
├── out/                 # Next.js static export
├── public/              # Static assets
├── lib/                 # Utility functions
├── electron-builder.yaml # Electron builder config
├── tsconfig.json        # Next.js TypeScript config
└── tsconfig.electron.json # Electron TypeScript config
```

## Configuration

### Electron Builder

The app is configured to build for:
- **Windows**: NSIS installer (interactive), portable, and zip
- **macOS**: DMG and zip (x64 and Apple Silicon)
- **Linux**: AppImage, deb, and tar.gz

Configuration is in `electron-builder.yaml`.

#### Windows Installer Features

The NSIS installer provides users with installation choices:
- ✅ Choose installation location
- ✅ Choose per-user or per-machine installation
- ✅ Creates desktop shortcut (can be removed manually)
- ✅ Always creates Start Menu shortcut
- ✅ Option to launch app after installation
- ✅ Multi-language support
- ✅ Shows license agreement

See `INSTALLER-GUIDE.md` for detailed configuration options.

### TypeScript

Two separate TypeScript configurations:
- `tsconfig.json` - Next.js frontend (module: esnext, jsx: react-jsx)
- `tsconfig.electron.json` - Electron backend (module: commonjs, target: ES2020)

## References

Inspired by best practices from:
- [electronjs-with-nextjs](https://github.com/saulotarsobc/electronjs-with-nextjs)
- [sc-electron-boilerplate](https://github.com/saulotarsobc/sc-electron-boilerplate)

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [shadcn/ui](https://ui.shadcn.com/)

## License

MIT
