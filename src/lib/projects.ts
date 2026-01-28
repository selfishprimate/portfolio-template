import type { Project } from './types';

// Import page meta
import worksIndexMd from '../content/works/index.md?raw';

// Import markdown files from project folders
import mobileBankingMd from '../content/works/mobile-banking-app/index.md?raw';
import ecommerceRedesignMd from '../content/works/ecommerce-redesign/index.md?raw';
import designSystemMd from '../content/works/design-system/index.md?raw';
import travelBookingMd from '../content/works/travel-booking-platform/index.md?raw';

// Import all images using Vite's glob import
const imageModules = import.meta.glob('../content/works/*/images/*.(jpg|jpeg|png|gif|webp|svg)', { eager: true, query: '?url', import: 'default' });

// Create a map of relative paths to resolved URLs
const imageMap: Record<string, string> = {};
for (const [path, url] of Object.entries(imageModules)) {
  // Extract project name and filename from path
  // Path format: ../content/works/{project}/images/{filename}
  const match = path.match(/\.\.\/content\/works\/([^/]+)\/images\/(.+)$/);
  if (match) {
    const [, project, filename] = match;
    imageMap[`${project}:${filename}`] = url as string;
  }
}

// Helper to resolve image path - exported for use in ProjectPage
export function resolveProjectImagePath(relativePath: string, projectSlug: string): string {
  // relativePath format: ./images/filename.jpg
  const filename = relativePath.replace('./images/', '');
  const key = `${projectSlug}:${filename}`;
  return imageMap[key] || relativePath;
}

// Alias for internal use
const resolveImagePath = resolveProjectImagePath;

const projectFiles: Record<string, string> = {
  'mobile-banking-app': mobileBankingMd,
  'ecommerce-redesign': ecommerceRedesignMd,
  'design-system': designSystemMd,
  'travel-booking-platform': travelBookingMd,
};

function parseFrontmatter(content: string): { data: Record<string, unknown>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const frontmatter = match[1];
  const markdown = match[2];

  const data: Record<string, unknown> = {};
  const lines = frontmatter.split('\n');
  let currentKey = '';
  let isArray = false;
  let arrayItems: string[] = [];

  for (const line of lines) {
    if (line.startsWith('  - ')) {
      arrayItems.push(line.replace('  - ', '').replace(/"/g, '').trim());
    } else if (line.includes(':')) {
      if (isArray && currentKey) {
        data[currentKey] = arrayItems;
        arrayItems = [];
        isArray = false;
      }

      const colonIndex = line.indexOf(':');
      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (value === '') {
        isArray = true;
        currentKey = key;
      } else if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/"/g, ''));
      } else if (value === 'true') {
        data[key] = true;
      } else if (value === 'false') {
        data[key] = false;
      } else {
        data[key] = value.replace(/"/g, '');
      }
    }
  }

  if (isArray && currentKey) {
    data[currentKey] = arrayItems;
  }

  return { data, content: markdown };
}

export function getProjects(): Project[] {
  const projects: Project[] = [];

  for (const [slug, content] of Object.entries(projectFiles)) {
    const { data, content: markdownContent } = parseFrontmatter(content);

    // Resolve image paths
    const coverImage = data.coverImage ? resolveImagePath(data.coverImage as string, slug) : '';
    const images = ((data.images as string[]) || []).map(img => resolveImagePath(img, slug));

    projects.push({
      slug,
      title: data.title as string || '',
      description: data.description as string || '',
      company: data.company as string || '',
      category: data.category as string || '',
      tags: (data.tags as string[]) || [],
      coverImage,
      images,
      featured: data.featured as boolean || false,
      featuredOrder: data.featuredOrder as number | undefined,
      order: data.order ? parseInt(data.order as string) : undefined,
      year: data.year as string || '',
      content: markdownContent,
    });
  }

  // Sort by order (ascending), then by year (descending) for items without order
  return projects.sort((a, b) => {
    // Items with order come first, sorted by order ascending
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    if (a.order !== undefined) return -1;
    if (b.order !== undefined) return 1;
    // Items without order sorted by year descending
    return parseInt(b.year) - parseInt(a.year);
  });
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getProjects().find(p => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return getProjects()
    .filter(p => p.featured)
    .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
}

export interface WorksPageMeta {
  label: string;
  title: string;
  description: string;
}

let cachedWorksMeta: WorksPageMeta | null = null;

export function getWorksMeta(): WorksPageMeta {
  if (!cachedWorksMeta) {
    const { data } = parseFrontmatter(worksIndexMd);
    cachedWorksMeta = {
      label: (data.label as string) || 'Portfolio',
      title: (data.title as string) || 'Selected Works',
      description: (data.description as string) || '',
    };
  }
  return cachedWorksMeta;
}
