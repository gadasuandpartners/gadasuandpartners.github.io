
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProjectForm } from "@/components/ProjectForm";
import { isAuthenticated, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { 
  Project, 
  projectsData, 
  countFeaturedProjects, 
  toggleProjectFeatured, 
  deleteProject,
  replaceFeaturedProject,
  getProjectById,
  updateProject
} from "@/lib/projectsData";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Trash2 } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
} from "@/components/ui/sheet";
import { EditProjectForm } from "@/components/EditProjectForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminPage = () => {
  const [projects, setProjects] = useState<Project[]>(projectsData);
  const [featuredCount, setFeaturedCount] = useState(countFeaturedProjects());
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedProjectToReplace, setSelectedProjectToReplace] = useState<number | null>(null);
  const [projectToReplaceWith, setProjectToReplaceWith] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
    }
  }, [navigate]);

  // Filter projects based on tab
  const filteredProjects = projects.filter(project => {
    if (selectedTab === "featured") return project.featured;
    if (selectedTab === "unfeatured") return !project.featured;
    return true; // "all" tab
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleToggleFeatured = (id: number) => {
    const project = projects.find(p => p.id === id);
    
    // Allow toggling on regardless of count
    if (!project?.featured) {
      if (featuredCount >= 6) {
        setSelectedProjectToReplace(null);
        setProjectToReplaceWith(id);
        return;
      }
      
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
        title: "Cannot unfeature",
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
  
  const handleReplaceProject = () => {
    if (selectedProjectToReplace && projectToReplaceWith) {
      const updatedProjects = replaceFeaturedProject(selectedProjectToReplace, projectToReplaceWith);
      setProjects([...updatedProjects]);
      
      // Reset selection
      setSelectedProjectToReplace(null);
      setProjectToReplaceWith(null);
      
      toast({
        title: "Featured projects updated",
        description: "The projects have been successfully swapped",
      });
    }
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
    const updatedProjects = deleteProject(id);
    // Update the state projects
    setProjects([...updatedProjects]);
    // Update featuredCount if needed
    if (project.featured) {
      setFeaturedCount(prevCount => prevCount - 1);
    }
    
    toast({
      title: "Project deleted",
      description: `${project.title} has been removed`,
    });
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProjectForEdit(project);
  };

  const handleProjectUpdated = () => {
    // Refresh the projects list
    setProjects([...projectsData]);
    setFeaturedCount(countFeaturedProjects());
    setSelectedProjectForEdit(null);
    
    toast({
      title: "Project updated",
      description: "The project details have been updated",
    });
  };

  const getFeaturedProjectOptions = () => {
    return projects.filter(p => !p.featured).map(p => (
      <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
    ));
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
        
        <Tabs 
          defaultValue="all" 
          value={selectedTab} 
          onValueChange={setSelectedTab}
          className="mb-10"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="featured">Featured ({featuredCount})</TabsTrigger>
            <TabsTrigger value="unfeatured">Unfeatured</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            {projectToReplaceWith && (
              <div className="bg-muted p-4 rounded-lg mb-6">
                <h3 className="font-medium mb-2">Replace Featured Project</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You already have 6 featured projects. Select which featured project to replace:
                </p>
                <div className="flex gap-4 flex-wrap">
                  <Select 
                    value={selectedProjectToReplace?.toString() || ""}
                    onValueChange={(value) => setSelectedProjectToReplace(Number(value))}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select project to replace" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects
                        .filter(p => p.featured)
                        .map(p => (
                          <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleReplaceProject}
                      disabled={!selectedProjectToReplace}
                    >
                      Replace
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setProjectToReplaceWith(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white p-6 shadow-sm border rounded-lg">
              <h2 className="text-2xl font-light mb-6">Project List</h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.mainCategory} - {project.subCategory}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {project.featured ? "Featured" : "Not featured"}
                        </span>
                        <Switch
                          checked={project.featured}
                          onCheckedChange={() => handleToggleFeatured(project.id)}
                        />
                      </div>
                      
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Edit Project</SheetTitle>
                            <SheetDescription>
                              Make changes to the project information here.
                            </SheetDescription>
                          </SheetHeader>
                          <EditProjectForm 
                            project={project} 
                            onUpdate={handleProjectUpdated}
                          />
                          <SheetFooter className="mt-4">
                            <SheetClose asChild>
                              <Button type="button" variant="outline">Cancel</Button>
                            </SheetClose>
                          </SheetFooter>
                        </SheetContent>
                      </Sheet>
                      
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
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No projects found.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="featured">
            {/* Featured projects tab content - similar to "all" but filtered */}
            <div className="bg-white p-6 shadow-sm border rounded-lg">
              <h2 className="text-2xl font-light mb-6">Featured Projects</h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.mainCategory} - {project.subCategory}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Edit Project</SheetTitle>
                            <SheetDescription>
                              Make changes to the project information here.
                            </SheetDescription>
                          </SheetHeader>
                          <EditProjectForm 
                            project={project} 
                            onUpdate={handleProjectUpdated}
                          />
                        </SheetContent>
                      </Sheet>
                      
                      {featuredCount > 6 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(project.id)}
                        >
                          Remove from Featured
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No featured projects found.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unfeatured">
            <div className="bg-white p-6 shadow-sm border rounded-lg">
              <h2 className="text-2xl font-light mb-6">Unfeatured Projects</h2>
              <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="flex justify-between items-center py-3 border-b">
                    <div>
                      <h3 className="font-medium">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.mainCategory} - {project.subCategory}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
                          <SheetHeader>
                            <SheetTitle>Edit Project</SheetTitle>
                            <SheetDescription>
                              Make changes to the project information here.
                            </SheetDescription>
                          </SheetHeader>
                          <EditProjectForm 
                            project={project} 
                            onUpdate={handleProjectUpdated}
                          />
                        </SheetContent>
                      </Sheet>
                      
                      {featuredCount < 6 ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleFeatured(project.id)}
                        >
                          Add to Featured
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProjectToReplaceWith(project.id)}
                        >
                          Replace a Featured
                        </Button>
                      )}
                      
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
                
                {filteredProjects.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">No unfeatured projects found.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-white p-6 shadow-sm border rounded-lg">
          <h2 className="text-2xl font-light mb-6">Add New Project</h2>
          <ProjectForm onProjectAdded={() => {
            setProjects([...projectsData]);
            setFeaturedCount(countFeaturedProjects());
          }} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
