# Project Cards Performance Improvement Plan

## Overview
The project cards are currently experiencing slow loading times due to three main issues:
1. Loading all projects at once from the database
2. Unoptimized images
3. Inefficient client-side rendering

## Implementation Plan

### Phase 1: Server-Side Pagination (Highest Impact)
- Modify Supabase queries to load projects in chunks
- Implement infinite scroll with proper pagination
- Move filtering to server-side to reduce data transfer

### Phase 2: Image Optimization
- Add image resizing and compression
- Implement progressive loading
- Add blur-up placeholders for better UX

### Phase 3: Client-Side Optimization
- Add React Query for efficient data caching
- Implement virtualization for large lists
- Optimize re-renders with proper memoization

## Technical Implementation Details

### Phase 1: Server-Side Pagination
```typescript
// src/lib/projectsSupabase.ts
export async function fetchProjects(
  page: number = 1,
  pageSize: number = 20,
  filters?: ProjectFilters
): Promise<{ data: Project[]; count: number }> {
  let query = supabase
    .from('projects')
    .select('*', { count: 'exact' })
    .eq('archived', false)
    .range((page - 1) * pageSize, page * pageSize - 1);

  // Add server-side filtering
  if (filters?.mainCategory) {
    query = query.eq('mainCategory', filters.mainCategory);
  }

  return query;
}
```

### Phase 2: Image Optimization
```typescript
// src/components/ProjectCard.tsx
const ProjectCard = ({ imageUrl, ...props }) => {
  return (
    <div className="relative">
      {/* Blur-up placeholder */}
      <img 
        src={`${imageUrl}?quality=1&blur=20`} 
        className="absolute inset-0"
        alt=""
      />
      {/* Main optimized image */}
      <img
        src={`${imageUrl}?w=800&quality=75`}
        loading="lazy"
        className="relative z-10"
        alt={props.title}
      />
    </div>
  );
};
```

### Phase 3: Client-Side Optimization
```typescript
// src/pages/AllProjectsPage.tsx
const AllProjectsPage = () => {
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ['projects', filters],
    queryFn: ({ pageParam = 1 }) => 
      fetchProjects(pageParam, 20, filters),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
  });

  // Implement virtualization
  const rowVirtualizer = useVirtualizer({
    count: data?.pages.flatMap(p => p.data).length ?? 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 300,
    overscan: 5,
  });
};
```

## Expected Outcomes
1. Significantly faster initial page load
2. Reduced memory usage
3. Better user experience with progressive loading
4. Smoother scrolling performance
5. Reduced server load

## Metrics to Monitor
- Time to First Meaningful Paint
- Page Load Time
- Memory Usage
- Server Response Time
- Client-side Rendering Time

## Next Steps
1. Implement Phase 1 changes in projectsSupabase.ts
2. Update AllProjectsPage.tsx to handle pagination
3. Add image optimization
4. Add client-side optimizations