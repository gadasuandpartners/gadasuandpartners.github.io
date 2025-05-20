
import { useState } from "react";
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
import { projectsData } from "@/lib/projectsData";
import { toast } from "sonner";

export function ProjectForm() {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState<MainCategory | "">("");
  const [subCategory, setSubCategory] = useState<SubCategory | "">("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [architect, setArchitect] = useState("");
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Planned");
  const [client, setClient] = useState("");

  // Filter subcategories based on selected main category
  const filteredSubcategories = mainCategory
    ? projectCategories.find(cat => cat.main === mainCategory)?.subcategories || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This would typically connect to a backend API
    // For demo purposes, we'll show a success message
    const newProject = {
      id: projectsData.length + 1,
      title,
      category: subCategory, // For backward compatibility
      mainCategory: mainCategory as MainCategory,
      subCategory: subCategory as SubCategory,
      year,
      imageUrl: imageUrl || "/placeholder.svg", // Fallback to placeholder
      description,
      location,
      architect,
      area,
      status,
      client
    };
    
    console.log("New project data:", newProject);
    toast.success("Project submitted successfully!");
    
    // In a real application, we would add this to the projectsData array
    // and save it to a database
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Project Title</label>
          <Input 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter project title"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Year</label>
          <Input 
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year of completion"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Main Category</label>
          <Select 
            value={mainCategory} 
            onValueChange={(value) => {
              setMainCategory(value as MainCategory);
              setSubCategory(""); // Reset subcategory when main category changes
            }}
          >
            <SelectTrigger>
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
          <label className="text-sm font-medium">Subcategory</label>
          <Select 
            value={subCategory}
            onValueChange={(value) => setSubCategory(value)}
            disabled={!mainCategory}
          >
            <SelectTrigger>
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
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <Input 
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Architect</label>
          <Input 
            value={architect}
            onChange={(e) => setArchitect(e.target.value)}
            placeholder="Architect name"
            defaultValue="Edwin Gadasu & Partners"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Area</label>
          <Input 
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="Area in sq.m"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select 
            value={status}
            onValueChange={(value) => setStatus(value)}
          >
            <SelectTrigger>
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
          <label className="text-sm font-medium">Client</label>
          <Input 
            value={client}
            onChange={(e) => setClient(e.target.value)}
            placeholder="Client name"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description"
          rows={5}
        />
      </div>
      
      <Button type="submit" className="w-full md:w-auto">Submit Project</Button>
    </form>
  );
}
