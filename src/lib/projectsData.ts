
import { MainCategory, SubCategory } from './projectCategories';

export interface Project {
  id: number;
  title: string;
  category: string; // For backward compatibility
  mainCategory: MainCategory;
  subCategory: SubCategory;
  year: string;
  imageUrl: string;
  description: string;
  location: string;
  architect: string;
  area: string;
  status: string;
  client: string;
  featured: boolean;
  archived: boolean; // New field to support archiving
}

export let projectsData: Project[] = [
  {
    id: 1,
    title: "Organic Pavilion",
    category: "Commercial",
    mainCategory: "Architectural Design",
    subCategory: "Commercial Architecture",
    year: "2023",
    imageUrl: "/lovable-uploads/736ea871-2941-4e80-9534-508fd9db4bca.png",
    description: "A revolutionary commercial complex inspired by natural forms, balancing functionality with organic aesthetics. The structure features a dynamic curved facade that optimizes natural light while providing shade where needed.",
    location: "Stockholm, Sweden",
    architect: "Gadasu & Partners",
    area: "12,500 sq.m",
    status: "Completed",
    client: "Nordic Ventures Group",
    featured: true,
    archived: false
  },
  {
    id: 2,
    title: "Urban Bloom",
    category: "Residential",
    mainCategory: "Architectural Design",
    subCategory: "Residential Architecture - Multi Unit",
    year: "2022",
    imageUrl: "/lovable-uploads/15a43508-7557-4aa2-be9c-a44de267b573.png",
    description: "A vertical garden residential tower that integrates lush landscaping into its architecture. Each apartment features dedicated growing spaces, creating a living breathing building that changes with the seasons.",
    location: "Singapore",
    architect: "Gadasu & Partners",
    area: "8,200 sq.m",
    status: "Completed",
    client: "EcoLiving Developments",
    featured: true,
    archived: false
  },
  {
    id: 3,
    title: "Copper Tower",
    category: "Cultural",
    mainCategory: "Architectural Design",
    subCategory: "Cultural Architecture",
    year: "2021",
    imageUrl: "/lovable-uploads/7cb1d03d-48df-47d4-823f-e66d9a5ade04.png",
    description: "A cultural center clad in oxidized copper panels that change appearance over time. The building houses exhibition spaces, performance venues, and community gathering areas designed to foster artistic expression.",
    location: "Barcelona, Spain",
    architect: "Gadasu & Partners",
    area: "7,800 sq.m",
    status: "Completed",
    client: "Barcelona Arts Foundation",
    featured: true,
    archived: false
  },
  {
    id: 4,
    title: "Azure Mosque",
    category: "Spiritual",
    mainCategory: "Architectural Design",
    subCategory: "Cultural Architecture",
    year: "2023",
    imageUrl: "/lovable-uploads/1906d23e-b50f-474d-9a82-3d4a67c3df32.png",
    description: "A contemporary mosque featuring blue glass elements that create stunning light patterns throughout the day. The design merges traditional Islamic architectural elements with modern construction techniques and materials.",
    location: "Dubai, UAE",
    architect: "Gadasu & Partners",
    area: "5,600 sq.m",
    status: "Completed",
    client: "Islamic Heritage Foundation",
    featured: true,
    archived: false
  },
  {
    id: 5,
    title: "Harmony Heights",
    category: "Residential",
    mainCategory: "Architectural Design",
    subCategory: "Residential Architecture - Multi Unit",
    year: "2022",
    imageUrl: "/lovable-uploads/6caa6b8d-d5d7-4639-978e-db301a0ec958.png",
    description: "A terraced residential development that steps down a hillside, offering panoramic views while maintaining privacy for residents. The layered architecture creates multiple communal gardens and outdoor spaces.",
    location: "Los Angeles, USA",
    architect: "Gadasu & Partners",
    area: "15,300 sq.m",
    status: "Completed",
    client: "Pacific Homes",
    featured: true,
    archived: false
  },
  {
    id: 6,
    title: "Desert Oasis",
    category: "Hospitality",
    mainCategory: "Interior Design",
    subCategory: "Hospitality Interior",
    year: "2022",
    imageUrl: "/lovable-uploads/4b883c8f-683c-4bee-b634-cf0672a3ad75.png",
    description: "A luxury resort that blends seamlessly with its desert surroundings. The design incorporates passive cooling strategies, rainwater harvesting, and locally sourced materials to create a sustainable oasis experience.",
    location: "Marrakech, Morocco",
    architect: "Gadasu & Partners",
    area: "22,000 sq.m",
    status: "Completed",
    client: "Sahara Luxury Resorts",
    featured: true,
    archived: false
  }
];

