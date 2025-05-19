
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProjectsGallery from "@/components/ProjectsGallery";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

const Index = () => {
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
