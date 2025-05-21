
import { useState, useRef } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from '@/components/ProjectCard';
import { ProjectsFilter } from '@/components/ProjectsFilter';
import { Project } from '@/lib/projectsData';
import { projectsData } from '@/lib/projectsData';
import { MainCategory, SubCategory } from '@/lib/projectCategories';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

const AllProjectsPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([]);

  // Filter projects based on selected categories
  const filteredProjects = projectsData.filter((project: Project) => {
    // If no main category is selected, show all
    if (!selectedMainCategory) return true;

    // If main category is selected but no subcategory, show all from main category
    if (selectedMainCategory && selectedSubCategories.length === 0) {
      return project.mainCategory === selectedMainCategory;
    }

    // If both main category and subcategories are selected
    return (
      project.mainCategory === selectedMainCategory && 
      selectedSubCategories.includes(project.subCategory)
    );
  });

  const clearFilters = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategories([]);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="py-32 bg-white" ref={sectionRef}>
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-light mb-4">ALL PROJECTS</h2>
            <div className="w-20 h-0.5 bg-gray-900"></div>
          </div>
          
          <ProjectsFilter 
            selectedMainCategory={selectedMainCategory}
            setSelectedMainCategory={setSelectedMainCategory}
            selectedSubCategories={selectedSubCategories}
            setSelectedSubCategories={setSelectedSubCategories}
            clearFilters={clearFilters}
          />
          
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
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
              <p className="text-muted-foreground">No projects match the selected criteria.</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={clearFilters}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AllProjectsPage;
