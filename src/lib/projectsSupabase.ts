import { supabase, isConnectionOffline } from "./supabaseClient";
import { Project } from "./projectsData";

// Constants
const TABLE = "projects";
const ROW_SIZE = 3;
const PAGE_SIZE = ROW_SIZE;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache management
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<any>>();

function setCache<T>(key: string, data: T) {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

function invalidateTableCache() {
  Array.from(cache.keys()).forEach(key => {
    if (key.includes('project') || key.includes('featured') || key.includes('row')) {
      cache.delete(key);
    }
  });
}

// Cache management exports
export function clearCache(): void {
  cache.clear();
  console.log('Cache cleared');
}

export const debugCache = {
  size: () => cache.size,
  keys: () => Array.from(cache.keys()),
  clear: clearCache
};

// Interfaces
export interface ProjectFilters {
  mainCategory?: string;
  subCategories?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  hasMore: boolean;
}

// Project row fetching
export async function fetchProjectRow(
  page: number = 1,
  filters?: ProjectFilters
): Promise<PaginatedResponse<Project>> {
  if (isConnectionOffline()) {
    throw new Error('Network is offline');
  }

  const cacheKey = `row_${page}_${JSON.stringify(filters)}`;
  const cached = getCache<PaginatedResponse<Project>>(cacheKey);
  if (cached) {
    console.log(`Returning cached row ${page}`);
    return cached;
  }

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE - 1;

  console.log(`Fetching project row ${page} (${start}-${end})`);
  const startTime = performance.now();

  try {
    let query = supabase
      .from(TABLE)
      .select('*', { count: 'exact' })
      .eq('archived', false)
      .order('id', { ascending: true })
      .range(start, end);

    if (filters?.mainCategory) {
      console.log('Applying mainCategory filter:', filters.mainCategory);
      query = query.eq('mainCategory', filters.mainCategory);
    }

    if (filters?.subCategories?.length) {
      console.log('Applying subCategories filter:', filters.subCategories);
      query = query.contains('subCategory', filters.subCategories);
    }

    const { data, error, count } = await query;
    
    if (error) throw error;

    if (!data) {
      console.log('No data returned from query');
      return { data: [], count: 0, hasMore: false };
    }

    const duration = performance.now() - startTime;
    console.log(`Fetched row ${page} (${data.length} projects) in ${duration.toFixed(0)}ms`);

    const result = {
      data: data as Project[],
      count: count || 0,
      hasMore: count ? (page * PAGE_SIZE) < count : false
    };

    setCache(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error in fetchProjectRow:', error);
    throw error;
  }
}

export function prefetchNextRow(page: number, filters?: ProjectFilters): void {
  void fetchProjectRow(page + 1, filters);
}

// Project management
export async function fetchProjects(): Promise<Project[]> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const cacheKey = 'all_projects';
  const cached = getCache<Project[]>(cacheKey);
  if (cached) return cached;

  const start = performance.now();

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .order('id', { ascending: true });
    
    if (error) throw error;
    if (!data) return [];

    const result = data as Project[];
    setCache(cacheKey, result);
    
    const duration = performance.now() - start;
    console.log(`Fetched ${result.length} projects in ${duration.toFixed(0)}ms`);
    
    return result;
  } catch (error) {
    console.error('Error in fetchProjects:', error);
    throw error;
  }
}

export async function fetchArchivedProjects(): Promise<Project[]> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const cacheKey = 'archived_projects';
  const cached = getCache<Project[]>(cacheKey);
  if (cached) return cached;

  const start = performance.now();

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", true)
      .order('id', { ascending: true });
    
    if (error) throw error;
    if (!data) return [];

    const result = data as Project[];
    setCache(cacheKey, result);
    
    const duration = performance.now() - start;
    console.log(`Fetched ${result.length} archived projects in ${duration.toFixed(0)}ms`);
    
    return result;
  } catch (error) {
    console.error('Error in fetchArchivedProjects:', error);
    throw error;
  }
}

export async function addProjectSupabase(project: Omit<Project, "id">): Promise<Project> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const start = performance.now();

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .insert([project])
      .select()
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('No data returned from insert operation');

    const duration = performance.now() - start;
    console.log(`Added project in ${duration.toFixed(0)}ms`);

    invalidateTableCache();
    return data as Project;
  } catch (error) {
    console.error('Error in addProjectSupabase:', error);
    throw error;
  }
}

export async function updateProjectSupabase(id: number, updates: Partial<Project>): Promise<Project> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const start = performance.now();

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .update(updates)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    if (!data) throw new Error('No data returned from update operation');

    const duration = performance.now() - start;
    console.log(`Updated project in ${duration.toFixed(0)}ms`);

    invalidateTableCache();
    return data as Project;
  } catch (error) {
    console.error('Error in updateProjectSupabase:', error);
    throw error;
  }
}

