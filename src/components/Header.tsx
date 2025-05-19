
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 lg:px-12",
      isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="flex justify-between items-center">
        <a href="#" className="text-2xl font-montserrat font-medium tracking-tighter">
          EDWIN GADASU ARCHITECTS
        </a>
        
        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={cn(
              "block h-0.5 bg-foreground transition-all duration-300",
              isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
            )} />
            <span className={cn(
              "block h-0.5 bg-foreground transition-all duration-300",
              isMobileMenuOpen ? "opacity-0" : ""
            )} />
            <span className={cn(
              "block h-0.5 bg-foreground transition-all duration-300",
              isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
            )} />
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className="flex space-x-10 font-inter text-sm">
            <li><a href="#home" className="hover:text-black/70 transition-colors">HOME</a></li>
            <li><a href="#projects" className="hover:text-black/70 transition-colors">PROJECTS</a></li>
            <li><a href="#about" className="hover:text-black/70 transition-colors">ABOUT</a></li>
            <li><a href="#contact" className="hover:text-black/70 transition-colors">CONTACT</a></li>
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className={cn(
        "lg:hidden fixed inset-x-0 bg-white/95 backdrop-blur-sm transition-all duration-300 overflow-hidden",
        isMobileMenuOpen ? "top-16 h-screen" : "top-16 h-0"
      )}>
        <nav className="px-6 py-8">
          <ul className="space-y-6 font-inter text-lg">
            <li>
              <a 
                href="#home" 
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </a>
            </li>
            <li>
              <a 
                href="#projects" 
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PROJECTS
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ABOUT
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACT
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
