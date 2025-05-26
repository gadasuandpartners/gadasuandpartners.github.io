// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qpvnstpcpqziemtaasvs.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwdm5zdHBjcHF6aWVtdGFhc3ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDA0NzIsImV4cCI6MjA2MzgxNjQ3Mn0.N4vJDaUxCDpLYHJV2W_HCnvKZ5LMs8fBWJVTf0l65BM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);