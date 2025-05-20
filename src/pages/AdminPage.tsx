
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProjectForm } from "@/components/ProjectForm";

const AdminPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-24">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-light mb-4">PROJECT MANAGEMENT</h1>
          <div className="w-20 h-0.5 bg-gray-900"></div>
          <p className="mt-6 text-muted-foreground max-w-2xl">
            Add new projects to the Gadasu+Partners portfolio. Complete all fields with relevant project details.
          </p>
        </div>
        
        <div className="bg-white p-6 shadow-sm border rounded-lg">
          <ProjectForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminPage;
