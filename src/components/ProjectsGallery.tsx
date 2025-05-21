
import { useRef, useState } from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/lib/projectsData';
import { getFeaturedProjects } from '@/lib/projectsData';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [useRandomProjects, setUseRandomProjects] = useState(false);
  
  // Get featured projects or random projects based on state
  const featuredProjects = getFeaturedProjects(useRandomProjects);

  return (
    <section id="projects" className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl md:text-4xl font-light mb-4">SELECTED PROJECTS</h2>
            <div className="w-20 h-0.5 bg-gray-900"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="random-projects"
                checked={useRandomProjects}
                onCheckedChange={setUseRandomProjects}
              />
              <Label htmlFor="random-projects" className="text-sm text-gray-600">Random Selection</Label>
            </div>
            <Link to="/projects" className="text-black hover:text-black/70 transition-colors border-b border-black pb-1">
              View All Projects
            </Link>
          </div>
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

