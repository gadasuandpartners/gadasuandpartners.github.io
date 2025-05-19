
import React from 'react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  index: number;
}

const ProjectCard = ({ title, category, year, imageUrl, index }: ProjectCardProps) => {
  return (
    <div 
      className={cn(
        "group cursor-pointer relative overflow-hidden",
        index === 0 ? "md:col-span-2 md:row-span-2" : ""
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="h-full aspect-[4/3] md:aspect-auto overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white/70 text-sm mb-1">{category} | {year}</p>
            <h3 className="text-white text-xl font-medium">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
