import { projects } from '../data/projects';
import type { Project } from './projectsSupabase';

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectById(id: number | string): Project | undefined {
  return projects.find(p => String(p.id) === String(id));
}
