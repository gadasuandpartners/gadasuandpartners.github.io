
import { useRef } from 'react';

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="about" className="py-24 bg-secondary" ref={sectionRef}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="animate-fade">
            <div className="relative h-full">
              <img 
                src="https://images.unsplash.com/photo-1431576901776-e539bd916ba2?auto=format&fit=crop&q=80" 
                alt="Architect portrait" 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>
          
          <div className="flex flex-col justify-center animate-fade">
            <h2 className="text-3xl md:text-4xl font-light mb-4">ABOUT THE ARCHITECT</h2>
            <div className="w-20 h-0.5 bg-gray-900 mb-8"></div>
            
            <p className="text-gray-700 mb-6">
              With over 15 years of experience in architectural design, I blend innovative concepts with practical 
              solutions to create spaces that inspire and endure. My approach focuses on sustainable practices, 
              thoughtful integration with surroundings, and client collaboration.
            </p>
            
            <p className="text-gray-700 mb-8">
              Having worked across residential, commercial, and cultural projects, my portfolio demonstrates 
              versatility and attention to detail. Each design reflects my belief that architecture should 
              enhance human experience while respecting environmental context.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Education</h3>
                <p className="text-sm text-gray-700">Master of Architecture<br />Harvard Graduate School of Design</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Awards</h3>
                <p className="text-sm text-gray-700">Design Excellence Award 2022<br />Sustainable Project Award 2021</p>
              </div>
            </div>
            
            <a href="#contact" className="inline-flex border border-black py-3 px-6 hover:bg-black hover:text-white transition-colors duration-300 self-start">
              GET IN TOUCH
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
