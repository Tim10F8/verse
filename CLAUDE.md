# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Current State**: This repository contains Chorus2, the default web interface for Kodi. It's a single-page application built with CoffeeScript, Backbone, and Marionette.

**Future Direction**: This codebase is being succeeded by **Verse** - a complete rewrite using modern technologies (React, TypeScript, Vite). The name "Verse" represents what comes after the Chorus in a song.

For the modernization plan, see `PROJECT_PLAN.md`.

### Chorus2 (Legacy)

Chorus2 is the current web interface that allows users to browse and control their Kodi media library through a web browser. The UI supports both controlling Kodi remotely and streaming media directly in the browser.

## Technology Stack

- **Frontend Framework**: Backbone.js with Marionette.js
- **Language**: CoffeeScript (compiles to JavaScript)
- **Templating**: ECO templates
- **Styling**: Sass/SCSS with Compass
- **Build System**: Grunt
- **Internationalization**: PO/JSON files via Jed

## Development Commands

### Initial Setup
```bash
# Using Docker (recommended)
docker pull jez500/chorus2-dev:latest
docker run -tiP -v `pwd`:/app jez500/chorus2-dev:latest ./build.sh install

# Or locally
./build.sh install
```

### Building
```bash
# Full build (languages, docs, JS, CSS)
grunt build

# Development mode with file watching and live reload
grunt

# Build languages only
grunt lang
```

### Release Build
```bash
# Build and package a release version
./build.sh <version-number>

# Switch to dev addon.xml
./build.sh dev
```

## Architecture

### Application Structure

The codebase follows a modular Marionette architecture organized by feature:

- **`src/js/app.coffee`**: Application entry point, initializes the Marionette app and global config
- **`src/js/apps/`**: Feature modules (album, artist, movie, settings, etc.) - each is a mini-application with its own controllers and views
- **`src/js/entities/`**: Data layer using Backbone models/collections that interface with Kodi's JSON-RPC API
- **`src/js/controllers/`**: Base controller and router logic
- **`src/js/views/`**: Reusable view components (cards, lists, layouts, forms)
- **`src/js/helpers/`**: Utility functions (caching, translation, UI helpers, connection management)
- **`src/js/config/`**: Framework configuration (Backbone sync, Marionette renderer)
- **`src/js/components/`**: Shared components (forms, etc.)

### Compilation Pipeline

1. **CoffeeScript**: Compiled in a specific order (see `coffeeStack` in Gruntfile.js):
   - Base files → helpers → config → entities → controllers → views → components → apps
2. **ECO Templates**: Compiled into `dist/js/build/tpl.js`
3. **Libraries**: Concatenated from jQuery, Lodash, Backbone, and other dependencies
4. **Final Output**: Combined into `dist/js/kodi-webinterface.js`

### Kodi Integration

- Communicates with Kodi via JSON-RPC API (default endpoint: `/jsonrpc`)
- Supports WebSocket connections on port 9090 for real-time updates
- Dual-player mode: "Kodi" mode (remote control) vs "Local" mode (browser playback)

## Key Conventions

### CoffeeScript Patterns
- Global objects: `@helpers`, `@config`, `@Kodi` (the main app instance)
- Uses `do` expressions for scoping (e.g., `@Kodi = do (Backbone, Marionette) ->`)
- Config stored in `config.static` object and persisted via localStorage

### Build Outputs
- **Source**: `src/` directory (commit these files)
- **Compiled**: `dist/` directory (do not commit unless building a release)
- **Build artifacts**: `dist/js/build/*.js` (always excluded from releases)

### Translations
- English (`src/lang/_strings/en.po`) is the source of truth
- PO files converted to JSON for Jed library
- Markdown docs in `src/lang/` compiled to HTML in `dist/lang/`

## Development Workflow

1. Make changes in `src/` directory only
2. Use `grunt` (watch mode) for continuous compilation during development
3. Test changes by pointing browser to Kodi instance at `http://localhost:8080`
4. Only commit source files in `src/` directory, not compiled files in `dist/`
5. For releases, run `./build.sh <version>` which updates version numbers and creates a zip package

## Important Notes

- The app is designed for the latest Kodi version; older versions may have API incompatibilities
- Requires Kodi HTTP control to be enabled (Settings > Services > Control)
- BrowserSync proxy settings in Gruntfile.js (lines 239-240) are environment-specific and may need adjustment
- The app minifies libraries but not the main app code for easier debugging in production
