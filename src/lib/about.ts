// Import the index.md file
import aboutMd from '../content/about/index.md?raw';

// Import all images using Vite's glob import
const imageModules = import.meta.glob('../content/about/images/*.(jpg|jpeg|png|gif|webp|svg)', { eager: true, query: '?url', import: 'default' });

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

export interface AboutProfile {
  name: string;
  handle: string;
  title: string;
  location: string;
  email: string;
  avatar: string;
}

export interface AboutQuote {
  text: string;
  author: string;
}

export interface AboutSocial {
  linkedin: string;
  github: string;
  twitter: string;
  patreon: string;
}

export interface AboutSection {
  title: string;
  description: string;
  items: string[];
}

export interface AboutBeyondDesign {
  title: string;
  paragraphs: string[];
}

export interface AboutContent {
  profile: AboutProfile;
  bio: string;
  quote: AboutQuote;
  social: AboutSocial;
  skills: AboutSection;
  domains: AboutSection;
  beyondDesign: AboutBeyondDesign;
}

// Parse the markdown format
function parseAboutContent(content: string): AboutContent {
  const sections = content.split(/\n(?=# )/).filter(s => s.trim());

  const aboutContent: AboutContent = {
    profile: {
      name: '',
      handle: '',
      title: '',
      location: '',
      email: '',
      avatar: '',
    },
    bio: '',
    quote: { text: '', author: '' },
    social: { linkedin: '', github: '', twitter: '', patreon: '' },
    skills: { title: '', description: '', items: [] },
    domains: { title: '', description: '', items: [] },
    beyondDesign: { title: '', paragraphs: [] },
  };

  for (const section of sections) {
    const lines = section.trim().split('\n');
    const headerLine = lines[0].trim();

    // Profile section
    if (headerLine === '# Profile') {
      for (const line of lines.slice(1)) {
        const trimmed = line.trim();
        if (trimmed.includes(': ')) {
          const colonIndex = trimmed.indexOf(': ');
          const key = trimmed.slice(0, colonIndex).trim();
          const value = trimmed.slice(colonIndex + 2).trim();
          if (key === 'name') aboutContent.profile.name = value;
          if (key === 'handle') aboutContent.profile.handle = value;
          if (key === 'title') aboutContent.profile.title = value;
          if (key === 'location') aboutContent.profile.location = value;
          if (key === 'email') aboutContent.profile.email = value;
          if (key === 'avatar') aboutContent.profile.avatar = resolveImagePath(value);
        }
      }
    }

    // Bio section
    else if (headerLine === '# Bio') {
      const bioLines = lines.slice(1).filter(l => l.trim());
      aboutContent.bio = bioLines.join('\n\n');
    }

    // Quote section
    else if (headerLine === '# Quote') {
      for (const line of lines.slice(1)) {
        const trimmed = line.trim();
        if (trimmed.includes(': ')) {
          const colonIndex = trimmed.indexOf(': ');
          const key = trimmed.slice(0, colonIndex).trim();
          const value = trimmed.slice(colonIndex + 2).trim();
          if (key === 'text') aboutContent.quote.text = value;
          if (key === 'author') aboutContent.quote.author = value;
        }
      }
    }

    // Social section
    else if (headerLine === '# Social') {
      for (const line of lines.slice(1)) {
        const trimmed = line.trim();
        if (trimmed.includes(': ')) {
          const colonIndex = trimmed.indexOf(': ');
          const key = trimmed.slice(0, colonIndex).trim();
          const value = trimmed.slice(colonIndex + 2).trim();
          if (key === 'linkedin') aboutContent.social.linkedin = value;
          if (key === 'github') aboutContent.social.github = value;
          if (key === 'twitter') aboutContent.social.twitter = value;
          if (key === 'patreon') aboutContent.social.patreon = value;
        }
      }
    }

    // Skills section
    else if (headerLine === '# Skills') {
      for (const line of lines.slice(1)) {
        const trimmed = line.trim();
        if (trimmed.includes(': ')) {
          const colonIndex = trimmed.indexOf(': ');
          const key = trimmed.slice(0, colonIndex).trim();
          const value = trimmed.slice(colonIndex + 2).trim();
          if (key === 'title') aboutContent.skills.title = value;
          if (key === 'description') aboutContent.skills.description = value;
          if (key === 'items') aboutContent.skills.items = value.split(', ').map(s => s.trim());
        }
      }
    }

    // Domains section
    else if (headerLine === '# Domains') {
      for (const line of lines.slice(1)) {
        const trimmed = line.trim();
        if (trimmed.includes(': ')) {
          const colonIndex = trimmed.indexOf(': ');
          const key = trimmed.slice(0, colonIndex).trim();
          const value = trimmed.slice(colonIndex + 2).trim();
          if (key === 'title') aboutContent.domains.title = value;
          if (key === 'description') aboutContent.domains.description = value;
          if (key === 'items') aboutContent.domains.items = value.split(', ').map(d => d.trim());
        }
      }
    }

    // Beyond Design section
    else if (headerLine === '# Beyond Design') {
      const paragraphs: string[] = [];
      for (const line of lines.slice(1)) {
        const trimmed = line.trim();
        if (trimmed.startsWith('title: ')) {
          aboutContent.beyondDesign.title = trimmed.slice(7);
        } else if (trimmed) {
          paragraphs.push(trimmed);
        }
      }
      aboutContent.beyondDesign.paragraphs = paragraphs;
    }
  }

  return aboutContent;
}

let cachedAboutContent: AboutContent | null = null;

export function getAboutContent(): AboutContent {
  if (!cachedAboutContent) {
    cachedAboutContent = parseAboutContent(aboutMd);
  }
  return cachedAboutContent;
}
