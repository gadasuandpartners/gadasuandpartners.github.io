
import { useState, useRef } from "react";
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
import { addProject } from "@/lib/projectsData";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUp, Link as LinkIcon, PlusCircle, X } from "lucide-react";

interface ProjectFormProps {
  onProjectAdded?: () => void;
}

export function ProjectForm({ onProjectAdded }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory | "">("");
  const [subCategory, setSubCategory] = useState<SubCategory[]>([]);
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
  
  // Gallery images
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState("");
  const [galleryImageSource, setGalleryImageSource] = useState<"url" | "upload">("url");
  const galleryFileInputRef = useRef<HTMLInputElement>(null);
  const [galleryPreview, setGalleryPreview] = useState<string | null>(null);

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
  
  // Add a gallery image from URL
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
    
    if (!title || !mainCategory || subCategory.length === 0) {
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
      : uploadPreview || "/placeholder.svg";
    
    // Add the new project
    const newProject = addProject({
      title,
      category: subCategory[0] || "", // For backward compatibility
      mainCategory: mainCategory as MainCategory,
      subCategory: subCategory,
      year,
      imageUrl: finalImageUrl,
      description,
      location,
      architect,
      area,
      status,
      client,
      featured: false, // New projects are not featured by default
      galleryImages: galleryImages // Include gallery images
    });
    
    toast.success("Project added successfully!");
    
    // Reset the form
    setTitle("");
    setMainCategory("");
    setSubCategory([]);
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
    setGalleryImageSource("url");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    if (galleryFileInputRef.current) {
      galleryFileInputRef.current.value = "";
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
              setSubCategory([]); // Reset subcategory when main category changes
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
          <div className="space-y-2">
            <Label htmlFor="sub-category">Subcategories *</Label>
            <div className="border rounded-md p-2 flex flex-wrap gap-2 min-h-[40px]">
              {filteredSubcategories.map((sub) => (
                <label key={sub} className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    value={sub}
                    checked={subCategory.includes(sub)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSubCategory([...subCategory, sub]);
                      } else {
                        setSubCategory(subCategory.filter(s => s !== sub));
                      }
                    }}
                  />
                  <span>{sub}</span>
                </label>
              ))}
            </div>
          </div>
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
                    onError={e => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.alt = "Image failed to load";
                    }}
                  />
                  {/* Optionally show a message if the image fails */}
                  {/* <span className="text-xs text-red-500">If the image does not appear, check the URL or try another image.</span> */}
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
