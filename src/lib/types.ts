export interface Project {
  slug: string;
  title: string;
  description: string;
  company: string;
  category: string;
  tags: string[];
  coverImage: string;
  images: string[];
  featured: boolean;
  featuredOrder?: number;
  order?: number;
  year: string;
  content: string;
}

export interface Article {
  title: string;
  description: string;
  date: string;
  url: string;
  tags: string[];
  coverImage?: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  location: string;
  logo?: string;
  url?: string;
  skills?: string[];
}

export interface Illustration {
  slug: string;
  title: string;
  description: string;
  caption: string;
  image: string;
}
