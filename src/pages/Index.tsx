
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsGallery from "@/components/ProjectsGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const scrollToHash = () => {
      if (window.location.hash) {
        const id = window.location.hash.replace("#", "");
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, []);

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
