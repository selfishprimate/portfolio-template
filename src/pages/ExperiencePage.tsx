import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { getExperienceContent } from '@/lib/experience';
import { SectionHeading } from '@/components/SectionHeading';
import { useSEO, generateTitle } from '@/hooks/useSEO';

export function ExperiencePage() {
  const { meta, experiences } = getExperienceContent();

  useSEO({
    title: generateTitle(meta.title),
    description: meta.description,
    keywords: ['Experience', 'Work History', 'UI/UX Designer', 'Career', 'Resume'],
  });

  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionHeading
          label={meta.label}
          title={meta.title}
          description={meta.description}
        />

        <div className="mt-12 space-y-0">
          {experiences.map((exp, index) => {
            const content = (
              <>
                {exp.logo && (
                  <div className="w-20 h-20 bg-border overflow-hidden flex-shrink-0">
                    <img
                      src={exp.logo}
                      alt={exp.company}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="inline-flex items-center gap-1.5 font-serif font-semibold text-xl text-text-primary group-hover:text-text-secondary transition-colors">
                    {exp.company}
                    {exp.url && <ArrowUpRight size={18} />}
                  </h3>
                  <p className="mt-1 text-text-secondary">
                    {exp.role} · Full Time · {exp.period.replace(' — ', ' · ')}
                  </p>
                  <p className="mt-4 text-text-secondary leading-snug">
                    {exp.description}
                  </p>
                  {exp.skills && exp.skills.length > 0 && (
                    <p className="mt-4 text-text-tertiary text-sm">
                      <span className="font-medium">Skills:</span> {exp.skills.join(', ')}
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
                transition={{ delay: index * 0.05 }}
                className="border-b border-border"
              >
                {exp.url ? (
                  <a
                    href={exp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex gap-6 py-8"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="group flex gap-6 py-8">
                    {content}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
