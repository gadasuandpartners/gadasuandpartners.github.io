# Plan: Support Multiple Subcategories per Project

## Goals
- Allow each project to have multiple subcategories.
- Projects should appear under all selected subcategories in filters and galleries.
- Project pages should display all assigned subcategories.

---

## Steps

### 1. Update Data Model
- Change `subCategory: string` to `subCategory: string[]` in [`src/lib/projectsData.ts`](src/lib/projectsData.ts).
- Update all code that reads/writes `subCategory` to handle arrays.

### 2. Update Project Form
- In [`src/components/ProjectForm.tsx`](src/components/ProjectForm.tsx), replace the subcategory dropdown with a multi-select component.
- Allow users to select multiple subcategories for a project.
- Save the selected subcategories as an array.

### 3. Update Project Add/Edit Logic
- Ensure new and edited projects save/load `subCategory` as an array.
- Update any validation to require at least one subcategory.

### 4. Update Project Display
- In [`src/pages/ProjectPage.tsx`](src/pages/ProjectPage.tsx), display all subcategories for a project (e.g., as badges or a list).

### 5. Update Filtering and Gallery Logic
- Update any filtering (e.g., in project galleries or subcategory filters) to check if the selected subcategory is included in the project's `subCategory` array.
- Projects should appear in all relevant subcategory views.

---

## Example Data Model

```ts
interface Project {
  // ...
  subCategory: string[]; // Now an array
  // ...
}
```

---

## Example Filter Logic

```ts
// Show project if any of its subcategories match the selected filter
const filteredProjects = allProjects.filter(project =>
  project.subCategory.includes(selectedSubcategory)
);
```

---

## Impacted Files

- [`src/lib/projectsData.ts`](src/lib/projectsData.ts)
- [`src/components/ProjectForm.tsx`](src/components/ProjectForm.tsx)
- [`src/pages/ProjectPage.tsx`](src/pages/ProjectPage.tsx)
- Any gallery/filter components using subcategories

---

## Next Steps

1. Confirm this plan.
2. Switch to code mode to implement the changes.