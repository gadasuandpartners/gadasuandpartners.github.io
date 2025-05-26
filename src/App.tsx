
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import Index from "./pages/Index";
import ProjectPage from "./pages/ProjectPage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import AllProjectsPage from "./pages/AllProjectsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Handle auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user?.email === 'sstonelabs@gmail.com') {
        navigate('/admin');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return null;
};

const App = () => {
  useEffect(() => {
    // Set document title
    document.title = "Gadasu + Partners";
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthHandler />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/project/:id" element={<ProjectPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/projects" element={<AllProjectsPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

