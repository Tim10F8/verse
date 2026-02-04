# Verse

> What comes after the Chorus in a song

A modern, fast, and beautiful web interface for Kodi - the successor to Chorus2.

[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](LICENSE)
[![Status: Active Development](https://img.shields.io/badge/Status-Active%20Development-orange)](PROJECT_PLAN.md)

---

## Overview

**Verse** is a complete reimagining of the Kodi web interface, built from the ground up with modern web technologies. With the resurgence of Kodi via CoreELEC and renewed enthusiast interest, Verse provides a web UI that matches contemporary expectations while honoring the spirit of Chorus2.

### Key Features (Planned)

- 🎵 **Complete Media Library** - Browse music, movies, TV shows, and live TV
- 🎮 **Dual Player Mode** - Control Kodi remotely or stream directly in your browser
- 🚀 **Blazing Fast** - Built with Vite and optimized for performance
- 📱 **Progressive Web App** - Install on any device, works offline
- 🎨 **Modern Design** - Clean, accessible interface with dark mode by default
- ⌨️ **Keyboard Shortcuts** - Power user features built-in
- 🌍 **Multilingual** - Support for 80+ languages
- ♿ **Accessible** - WCAG AA compliant

---

## Why Verse?

Chorus2 has served the Kodi community well, but its technology stack (CoffeeScript, Backbone, Marionette) makes it increasingly difficult to maintain and enhance. Verse addresses this by:

- **Modern Stack**: React 18, TypeScript, Vite - technologies that attract contributors
- **Type Safety**: Full TypeScript implementation prevents bugs and improves maintainability
- **Better Performance**: Virtual scrolling, code splitting, and optimized caching
- **Mobile First**: Responsive design that works beautifully on all devices
- **Developer Experience**: Hot reload, modern tooling, clear architecture

---

## Technology Stack

### Core
- **Framework**: [React 18](https://react.dev) with [TypeScript](https://www.typescriptlang.org)
- **Build Tool**: [Vite](https://vitejs.dev) - Lightning-fast HMR
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS
- **Components**: [shadcn/ui](https://ui.shadcn.com) - Accessible, customizable components

### State & Data
- **API Layer**: [TanStack Query](https://tanstack.com/query) - Powerful data synchronization
- **Client State**: [Zustand](https://zustand-demo.pmnd.rs) - Simple, scalable state management
- **Real-time**: Native WebSocket with automatic reconnection

### Additional
- **Routing**: [TanStack Router](https://tanstack.com/router) - Type-safe routing
- **Forms**: [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)
- **i18n**: [i18next](https://www.i18next.com) - Internationalization
- **Testing**: [Vitest](https://vitest.dev) + [Testing Library](https://testing-library.com)
- **Icons**: [Lucide React](https://lucide.dev)

---

## Project Status

🚧 **Currently in active development** - Phase 0 (Foundation)

Verse is being built incrementally following a [detailed project plan](PROJECT_PLAN.md):

- ✅ **Phase 0**: Foundation & Infrastructure (In Progress)
- ⏳ **Phase 1**: Music Library (Coming Soon)
- ⏳ **Phase 2**: Player & Playback
- ⏳ **Phase 3**: Movies & TV Shows
- ... and [9 more phases](PROJECT_PLAN.md#implementation-phases)

**Estimated Timeline**: MVP in 4-6 months, feature parity in 8-12 months

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ and npm
- A running [Kodi](https://kodi.tv) instance with:
  - HTTP control enabled
  - Username and password configured (recommended)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/xbmc/chorus2.git
cd chorus2

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Building for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

### Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## Documentation

- 📋 [Project Plan](PROJECT_PLAN.md) - Comprehensive development roadmap
- 🏗️ [Architecture](docs/ARCHITECTURE.md) - Technical design decisions
- 🎨 [Design System](docs/DESIGN_SYSTEM.md) - UI/UX guidelines
- 🔌 [API Integration](docs/API.md) - Kodi JSON-RPC implementation
- 🤝 [Contributing](CONTRIBUTING.md) - How to contribute

---

## Contributing

We welcome contributions! Verse is being built in the open and we'd love your help.

### Ways to Contribute

- 🐛 **Report bugs** - Found an issue? [Open a bug report](../../issues/new?template=bug_report.md)
- 💡 **Suggest features** - Have an idea? [Start a discussion](../../discussions)
- 🔧 **Submit PRs** - Fix bugs or implement features
- 📖 **Improve docs** - Help make our documentation better
- 🌍 **Translate** - Help translate Verse to your language
- 🎨 **Design** - UI/UX improvements and design work

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Commit with clear messages (`git commit -m 'Add amazing feature'`)
6. Push to your fork (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- TypeScript with strict mode enabled
- ESLint + Prettier for code formatting
- Follow React best practices and hooks guidelines
- Write tests for new features
- Keep accessibility in mind (WCAG AA)

---

## Roadmap

### Phase 0: Foundation (Weeks 1-2) - **IN PROGRESS**
- ✅ Project structure and tooling setup
- ⏳ JSON-RPC client implementation
- ⏳ Basic layout and routing
- ⏳ Connection management

### Phase 1: Music Library (Weeks 3-5)
- Artists, albums, and songs browsing
- Search and filtering
- Virtual scrolling for large libraries

### Phase 2: Player & Playback (Weeks 6-7)
- Dual player mode (Kodi + Local)
- Playback controls
- Real-time status updates

### Coming Later
- Movies & TV Shows
- Playlists & Queue Management
- Live TV/PVR
- Add-ons
- Settings Management
- PWA Features

[View complete roadmap →](PROJECT_PLAN.md#implementation-phases)

---

## Community

- 💬 [GitHub Discussions](../../discussions) - Questions, ideas, and general chat
- 🐛 [Issue Tracker](../../issues) - Bug reports and feature requests
- 📺 [Kodi Forums](https://forum.kodi.tv) - General Kodi discussion
- 💬 [Reddit r/Kodi](https://reddit.com/r/kodi) - Community discussion

---

## Relationship to Chorus2

Verse is a **successor**, not a replacement... yet. During development:

- Chorus2 remains the default web interface for Kodi
- Both can be installed side-by-side
- No features will be removed from Chorus2
- Once Verse reaches feature parity, it will become the recommended interface
- Chorus2 will remain available for those who prefer it

All credit for the original vision goes to [Jeremy Graham](http://jez.me) and the [Chorus2 contributors](https://github.com/xbmc/chorus2/graphs/contributors).

---

## License

This program is free software; you can redistribute it and/or modify it under the terms of the [GNU General Public License v2](LICENSE) as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

---

## Acknowledgments

- **Jeremy Graham** - Creator of Chorus and Chorus2
- **Kodi Team** - For the amazing media center
- **Chorus2 Contributors** - For years of improvements and translations
- **Open Source Community** - For the incredible tools that make Verse possible

---

<div align="center">

**[View Project Plan](PROJECT_PLAN.md)** • **[Start Contributing](CONTRIBUTING.md)** • **[Join Discussion](../../discussions)**

Made with ❤️ by the Kodi community

</div>
