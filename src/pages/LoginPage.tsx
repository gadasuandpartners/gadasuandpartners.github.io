
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-light mb-4">ADMIN LOGIN</h1>
          <div className="w-20 h-0.5 bg-gray-900 mx-auto"></div>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Please sign in to access the Gadasu+Partners project management system.
          </p>
        </div>
        
        <div className="bg-white p-6 shadow-sm border rounded-lg">
          <LoginForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;

