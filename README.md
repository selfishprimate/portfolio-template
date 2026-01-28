# Portfolio Template

A modern, responsive portfolio template for UI/UX designers built with React, TypeScript, and Tailwind CSS.

![Portfolio Template](https://picsum.photos/seed/portfolio-preview/1200/630)

## Features

- **Content-driven** - All content managed through simple Markdown files
- **Responsive design** - Looks great on all devices
- **Dark mode** - Built-in light/dark theme toggle
- **Fast** - Built with Vite for lightning-fast development and builds
- **SEO friendly** - Dynamic meta tags for better search visibility
- **Animations** - Smooth animations powered by Framer Motion
- **Medium integration** - Auto-fetch articles from your Medium profile

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/selfishprimate/portfolio-template.git
cd portfolio-template
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Customization

### Personal Information

Edit `src/lib/data.ts` to update your personal information:

```typescript
export const siteConfig = {
  name: "Your Name",
  handle: "yourhandle",
  title: "Your Title",
  location: "Your Location",
  email: "your@email.com",
  // ...
};
```

### Content

All content is stored in `src/content/` as Markdown files:

| Folder | Description |
|--------|-------------|
| `works/` | Portfolio projects - each project in its own folder |
| `articles/` | Blog articles |
| `experience/` | Work experience |
| `illustrations/` | Illustration gallery |
| `about/` | About page content |
| `home/` | Homepage content |

### Adding a New Project

1. Create a new folder in `src/content/works/`:

```
src/content/works/my-project/
├── index.md
└── images/
    ├── cover.jpg
    └── screenshot-1.jpg
```

2. Add project content in `index.md`:

```markdown
---
title: "Project Title"
description: "Project description"
company: "Company Name"
category: "Web Application"
tags: ["UI/UX", "Web Design"]
coverImage: "./images/cover.jpg"
images: []
order: 1
year: "2024"
featured: true
featuredOrder: 1
---

Your project content in Markdown...
```

3. Register the project in `src/lib/projects.ts`:

```typescript
import myProjectMd from '../content/works/my-project/index.md?raw';

const projectFiles: Record<string, string> = {
  // ... existing projects
  'my-project': myProjectMd,
};
```

### Branding

- **Logo**: Edit `src/components/Header.tsx` and `src/components/Footer.tsx`
- **Colors**: Customize theme in `src/index.css`
- **Fonts**: Update font imports in `index.html` and `src/index.css`

### Medium Articles (Optional)

To auto-fetch articles from Medium:

1. Edit `medium.config.ts`:

```typescript
export const config = {
  username: "your-medium-username"
};
```

2. Run the fetch script:

```bash
npm run fetch-articles
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run fetch-articles` | Fetch Medium articles |

## Tech Stack

- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)

## Deployment

Build the project for production:

```bash
npm run build
```

The `dist/` folder contains the static files ready to deploy to any hosting service (Netlify, Vercel, GitHub Pages, etc.).

**Note**: Since this is a single-page application (SPA), configure your hosting to redirect all routes to `index.html`.

## License

MIT License - feel free to use this template for your personal or commercial projects.

## Author

Created by [selfishprimate](https://www.linkedin.com/in/selfishprimate/)
