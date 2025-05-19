
import { useRef, useEffect } from 'react';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    id: 1,
    title: "Skyline Tower",
    category: "Commercial",
    year: "2023",
    imageUrl: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    title: "The Glass House",
    category: "Residential",
    year: "2022",
    imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    title: "Urban Museum",
    category: "Cultural",
    year: "2021",
    imageUrl: "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&q=80"
  },
  {
    id: 4,
    title: "Eco Pavilion",
    category: "Sustainable",
    year: "2023",
    imageUrl: "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&q=80"
  },
  {
    id: 5,
    title: "The Concrete Lane",
    category: "Residential",
    year: "2022",
    imageUrl: "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80"
  }
];

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const projectElements = sectionRef.current?.querySelectorAll('.project-item');
    projectElements?.forEach(el => {
      observer.observe(el);
    });
    
    return () => {
      projectElements?.forEach(el => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <section id="projects" className="py-24 bg-white" ref={sectionRef}>
      <div className="container">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">SELECTED PROJECTS</h2>
          <div className="w-20 h-0.5 bg-gray-900"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projectsData.map((project, index) => (
            <div key={project.id} className="opacity-0 project-item">
              <ProjectCard
                title={project.title}
                category={project.category}
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
