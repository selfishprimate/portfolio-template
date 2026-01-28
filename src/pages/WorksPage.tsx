import { getProjects, getWorksMeta } from '@/lib/projects';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHeading } from '@/components/SectionHeading';
import { useSEO, generateTitle } from '@/hooks/useSEO';

export function WorksPage() {
  const allProjects = getProjects();
  const meta = getWorksMeta();

  useSEO({
    title: generateTitle(meta.title),
    description: meta.description,
    keywords: ['UI/UX Design', 'Portfolio', 'Mobile App Design', 'Web Design', 'Design System', 'Case Studies'],
  });

  return (
    <div className="min-h-screen">
      {/* Projects */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        <SectionHeading
          label={meta.label}
          title={meta.title}
          description={meta.description}
        />

        <div className="grid md:grid-cols-2 gap-16 mt-16 md:mt-24">
          {allProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
