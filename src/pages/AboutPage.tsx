import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getAboutContent } from '@/lib/about';
import { useSEO, generateTitle } from '@/hooks/useSEO';

export function AboutPage() {
  const about = getAboutContent();

  useSEO({
    title: generateTitle('About'),
    description: 'Learn about Jonathan Doe, a UI/UX Designer with over 10 years of experience crafting digital experiences across mobile, web, and enterprise platforms.',
    keywords: ['About', 'UI/UX Designer', 'Experience', 'Skills', 'Background'],
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-border overflow-hidden">
              {about.profile.avatar && (
                <img
                  src={about.profile.avatar}
                  alt={about.profile.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            <span className="text-xs font-sans uppercase text-text-tertiary">
              About Me
            </span>
            <h2 className="mt-4 font-serif font-semibold text-4xl md:text-5xl text-text-primary">
              {about.profile.name}
            </h2>
            <p className="mt-2 text-text-secondary text-lg">
              {about.profile.title} · {about.profile.location}
            </p>

            <div className="mt-8 space-y-6 text-text-secondary leading-relaxed">
              {about.bio.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            {/* Social Links */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href={about.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary font-sans text-sm rounded-full hover:bg-border/50 transition-colors"
              >
                LinkedIn
                <ArrowUpRight size={14} />
              </a>
              <a
                href={about.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary font-sans text-sm rounded-full hover:bg-border/50 transition-colors"
              >
                GitHub
                <ArrowUpRight size={14} />
              </a>
              <a
                href={about.social.patreon}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-text-primary font-sans text-sm rounded-full hover:bg-border/50 transition-colors"
              >
                Patreon
                <ArrowUpRight size={14} />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quote */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="sr-only">Quote</h2>
        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="font-serif italic text-2xl md:text-3xl text-text-primary">
            "{about.quote.text}"
          </p>
          <cite className="mt-4 block text-text-tertiary not-italic">
            — {about.quote.author}
          </cite>
        </motion.blockquote>
      </section>

      {/* Skills & Domains */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <h2 className="sr-only">Skills & Domains</h2>
        <div className="flex flex-col gap-12 text-center">
          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-serif font-semibold text-2xl text-text-primary mb-2">
              {about.skills.title}
            </h3>
            {about.skills.description && (
              <p className="text-text-tertiary mb-6">{about.skills.description}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {about.skills.items.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 text-sm font-sans text-text-secondary border border-border rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Domains */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-serif font-semibold text-2xl text-text-primary mb-2">
              {about.domains.title}
            </h3>
            {about.domains.description && (
              <p className="text-text-tertiary mb-6">{about.domains.description}</p>
            )}
            <div className="flex flex-wrap justify-center gap-2">
              {about.domains.items.map((domain) => (
                <span
                  key={domain}
                  className="px-4 py-2 text-sm font-sans text-text-secondary border border-border rounded-full"
                >
                  {domain}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Personal */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif font-semibold text-2xl text-text-primary mb-6">
            {about.beyondDesign.title}
          </h2>
          {about.beyondDesign.paragraphs.map((paragraph, index) => (
            <p key={index} className={`text-text-secondary leading-relaxed ${index > 0 ? 'mt-4' : ''}`}>
              {paragraph}
            </p>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
