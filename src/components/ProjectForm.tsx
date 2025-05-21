
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { projectCategories, MainCategory, SubCategory } from "@/lib/projectCategories";
import { addProject } from "@/lib/projectsData";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageUp, Link as LinkIcon } from "lucide-react";

export function ProjectForm() {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory | "">("");
  const [subCategory, setSubCategory] = useState<SubCategory | "">("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [architect, setArchitect] = useState("Edwin Gadasu & Partners");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Planned");
  const [client, setClient] = useState("");
  const [imageSource, setImageSource] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

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
      featured: false // New projects are not featured by default
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
    setArchitect("Edwin Gadasu & Partners");
    setArea("");
    setStatus("Planned");
    setClient("");
    setSelectedFile(null);
    setUploadPreview(null);
    setImageSource("url");
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            required
            placeholder="Enter project title"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input 
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year of completion"
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
              <SelectValue placeholder="Project status" />
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
          placeholder="Project description"
          rows={5}
        />
      </div>
      
      <Button type="submit" className="w-full md:w-auto">Add Project</Button>
    </form>
  );
}
