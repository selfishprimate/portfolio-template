import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { getHomeContent } from '@/lib/home';
import { getExperiences } from '@/lib/experience';
import { getFeaturedProjects } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeading } from '@/components/SectionHeading';
import { useSEO, generateTitle } from '@/hooks/useSEO';

export function HomePage() {
  const home = getHomeContent();
  const featuredProjects = getFeaturedProjects();
  const experiences = getExperiences();

  useSEO({
    title: generateTitle(),
    description: home.hero.subtitle,
    keywords: ['UI/UX Designer', 'Product Designer', 'Istanbul', 'Portfolio', 'Web Design', 'Mobile App Design'],
  });
  const { scrollY } = useScroll();
  const imageOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-24 md:py-32 lg:py-40 overflow-visible">
        {/* Decorative ornament */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{ opacity: imageOpacity }}
          className="hidden lg:block fixed top-24 right-0 translate-x-1/2 lg:w-[600px] pointer-events-none"
        >
          <img
            src="/images/featured-image-for-light.svg"
            alt=""
            className="w-full h-auto light-only"
          />
          <img
            src="/images/featured-image-for-dark.svg"
            alt=""
            className="w-full h-auto dark-only"
          />
        </motion.div>

        <div className="relative max-w-4xl">
          {/* Greeting */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="text-text-tertiary font-sans text-sm uppercase">
              {home.hero.title} — {home.hero.location}
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif font-semibold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-text-primary leading-[1.1]"
          >
            {home.hero.headline}{' '}
            <span className="italic text-accent">{home.hero.headlineAccent}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl"
          >
            {home.hero.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link
              to="/works"
              className="inline-flex items-center gap-2 px-6 py-3 bg-text-primary text-surface font-sans text-sm rounded-full hover:bg-text-secondary transition-colors"
            >
              View My Works
              <ArrowRight size={16} />
            </Link>
            <a
              href={home.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-border text-text-primary font-sans text-sm rounded-full hover:bg-border/50 transition-colors"
            >
              LinkedIn
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-24 pt-12 border-t border-border"
        >
          <p className="font-serif italic text-xl md:text-2xl text-text-secondary max-w-2xl">
            "{home.quote.text}"
          </p>
          <cite className="mt-3 block text-sm text-text-tertiary not-italic">
            — {home.quote.author}
          </cite>
        </motion.blockquote>
      </section>

      {/* Featured Work Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="flex items-end justify-between mb-12">
          <SectionHeading
            label={home.featuredWork.label}
            title={home.featuredWork.title}
          />
          <Link
            to="/works"
            className="hidden md:inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View all works
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-16">
          {featuredProjects.slice(0, 4).map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
              variant="featured"
            />
          ))}
        </div>

        <div className="mt-12 md:hidden">
          <Link
            to="/works"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View all works
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Experience Preview */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <SectionHeading
          label={home.experiencePreview.label}
          title={home.experiencePreview.title}
        />

        <div className="grid max-w-3xl">
          {experiences.slice(0, 4).map((exp, index) => {
            const content = (
              <>
                {exp.logo && (
                  <div className="w-16 h-16 bg-border overflow-hidden flex-shrink-0">
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="inline-flex items-center gap-1.5 font-serif font-semibold text-xl text-text-primary group-hover:text-text-secondary transition-colors">
                    {exp.company}
                    {exp.url && <ArrowUpRight size={18} />}
                  </h3>
                  <p className="mt-1 text-text-secondary">
                    {exp.role} · Full Time · {exp.period.replace(' — ', ' · ')}
                  </p>
                  {exp.description && (
                    <p className="mt-2 text-text-secondary text-sm leading-snug">
                      {exp.description}
                    </p>
                  )}
                </div>
              </>
            );

            return (
              <motion.div
                key={exp.company + exp.period}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-border"
              >
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-5 py-6"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group flex items-start gap-5 py-6">
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <Link
            to="/experience"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            View full experience
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-text-primary p-12 md:p-16 lg:p-20"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative">
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-surface max-w-xl">
              {home.cta.title}
            </h2>
            <p className="mt-6 text-surface/70 text-lg max-w-lg">
              {home.cta.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={home.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text-primary font-sans text-sm rounded-full hover:bg-surface/90 transition-colors"
              >
                {home.cta.buttonText}
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
