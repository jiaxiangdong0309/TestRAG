# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TestRAG is a Vue 3 + TypeScript + Vite frontend project for testing and developing RAG (Retrieval-Augmented Generation) related functionality. The project focuses on chat and webpage preview features with SSE (Server-Sent Events) support.

## Development Commands

### Common Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format
```

### Quality Assurance
Always run these commands before committing:
```bash
npm run type-check  # TypeScript type checking
npm run lint        # ESLint code checking
npm run format      # Prettier code formatting
```

## Technology Stack

### Core Dependencies
- **Vue 3.5.18** with Composition API and `<script setup>` syntax
- **TypeScript 5.8.0** for type safety
- **Vite 7.0.6** for fast development and building
- **Vue Router 4.5.1** for routing
- **Pinia 3.0.3** for state management
- **Tailwind CSS 3.4.17** for styling
- **Axios 1.11.0** for HTTP requests
- **Markdown-it 14.1.0** for markdown rendering

### Development Tools
- **ESLint 9.31.0** + **Prettier 3.6.2** for code quality
- **Vue DevTools** for debugging
- **PostCSS** + **Autoprefixer** for CSS processing

## Project Architecture

### Directory Structure
```
src/
├── api/                     # API layer
│   ├── config/             # API configuration
│   ├── modules/            # API modules (dify, etc.)
│   ├── sse/                # SSE (Server-Sent Events) implementation
│   ├── request.ts          # Axios instance with interceptors
│   ├── types.ts            # API type definitions
│   └── index.ts            # API module entry point
├── components/             # Global reusable components
│   ├── ui/                 # UI component library
│   └── chat/               # Chat-specific components
├── pages/                  # Page components
│   ├── chat/               # Chat page
│   └── webpage-preview/    # Webpage preview page
├── router/                 # Vue Router configuration
├── stores/                 # Pinia stores (if any)
├── assets/                 # Static assets and styles
├── App.vue                 # Root component
└── main.ts                 # Application entry point
```

### Key Architectural Features

#### API Layer
- **Axios instance** with request/response interceptors in `src/api/request.ts`
- **SSE module** in `src/api/sse/` with automatic reconnection and event handling
- **Modular API structure** with separate modules for different services
- **Type-safe API calls** with comprehensive TypeScript definitions

#### Component Architecture
- **Global components** in `src/components/` for reusable UI elements
- **Page-specific components** in `src/pages/[page]/components/` for page-specific logic
- **UI component library** in `src/components/ui/` for consistent design system

#### State Management
- **Pinia** for global state management
- **Local state** using Vue 3's `ref` and `reactive`
- **Simple authentication** using localStorage for username persistence

### SSE (Server-Sent Events)
The project includes a comprehensive SSE implementation with:
- Automatic reconnection with exponential backoff
- Event handling system
- Connection state management
- Factory pattern for managing multiple SSE connections
- TypeScript support throughout

### Current Application Features
- **Chat interface** with real-time messaging
- **Webpage preview** functionality
- **Simple user authentication** (username-based)
- **Responsive design** with mobile support
- **SSE integration** for real-time updates

## Development Guidelines

### Component Development
1. Use `<script setup>` syntax for all components
2. Follow the established file naming: PascalCase for components, kebab-case for files
3. Place global components in `src/components/`
4. Place page-specific components in `src/pages/[page]/components/`
5. Use TypeScript for all component props and emissions

### API Development
1. Create API modules in `src/api/modules/`
2. Use the configured Axios instance from `src/api/request.ts`
3. Follow the established error handling patterns
4. Use TypeScript interfaces for request/response types

### Styling Guidelines
1. Use Tailwind CSS classes for all styling
2. Avoid custom CSS unless absolutely necessary
3. Use responsive design patterns with Tailwind breakpoints
4. Follow the established color scheme and spacing

### State Management
1. Use Pinia for global state that needs to be shared across components
2. Use local `ref`/`reactive` for component-specific state
3. Keep state management simple and avoid over-engineering

## Configuration Files

### Vite Configuration (`vite.config.ts`)
- Proxy configuration for API endpoints
- Path aliases (`@` for `src/`)
- Vue plugin configuration

### Build Configuration
- TypeScript configuration in `tsconfig.json` and related files
- Tailwind CSS configuration in `tailwind.config.js`
- ESLint configuration in `eslint.config.ts`

## Environment Setup

### Node.js Version
- **Required version**: 20.19.4
- **Automatic version management**: Uses `.nvmrc` and `.node-version` files
- **Shell integration**: Automatically switches Node.js version when entering project directory

### Browser Support
- Modern browsers with ES2020 support
- EventSource API required for SSE functionality

## Common Development Tasks

### Adding a New Page
1. Create directory in `src/pages/[page-name]/`
2. Create `index.vue` file with proper structure
3. Add route in `src/router/index.ts`
4. Add navigation link in `App.vue`

### Adding API Integration
1. Create module in `src/api/modules/`
2. Define TypeScript interfaces in `src/api/types.ts`
3. Use the configured Axios instance
4. Handle errors appropriately

### Working with SSE
1. Import from `src/api/sse/`
2. Use `SSEClient` class or `createSSEClient` function
3. Always call `destroy()` when components unmount
4. Handle connection states and errors

## Important Notes

### Security
- No hardcoded API keys or sensitive information in the codebase
- Use environment variables for configuration
- The project uses proxy configuration for API calls

### Performance
- Components are lazy-loaded via Vue Router
- Use proper cleanup for SSE connections
- Avoid unnecessary re-renders with proper reactive patterns

### Code Quality
- Always run type checking and linting before commits
- Follow established patterns and conventions
- Keep components focused and single-purpose