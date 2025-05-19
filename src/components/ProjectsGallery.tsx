
import { useRef } from 'react';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    id: 1,
    title: "Organic Pavilion",
    category: "Commercial",
    year: "2023",
    imageUrl: "/lovable-uploads/736ea871-2941-4e80-9534-508fd9db4bca.png"
  },
  {
    id: 2,
    title: "Urban Bloom",
    category: "Residential",
    year: "2022",
    imageUrl: "/lovable-uploads/15a43508-7557-4aa2-be9c-a44de267b573.png"
  },
  {
    id: 3,
    title: "Copper Tower",
    category: "Cultural",
    year: "2021",
    imageUrl: "/lovable-uploads/7cb1d03d-48df-47d4-823f-e66d9a5ade04.png"
  },
  {
    id: 4,
    title: "Azure Mosque",
    category: "Spiritual",
    year: "2023",
    imageUrl: "/lovable-uploads/1906d23e-b50f-474d-9a82-3d4a67c3df32.png"
  },
  {
    id: 5,
    title: "Harmony Heights",
    category: "Residential",
    year: "2022",
    imageUrl: "/lovable-uploads/6caa6b8d-d5d7-4639-978e-db301a0ec958.png"
  },
  {
    id: 6,
    title: "Desert Oasis",
    category: "Hospitality",
    year: "2022",
    imageUrl: "/lovable-uploads/4b883c8f-683c-4bee-b634-cf0672a3ad75.png"
  }
];

const ProjectsGallery = () => {
  const sectionRef = useRef<HTMLElement>(null);
  
  return (
    <section id="projects" className="py-24 bg-white" ref={sectionRef}>
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4">SELECTED PROJECTS</h2>
          <div className="w-20 h-0.5 bg-gray-900"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData.map((project, index) => (
            <div key={project.id} className="project-item animate-fade">
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
