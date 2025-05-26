// AdminPage.tsx (Supabase version)
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProjectForm } from "@/components/ProjectForm";
import { getCurrentUser, signOutSupabase } from "@/lib/authSupabase";
import { Button } from "@/components/ui/button";
import { Project } from "@/lib/projectsData";
import {
  fetchProjects,
  fetchArchivedProjects,
  addProjectSupabase,
  updateProjectSupabase,
  deleteProjectSupabase,
  archiveProjectSupabase,
  unarchiveProjectSupabase,
  toggleFeaturedSupabase,
} from "@/lib/projectsSupabase";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Archive, Edit, Trash2, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
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

const ADMIN_EMAIL = "sstonelabs@gmail.com";

const AdminPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [archivedProjects, setArchivedProjects] = useState<Project[]>([]);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedProjectToReplace, setSelectedProjectToReplace] = useState<number | null>(null);
  const [projectToReplaceWith, setProjectToReplaceWith] = useState<number | null>(null);
  const [useRandomProjects, setUseRandomProjects] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>("projects");
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication with Supabase
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await getCurrentUser();
        if (!user || user.email !== ADMIN_EMAIL) {
          navigate("/login");
          return;
        }
        setAuthLoading(false);
      } catch (error) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  // Fetch projects from Supabase
  const loadProjects = async () => {
    setLoading(true);
    try {
      const [all, archived] = await Promise.all([fetchProjects(), fetchArchivedProjects()]);
      setProjects(all);
      setArchivedProjects(archived);
      setFeaturedCount(all.filter(p => p.featured).length);
    } catch (e: any) {
      console.error('Error loading projects:', e);
      toast({
        title: "Error loading projects",
        description: e.message || String(e),
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects based on tab
  const filteredProjects = projects.filter(project => {
    if (selectedTab === "featured") return project.featured;
    if (selectedTab === "unfeatured") return !project.featured;
    return true;
  });

  const handleLogout = async () => {
    try {
      await signOutSupabase();
      navigate("/");
    } catch (error) {
      toast({ title: "Error signing out", description: String(error), variant: "destructive" });
    }
  };

  const handleReplaceProject = async (unfeaturedId: number, featuredId: number) => {
    try {
      // Unfeature the current featured project and feature the new one
      await toggleFeaturedSupabase(featuredId, false);
      await toggleFeaturedSupabase(unfeaturedId, true);
      await loadProjects();
      
      // Trigger homepage refresh
      localStorage.setItem('projectsUpdated', Date.now().toString());
      
      toast({
        title: "Projects replaced",
        description: "Featured project has been replaced successfully",
      });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    }
  };

  const handleToggleFeatured = async (id: number, featured: boolean) => {
    try {
      if (featured) {
        // If trying to feature a project, check if we already have 6 featured
        if (featuredCount >= 6) {
          toast({
            title: "Cannot feature project",
            description: "You already have 6 featured projects. Please unfeature one first or use the replace feature.",
            variant: "destructive"
          });
          return;
        }
      } else {
        // If trying to unfeature a project, check if we have exactly 6 featured
        if (featuredCount <= 6) {
          toast({
            title: "Cannot unfeature project",
            description: "You must maintain exactly 6 featured projects. Use the replace feature instead.",
            variant: "destructive"
          });
          return;
        }
      }
      
      await toggleFeaturedSupabase(id, featured);
      await loadProjects();
      
      // Trigger homepage refresh
      localStorage.setItem('projectsUpdated', Date.now().toString());
      
      toast({
        title: "Project updated",
        description: featured ? "Project is now featured" : "Project is now unfeatured",
      });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    }
  };

  const handleArchiveProject = async (id: number) => {
    try {
      await archiveProjectSupabase(id);
      await loadProjects();
      toast({ title: "Project archived", description: "Project has been archived" });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    }
  };

  const handleUnarchiveProject = async (id: number) => {
    try {
      await unarchiveProjectSupabase(id);
      await loadProjects();
      toast({ title: "Project restored", description: "Project has been restored from archive" });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await deleteProjectSupabase(id);
      await loadProjects();
      toast({ title: "Project deleted", description: "Project has been permanently removed" });
    } catch (e) {
      toast({ title: "Error", description: String(e), variant: "destructive" });
    }
  };

  const handleProjectAdded = async () => {
    await loadProjects();
    toast({ title: "Project added", description: "The new project has been successfully added" });
  };

  const handleProjectUpdated = async () => {
    await loadProjects();
    setSelectedProjectForEdit(null);
    toast({ title: "Project updated", description: "The project details have been updated" });
  };


  const getFeaturedProjectOptions = () => {
    return projects.filter(p => !p.featured).map(p => (
      <SelectItem key={p.id} value={p.id.toString()}>{p.title}</SelectItem>
    ));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Checking authentication...</p>
      </div>
    );
  }

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
                  onCheckedChange={(checked) => {
                    setUseRandomProjects(checked);
                    // Save to localStorage so the homepage can read it
                    localStorage.setItem('useRandomSelection', JSON.stringify(checked));
                  }}
                />
                <label htmlFor="random-projects" className="text-sm cursor-pointer">
                  Show random projects on homepage instead of featured
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={loadProjects}
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

            <Card className="mb-10">
              <CardHeader>
                <CardTitle>Project List</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Loading projects...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {filteredProjects.map((project) => (
                      <div key={project.id} className="flex justify-between items-center py-3 border-b">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.mainCategory} - {Array.isArray(project.subCategory) ? project.subCategory.join(", ") : project.subCategory}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {project.featured ? "Featured" : "Not featured"}
                            </span>
                            <Switch
                              checked={project.featured}
                              onCheckedChange={() => handleToggleFeatured(project.id, !project.featured)}
                            />
                          </div>

                          {!project.featured && featuredCount >= 6 && (
                            <Select onValueChange={(featuredId) => handleReplaceProject(project.id, parseInt(featuredId))}>
                              <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Replace..." />
                              </SelectTrigger>
                              <SelectContent>
                                {projects.filter(p => p.featured).map(p => (
                                  <SelectItem key={p.id} value={p.id.toString()}>
                                    Replace {p.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

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
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add New Project</CardTitle>
              </CardHeader>
              <CardContent>
                <ProjectForm onProjectAdded={handleProjectAdded} />
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
                {loading ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Loading projects...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {archivedProjects.map((project) => (
                      <div key={project.id} className="flex justify-between items-center py-3 border-b">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {project.mainCategory} - {Array.isArray(project.subCategory) ? project.subCategory.join(", ") : project.subCategory}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleUnarchiveProject(project.id)}
                          >
                            Restore
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
                    {archivedProjects.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No archived projects found.</p>
                      </div>
                    )}
                  </div>
                )}
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
