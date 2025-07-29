import React, { useState, useRef, useEffect } from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  id: number;
  title: string;
  category: string;
  year: string;
  imageUrl: string;
  index: number;
}

const getOptimizedImageUrl = (url: string, width: number, quality: number = 75) => {
  if (url.includes('imagedelivery.net')) {
    return `${url}/w=${width},q=${quality}`;
  }
  return url;
};

const ProjectCard: React.FC<ProjectCardProps> = React.memo(({ id, title, category, year, imageUrl, index }) => {
  const isEager = index < 3;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldLoadImage, setShouldLoadImage] = useState(isEager);
  const cardRef = useRef<HTMLDivElement>(null);
  // Debug: track component lifecycle
  useEffect(() => {
    console.debug(`[ProjectCard] mounted → id: ${id}, index: ${index}`);
    return () => {
      console.debug(`[ProjectCard] unmounted ← id: ${id}, index: ${index}`);
    };
  }, [id, index]);
  // Log whenever these state values change
  useEffect(() => {
    console.debug(`[ProjectCard] shouldLoadImage changed → id: ${id}, index: ${index}, value: ${shouldLoadImage}`);
  }, [shouldLoadImage, id, index]);

  useEffect(() => {
    console.debug(`[ProjectCard] imageLoaded changed → id: ${id}, index: ${index}, value: ${imageLoaded}`);
  }, [imageLoaded, id, index]);

  useEffect(() => {
    if (isEager) return; // Eager cards load immediately
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.debug(`[ProjectCard] Intersection observed, start loading image → id: ${id}, index: ${index}`);
          setShouldLoadImage(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.01
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isEager, id, index]);

  return (
    <div ref={cardRef}>
      <Link 
        to={`/project/${id}`}
        className={cn(
          "group cursor-pointer relative overflow-hidden rounded-md shadow-md block",
          index === 0 ? "md:col-span-2 md:row-span-2" : ""
        )}
      >
        <AspectRatio ratio={4/3}>
          {/* Static placeholder while loading */}
          {(!shouldLoadImage || !imageLoaded) && (
            <div className="absolute inset-0 w-full h-full bg-gray-100 animate-pulse rounded-md" />
          )}
          
          {shouldLoadImage && (
            <img 
              src={getOptimizedImageUrl(imageUrl, 800)}
              srcSet={`
                ${getOptimizedImageUrl(imageUrl, 400)} 400w,
                ${getOptimizedImageUrl(imageUrl, 800)} 800w,
                ${getOptimizedImageUrl(imageUrl, 1200)} 1200w
              `}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={title}
              loading="lazy"
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                "group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => {
                console.debug(`[ProjectCard] image onLoad fired → id: ${id}, index: ${index}`);
                setImageLoaded(true);
              }}
            />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-white/70 text-sm mb-1">{category} | {year}</p>
                <h3 className="text-white text-xl font-medium">{title}</h3>
              </div>
            </div>
          </div>
        </AspectRatio>
      </Link>
    </div>
  );
});

export default ProjectCard;
