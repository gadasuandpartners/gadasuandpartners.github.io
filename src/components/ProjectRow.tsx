import React, { useRef, useEffect } from 'react';
import { Project } from '@/lib/projectsData';
import ProjectCard from './ProjectCard';

interface ProjectRowProps {
  projects: Project[];
  onVisible: () => void;
  rowIndex: number;
}

const ProjectRow = ({ projects, onVisible, rowIndex }: ProjectRowProps) => {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
          observer.disconnect();
        }
      },
      { 
        rootMargin: "200px", // Start loading 200px before row becomes visible
        threshold: 0.1 
      }
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div 
      ref={rowRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          category={
            Array.isArray(project.subCategory)
              ? project.subCategory.join(", ")
              : project.subCategory
          }
          year={project.year}
          imageUrl={project.imageUrl}
          index={rowIndex === 0 && index === 0 ? 0 : index + 1} // Special handling for first card
        />
      ))}
    </div>
  );
};

export default ProjectRow;