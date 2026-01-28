import type { Illustration } from './types';

// Import the index.md file
import illustrationsMd from '../content/illustrations/index.md?raw';

// Import all images using Vite's glob import
const imageModules = import.meta.glob('../content/illustrations/images/*.(jpg|jpeg|png|gif|webp|svg)', { eager: true, query: '?url', import: 'default' });

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

export interface IllustrationsPageMeta {
  label: string;
  title: string;
  description: string;
}

export interface IllustrationsContent {
  meta: IllustrationsPageMeta;
  illustrations: Illustration[];
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
function parseIllustrationsContent(content: string): IllustrationsContent {
  const { meta, body } = parseFrontmatter(content);
  const illustrations: Illustration[] = [];

  // Split by # headings (each section starts with # )
  const sections = body.split(/\n(?=# )/).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const item: Record<string, string> = {};

    for (const line of lines) {
      const trimmed = line.trim();

      // Title line starts with #
      if (trimmed.startsWith('# ')) {
        item.title = trimmed.replace(/^#\s+/, '');
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

    if (item.title && item.image) {
      illustrations.push({
        slug: item.slug || item.title.toLowerCase().replace(/\s+/g, '-'),
        title: item.title,
        description: item.description || '',
        caption: item.caption || '',
        image: resolveImagePath(item.image),
      });
    }
  }

  return {
    meta: {
      label: meta.label || 'Creative',
      title: meta.title || 'Illustrations',
      description: meta.description || '',
    },
    illustrations,
  };
}

let cachedContent: IllustrationsContent | null = null;

export function getIllustrationsContent(): IllustrationsContent {
  if (!cachedContent) {
    cachedContent = parseIllustrationsContent(illustrationsMd);
  }
  return cachedContent;
}

export function getIllustrations(): Illustration[] {
  return getIllustrationsContent().illustrations;
}

export function getIllustrationsMeta(): IllustrationsPageMeta {
  return getIllustrationsContent().meta;
}
