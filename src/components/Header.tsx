import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';

const navItems = [
  { label: 'Works', path: '/works' },
  { label: 'Illustrations', path: '/illustrations' },
  { label: 'Articles', path: '/articles' },
  { label: 'Experience', path: '/experience' },
  { label: 'About', path: '/about' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [enableTransition, setEnableTransition] = useState(false);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();

  // Get active nav item index
  const activeIndex = navItems.findIndex(
    item => location.pathname === item.path || location.pathname.startsWith(item.path + '/')
  );

  // Update underline position when active index changes
  useEffect(() => {
    if (activeIndex !== -1 && navRefs.current[activeIndex]) {
      const el = navRefs.current[activeIndex];
      setUnderlineStyle({
        left: el?.offsetLeft ?? 0,
        width: el?.offsetWidth ?? 0
      });
    }
  }, [activeIndex]);

  // Enable transition only after first render
  useEffect(() => {
    const timer = setTimeout(() => setEnableTransition(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useBodyScrollLock(isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-surface/80 backdrop-blur-lg' : ''
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group">
              <div className="flex flex-col items-start">
                <h1 className="flex items-baseline gap-2">
                  <span className="font-serif font-medium text-2xl text-text-primary" style={{ letterSpacing: '-0.03em' }}>
                    Portfolio
                  </span>
                  <span className="font-serif font-medium text-2xl text-text-primary" style={{ letterSpacing: '-0.03em' }}>
                    Template
                  </span>
                </h1>
                <span className="hidden sm:block text-xs text-text-secondary/80 mt-0.5">
                  Showcase your creative work.
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <h2 className="sr-only">Main Navigation</h2>
              <div className="relative flex items-center gap-8">
                {navItems.map((item, index) => (
                  <Link
                    key={item.path}
                    ref={el => { navRefs.current[index] = el; }}
                    to={item.path}
                    className={`relative font-sans text-sm transition-colors hover:text-text-primary ${
                      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {activeIndex !== -1 && underlineStyle.width > 0 && (
                  <span
                    className="absolute -bottom-1 h-px bg-text-primary"
                    style={{
                      left: underlineStyle.left,
                      width: underlineStyle.width,
                      transition: enableTransition ? 'left 0.3s ease, width 0.3s ease' : 'none'
                    }}
                  />
                )}
              </div>
              <ThemeToggle />
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Open menu"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-[5px]">
                  <span className="block w-full h-[1.3px] bg-current"></span>
                  <span className="block w-full h-[1.3px] bg-current"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Outside header for proper z-index stacking */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 bg-background z-[100]"
          >
            {/* Close button */}
            <button
              onClick={closeMenu}
              className="absolute top-6 right-6 p-2 rounded-full text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Close menu"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={item.path}
                    onClick={closeMenu}
                    className={`font-serif text-3xl transition-colors hover:text-text-primary ${
                      location.pathname === item.path
                        ? 'text-text-primary'
                        : 'text-text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
