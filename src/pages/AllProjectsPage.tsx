import { useState, useRef, useEffect, useCallback } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProjectCard from '@/components/ProjectCard';
import { ProjectsFilter } from '@/components/ProjectsFilter';
import { Project } from '@/lib/projectsData';
import { fetchProjectRow, ProjectFilters } from '@/lib/projectsSupabase';
import { MainCategory, SubCategory } from '@/lib/projectCategories';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from "@/components/ui/alert";

const AllProjectsPage = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedMainCategory, setSelectedMainCategory] = useState<MainCategory | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<SubCategory[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentRow, setCurrentRow] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Function to fetch the next row of projects
  const loadNextRow = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      console.log(`Loading row ${currentRow}...`);
      setLoading(true);
      setError(null);
      
      const filters: ProjectFilters = {};
      if (selectedMainCategory) {
        filters.mainCategory = selectedMainCategory;
      }
      if (selectedSubCategories.length > 0) {
        filters.subCategories = selectedSubCategories;
      }

      const response = await fetchProjectRow(currentRow, filters);
      console.log(`Row ${currentRow} loaded:`, response.data.length, 'projects');
      
      setProjects(prev => [...prev, ...response.data]);
      setHasMore(response.hasMore);
      setTotalCount(response.count);
      setCurrentRow(prev => prev + 1);
      setRetryCount(0); // Reset retry count on success
    } catch (error) {
      console.error('Error loading projects:', error);
      setError('Failed to load projects. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [currentRow, hasMore, loading, selectedMainCategory, selectedSubCategories]);

  // Reset and load first row when filters change
  const resetAndLoad = useCallback(async () => {
    console.log('Resetting and loading first row...');
    setProjects([]);
    setCurrentRow(1);
    setHasMore(true);
    setError(null);
    setRetryCount(0);

    const filters: ProjectFilters = {};
    if (selectedMainCategory) {
      filters.mainCategory = selectedMainCategory;
    }
    if (selectedSubCategories.length > 0) {
      filters.subCategories = selectedSubCategories;
    }

    try {
      setLoading(true);
      const response = await fetchProjectRow(1, filters);
      console.log('Initial row loaded:', response.data.length, 'projects');
      
      setProjects(response.data);
      setHasMore(response.hasMore);
      setTotalCount(response.count);
      setCurrentRow(2);
    } catch (error) {
      console.error('Error loading initial projects:', error);
      setError('Failed to load projects. Please try again.');
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  }, [selectedMainCategory, selectedSubCategories]);

  // Initial load
  useEffect(() => {
    console.log('Initial load triggered');
    resetAndLoad();
  }, [resetAndLoad]);

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    if (error) return; // Don't observe when there's an error

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          console.log('Scroll trigger activated, loading next row');
          loadNextRow();
        }
      },
      { rootMargin: '200px' }
    );

    const loadMoreTrigger = document.getElementById('load-more-trigger');
    if (loadMoreTrigger) {
      observer.observe(loadMoreTrigger);
    }

    return () => observer.disconnect();
  }, [loadNextRow, loading, hasMore, error]);

  const clearFilters = useCallback(() => {
    setSelectedMainCategory(null);
    setSelectedSubCategories([]);
  }, []);

  // Retry handler
  const handleRetry = useCallback(() => {
    console.log('Retrying load...');
    if (projects.length === 0) {
      resetAndLoad();
    } else {
      loadNextRow();
    }
  }, [projects.length, resetAndLoad, loadNextRow]);

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

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="ml-4"
                  onClick={handleRetry}
                  disabled={loading}
                >
                  {loading ? 'Retrying...' : 'Retry'}
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {projects.length === 0 && loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading projects...</p>
            </div>
          ) : projects.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div key={project.id} className="animate-fadeIn">
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
              
              {/* Loading indicator for next row */}
              {loading && (
                <div className="flex justify-center mt-8">
                  <p className="text-muted-foreground">Loading more projects...</p>
                </div>
              )}
              
              {/* Invisible trigger for intersection observer */}
              {hasMore && !error && (
                <div id="load-more-trigger" className="h-10 mt-8" />
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
                Clear Filters {totalCount > 0 && `(Found ${totalCount} projects)`}
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
