# Performance Optimization Plan for Initial Project Load

## Current Issues
The initial load of the first three project cards is significantly slow due to several factors:

1. **Database Performance**
   - Missing optimized indexes
   - Fetching unnecessary data
   - Row-level security checks on every query

2. **Image Loading**
   - Full-size images loaded immediately
   - No image optimization
   - No CDN implementation

3. **Application Architecture**
   - No data caching
   - Authentication overhead
   - No selective field fetching

## Solution Plan

### 1. Database Optimizations (Immediate Impact)

```sql
-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_main_category 
ON projects("mainCategory") WHERE NOT archived;

CREATE INDEX IF NOT EXISTS idx_projects_sub_category 
ON projects USING GIN("subCategory") WHERE NOT archived;

-- Create a materialized view for card data
CREATE MATERIALIZED VIEW project_cards AS
SELECT 
  id,
  title,
  "mainCategory",
  "subCategory",
  year,
  "imageUrl"
FROM projects
WHERE NOT archived;

-- Create refresh function
CREATE FUNCTION refresh_project_cards()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW project_cards;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Auto-refresh on changes
CREATE TRIGGER refresh_project_cards_trigger
AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_project_cards();
```

### 2. Image Optimization (Significant Impact)

1. Implement image CDN:
```typescript
// Update image URLs to use Cloudinary or similar CDN
const getOptimizedImageUrl = (url: string, width: number) => {
  return `https://res.cloudinary.com/your-cloud/image/fetch/w_${width},q_auto,f_auto/${url}`;
};
```

2. Progressive loading:
   - Generate and store thumbnail versions (e.g., 50px wide)
   - Use blur-up loading with tiny thumbnails
   - Load full card images only when needed

### 3. Application Optimizations (Moderate Impact)

1. Implement client-side caching:
```typescript
// src/lib/projectsCache.ts
export const projectsCache = {
  async getProjects(page: number) {
    const cacheKey = `projects_page_${page}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await fetchProjectRow(page);
    localStorage.setItem(cacheKey, JSON.stringify(data));
    return data;
  }
};
```

2. Optimize data fetching:
```typescript
// Only select needed fields for cards
const query = supabase
  .from('project_cards')  // Use materialized view
  .select('id, title, mainCategory, subCategory, year, imageUrl')
  .range(start, end);
```

3. Implement preloading:
```typescript
// Preload next row when current row is 50% visible
const preloadNextRow = (page: number) => {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = getApiUrl(`/projects?page=${page + 1}`);
  document.head.appendChild(link);
};
```

## Implementation Priority

1. **Phase 1 - Database (Day 1)**
   - Add optimized indexes
   - Create materialized view
   - Update queries to use view

2. **Phase 2 - Images (Days 2-3)**
   - Set up CDN integration
   - Implement image optimization
   - Add progressive loading

3. **Phase 3 - Application (Days 4-5)**
   - Add caching layer
   - Implement preloading
   - Optimize data fetching

## Expected Improvements

- Database query time: 60-80% reduction
- Initial load time: 70-90% reduction
- Perceived performance: Significant improvement due to progressive loading
- Subsequent loads: Near-instant due to caching

## Monitoring

1. Add performance monitoring:
```typescript
const measureQueryTime = async (query: Promise<any>) => {
  const start = performance.now();
  const result = await query;
  const duration = performance.now() - start;
  console.log(`Query took ${duration}ms`);
  return result;
};
```

2. Track key metrics:
   - Time to first meaningful paint
   - Time to interactive
   - Query execution time
   - Image load time

## Next Steps

1. Implement database optimizations
2. Set up image CDN and optimization pipeline
3. Add client-side caching and preloading
4. Measure and validate improvements