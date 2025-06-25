import { useRef, useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { getFeaturedProjectsSupabase, getRandomSelectionSetting } from '@/lib/projectsSupabase';
import { Project } from '@/lib/projectsData';
import Logo from './Logo';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { checkConnection } from '@/lib/supabaseClient';

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load featured projects from Supabase
  useEffect(() => {
    let mounted = true;

    const loadProjects = async () => {
      console.log('Starting to load featured projects...');
      
      try {
        // First check connection
        const isConnected = await checkConnection();
        if (!isConnected) {
          throw new Error('Unable to connect to database');
        }

        setLoading(true);
        setError(null);

        // Track timing
        const start = performance.now();
        
        console.log('Getting random selection setting...');
        const useRandom = await getRandomSelectionSetting();
        
        console.log('Fetching featured projects...');
        const projects = await getFeaturedProjectsSupabase(useRandom);
        
        const duration = performance.now() - start;
        console.log(`Loaded ${projects.length} projects in ${duration.toFixed(0)}ms`);
        
        if (mounted) {
          setFeaturedProjects(projects);
        }
      } catch (err) {
        console.error('Error in ProjectsGallery:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load projects'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  // Error display helper
  const errorMessage = error ? (
    <Alert variant="destructive" className="mb-6">
      <AlertDescription>
        {error.message}
        <Button
          variant="outline"
          size="sm"
          className="ml-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  ) : null;

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
            className="text-black hover:text-black/70 transition-colors border-b border-black pb-1"
          >
            View All Projects
          </Link>
        </div>
        
        {errorMessage}
        
        {loading ? (
          <div className="text-center py-12">
            <Logo variant="short" className="mx-auto text-3xl mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project, index) => (
              <div key={project.id} className="project-item opacity-100 transition-opacity duration-300">
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
        ) : (
          <div className="text-center py-12">
            <Logo variant="short" className="mx-auto text-3xl mb-4" />
            <p className="text-muted-foreground">No projects available.</p>
            {error && (
              <Button 
                variant="outline" 
                size="sm"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsGallery;