// Company social media links
export interface SocialMediaLinks {
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export let socialMediaLinks: SocialMediaLinks = {
  instagram: "",
  twitter: "",
  linkedin: ""
};

// Update social media links
export const updateSocialMediaLinks = (links: SocialMediaLinks) => {
  socialMediaLinks = {
    ...socialMediaLinks,
    ...links
  };
  return socialMediaLinks;
};

// Get social media links
export const getSocialMediaLinks = () => {
  return socialMediaLinks;
};

// Functions to manage project data
export const getFeaturedProjects = (isRandom = false) => {
  // Filter projects that are featured and not archived
  const featuredProjects = projectsData.filter(project => project.featured && !project.archived);
  
  if (isRandom) {
    // Get 6 random projects that are not archived
    const nonArchivedProjects = projectsData.filter(project => !project.archived);
    return [...nonArchivedProjects]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(6, nonArchivedProjects.length));
  }
  
  // Return featured projects or fallback to showing first 6 if not enough featured
  return featuredProjects.length >= 6
    ? featuredProjects.slice(0, 6)
    : projectsData.filter(project => !project.archived).slice(0, Math.min(6, projectsData.length));
};

export const toggleProjectFeatured = (id: number) => {
  const projectIndex = projectsData.findIndex(project => project.id === id);
  if (projectIndex !== -1) {
    projectsData[projectIndex].featured = !projectsData[projectIndex].featured;
  }
  return projectsData;
};

export const updateProject = (id: number, updatedProject: Partial<Project>) => {
  const projectIndex = projectsData.findIndex(project => project.id === id);
  if (projectIndex !== -1) {
    projectsData[projectIndex] = {
      ...projectsData[projectIndex],
      ...updatedProject
    };
  }
  return projectsData;
};

export const replaceFeaturedProject = (unfeaturedId: number, featuredId: number) => {
  // First, check if we're trying to replace a project with itself
  if (unfeaturedId === featuredId) return projectsData;
  
  // Get the projects
  const projectToUnfeature = projectsData.find(p => p.id === unfeaturedId);
  const projectToFeature = projectsData.find(p => p.id === featuredId);
  
  // Make sure both projects exist
  if (!projectToUnfeature || !projectToFeature) return projectsData;
  
  // Make sure the one to unfeature is actually featured
  if (!projectToUnfeature.featured) return projectsData;
  
  // Toggle both projects
  projectToUnfeature.featured = false;
  projectToFeature.featured = true;
  
  return [...projectsData]; // Return new array for reactivity
};

export const countFeaturedProjects = () => {
  return projectsData.filter(project => project.featured && !project.archived).length;
};

export const getProjectById = (id: number) => {
  return projectsData.find(project => project.id === id);
};

export const addProject = (project: Omit<Project, 'id' | 'archived'>) => {
  // Find the highest ID to ensure uniqueness
  const highestId = projectsData.reduce((max, project) => Math.max(max, project.id), 0);
  const newProject: Project = {
    ...project,
    id: highestId + 1,
    archived: false
  };
  
  projectsData.push(newProject);
  return newProject;
};

export const archiveProject = (id: number) => {
  const projectIndex = projectsData.findIndex(project => project.id === id);
  if (projectIndex !== -1) {
    projectsData[projectIndex].archived = true;
    // If project is featured, unfeature it when archiving
    if (projectsData[projectIndex].featured) {
      projectsData[projectIndex].featured = false;
    }
  }
  return projectsData;
};

export const unarchiveProject = (id: number) => {
  const projectIndex = projectsData.findIndex(project => project.id === id);
  if (projectIndex !== -1) {
    projectsData[projectIndex].archived = false;
  }
  return projectsData;
};

export const getArchivedProjects = () => {
  return projectsData.filter(project => project.archived);
};

export const getNonArchivedProjects = () => {
  return projectsData.filter(project => !project.archived);
};

export const deleteProject = (id: number) => {
  projectsData = projectsData.filter(project => project.id !== id);
  return projectsData;
};

// Function to set random selection mode for the homepage
export let useRandomSelection = false;

export const setRandomSelection = (value: boolean) => {
  useRandomSelection = value;
  return useRandomSelection;
};

export const getRandomSelection = () => {
  return useRandomSelection;
};
