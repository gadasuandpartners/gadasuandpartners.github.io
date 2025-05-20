
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { projectsData } from '@/components/ProjectsGallery';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// Additional images for each project's gallery
const projectGalleryImages = [
  // Project 1 gallery
  [
    "https://images.unsplash.com/photo-1486718448742-163732cd1544?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1460574283810-2aab119d8511?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?auto=format&fit=crop&q=80"
  ],
  // Project 2 gallery
  [
    "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1473177104440-ffee2f376098?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1494891848038-7bd202a2afeb?auto=format&fit=crop&q=80"
  ],
  // Project 3 gallery
  [
    "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1433832597046-4f10e10ac764?auto=format&fit=crop&q=80"
  ],
  // Project 4 gallery
  [
    "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1466442929976-97f336a657be?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1492321936769-b49830bc1d1e?auto=format&fit=crop&q=80"
  ],
  // Project 5 gallery
  [
    "https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1488972685288-c3fd157d7c7a?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80"
  ],
  // Project 6 gallery
  [
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1496307653780-42ee777d4833?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&q=80"
  ]
];

const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<(typeof projectsData)[0] | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    if (id) {
      const projectId = parseInt(id);
      const foundProject = projectsData.find(p => p.id === projectId);
      if (foundProject) {
        setProject(foundProject);
        // Get additional images for the project's gallery
        if (projectId > 0 && projectId <= projectGalleryImages.length) {
          setGalleryImages([
            foundProject.imageUrl,
            ...projectGalleryImages[projectId - 1]
          ]);
        }
      }
    }
  }, [id]);

  if (!project) {
    return <div className="min-h-screen flex items-center justify-center">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative h-[70vh] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={project.imageUrl} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
          <div className="container relative h-full flex flex-col justify-end pb-16 text-white">
            <Link to="/#projects" className="flex items-center text-white/80 hover:text-white transition-colors mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Back to projects</span>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-4">{project.title}</h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              <p className="text-white/80">{project.category}</p>
              <p className="text-white/80">{project.location}</p>
              <p className="text-white/80">{project.year}</p>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-16 bg-white">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Left Column - Project Info */}
              <div className="md:col-span-1">
                <div className="sticky top-24">
                  <h2 className="text-2xl font-light mb-8">Project Information</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">ARCHITECT</h3>
                      <p>Gadasu+Partners</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">CLIENT</h3>
                      <p>{project.client}</p>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">LOCATION</h3>
                      <p>{project.location}</p>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">AREA</h3>
                      <p>{project.area}</p>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">STATUS</h3>
                      <p>{project.status}</p>
                    </div>

                    <div>
                      <h3 className="text-sm text-gray-500 mb-1">YEAR</h3>
                      <p>{project.year}</p>
                    </div>
                  </div>

                  <div className="mt-12">
                    <Button asChild variant="outline" className="rounded-none border-black">
                      <a href="#contact">Contact about this project</a>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Project Description and Gallery */}
              <div className="md:col-span-2">
                <div className="prose prose-lg max-w-none mb-12">
                  <h2 className="text-3xl font-light mb-6">Project Overview</h2>
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed">{project.description}</p>
                  
                  <p className="text-gray-700 text-lg leading-relaxed">
                    G+P's design approach focuses on creating a harmonious relationship between the built environment and its 
                    surroundings. Through careful consideration of materials, light, and spatial arrangements, 
                    the architecture evokes a sense of place while meeting all functional requirements.
                  </p>
                </div>

                <Separator className="my-12" />
                
                {/* Gallery Section */}
                <h2 className="text-3xl font-light mb-8">Project Gallery</h2>
                
                <div className="space-y-12">
                  <Carousel className="w-full">
                    <CarouselContent>
                      {galleryImages.map((img, index) => (
                        <CarouselItem key={index}>
                          <AspectRatio ratio={16/9}>
                            <img 
                              src={img} 
                              alt={`Project image ${index + 1}`}
                              className="w-full h-full object-cover rounded-md"
                            />
                          </AspectRatio>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {galleryImages.slice(0, 4).map((img, index) => (
                      <div key={`grid-${index}`}>
                        <AspectRatio ratio={4/3}>
                          <img 
                            src={img} 
                            alt={`Project detail ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </AspectRatio>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Related Projects Section */}
        <section className="py-16 bg-secondary">
          <div className="container">
            <h2 className="text-3xl font-light mb-8">Related Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {projectsData
                .filter(p => p.id !== project.id && p.category === project.category)
                .slice(0, 3)
                .map((relatedProject, index) => (
                  <Link 
                    key={relatedProject.id} 
                    to={`/project/${relatedProject.id}`}
                    className="group block"
                  >
                    <AspectRatio ratio={4/3}>
                      <img 
                        src={relatedProject.imageUrl} 
                        alt={relatedProject.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </AspectRatio>
                    <div className="mt-4">
                      <h3 className="text-xl font-medium">{relatedProject.title}</h3>
                      <p className="text-gray-600">{relatedProject.category} | {relatedProject.year}</p>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProjectPage;
