import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, ArrowRight, ArrowUpRight, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjectBySlug, getProjects, resolveProjectImagePath } from '@/lib/projects';
import { useSEO, generateTitle } from '@/hooks/useSEO';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = slug ? getProjectBySlug(slug) : undefined;
  const allProjects = getProjects();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useSEO({
    title: generateTitle('Works', project?.title),
    description: project?.description || 'UI/UX Design case study',
    keywords: project?.tags || ['UI/UX Design', 'Case Study'],
    ogImage: project?.coverImage,
  });

  // Type for image data with alt and caption
  interface ImageData {
    src: string;
    alt: string;
    caption: string;
  }

  // Collect all images from content for lightbox
  const allImages = useMemo(() => {
    if (!project || !slug) return [] as ImageData[];
    const images: ImageData[] = [];

    // Parse gallery blocks to extract figure elements
    const galleryRegex = /<gallery[^>]*>([\s\S]*?)<\/gallery>/g;
    const figureRegex = /<figure\s+src="([^"]+)"(?:\s+alt="([^"]*)")?\s*>([^<]*)<\/figure>/g;

    let galleryMatch;
    while ((galleryMatch = galleryRegex.exec(project.content)) !== null) {
      const galleryContent = galleryMatch[1];
      let figureMatch;
      while ((figureMatch = figureRegex.exec(galleryContent)) !== null) {
        const [, src, alt = '', caption = ''] = figureMatch;
        const resolved = resolveProjectImagePath(src, slug);
        images.push({
          src: resolved,
          alt: alt || project.title,
          caption: caption.trim()
        });
      }
    }

    return images;
  }, [project, slug]);

  // Lock body scroll when lightbox is open
  useBodyScrollLock(lightboxIndex !== null);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === 0 ? allImages.length - 1 : lightboxIndex - 1);
      setIsZoomed(false);
    }
  };

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex(lightboxIndex === allImages.length - 1 ? 0 : lightboxIndex + 1);
      setIsZoomed(false);
    }
  };

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      setLightboxIndex(lightboxIndex === 0 ? allImages.length - 1 : lightboxIndex - 1);
    } else if (e.key === 'ArrowRight') {
      setLightboxIndex(lightboxIndex === allImages.length - 1 ? 0 : lightboxIndex + 1);
    }
  }, [lightboxIndex, allImages.length]);

  useEffect(() => {
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [lightboxIndex, handleKeyDown]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-serif text-3xl text-text-primary mb-4">Project not found</h2>
          <Link to="/works" className="text-text-secondary hover:text-text-primary transition-colors">
            ← Back to work
          </Link>
        </div>
      </div>
    );
  }

  // Get next and previous projects
  const currentIndex = allProjects.findIndex(p => p.slug === slug);
  const nextProject = allProjects[currentIndex + 1] || allProjects[0];
  const prevProject = allProjects[currentIndex - 1] || allProjects[allProjects.length - 1];

  // Helper to resolve image path
  const resolveImagePath = (relativePath: string): string => {
    return resolveProjectImagePath(relativePath, slug!);
  };

  // Get lightbox index for an image path
  const getLightboxIndex = (relativePath: string): number => {
    const resolved = resolveImagePath(relativePath);
    return allImages.findIndex(img => img.src === resolved);
  };

  // Parse content and render with galleries
  const renderContentWithGalleries = () => {
    const content = project.content;

    // Split content by gallery blocks
    const parts = content.split(/(<gallery[^>]*>[\s\S]*?<\/gallery>)/g);

    return parts.map((part, index) => {
      // Check if this is a gallery block
      const galleryMatch = part.match(/<gallery\s+cols="(\d+)">([\s\S]*?)<\/gallery>/);

      if (galleryMatch) {
        const cols = parseInt(galleryMatch[1]);
        const galleryContent = galleryMatch[2];

        // Parse figure elements
        const figures: { src: string; alt: string; caption: string }[] = [];
        let figureMatch;
        const localFigureRegex = /<figure\s+src="([^"]+)"(?:\s+alt="([^"]*)")?\s*>([^<]*)<\/figure>/g;
        while ((figureMatch = localFigureRegex.exec(galleryContent)) !== null) {
          const [, src, alt = '', caption = ''] = figureMatch;
          figures.push({ src, alt: alt || project.title, caption: caption.trim() });
        }

        let gridClass = 'grid-cols-1';
        if (cols === 2) gridClass = 'grid-cols-1 md:grid-cols-2';
        if (cols === 3) gridClass = 'grid-cols-1 md:grid-cols-3';
        if (cols === 4) gridClass = 'grid-cols-2 md:grid-cols-4';

        return (
          <div key={index} className={`grid ${gridClass} gap-16 my-12`}>
            {figures.map((figure, figIndex) => {
              const resolvedPath = resolveImagePath(figure.src);
              const lightboxIdx = getLightboxIndex(figure.src);
              return (
                <figure key={figIndex} className="m-0">
                  <button
                    onClick={() => openLightbox(lightboxIdx)}
                    className="w-full overflow-hidden cursor-zoom-in"
                  >
                    <img
                      src={resolvedPath}
                      alt={figure.alt}
                      className="w-full h-auto"
                    />
                  </button>
                  {figure.caption && (
                    <figcaption className="mt-2 text-sm text-text-tertiary text-center">
                      {figure.caption}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        );
      }

      if (part.trim()) {
        return (
          <div key={index} className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {part}
            </ReactMarkdown>
          </div>
        );
      }

      return null;
    });
  };

  return (
    <div className="min-h-screen">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-6xl mx-auto px-6 py-8"
      >
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </motion.div>

      {/* Header */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Title */}
          <h2 className="font-serif font-semibold text-3xl md:text-4xl lg:text-5xl text-text-primary max-w-4xl">
            {project.title}
          </h2>

          {/* Description */}
          <p className="mt-6 text-text-secondary text-lg leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Meta */}
          <p className="mt-6 text-xs font-sans text-text-tertiary uppercase">
            {project.company}, {project.year}
          </p>
        </motion.div>
      </section>

      {/* Cover Image */}
      {project.coverImage && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-7xl mx-auto px-6 pb-16"
        >
          <div className="overflow-hidden">
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-auto"
            />
          </div>
        </motion.section>
      )}

      {/* Content with Galleries */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {renderContentWithGalleries()}
        </motion.div>
      </section>

      {/* Tags */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 text-sm font-sans text-text-secondary bg-border/50 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-border mt-16">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Previous */}
          <Link
            to={`/works/${prevProject.slug}`}
            className="group"
          >
            <span className="inline-flex items-center gap-2 text-xs font-sans uppercase text-text-tertiary">
              <ArrowLeft size={14} />
              Previous Project
            </span>
            <h3 className="mt-2 font-serif text-xl text-text-primary group-hover:text-text-secondary transition-colors">
              {prevProject.title}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {prevProject.company}
            </p>
          </Link>

          {/* Next */}
          <Link
            to={`/works/${nextProject.slug}`}
            className="group text-right"
          >
            <span className="inline-flex items-center justify-end gap-2 text-xs font-sans uppercase text-text-tertiary">
              Next Project
              <ArrowRight size={14} />
            </span>
            <h3 className="mt-2 font-serif text-xl text-text-primary group-hover:text-text-secondary transition-colors">
              {nextProject.title}
            </h3>
            <p className="mt-1 text-sm text-text-tertiary">
              {nextProject.company}
            </p>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-text-primary">
            Interested in working together?
          </h2>
          <p className="mt-4 text-text-secondary">
            Let's discuss your project and see how I can help.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-text-primary text-surface font-sans text-sm rounded-full hover:bg-text-secondary transition-colors"
          >
            Get In Touch
            <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-neutral-950/95 flex flex-col"
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-10 w-12 h-12 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close lightbox"
            >
              <X size={28} />
            </button>

            {/* Image Area */}
            <div
              className={`flex-1 ${isZoomed ? 'overflow-auto scrollbar-hide' : 'flex items-center justify-center overflow-hidden'}`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  isZoomed ? setIsZoomed(false) : closeLightbox();
                }
              }}
            >
              {isZoomed ? (
                <div className="inline-block p-4">
                  <img
                    src={allImages[lightboxIndex]?.src}
                    alt={allImages[lightboxIndex]?.alt || `${project.title} - Image ${lightboxIndex + 1}`}
                    className="w-[130vw] h-auto cursor-zoom-out"
                    onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                    draggable={false}
                  />
                </div>
              ) : (
                <img
                  src={allImages[lightboxIndex]?.src}
                  alt={allImages[lightboxIndex]?.alt || `${project.title} - Image ${lightboxIndex + 1}`}
                  className={`max-w-[92vw] max-h-[calc(100vh-8rem)] object-contain ${!isTouchDevice ? 'cursor-zoom-in' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isTouchDevice) setIsZoomed(true);
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* Bottom Navigation - Sticky */}
            {allImages.length > 1 && (
              <div
                className="sticky bottom-0 left-0 right-0 flex items-center justify-center py-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={goToPrevious}
                    className="w-10 h-10 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <span className="text-text-tertiary text-sm font-sans min-w-[3rem] text-center">
                    {lightboxIndex + 1} / {allImages.length}
                  </span>
                  <button
                    onClick={goToNext}
                    className="w-10 h-10 flex items-center justify-center text-text-tertiary hover:text-text-primary transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
