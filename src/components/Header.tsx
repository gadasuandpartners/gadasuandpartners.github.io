import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    if (location.pathname === '/' && hash) {
      e.preventDefault();
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Update URL hash without reload
        window.history.pushState(null, '', `#/${hash}`);
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6 lg:px-12",
      isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
    )}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo variant="full" />
        </div>

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
            <li>
              <Link
                to="/"
                className="hover:text-black/70 transition-colors"
                onClick={(e) => scrollToSection(e, '#home')}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="hover:text-black/70 transition-colors"
              >
                PROJECTS
              </Link>
            </li>
            <li>
              <Link
                to={{ pathname: "/", hash: "#about" }}
                className="hover:text-black/70 transition-colors"
                onClick={(e) => scrollToSection(e, '#about')}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                to={{ pathname: "/", hash: "#contact" }}
                className="hover:text-black/70 transition-colors"
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                CONTACT
              </Link>
            </li>
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
              <Link
                to="/"
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={(e) => scrollToSection(e, '#home')}
              >
                HOME
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PROJECTS
              </Link>
            </li>
            <li>
              <Link
                to={{ pathname: "/", hash: "#about" }}
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={(e) => scrollToSection(e, '#about')}
              >
                ABOUT
              </Link>
            </li>
            <li>
              <Link
                to={{ pathname: "/", hash: "#contact" }}
                className="block py-2 hover:text-black/70 transition-colors"
                onClick={(e) => scrollToSection(e, '#contact')}
              >
                CONTACT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
