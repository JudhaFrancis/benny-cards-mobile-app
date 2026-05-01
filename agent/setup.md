# Agent Project Setup & Guidelines

This document provides context and setup instructions for AI agents working on the **Benny Cards Mobile App**.

## Tech Stack
- **Framework**: Ionic React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Utility-first)
- **Animation**: Framer Motion
- **Icons**: Ionicons
- **Package Manager**: pnpm

## Styling Guidelines
- Use **Tailwind CSS** for all new UI components.
- Avoid writing raw CSS in `.css` files unless absolutely necessary for Ionic component overrides.
- Use the `variables.css` file for theme-specific variables (colors, fonts).

## Animation Guidelines
- Use **Framer Motion** for all UI transitions and micro-interactions.
- Import `motion` from `framer-motion` to create animated elements.

## Common Commands
- `pnpm dev`: Start the development server.
- `pnpm build`: Build the project for production.
- `pnpm lint`: Run ESLint.

## Project Structure
- `src/components`: Reusable UI components.
- `src/pages`: Main application screens/tabs.
- `src/theme`: Ionic theme variables and global styles.
- `src/index.css`: Tailwind CSS entry point.
