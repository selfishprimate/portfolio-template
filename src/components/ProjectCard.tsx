import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  variant?: 'default' | 'featured';
}

export function ProjectCard({ project, index, variant = 'default' }: ProjectCardProps) {
  const isFeatured = variant === 'featured';

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link
        to={`/works/${project.slug}`}
        className={`group block ${isFeatured ? '' : ''}`}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-border">
          {project.coverImage && (
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-auto transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-text-primary/0 group-hover:bg-text-primary/5 transition-colors duration-300" />

          {/* Arrow indicator */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <ArrowUpRight size={18} className="text-text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="mt-5">
          <p className="text-xs font-sans text-text-tertiary mb-2 uppercase">
            {project.company}, {project.year}
          </p>
          
          <h3 className={`font-serif font-semibold text-text-primary group-hover:text-text-secondary transition-colors ${
            isFeatured ? 'text-xl md:text-2xl' : 'text-xl md:text-2xl'
          }`}>
            {project.title}
          </h3>

          <p className="mt-2 text-text-secondary/70 leading-snug line-clamp-2">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
