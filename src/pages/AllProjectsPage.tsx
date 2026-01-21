import { useState, useRef, useCallback, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from '@/components/ProjectCard';
import { ProjectsFilter } from '@/components/ProjectsFilter';
import { MainCategory, SubCategory } from '@/lib/projectCategories';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getAllProjects } from '@/lib/projectsStatic';

const AllProjectsPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const clearFilters = useCallback(() => {
    setSelectedMainCategory(null);
    setSelectedSubCategories([]);
  }, []);

  // Get all projects from static data
  const allProjects = getAllProjects();
  console.log("All static projects:", allProjects);
  // Filter projects by selected main category and subcategories
  const filteredProjects = allProjects.filter(project => {
    const mainCatMatch = selectedMainCategory ? project.mainCategory === selectedMainCategory : true;
    const subCatMatch = selectedSubCategories.length > 0
      ? selectedSubCategories.some(sub => {
        if (Array.isArray(project.subCategory)) {
          return project.subCategory.includes(sub);
        }
        return (project.subCategory || '').split(',').map(s => s.trim()).includes(sub);
      })
      : true;
    const isArchived = String(project.archived) === 'true';
    return mainCatMatch && subCatMatch && !isArchived;
  });
  console.log("Filtered projects:", filteredProjects);
  const totalCount = allProjects.length;
  const projects = filteredProjects;
  console.log('First project object:', allProjects[0]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="py-32 bg-white" ref={sectionRef}>
        <div className="container mx-auto">
          <div className="mb-8 px-4">
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

          <div>
            <div className="text-right text-xs text-gray-400 mb-2">
              Showing {projects.length} of {totalCount} projects
            </div>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
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
            ) : (
              <div className="text-center py-12">
                <Logo variant="short" className="mx-auto text-3xl mb-4" />
                <p className="text-muted-foreground">No projects match the selected criteria.</p>
                <Button className="mt-4" variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default AllProjectsPage;
