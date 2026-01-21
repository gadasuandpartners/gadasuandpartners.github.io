
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsGallery from "@/components/ProjectsGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    // Small timeout to ensure DOM is ready and layout is stable
    const timer = setTimeout(() => {
      if (hash) {
        const id = hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <ProjectsGallery />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
