
import { cn } from '@/lib/utils';

const Hero = () => {
  return (
    <section 
      id="home" 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80')] bg-center bg-cover">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container relative z-10 px-6">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-montserrat font-light mb-6 animate-fade">
            DESIGN THAT <span className="font-semibold">INSPIRES</span>
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto animate-fade">
            Creating spaces that blend aesthetics with functionality, 
            transforming visions into architectural masterpieces.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade">
            <a 
              href="#projects" 
              className="bg-white text-black px-8 py-3 font-medium tracking-wide hover:bg-white/90 transition-colors"
            >
              VIEW PROJECTS
            </a>
            <a 
              href="#contact" 
              className="border border-white text-white px-8 py-3 font-medium tracking-wide hover:bg-white/10 transition-colors"
            >
              GET IN TOUCH
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
        <span className="text-white text-sm mb-2 font-light tracking-widest">SCROLL</span>
        <div className="w-0.5 h-8 bg-white/40"></div>
      </div>
    </section>
  );
};

export default Hero;
