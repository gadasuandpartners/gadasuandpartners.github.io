
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
  updateProject,
  archiveProject,
  unarchiveProject,
  getArchivedProjects,
  getNonArchivedProjects,
  setRandomSelection,
  getRandomSelection
} from "@/lib/projectsData";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Archive, Edit, Trash2, RefreshCw, ArchiveRestore } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SocialMediaSettings from "@/components/SocialMediaSettings";

const AdminPage = () => {
  const [projects, setProjects] = useState<Project[]>(getNonArchivedProjects());
  const [archivedProjects, setArchivedProjects] = useState<Project[]>(getArchivedProjects());
  const [featuredCount, setFeaturedCount] = useState(countFeaturedProjects());
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedProjectToReplace, setSelectedProjectToReplace] = useState<number | null>(null);
  const [projectToReplaceWith, setProjectToReplaceWith] = useState<number | null>(null);
  const [useRandomProjects, setUseRandomProjects] = useState(getRandomSelection());
  const [settingsTab, setSettingsTab] = useState<string>("projects");
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
    if (project && !project.featured) {
      if (featuredCount >= 6) {
        setProjectToReplaceWith(id);
        return;
      }
      
      const updatedProjects = toggleProjectFeatured(id);
      setProjects([...getNonArchivedProjects()]);
      setFeaturedCount(countFeaturedProjects());
      
      toast({
        title: "Project updated",
        description: `${project?.title} is now featured`,
      });
      return;
    }
    
    // When unfeaturing, check if we would go below minimum
    if (project && featuredCount <= 6 && project.featured) {
      toast({
        title: "Cannot unfeature",
        description: "You need at least 6 featured projects for the homepage gallery",
        variant: "destructive",
      });
      return;
    }
    
    const updatedProjects = toggleProjectFeatured(id);
    setProjects([...getNonArchivedProjects()]);
    setFeaturedCount(countFeaturedProjects());
    
    toast({
      title: "Project updated",
      description: `${project?.title} is now unfeatured`,
    });
  };
  
  const handleReplaceProject = () => {
    if (selectedProjectToReplace && projectToReplaceWith) {
      const updatedProjects = replaceFeaturedProject(selectedProjectToReplace, projectToReplaceWith);
      setProjects([...getNonArchivedProjects()]);
      
      // Reset selection
      setSelectedProjectToReplace(null);
      setProjectToReplaceWith(null);
      
      toast({
        title: "Featured projects updated",
        description: "The projects have been successfully swapped",
      });
    }
  };
  
  const handleArchiveProject = (id: number) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    
    // Check if this is a featured project and we would go below minimum
    if (project.featured && featuredCount <= 6) {
      toast({
        title: "Cannot archive",
        description: "This is a featured project. You need at least 6 featured projects for the homepage gallery.",
        variant: "destructive",
      });
      return;
    }
    
    // Archive the project
    archiveProject(id);
    
    // Update states
    setProjects([...getNonArchivedProjects()]);
    setArchivedProjects([...getArchivedProjects()]);
    setFeaturedCount(countFeaturedProjects());
    
    toast({
      title: "Project archived",
      description: `${project.title} has been moved to the archive`,
    });
  };
  
  const handleUnarchiveProject = (id: number) => {
    const project = archivedProjects.find(p => p.id === id);
    if (!project) return;
    
    // Unarchive the project
    unarchiveProject(id);
    
    // Update states
    setProjects([...getNonArchivedProjects()]);
    setArchivedProjects([...getArchivedProjects()]);
    
    toast({
      title: "Project restored",
      description: `${project.title} has been restored from the archive`,
    });
  };
  
  const handleDeleteProject = (id: number) => {
    const project = [...projects, ...archivedProjects].find(p => p.id === id);
    if (!project) return;
    
    // Remove project from projectsData
    const updatedProjects = deleteProject(id);
    
    // Update the state projects
    setProjects([...getNonArchivedProjects()]);
    setArchivedProjects([...getArchivedProjects()]);
    
    // Update featuredCount if needed
    if (project.featured) {
      setFeaturedCount(countFeaturedProjects());
    }
    
    toast({
      title: "Project deleted",
      description: `${project.title} has been permanently removed`,
    });
  };
  
  const handleEditProject = (project: Project) => {
    setSelectedProjectForEdit(project);
  };

  const handleProjectUpdated = () => {
    // Refresh the projects list
    setProjects([...getNonArchivedProjects()]);
    setArchivedProjects([...getArchivedProjects()]);
    setFeaturedCount(countFeaturedProjects());
    setSelectedProjectForEdit(null);
    
    toast({
      title: "Project updated",
      description: "The project details have been updated",
    });
  };

  const handleToggleRandomProjects = (value: boolean) => {
    setUseRandomProjects(value);
    setRandomSelection(value);
    
    toast({
      title: value ? "Random selection enabled" : "Featured selection enabled",
      description: value 
        ? "Homepage will now show random projects each time" 
        : "Homepage will now show your selected featured projects",
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
            <h1 className="text-3xl md:text-4xl font-light mb-4">ADMIN DASHBOARD</h1>
            <div className="w-20 h-0.5 bg-gray-900"></div>
            <p className="mt-6 text-muted-foreground max-w-2xl">
              Manage projects, settings, and content for the Gadasu+Partners website.
            </p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log out
          </Button>
        </div>

        <Tabs 
          defaultValue="projects" 
          value={settingsTab} 
          onValueChange={setSettingsTab}
          className="mb-10"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="archive">Archive ({archivedProjects.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="projects">
            <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch 
                  id="random-projects"
                  checked={useRandomProjects} 
                  onCheckedChange={handleToggleRandomProjects}
                />
                <label htmlFor="random-projects" className="text-sm cursor-pointer">
                  Show random projects on homepage instead of featured
                </label>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setProjects([...getNonArchivedProjects()]);
                    setFeaturedCount(countFeaturedProjects());
                  }}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh List
                </Button>
                <Select 
                  value={selectedTab} 
                  onValueChange={setSelectedTab}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Projects</SelectItem>
                    <SelectItem value="featured">Featured ({featuredCount})</SelectItem>
                    <SelectItem value="unfeatured">Unfeatured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {projectToReplaceWith && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Replace Featured Project</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            )}
            
            <Card className="mb-10">
              <CardHeader>
                <CardTitle>Project List</CardTitle>
              </CardHeader>
              <CardContent>
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
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-yellow-600 hover:text-yellow-700"
                          onClick={() => handleArchiveProject(project.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        
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
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectForm onProjectAdded={() => {
                  setProjects([...getNonArchivedProjects()]);
                  setFeaturedCount(countFeaturedProjects());
                  toast({
                    title: "Project added",
                    description: "The new project has been successfully added",
                  });
                }} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Website Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SocialMediaSettings />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="archive">
            <Card>
              <CardHeader>
                <CardTitle>Archived Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  {archivedProjects.map((project) => (
                    <div key={project.id} className="flex justify-between items-center py-3 border-b">
                      <div>
                        <h3 className="font-medium">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {project.mainCategory} - {project.subCategory}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleUnarchiveProject(project.id)}
                        >
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive/80">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Project Permanently</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to permanently delete {project.title}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleDeleteProject(project.id)}
                              >
                                Delete Permanently
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                  
                  {archivedProjects.length === 0 && (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground">No archived projects found.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
