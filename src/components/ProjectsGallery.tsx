import { useRef } from 'react';
import ProjectCard from './ProjectCard';
import { getAllProjects } from '@/lib/projectsStatic';
import type { Project } from '@/lib/projectsSupabase';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Get projects from static data
  const allProjects = getAllProjects();

  // Specific order requested: Green House, Villa Néon, Samas, Azure Mosque, Kɔkɔɔ Pɔn, The Miraj
  const selectedIds = ["16", "2", "25", "4", "15", "17"];

  const featuredProjects = selectedIds
    .map(id => allProjects.find(p => String(p.id) === id))
    .filter((p): p is Project => p !== undefined);

  return (
    <section id="projects" className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">SELECTED PROJECTS</h2>
            <div className="w-20 h-0.5 bg-gray-900"></div>
          </div>
          <Link
            to="/projects"
            className="text-gray-600 hover:text-gray-900 font-medium text-lg transition-colors"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project, index) => (
            <div key={project.id} className="animate-fadeIn">
              <ProjectCard
                id={project.id}
                title={project.title}
                category={Array.isArray(project.subCategory) ? project.subCategory.join(", ") : project.subCategory}
                year={project.year}
                imageUrl={project.imageUrl}
                index={index}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGallery;
