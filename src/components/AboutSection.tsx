
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
              We specialize in architectural design that unites innovation with functionality, crafting spaces that inspire, 
              endure, and respond to their context. Our approach emphasizes sustainability, thoughtful integration with the 
              environment, and close collaboration with clients to bring each vision to life.
            </p>
            
            <p className="text-gray-700 mb-8">
              With a portfolio spanning residential, commercial, and cultural projects, we bring versatility and a deep attention 
              to detail to every design. We believe architecture should elevate the human experience while honoring the character 
              of its surroundings.
            </p>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Education</h3>
              <p className="text-sm text-gray-700">Babson College<br />London School of Economics</p>
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