export async function deleteProjectSupabase(id: number): Promise<void> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const start = performance.now();

  try {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq("id", id);
      
    if (error) throw error;

    const duration = performance.now() - start;
    console.log(`Deleted project in ${duration.toFixed(0)}ms`);

    invalidateTableCache();
  } catch (error) {
    console.error('Error in deleteProjectSupabase:', error);
    throw error;
  }
}

export async function archiveProjectSupabase(id: number): Promise<Project> {
  return updateProjectSupabase(id, { archived: true });
}

export async function unarchiveProjectSupabase(id: number): Promise<Project> {
  return updateProjectSupabase(id, { archived: false });
}

export async function toggleFeaturedSupabase(id: number, featured: boolean): Promise<Project> {
  return updateProjectSupabase(id, { featured });
}

export async function getProjectByIdSupabase(id: number): Promise<Project | null> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const cacheKey = `project_${id}`;
  const cached = getCache<Project | null>(cacheKey);
  if (cached !== null) return cached;

  const start = performance.now();

  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("id", id)
      .eq("archived", false)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        setCache(cacheKey, null);
        return null;
      }
      throw error;
    }
    
    const result = data as Project;
    setCache(cacheKey, result);
    
    const duration = performance.now() - start;
    console.log(`Fetched project ${id} in ${duration.toFixed(0)}ms`);
    
    return result;
  } catch (error) {
    console.error(`Error in getProjectByIdSupabase(${id}):`, error);
    throw error;
  }
}

export async function getRelatedProjectsSupabase(projectId: number, project: Project): Promise<Project[]> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const cacheKey = `related_${projectId}`;
  const cached = getCache<Project[]>(cacheKey);
  if (cached) return cached;

  const start = performance.now();

  try {
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
      const { data: relatedByCategory } = await supabase
        .from(TABLE)
        .select("*")
        .eq("archived", false)
        .eq("mainCategory", project.mainCategory)
        .neq("id", projectId)
        .not("id", "in", `(${related.map(p => p.id).join(",")})`)
        .limit(3 - related.length);
      
      if (relatedByCategory) {
        related = [...related, ...relatedByCategory as Project[]];
      }
    }
    
    // If we still don't have 3 projects yet, add by location
    if (related.length < 3) {
      const { data: relatedByLocation } = await supabase
        .from(TABLE)
        .select("*")
        .eq("archived", false)
        .eq("location", project.location)
        .neq("id", projectId)
        .not("id", "in", `(${related.map(p => p.id).join(",")})`)
        .limit(3 - related.length);
      
      if (relatedByLocation) {
        related = [...related, ...relatedByLocation as Project[]];
      }
    }

    const result = related.slice(0, 3);
    setCache(cacheKey, result);
    
    const duration = performance.now() - start;
    console.log(`Found ${result.length} related projects in ${duration.toFixed(0)}ms`);
    
    return result;
  } catch (error) {
    console.error(`Error in getRelatedProjectsSupabase(${projectId}):`, error);
    throw error;
  }
}

export function getRandomSelectionSetting(): Promise<boolean> {
  const cacheKey = 'randomSelection';
  const cached = getCache<boolean>(cacheKey);
  if (cached !== null) return Promise.resolve(cached);

  return new Promise((resolve) => {
    try {
      const stored = localStorage.getItem('useRandomSelection');
      const value = stored ? JSON.parse(stored) : false;
      setCache(cacheKey, value);
      resolve(value);
    } catch {
      console.warn('Failed to read random selection setting, defaulting to false');
      resolve(false);
    }
  });
}

export async function getFeaturedProjectsSupabase(isRandom = false): Promise<Project[]> {
  if (isConnectionOffline()) throw new Error('Network is offline');

  const cacheKey = `featured_${isRandom}`;
  const cached = getCache<Project[]>(cacheKey);
  if (cached) return cached;

  const start = performance.now();

  try {
    if (isRandom) {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("archived", false)
        .limit(6);
      
      if (error) throw error;
      if (!data) return [];
      
      const result = data
        .sort(() => 0.5 - Math.random())
        .slice(0, 6) as Project[];
      
      setCache(cacheKey, result);
      
      const duration = performance.now() - start;
      console.log(`Fetched ${result.length} random projects in ${duration.toFixed(0)}ms`);
      
      return result;
    }
    
    // Instead of using materialized view, query featured projects directly
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("archived", false)
      .eq("featured", true)
      .limit(6);
    
    if (error) throw error;
    let result = (data || []) as Project[];
    
    if (result.length < 6) {
      // If we don't have enough featured projects, add some non-featured ones
      const { data: additional } = await supabase
        .from(TABLE)
        .select("*")
        .eq("archived", false)
        .eq("featured", false)
        .limit(6 - result.length);
      
      if (additional) {
        result = [...result, ...additional as Project[]];
      }
    }

    setCache(cacheKey, result);
    
    const duration = performance.now() - start;
    console.log(`Fetched ${result.length} featured projects in ${duration.toFixed(0)}ms`);
    
    return result;
  } catch (error) {
    console.error('Error in getFeaturedProjectsSupabase:', error);
    throw error;
  }
}