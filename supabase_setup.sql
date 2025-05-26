-- Create the projects table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  "mainCategory" TEXT NOT NULL,
  "subCategory" TEXT[] NOT NULL,
  year TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  architect TEXT NOT NULL,
  area TEXT NOT NULL,
  status TEXT NOT NULL,
  client TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  archived BOOLEAN DEFAULT false,
  "galleryImages" TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on featured projects for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured) WHERE NOT archived;

-- Create an index on archived projects
CREATE INDEX IF NOT EXISTS idx_projects_archived ON projects(archived);

-- Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all projects
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

-- Create policy to allow only admin user to insert/update/delete projects
-- Replace 'sstonelabs@gmail.com' with your actual admin email if different
CREATE POLICY "Admin can manage projects" ON projects
  FOR ALL USING (auth.jwt() ->> 'email' = 'sstonelabs@gmail.com');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();