import { useState, useRef, useEffect } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from '@/components/ProjectCard';
import { ProjectsFilter } from '@/components/ProjectsFilter';
import { Project } from '@/lib/projectsData';
import { fetchProjects } from '@/lib/projectsSupabase';
import { MainCategory, SubCategory } from '@/lib/projectCategories';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';

const AllProjectsPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([]);
  const [visibleCount, setVisibleCount] = useState(20);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from Supabase
  useEffect(() => {
    setLoading(true);
    fetchProjects()
      .then(data => setProjects(data))
      .finally(() => setLoading(false));
  }, []);

  // Filter projects based on selected categories
  const filteredProjects = projects.filter((project: Project) => {
    if (!selectedMainCategory) return true;
    if (selectedMainCategory && selectedSubCategories.length === 0) {
      return project.mainCategory === selectedMainCategory;
    }
    return (
      project.mainCategory === selectedMainCategory &&
      (
        Array.isArray(project.subCategory)
          ? project.subCategory.some(sub => selectedSubCategories.includes(sub))
          : selectedSubCategories.includes(project.subCategory as SubCategory)
      )
    );
  });

  // Infinite scroll: load more projects as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
      ) {
        setVisibleCount((prev) => {
          if (prev < filteredProjects.length) {
            return prev + 20;
          }
          return prev;
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredProjects.length]);

  const clearFilters = () => {
    setSelectedMainCategory(null);
    setSelectedSubCategories([]);
    setVisibleCount(20);
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

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.slice(0, visibleCount).map((project, index) => (
                  <div key={project.id} className="project-item animate-fade">
                    <ProjectCard
                      id={project.id}
                      title={project.title}
                      category={
                        Array.isArray(project.subCategory)
                          ? project.subCategory.join(", ")
                          : project.subCategory
                      }
                      year={project.year}
                      imageUrl={project.imageUrl}
                      index={index}
                    />
                  </div>
                ))}
              </div>
              {visibleCount < filteredProjects.length && (
                <div className="flex justify-center mt-8">
                  <Button onClick={() => setVisibleCount((prev) => prev + 20)}>
                    Load More
                  </Button>
                </div>
              )}
            </>
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
