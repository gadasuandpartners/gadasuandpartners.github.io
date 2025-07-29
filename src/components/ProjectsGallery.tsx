import { useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import { getFeaturedProjects } from '@/lib/projectsData';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [featuredProjects] = useState(() => getFeaturedProjects(false));

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
