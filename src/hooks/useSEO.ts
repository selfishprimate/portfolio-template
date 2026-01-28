import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
}

const BASE_TITLE = 'Portfolio Template';

export function useSEO({ title, description, keywords, ogImage, ogType = 'website' }: SEOProps) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper to update or create meta tag
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Description
    if (description) {
      setMeta('description', description);
      setMeta('og:description', description, true);
    }

    // Keywords
    if (keywords && keywords.length > 0) {
      setMeta('keywords', keywords.join(', '));
    }

    // Open Graph
    setMeta('og:title', title, true);
    setMeta('og:type', ogType, true);

    if (ogImage) {
      setMeta('og:image', ogImage, true);
    }

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    if (description) {
      setMeta('twitter:description', description);
    }
    if (ogImage) {
      setMeta('twitter:image', ogImage);
    }

  }, [title, description, keywords, ogImage, ogType]);
}

// Helper to generate consistent titles
export function generateTitle(page?: string, subpage?: string): string {
  if (!page) {
    return `${BASE_TITLE}: UI/UX Designer Portfolio`;
  }
  if (subpage) {
    return `${BASE_TITLE}: ${page}, ${subpage}`;
  }
  return `${BASE_TITLE}: ${page}`;
}
