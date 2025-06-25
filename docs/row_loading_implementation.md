# Row-by-Row Loading Implementation Plan

## Problem
Currently, all project card images are being loaded at once, causing performance issues and slow initial load times.

## Solution
Implement row-by-row loading using the Intersection Observer API to load project cards only when they are about to become visible in the viewport.

## Technical Implementation Details

### 1. Project Row Component
Create a new component to wrap each row of project cards:

```typescript
// src/components/ProjectRow.tsx
interface ProjectRowProps {
  projects: Project[];
  onVisible: () => void;
}

const ProjectRow = ({ projects, onVisible }) => {
  // Use Intersection Observer to detect when row is about to be visible
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onVisible();
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // Start loading 200px before row becomes visible
    );

    if (rowRef.current) {
      observer.observe(rowRef.current);
    }

    return () => observer.disconnect();
  }, [onVisible]);

  return (
    <div ref={rowRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map(project => (
        <ProjectCard key={project.id} {...project} />
      ))}
    </div>
  );
};
```

### 2. Update AllProjectsPage
Modify the page to load and display projects in rows:

```typescript
// src/pages/AllProjectsPage.tsx
const PROJECTS_PER_ROW = 3;

const AllProjectsPage = () => {
  const [visibleRows, setVisibleRows] = useState(1);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Split projects into rows
  const projectRows = useMemo(() => {
    const rows = [];
    for (let i = 0; i < projects.length; i += PROJECTS_PER_ROW) {
      rows.push(projects.slice(i, i + PROJECTS_PER_ROW));
    }
    return rows;
  }, [projects]);

  // Only render rows that have been marked as visible
  const visibleProjects = projectRows.slice(0, visibleRows);

  return (
    <div>
      {visibleProjects.map((rowProjects, index) => (
        <ProjectRow
          key={index}
          projects={rowProjects}
          onVisible={() => setVisibleRows(prev => Math.max(prev, index + 2))}
        />
      ))}
    </div>
  );
};
```

### 3. ProjectCard Component Updates

```typescript
// src/components/ProjectCard.tsx
const ProjectCard = ({ imageUrl, ...props }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only start loading image when parent row signals it's visible
    if (cardRef.current) {
      setShouldLoad(true);
    }
  }, []);

  return (
    <div ref={cardRef}>
      {shouldLoad ? (
        // Render optimized image with blur-up loading
        <OptimizedImage url={imageUrl} {...props} />
      ) : (
        // Render placeholder
        <PlaceholderImage />
      )}
    </div>
  );
};
```

## Benefits
1. Initial page load will be much faster as only the first row of images is loaded
2. Subsequent rows load just before they come into view, providing a smooth scrolling experience
3. Network requests are spread out over time rather than all at once
4. Better memory usage as images are loaded incrementally
5. Improved perceived performance with placeholder content

## Implementation Steps
1. Create new ProjectRow component
2. Update AllProjectsPage to use row-based loading
3. Modify ProjectCard to work with row visibility
4. Add proper loading states and placeholders
5. Test scrolling performance and adjust intersection observer margins as needed

Next step: Switch to Code mode to implement these changes.