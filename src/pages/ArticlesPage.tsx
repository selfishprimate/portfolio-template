import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from '@/components/SectionHeading';
import { getArticlesContent } from '@/lib/articles';
import { useSEO, generateTitle } from '@/hooks/useSEO';

export function ArticlesPage() {
  const { meta, articles } = getArticlesContent();

  useSEO({
    title: generateTitle(meta.title),
    description: meta.description,
    keywords: ['Articles', 'Blog', 'Design', 'UI/UX', 'Thoughts', 'Insights'],
  });

  return (
    <div className="min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionHeading
          label={meta.label}
          title={meta.title}
          description={meta.description}
        />

        <div className="grid mt-16 md:mt-24">
          {articles.map((article, index) => (
            <motion.a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group grid md:grid-cols-[240px_1fr] gap-6 py-12 border-b border-border"
            >
              {/* Cover Image */}
              <div className="overflow-hidden bg-border aspect-square">
                {article.coverImage && (
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm font-sans text-text-tertiary">
                    {article.date}
                  </span>
                  <span className="text-text-tertiary">·</span>
                  <span className="text-sm font-sans text-text-tertiary">
                    Medium
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-xl md:text-2xl text-text-primary group-hover:text-text-secondary transition-colors">
                  {article.title}
                </h3>
                <p className="mt-3 text-text-secondary leading-relaxed">
                  {article.description}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-sm font-sans text-text-secondary bg-border rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-text-secondary group-hover:text-text-primary transition-colors ml-auto">
                    <span className="hidden sm:inline">Read</span>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
