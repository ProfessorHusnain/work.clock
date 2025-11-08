# World Clock

> Electron + Next.js desktop application for displaying world clocks across different timezones

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Desktop**: Electron 39 with TypeScript
- **Styling**: Tailwind CSS 4, shadcn/ui components
- **UI Components**: Button, Dialog, Input, Input Group, Item, Empty, Toggle Group, Label, Dropdown Menu from shadcn/ui
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

The app is configured to build production-ready installers for all platforms:

- **Windows**: NSIS installer (x64, ARM64), portable executable, zip archive
- **macOS**: DMG, PKG, and zip (Intel x64 and Apple Silicon ARM64)
- **Linux**: AppImage, DEB, RPM, Snap, and tar.gz (x64, ARM64)

Configuration is in `electron-builder.yaml`.

### Production Deployment

**📦 Ready to deploy?** 

→ **Start here: [PRODUCTION_DOCS_INDEX.md](PRODUCTION_DOCS_INDEX.md)** - Complete navigation guide

**Quick Links:**
- **[QUICK_PRODUCTION_GUIDE.md](QUICK_PRODUCTION_GUIDE.md)** - 5-minute quick start
- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** - Complete deployment guide
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Pre-release checklist
- **[ICON_CREATION_GUIDE.md](ICON_CREATION_GUIDE.md)** - Icon creation guide
- **[PRODUCTION_QUICK_REFERENCE.md](PRODUCTION_QUICK_REFERENCE.md)** - Command cheat sheet
- **[build/README.md](build/README.md)** - Build resources reference

#### Key Features

**Windows Installer:**
- Multi-language support (10+ languages)
- User-selectable install location
- Per-user or per-machine installation
- Desktop and Start Menu shortcuts
- Clean uninstallation with data removal
- Code signing ready

**macOS Installer:**
- Universal binaries (Intel + Apple Silicon)
- Beautiful DMG with custom background
- Notarization support
- Hardened runtime enabled
- Dark mode support

**Linux Packages:**
- Multiple formats (AppImage, DEB, RPM, Snap)
- Desktop integration
- System tray support
- Proper dependency management

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
