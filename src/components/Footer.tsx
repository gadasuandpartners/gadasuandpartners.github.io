
import React from 'react';
import { Link } from 'react-router-dom';
import AdminButton from './AdminButton';
import { Instagram, Twitter, Linkedin } from 'lucide-react';
import { getSocialMediaLinks } from '@/lib/projectsData';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const socialLinks = getSocialMediaLinks();

  return (
    <footer className="bg-black text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-montserrat font-medium tracking-tighter mb-4">
              G+P
            </h3>
            <p className="text-white/70 max-w-xs">
              Dedicated to creating spaces that inspire, function beautifully, and stand the test of time.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-white/70">
              <li><a href="#home" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#projects" className="hover:text-white transition-colors">Projects</a></li>
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><AdminButton className="mt-4" /></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-medium mb-4">Connect</h4>
            <div className="flex space-x-4 mb-6">
              <a href={socialLinks.instagram || "#contact"} target={socialLinks.instagram ? "_blank" : "_self"} rel="noopener noreferrer" className="w-10 h-10 border border-white/50 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-4 h-4" />
              </a>
              
              <a href={socialLinks.twitter || "#contact"} target={socialLinks.twitter ? "_blank" : "_self"} rel="noopener noreferrer" className="w-10 h-10 border border-white/50 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-4 h-4" />
              </a>
              
              <a href={socialLinks.linkedin || "#contact"} target={socialLinks.linkedin ? "_blank" : "_self"} rel="noopener noreferrer" className="w-10 h-10 border border-white/50 flex items-center justify-center hover:bg-white hover:text-black transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
            
            <p className="text-white/50 text-sm">
              Subscribe to our newsletter for the latest updates.
            </p>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/50 text-sm">
            © {currentYear} Gadasu+Partners. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6 text-white/50 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
