
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
import { Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

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
    
    // Allow toggling on regardless of count
    if (!project?.featured) {
      const updatedProjects = toggleProjectFeatured(id);
      setProjects([...updatedProjects]);
      setFeaturedCount(countFeaturedProjects());
      
      toast({
        title: "Project updated",
        description: `${project?.title} is now featured`,
      });
      return;
    }
    
    // When unfeaturing, check if we would go below minimum
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
      description: `${project?.title} is now unfeatured`,
    });
  };
  
  const handleDeleteProject = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    // Check if this is a featured project and we would go below minimum
    if (project.featured && featuredCount <= 6) {
      toast({
        title: "Cannot delete",
        description: "This is a featured project. You need at least 6 featured projects for the homepage gallery.",
        variant: "destructive",
      });
      return;
    }
    
    // Remove project from projectsData
    const updatedProjects = projectsData.filter(p => p.id !== id);
    // Update the state projects
    setProjects(updatedProjects);
    // Update featuredCount if needed
    if (project.featured) {
      setFeaturedCount(prevCount => prevCount - 1);
    }
    
    toast({
      title: "Project deleted",
      description: `${project.title} has been removed`,
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
            Select which projects appear on the homepage. You need at least 6 featured projects.
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
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {project.featured ? "Featured" : "Not featured"}
                      </span>
                      <Switch
                        checked={project.featured}
                        onCheckedChange={() => handleToggleFeatured(project.id)}
                      />
                    </div>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Project</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {project.title}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => handleDeleteProject(project.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
