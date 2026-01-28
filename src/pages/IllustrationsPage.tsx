import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { getIllustrationsContent } from '@/lib/illustrations';
import { useSEO, generateTitle } from '@/hooks/useSEO';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

export function IllustrationsPage() {
  const { meta, illustrations } = getIllustrationsContent();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  useSEO({
    title: generateTitle(meta.title),
    description: meta.description,
    keywords: ['Illustrations', 'Digital Art', 'Creative', 'Artwork', 'Drawing'],
  });

  // Lock body scroll when lightbox is open
  useBodyScrollLock(selectedIndex !== null);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsZoomed(false);
  };
  const closeLightbox = () => {
    setSelectedIndex(null);
    setIsZoomed(false);
  };

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? illustrations.length - 1 : selectedIndex - 1);
      setIsZoomed(false);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === illustrations.length - 1 ? 0 : selectedIndex + 1);
      setIsZoomed(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      setSelectedIndex(selectedIndex === 0 ? illustrations.length - 1 : selectedIndex - 1);
      setIsZoomed(false);
    } else if (e.key === 'ArrowRight') {
      setSelectedIndex(selectedIndex === illustrations.length - 1 ? 0 : selectedIndex + 1);
      setIsZoomed(false);
    }
  }, [selectedIndex, illustrations.length]);

  useEffect(() => {
    if (selectedIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedIndex, handleKeyDown]);

  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionHeading
          label={meta.label}
          title={meta.title}
          description={meta.description}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-16 md:mt-24">
          {illustrations.map((illustration, index) => (
            <motion.div
              key={illustration.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-square overflow-hidden bg-border">
                <img
                  src={illustration.image}
                  alt={illustration.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
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
              className={`flex-1 ${isZoomed ? 'overflow-auto scrollbar-hide' : 'flex items-center justify-center overflow-hidden pt-12'}`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  isZoomed ? setIsZoomed(false) : closeLightbox();
                }
              }}
            >
              {isZoomed ? (
                <div className="inline-block p-4">
                  <img
                    src={illustrations[selectedIndex].image}
                    alt={illustrations[selectedIndex].title}
                    className="w-[130vw] h-auto cursor-zoom-out"
                    onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
                    draggable={false}
                  />
                </div>
              ) : (
                <img
                  src={illustrations[selectedIndex].image}
                  alt={illustrations[selectedIndex].title}
                  className={`max-w-[92vw] max-h-[calc(100vh-8rem)] object-contain ${!isTouchDevice ? 'cursor-zoom-in' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isTouchDevice) setIsZoomed(true);
                  }}
                  draggable={false}
                />
              )}
            </div>

            {/* Bottom Navigation */}
            {illustrations.length > 1 && (
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
                    {selectedIndex + 1} / {illustrations.length}
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
