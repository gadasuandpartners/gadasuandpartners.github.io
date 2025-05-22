
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectCategories, MainCategory, SubCategory } from "@/lib/projectCategories";
import { addProject } from "@/lib/projectsData";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUp, Link as LinkIcon, PlusCircle } from "lucide-react";

interface ProjectFormProps {
  onProjectAdded?: () => void;
}

export function ProjectForm({ onProjectAdded }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory | "">("");
  const [subCategory, setSubCategory] = useState<SubCategory | "">("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [architect, setArchitect] = useState("Gadasu & Partners");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Planned");
  const [client, setClient] = useState("");
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  
  // New state for gallery images
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState("");

  // Filter subcategories based on selected main category
  const filteredSubcategories = mainCategory
    ? projectCategories.find(cat => cat.main === mainCategory)?.subcategories || []
    : [];

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
    
    if (imageSource === "upload" && !selectedFile) {
      toast.error("Please upload an image");
      return;
    }
    
    // For demonstration purposes, we'll use either the URL or the preview URL
    // In a real app, you would upload the file to a server
    const finalImageUrl = imageSource === "url" 
      ? imageUrl 
      : uploadPreview || "/placeholder.svg";
    
    // Add the new project
    const newProject = addProject({
      title,
      category: subCategory, // For backward compatibility
      mainCategory: mainCategory as MainCategory,
      subCategory: subCategory as SubCategory,
      year,
      imageUrl: finalImageUrl,
      description,
      location,
      architect,
      area,
      status,
      client,
      featured: false, // New projects are not featured by default
      galleryImages: galleryImages // Add gallery images
    });
    
    toast.success("Project added successfully!");
    
    // Reset the form
    setTitle("");
    setMainCategory("");
    setSubCategory("");
    setYear(new Date().getFullYear().toString());
    setImageUrl("");
    setDescription("");
    setLocation("");
    setArchitect("Gadasu & Partners");
    setArea("");
    setStatus("Planned");
    setClient("");
    setSelectedFile(null);
    setUploadPreview(null);
    setImageSource("url");
    setGalleryImages([]);
    setNewGalleryImageUrl("");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    // Call the callback if provided
    if (onProjectAdded) {
      onProjectAdded();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Project Title *</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter project title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="main-category">Main Category *</Label>
          <Select 
            value={mainCategory} 
            onValueChange={(value) => {
              setMainCategory(value as MainCategory);
              setSubCategory(""); // Reset subcategory when main category changes
            }}
            required
          >
            <SelectTrigger id="main-category">
              <SelectValue placeholder="Select category" />
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
          <Label htmlFor="sub-category">Subcategory *</Label>
          <Select 
            value={subCategory}
            onValueChange={(value) => setSubCategory(value)}
            disabled={!mainCategory}
            required
          >
            <SelectTrigger id="sub-category">
              <SelectValue placeholder="Select subcategory" />
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
              <Input 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL"
              />
              {imageUrl && (
                <div className="mt-2 border rounded-md overflow-hidden">
                  <img 
                    src={imageUrl} 
                    alt="Preview" 
                    className="w-full h-40 object-cover"
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="upload" className="pt-4">
              <div className="grid gap-4">
                <Input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {uploadPreview && (
                  <div className="border rounded-md overflow-hidden">
                    <img 
                      src={uploadPreview} 
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
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="architect">Architect</Label>
          <Input 
            id="architect"
            value={architect}
            onChange={(e) => setArchitect(e.target.value)}
            placeholder="Architect name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="area">Area</Label>
          <Input 
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area in sq.m"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger id="status">
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
          <Label htmlFor="client">Client</Label>
          <Input 
            id="client"
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Client name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter project description"
          rows={5}
        />
      </div>
      
      <Button type="submit" className="w-full md:w-auto">Add Project</Button>
    </form>
  );
}
