
import { useRef } from 'react';
import ProjectCard from './ProjectCard';
import { getFeaturedProjects } from '@/lib/projectsData';
import Logo from './Logo';
import { Link } from 'react-router-dom';

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Get featured projects
  const featuredProjects = getFeaturedProjects();

  return (
    <section id="projects" className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">SELECTED PROJECTS</h2>
            <div className="w-20 h-0.5 bg-gray-900"></div>
          </div>
          <Link to="/projects" className="text-black hover:text-black/70 transition-colors border-b border-black pb-1">
            View All Projects
          </Link>
        </div>
        
        {featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="project-item animate-fade">
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  category={project.subCategory}
                  year={project.year}
                  imageUrl={project.imageUrl}
                  index={index}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Logo variant="short" className="mx-auto text-3xl mb-4" />
            <p className="text-muted-foreground">No projects available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsGallery;
