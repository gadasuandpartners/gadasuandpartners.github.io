-- Drop existing indexes if they exist
DROP INDEX IF EXISTS idx_projects_featured;
DROP INDEX IF EXISTS idx_projects_archived;
DROP INDEX IF EXISTS idx_projects_main_category;

-- Create optimized indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_featured_composite 
ON projects(featured, archived) 
WHERE NOT archived;

-- Index for main category filtering
CREATE INDEX IF NOT EXISTS idx_projects_main_category 
ON projects("mainCategory") 
WHERE NOT archived;

-- Index for sub-category array searches
CREATE INDEX IF NOT EXISTS idx_projects_sub_category 
ON projects USING GIN("subCategory") 
WHERE NOT archived;

-- Create a materialized view for featured projects
-- This will dramatically speed up the initial load
CREATE MATERIALIZED VIEW IF NOT EXISTS featured_projects AS
SELECT id, title, "mainCategory", "subCategory", year, "imageUrl", featured
FROM projects
WHERE featured = true AND archived = false
ORDER BY id ASC;

-- Create function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_featured_projects()
RETURNS trigger AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY featured_projects;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS refresh_featured_projects_trigger ON projects;

-- Create trigger to refresh materialized view when projects table changes
CREATE TRIGGER refresh_featured_projects_trigger
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_featured_projects();

-- Create statistics for better query planning
ANALYZE projects;

-- Create partial index for featured projects to speed up homepage load
CREATE INDEX IF NOT EXISTS idx_featured_projects_partial 
ON projects(id) 
WHERE featured = true AND archived = false;

-- Add index for performance monitoring
CREATE INDEX IF NOT EXISTS idx_projects_created_at 
ON projects(created_at) 
WHERE NOT archived;

-- Comment on indexes for documentation
COMMENT ON INDEX idx_projects_featured_composite IS 'Optimizes featured project queries while excluding archived';
COMMENT ON INDEX idx_projects_main_category IS 'Speeds up filtering by main category';
COMMENT ON INDEX idx_projects_sub_category IS 'Enables efficient subcategory array searches';
COMMENT ON MATERIALIZED VIEW featured_projects IS 'Caches featured projects for faster homepage load';

-- Add execution plan analysis
EXPLAIN ANALYZE 
SELECT * FROM projects 
WHERE featured = true AND archived = false 
LIMIT 6;