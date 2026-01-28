// Import the index.md file
import homeMd from '../content/home/index.md?raw';

export interface HomeHero {
  title: string;
  location: string;
  headline: string;
  headlineAccent: string;
  subtitle: string;
}

export interface HomeQuote {
  text: string;
  author: string;
}

export interface HomeSectionMeta {
  label: string;
  title: string;
}

export interface HomeCTA {
  title: string;
  description: string;
  buttonText: string;
}

export interface HomeSocial {
  linkedin: string;
}

export interface HomeContent {
  hero: HomeHero;
  quote: HomeQuote;
  featuredWork: HomeSectionMeta;
  experiencePreview: HomeSectionMeta;
  cta: HomeCTA;
  social: HomeSocial;
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

// Parse the markdown format
function parseHomeContent(content: string): HomeContent {
  const { meta, body } = parseFrontmatter(content);

  const homeContent: HomeContent = {
    hero: {
      title: meta.title || '',
      location: meta.location || '',
      headline: meta.headline || '',
      headlineAccent: meta.headlineAccent || '',
      subtitle: meta.subtitle || '',
    },
    quote: { text: '', author: '' },
    featuredWork: { label: '', title: '' },
    experiencePreview: { label: '', title: '' },
    cta: { title: '', description: '', buttonText: '' },
    social: { linkedin: '' },
  };

  // Parse sections from body
  const sections = body.split(/\n(?=# )/).filter(s => s.trim());

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const headerLine = lines[0].trim();
    const sectionData: Record<string, string> = {};

    for (const line of lines.slice(1)) {
      const trimmed = line.trim();
      if (trimmed.includes(': ')) {
        const colonIndex = trimmed.indexOf(': ');
        const key = trimmed.slice(0, colonIndex).trim();
        const value = trimmed.slice(colonIndex + 2).trim();
        sectionData[key] = value;
      }
    }

    if (headerLine === '# Quote') {
      homeContent.quote = {
        text: sectionData.text || '',
        author: sectionData.author || '',
      };
    } else if (headerLine === '# Featured Work') {
      homeContent.featuredWork = {
        label: sectionData.label || '',
        title: sectionData.title || '',
      };
    } else if (headerLine === '# Experience Preview') {
      homeContent.experiencePreview = {
        label: sectionData.label || '',
        title: sectionData.title || '',
      };
    } else if (headerLine === '# CTA Section') {
      homeContent.cta = {
        title: sectionData.title || '',
        description: sectionData.description || '',
        buttonText: sectionData.buttonText || '',
      };
    } else if (headerLine === '# Social') {
      homeContent.social = {
        linkedin: sectionData.linkedin || '',
      };
    }
  }

  return homeContent;
}

let cachedContent: HomeContent | null = null;

export function getHomeContent(): HomeContent {
  if (!cachedContent) {
    cachedContent = parseHomeContent(homeMd);
  }
  return cachedContent;
}
