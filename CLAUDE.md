# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An open-source portfolio template for UI/UX designers built with React 19, TypeScript, and Vite. All content is managed through Markdown files with YAML frontmatter - no database required.

## Commands

```bash
npm run dev              # Start dev server at localhost:5173
npm run build            # TypeScript compile + Vite build to dist/
npm run lint             # ESLint
npm run preview          # Preview production build
npm run fetch-articles   # Fetch Medium articles via RSS (configure username in medium.config.ts)
```

## Architecture

### Content System
All portfolio content lives in `src/content/` as Markdown files:
- `works/{slug}/index.md` - Project case studies with images in `{slug}/images/`
- `articles/index.md` - Blog articles (can auto-fetch from Medium)
- `experience/index.md` - Work history
- `illustrations/index.md` - Illustration portfolio
- `about/index.md` - About page content
- `home/index.md` - Homepage content

Data loaders in `src/lib/` parse Markdown into typed objects:
- `projects.ts` - Parses works, resolves image paths via Vite glob imports
- `articles.ts` - Parses articles with caching
- `experience.ts` - Parses work experience
- `data.ts` - Site configuration (name, social links, etc.)

### Customization
To personalize the template:
1. Update `src/lib/data.ts` with your info (name, email, social links)
2. Replace content in `src/content/` folders with your own
3. Update `medium.config.ts` with your Medium username (optional)
4. Modify branding in `src/components/Header.tsx` and `Footer.tsx`

### Image Resolution
Images in content use relative paths or external URLs. For local images, Vite's `import.meta.glob` resolves these at build time. Helper functions like `resolveProjectImagePath()` map relative paths to resolved URLs.

### Routing
React Router v7 with routes defined in `src/App.tsx`:
- `/` - Home
- `/works` - Portfolio grid
- `/works/:slug` - Individual project
- `/articles`, `/experience`, `/illustrations`, `/about`

### Styling
Tailwind CSS v4 with custom theme variables in `src/index.css`. Dark mode via `.dark` class on `<html>`, toggled by `ThemeToggle` component with localStorage persistence.
