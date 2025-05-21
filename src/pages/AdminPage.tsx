
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProjectForm } from "@/components/ProjectForm";
import { isAuthenticated, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Project, projectsData, countFeaturedProjects, toggleProjectFeatured } from "@/lib/projectsData";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

const AdminPage = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [featuredCount, setFeaturedCount] = useState(countFeaturedProjects());
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleFeatured = (id: number) => {
    const project = projects.find(p => p.id === id);
    
    // Don't allow unfeaturing if only 6 featured projects and this one is featured
    if (featuredCount <= 6 && project?.featured) {
      toast({
        title: "Cannot unfeatured",
        description: "You need at least 6 featured projects for the homepage gallery",
        variant: "destructive",
      });
      return;
    }
    
    const updatedProjects = toggleProjectFeatured(id);
    setProjects([...updatedProjects]);
    setFeaturedCount(countFeaturedProjects());
    
    toast({
      title: "Project updated",
      description: `${project?.title} is now ${!project?.featured ? 'featured' : 'unfeatured'}`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-12 flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-light mb-4">PROJECT MANAGEMENT</h1>
            <div className="w-20 h-0.5 bg-gray-900"></div>
            <p className="mt-6 text-muted-foreground max-w-2xl">
              Add new projects to the Gadasu+Partners portfolio or manage existing ones.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>
        
        <div className="mb-10">
          <h2 className="text-2xl font-light mb-6">Featured Projects</h2>
          <p className="mb-4 text-muted-foreground">
            Select which projects appear on the homepage. You need exactly 6 featured projects.
            Currently featuring: <span className="font-semibold">{featuredCount}/6</span>
          </p>
          
          <div className="bg-white p-6 shadow-sm border rounded-lg mb-10">
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.mainCategory} - {project.subCategory}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {project.featured ? "Featured" : "Not featured"}
                    </span>
                    <Switch
                      checked={project.featured}
                      onCheckedChange={() => handleToggleFeatured(project.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 shadow-sm border rounded-lg">
          <h2 className="text-2xl font-light mb-6">Add New Project</h2>
          <ProjectForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;

