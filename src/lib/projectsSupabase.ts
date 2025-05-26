// src/lib/projectsSupabase.ts
import { supabase } from "./supabaseClient";
import { Project } from "./projectsData";

// Table name in Supabase
const TABLE = "projects";

// Fetch all non-archived projects
export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("archived", false)
    .order("id", { ascending: true });
  if (error) throw error;
  return data as Project[];
}

// Fetch all archived projects
export async function fetchArchivedProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("archived", true)
    .order("id", { ascending: true });
  if (error) throw error;
  return data as Project[];
}

// Add a new project
export async function addProjectSupabase(project: Omit<Project, "id">): Promise<Project> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

// Update a project
export async function updateProjectSupabase(id: number, updates: Partial<Project>): Promise<Project> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

// Delete a project
export async function deleteProjectSupabase(id: number): Promise<void> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);
  if (error) throw error;
}

// Archive a project
export async function archiveProjectSupabase(id: number): Promise<Project> {
  return updateProjectSupabase(id, { archived: true });
}

// Unarchive a project
export async function unarchiveProjectSupabase(id: number): Promise<Project> {
  return updateProjectSupabase(id, { archived: false });
}

// Toggle featured
export async function toggleFeaturedSupabase(id: number, featured: boolean): Promise<Project> {
  return updateProjectSupabase(id, { featured });
}

// Get featured projects for homepage (6 projects)
export async function getFeaturedProjectsSupabase(isRandom = false): Promise<Project[]> {
  if (isRandom) {
    // Get 6 random non-archived projects
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .limit(6);
    
    if (error) throw error;
    
    // Shuffle the results
    const shuffled = (data || []).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6) as Project[];
  } else {
    // Get featured projects first
    const { data: featuredData, error: featuredError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .eq("featured", true)
      .order("id", { ascending: true });
    
    if (featuredError) throw featuredError;
    
    const featuredProjects = featuredData as Project[];
    
    // If we have 6 or more featured projects, return first 6
    if (featuredProjects.length >= 6) {
      return featuredProjects.slice(0, 6);
    }
    
    // If we have fewer than 6 featured projects, fill with non-featured ones
    const { data: allData, error: allError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .order("id", { ascending: true })
      .limit(6);
    
    if (allError) throw allError;
    
    return (allData as Project[]).slice(0, 6);
  }
}

// Get random selection setting from admin
export async function getRandomSelectionSetting(): Promise<boolean> {
  // For now, we'll store this in localStorage on the client side
  // In a full implementation, you might want to store this in a settings table
  try {
    const stored = localStorage.getItem('useRandomSelection');
    return stored ? JSON.parse(stored) : false;
  } catch {
    return false;
  }
}

// Get a single project by ID
export async function getProjectByIdSupabase(id: number): Promise<Project | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .eq("archived", false)
    .single();
  
  if (error) {
    if (error.code === 'PGRST116') {
      // No rows returned
      return null;
    }
    throw error;
  }
  
  return data as Project;
}

// Get related projects based on category, subcategory, or location
export async function getRelatedProjectsSupabase(projectId: number, project: Project): Promise<Project[]> {
  // First try to get projects with same subcategory
  const { data: relatedBySubcategory, error: subError } = await supabase
    .from(TABLE)
    .select("*")
    .eq("archived", false)
    .neq("id", projectId)
    .contains("subCategory", project.subCategory)
    .limit(3);
  
  if (subError) throw subError;
  
  let related = relatedBySubcategory as Project[] || [];
  
  // If we don't have 3 projects yet, add by main category
  if (related.length < 3) {
    const { data: relatedByCategory, error: catError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .eq("mainCategory", project.mainCategory)
      .neq("id", projectId)
      .not("id", "in", `(${related.map(p => p.id).join(",")})`)
      .limit(3 - related.length);
    
    if (catError) throw catError;
    
    related = [...related, ...(relatedByCategory as Project[] || [])];
  }
  
  // If we still don't have 3 projects, add by location
  if (related.length < 3) {
    const { data: relatedByLocation, error: locError } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .eq("location", project.location)
      .neq("id", projectId)
      .not("id", "in", `(${related.map(p => p.id).join(",")})`)
      .limit(3 - related.length);
    
    if (locError) throw locError;
    
    related = [...related, ...(relatedByLocation as Project[] || [])];
  }
  
  return related.slice(0, 3);
}