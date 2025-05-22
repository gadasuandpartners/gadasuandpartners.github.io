
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectCategories, MainCategory, SubCategory } from "@/lib/projectCategories";
import { Project, updateProject } from "@/lib/projectsData";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUp, Link as LinkIcon, PlusCircle, X } from "lucide-react";
import { CardContent } from "./ui/card";

interface EditProjectFormProps {
  project: Project;
  onUpdate: () => void;
}

export function EditProjectForm({ project, onUpdate }: EditProjectFormProps) {
  const [title, setTitle] = useState(project.title);
  const [mainCategory, setMainCategory] = useState<MainCategory>(project.mainCategory);
  const [subCategory, setSubCategory] = useState<SubCategory>(project.subCategory);
  const [year, setYear] = useState(project.year);
  const [imageUrl, setImageUrl] = useState(project.imageUrl);
  const [description, setDescription] = useState(project.description);
  const [location, setLocation] = useState(project.location);
  const [architect, setArchitect] = useState(project.architect);
  const [area, setArea] = useState(project.area);
  const [status, setStatus] = useState(project.status);
  const [client, setClient] = useState(project.client);
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  
  // Gallery images state
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState("");
  const [galleryImageSource, setGalleryImageSource] = useState<"url" | "upload">("url");
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);

  // Filter subcategories based on selected main category
  const filteredSubcategories = mainCategory
    ? projectCategories.find(cat => cat.main === mainCategory)?.subcategories || []
    : [];

  // Load gallery images on mount
  useEffect(() => {
    setGalleryImages(project.galleryImages || []);
  }, [project.id, project.galleryImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleGalleryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const preview = event.target?.result as string;
        setGalleryPreview(preview);
        
        // Add to gallery immediately
        setGalleryImages(prev => [...prev, preview]);
        
        // Reset the file input
        if (galleryFileInputRef.current) {
          galleryFileInputRef.current.value = '';
        }
        setGalleryPreview(null);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Add a gallery image
  const addGalleryImage = () => {
    if (newGalleryImageUrl && !galleryImages.includes(newGalleryImageUrl)) {
      setGalleryImages([...galleryImages, newGalleryImageUrl]);
      setNewGalleryImageUrl("");
    } else {
      toast.error("Please enter a valid unique image URL");
    }
  };
  
  // Remove a gallery image
  const removeGalleryImage = (index: number) => {
    const updatedGallery = [...galleryImages];
    updatedGallery.splice(index, 1);
    setGalleryImages(updatedGallery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !mainCategory || !subCategory) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (imageSource === "url" && !imageUrl) {
      toast.error("Please provide an image URL");
      return;
    }
    
    if (imageSource === "upload" && !selectedFile && !uploadPreview) {
      toast.error("Please upload an image");
      return;
    }
    
    // For demonstration purposes, we'll use either the URL or the preview URL
    // In a real app, you would upload the file to a server
    const finalImageUrl = imageSource === "url" 
      ? imageUrl 
      : uploadPreview || project.imageUrl;
    
    // Update the project
    updateProject(project.id, {
      title,
      category: subCategory, // For backward compatibility
      mainCategory,
      subCategory,
      year,
      imageUrl: finalImageUrl,
      description,
      location,
      architect,
      area,
      status,
      client,
      galleryImages
    });
    
    toast.success("Project updated successfully!");
    
    // Call the onUpdate callback
    onUpdate();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title-edit">Project Title *</Label>
          <Input 
            id="title-edit"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year-edit">Year</Label>
          <Input 
            id="year-edit"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="main-category-edit">Main Category *</Label>
          <Select 
            value={mainCategory} 
            onValueChange={(value) => {
              setMainCategory(value as MainCategory);
              setSubCategory("" as SubCategory); // Reset subcategory when main category changes
            }}
            required
          >
            <SelectTrigger id="main-category-edit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {projectCategories.map((category) => (
                <SelectItem key={category.main} value={category.main}>
                  {category.main}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="sub-category-edit">Subcategory *</Label>
          <Select 
            value={subCategory}
            onValueChange={(value) => setSubCategory(value as SubCategory)}
            disabled={!mainCategory}
            required
          >
            <SelectTrigger id="sub-category-edit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filteredSubcategories.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 col-span-1 md:col-span-2">
          <Label>Project Image *</Label>
          <Tabs defaultValue="url" value={imageSource} onValueChange={(v) => setImageSource(v as "url" | "upload")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Image URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <ImageUp className="h-4 w-4" />
                Upload Image
              </TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="pt-4">
              <div className="space-y-4">
                <Input 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                />
                {imageUrl && (
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt="Preview" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="upload" className="pt-4">
              <div className="grid gap-4">
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {(uploadPreview || project.imageUrl) && (
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={uploadPreview || project.imageUrl} 
                      alt="Preview" 
                      className="w-full h-40 object-cover"
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Gallery Images Section */}
        <div className="space-y-4 col-span-1 md:col-span-2">
          <Label>Project Gallery Images</Label>
          <Tabs defaultValue="url" value={galleryImageSource} onValueChange={(v) => setGalleryImageSource(v as "url" | "upload")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Image URL
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <ImageUp className="h-4 w-4" />
                Upload Image
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="pt-4">
              <div className="flex gap-2">
                <Input 
                  value={newGalleryImageUrl}
                  onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                  placeholder="Enter gallery image URL"
                  className="flex-1"
                />
                <Button type="button" onClick={addGalleryImage} size="icon">
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="upload" className="pt-4">
              <Input 
                ref={galleryFileInputRef}
                type="file" 
                accept="image/*"
                onChange={handleGalleryFileChange}
              />
            </TabsContent>
          </Tabs>
          
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {galleryImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={img} 
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-24 object-cover border rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeGalleryImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location-edit">Location</Label>
          <Input 
            id="location-edit"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="architect-edit">Architect</Label>
          <Input 
            id="architect-edit"
            value={architect}
            onChange={(e) => setArchitect(e.target.value)}
            placeholder="Architect name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="area-edit">Area</Label>
          <Input 
            id="area-edit"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area in sq.m"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status-edit">Status</Label>
          <Select 
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger id="status-edit">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Planned">Planned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="client-edit">Client</Label>
          <Input 
            id="client-edit"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Client name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description-edit">Description</Label>
        <Textarea 
          id="description-edit"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
          rows={5}
        />
      </div>
      
      <Button type="submit" className="w-full md:w-auto">Update Project</Button>
    </form>
  );
}
