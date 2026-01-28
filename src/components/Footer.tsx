import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/data';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-32">
      <h2 className="sr-only">Footer</h2>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:pr-8">
            <Link to="/" className="inline-flex items-baseline gap-2 mb-4">
              <span className="font-serif font-medium text-2xl text-text-primary" style={{ letterSpacing: '-0.03em' }}>
                Portfolio
              </span>
              <span className="font-serif font-medium text-2xl text-text-primary" style={{ letterSpacing: '-0.03em' }}>
                Template
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs mb-5">
              Crafting intuitive digital experiences through thoughtful UI/UX design. AI for Design, Design for AI.
            </p>
            <div className="flex items-center gap-4">
              <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href="https://medium.com/" target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-sans text-xs uppercase text-text-tertiary mb-4">
              Navigation
            </h3>
            <ul className="flex flex-col gap-1 list-none">
              <li>
                <Link to="/works" className="text-text-secondary hover:text-accent transition-colors text-sm">
                  Works
                </Link>
              </li>
              <li>
                <Link to="/illustrations" className="text-text-secondary hover:text-accent transition-colors text-sm">
                  Illustrations
                </Link>
              </li>
              <li>
                <Link to="/articles" className="text-text-secondary hover:text-accent transition-colors text-sm">
                  Articles
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-text-secondary hover:text-accent transition-colors text-sm">
                  Experience
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-text-secondary hover:text-accent transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="font-sans text-xs uppercase text-text-tertiary mb-4">
              Projects
            </h3>
            <ul className="flex flex-col gap-1 list-none">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors text-sm group"
                >
                  Project One
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors text-sm group"
                >
                  Project Two
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors text-sm group"
                >
                  Project Three
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-sans text-xs uppercase text-text-tertiary mb-4">
              Support
            </h3>
            <ul className="flex flex-col gap-1 list-none">
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors text-sm group"
                >
                  GitHub Sponsors
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors text-sm group"
                >
                  Patreon
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors text-sm group"
                >
                  Buy Me A Coffee
                  <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-text-tertiary text-xs">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <a
            href="https://www.linkedin.com/in/selfishprimate/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-tertiary text-xs hover:text-accent transition-colors"
          >
            Created by selfishprimate
          </a>
        </div>
      </div>
    </footer>
  );
}
