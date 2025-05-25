import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { projectCategories, MainCategory, SubCategory } from "@/lib/projectCategories";

interface ProjectsFilterProps {
  selectedMainCategory: MainCategory | null;
  setSelectedMainCategory: (category: MainCategory | null) => void;
  selectedSubCategories: SubCategory[];
  setSelectedSubCategories: (categories: SubCategory[]) => void;
  clearFilters: () => void;
}

export function ProjectsFilter({
  selectedMainCategory,
  setSelectedMainCategory,
  selectedSubCategories,
  setSelectedSubCategories,
  clearFilters,
}: ProjectsFilterProps) {
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  const handleMainCategorySelect = (category: MainCategory | null) => {
    setSelectedMainCategory(category);
    // Clear subcategories when main category changes
    if (category !== selectedMainCategory) {
      setSelectedSubCategories([]);
    }
    setIsMainMenuOpen(false);
  };

  const handleSubCategorySelect = (subCategory: SubCategory) => {
    setSelectedSubCategories(
      selectedSubCategories.includes(subCategory)
        ? selectedSubCategories.filter(cat => cat !== subCategory)
        : [...selectedSubCategories, subCategory]
    );
  };

  const availableSubcategories = selectedMainCategory
    ? projectCategories.find(cat => cat.main === selectedMainCategory)?.subcategories || []
    : [];

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <DropdownMenu open={isMainMenuOpen} onOpenChange={setIsMainMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {selectedMainCategory || "All Categories"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Main Categories</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleMainCategorySelect(null)}>
              All Categories
            </DropdownMenuItem>
            {projectCategories.map(category => (
              <DropdownMenuItem 
                key={category.main} 
                onClick={() => handleMainCategorySelect(category.main)}
                className={cn(
                  selectedMainCategory === category.main && "bg-accent"
                )}
              >
                {category.main}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedMainCategory && (
        <Popover open={isSubMenuOpen} onOpenChange={setIsSubMenuOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Subcategories
              <Badge variant="secondary" className="ml-1">
                {selectedSubCategories.length}
              </Badge>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4 max-h-[60vh] overflow-auto">
              <div className="grid grid-cols-1 gap-2">
                {availableSubcategories.map(subCategory => (
                  <div 
                    key={subCategory} 
                    className="flex items-center"
                  >
                    <label 
                      className={cn(
                        "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm cursor-pointer",
                        selectedSubCategories.includes(subCategory) 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-muted"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSubCategories.includes(subCategory)}
                        onChange={() => handleSubCategorySelect(subCategory)}
                        className="mr-2"
                      />
                      {subCategory}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {(selectedMainCategory || selectedSubCategories.length > 0) && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
