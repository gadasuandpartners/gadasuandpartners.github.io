import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { syncProjectsFromSupabase } from './lib/projectsData';
import './index.css'
import queryClient from './queryClient';

// Start background sync with Supabase on app load
syncProjectsFromSupabase();

createRoot(document.getElementById("root")!).render(<App />);
