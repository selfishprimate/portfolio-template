import type { Experience } from './types';

// Import the index.md file
import experienceMd from '../content/experience/index.md?raw';

// Import all images using Vite's glob import
const imageModules = import.meta.glob('../content/experience/images/*.(jpg|jpeg|png|gif|webp|svg)', { eager: true, query: '?url', import: 'default' });

// Create a map of filenames to resolved URLs
const imageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(imageModules)) {
  const filename = path.split('/').pop();
  if (filename) {
    imageMap[filename] = url as string;
  }
}

// Helper to resolve image path
function resolveImagePath(relativePath: string): string {
  const filename = relativePath.replace('./images/', '');
  return imageMap[filename] || relativePath;
}

export interface ExperiencePageMeta {
  label: string;
  title: string;
  description: string;
}

export interface ExperienceContent {
  meta: ExperiencePageMeta;
  experiences: Experience[];
}

// Parse frontmatter
function parseFrontmatter(content: string): { meta: Record<string, string>; body: string } {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!frontmatterMatch) {
    return { meta: {}, body: content };
  }

  const meta: Record<string, string> = {};
  const frontmatterLines = frontmatterMatch[1].split('\n');
  for (const line of frontmatterLines) {
    const colonIndex = line.indexOf(': ');
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 2).trim();
      meta[key] = value;
    }
  }

  return { meta, body: frontmatterMatch[2] };
}

// Parse the markdown format (sections split by # headings)
function parseExperienceContent(content: string): ExperienceContent {
  const { meta, body } = parseFrontmatter(content);
  const experiences: Experience[] = [];

  // Split by # headings (each section starts with # )
  const sections = body.split(/\n(?=# )/).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const item: Record<string, string> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      // Company name line starts with #
      if (trimmed.startsWith('# ')) {
        item.company = trimmed.replace(/^#\s+/, '');
      }
      // Key: value lines
      else if (trimmed.includes(': ')) {
        const colonIndex = trimmed.indexOf(': ');
        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 2).trim();
        if (key && value) {
          item[key] = value;
        }
      }
    }

    if (item.company && item.role) {
      experiences.push({
        company: item.company,
        role: item.role,
        period: item.period || '',
        description: item.description || '',
        location: item.location || '',
        logo: item.logo ? resolveImagePath(item.logo) : undefined,
        url: item.url || undefined,
        skills: item.skills ? item.skills.split(', ').map(s => s.trim()) : undefined,
      });
    }
  }

  return {
    meta: {
      label: meta.label || 'Career',
      title: meta.title || 'Work Experience',
      description: meta.description || '',
    },
    experiences,
  };
}

let cachedContent: ExperienceContent | null = null;

export function getExperienceContent(): ExperienceContent {
  if (!cachedContent) {
    cachedContent = parseExperienceContent(experienceMd);
  }
  return cachedContent;
}

export function getExperiences(): Experience[] {
  return getExperienceContent().experiences;
}

export function getExperienceMeta(): ExperiencePageMeta {
  return getExperienceContent().meta;
}
