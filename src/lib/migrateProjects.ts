// Migration script to transfer projects from localStorage to Supabase
import { supabase } from './supabaseClient';
import { Project } from './projectsData';

// The initial projects data to migrate
const projectsToMigrate: Project[] = [
  {
    id: 1,
    title: "Organic Pavilion",
    category: "Commercial",
    mainCategory: "Architectural Design",
    subCategory: ["Commercial Architecture"],
    year: "2023",
    imageUrl: "/lovable-uploads/736ea871-2941-4e80-9534-508fd9db4bca.png",
    description: "A revolutionary commercial complex inspired by natural forms, balancing functionality with organic aesthetics. The structure features a dynamic curved facade that optimizes natural light while providing shade where needed.",
    location: "Stockholm, Sweden",
    architect: "Gadasu & Partners",
    area: "12,500 sq.m",
    status: "Completed",
    client: "Nordic Ventures Group",
    featured: true,
    archived: false,
    galleryImages: []
  },
  {
    id: 2,
    title: "Urban Bloom",
    category: "Residential",
    mainCategory: "Architectural Design",
    subCategory: ["Residential Architecture - Multi Unit"],
    year: "2022",
    imageUrl: "/lovable-uploads/15a43508-7557-4aa2-be9c-a44de267b573.png",
    description: "A vertical garden residential tower that integrates lush landscaping into its architecture. Each apartment features dedicated growing spaces, creating a living breathing building that changes with the seasons.",
    location: "Singapore",
    architect: "Gadasu & Partners",
    area: "8,200 sq.m",
    status: "Completed",
    client: "EcoLiving Developments",
    featured: true,
    archived: false,
    galleryImages: []
  },
  {
    id: 3,
    title: "Copper Tower",
    category: "Cultural",
    mainCategory: "Architectural Design",
    subCategory: ["Cultural Architecture"],
    year: "2021",
    imageUrl: "/lovable-uploads/7cb1d03d-48df-47d4-823f-e66d9a5ade04.png",
    description: "A cultural center clad in oxidized copper panels that change appearance over time. The building houses exhibition spaces, performance venues, and community gathering areas designed to foster artistic expression.",
    location: "Barcelona, Spain",
    architect: "Gadasu & Partners",
    area: "7,800 sq.m",
    status: "Completed",
    client: "Barcelona Arts Foundation",
    featured: true,
    archived: false,
    galleryImages: []
  },
  {
    id: 4,
    title: "Azure Mosque",
    category: "Spiritual",
    mainCategory: "Architectural Design",
    subCategory: ["Cultural Architecture"],
    year: "2023",
    imageUrl: "/lovable-uploads/1906d23e-b50f-474d-9a82-3d4a67c3df32.png",
    description: "A contemporary mosque featuring blue glass elements that create stunning light patterns throughout the day. The design merges traditional Islamic architectural elements with modern construction techniques and materials.",
    location: "Dubai, UAE",
    architect: "Gadasu & Partners",
    area: "5,600 sq.m",
    status: "Completed",
    client: "Islamic Heritage Foundation",
    featured: true,
    archived: false,
    galleryImages: []
  },
  {
    id: 5,
    title: "Harmony Heights",
    category: "Residential",
    mainCategory: "Architectural Design",
    subCategory: ["Residential Architecture - Multi Unit"],
    year: "2022",
    imageUrl: "/lovable-uploads/6caa6b8d-d5d7-4639-978e-db301a0ec958.png",
    description: "A terraced residential development that steps down a hillside, offering panoramic views while maintaining privacy for residents. The layered architecture creates multiple communal gardens and outdoor spaces.",
    location: "Los Angeles, USA",
    architect: "Gadasu & Partners",
    area: "15,300 sq.m",
    status: "Completed",
    client: "Pacific Homes",
    featured: true,
    archived: false,
    galleryImages: []
  },
  {
    id: 6,
    title: "Desert Oasis",
    category: "Hospitality",
    mainCategory: "Interior Design",
    subCategory: ["Hospitality Interior"],
    year: "2022",
    imageUrl: "/lovable-uploads/4b883c8f-683c-4bee-b634-cf0672a3ad75.png",
    description: "A luxury resort that blends seamlessly with its desert surroundings. The design incorporates passive cooling strategies, rainwater harvesting, and locally sourced materials to create a sustainable oasis experience.",
    location: "Marrakech, Morocco",
    architect: "Gadasu & Partners",
    area: "22,000 sq.m",
    status: "Completed",
    client: "Sahara Luxury Resorts",
    featured: true,
    archived: false,
    galleryImages: []
  }
];

export const migrateProjectsToSupabase = async () => {
  try {
    console.log('Starting migration of projects to Supabase...');
    
    // First, check if projects already exist
    const { data: existingProjects, error: fetchError } = await supabase
      .from('projects')
      .select('id');
    
    if (fetchError) {
      console.error('Error checking existing projects:', fetchError);
      throw new Error(`Failed to check existing projects: ${fetchError.message}`);
    }
    
    if (existingProjects && existingProjects.length > 0) {
      console.log('Projects already exist in Supabase. Skipping migration.');
      return { success: true, message: `Found ${existingProjects.length} existing projects. Migration skipped.` };
    }
    
    // Prepare projects for insertion (remove id field to let Supabase auto-generate)
    const projectsForInsertion = projectsToMigrate.map(project => ({
      title: project.title,
      category: project.category,
      mainCategory: project.mainCategory,
      subCategory: project.subCategory,
      year: project.year,
      imageUrl: project.imageUrl,
      description: project.description,
      location: project.location,
      architect: project.architect,
      area: project.area,
      status: project.status,
      client: project.client,
      featured: project.featured,
      archived: project.archived,
      galleryImages: project.galleryImages || []
    }));
    
    console.log('Inserting projects:', projectsForInsertion.length);
    
    // Insert all projects
    const { data, error } = await supabase
      .from('projects')
      .insert(projectsForInsertion)
      .select();
    
    if (error) {
      console.error('Insert error:', error);
      throw new Error(`Failed to insert projects: ${error.message} - ${error.details || ''}`);
    }
    
    console.log(`Successfully migrated ${data?.length || 0} projects to Supabase`);
    return {
      success: true,
      message: `Successfully migrated ${data?.length || 0} projects`,
      data
    };
    
  } catch (error: any) {
    console.error('Migration failed:', error);
    return {
      success: false,
      message: `Migration failed: ${error.message || error}`,
      error
    };
  }
};

// Function to run migration from browser console or admin panel
export const runMigration = async () => {
  const result = await migrateProjectsToSupabase();
  console.log('Migration result:', result);
  return result;
};