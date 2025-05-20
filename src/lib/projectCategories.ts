
export type MainCategory = 'ARCHITECTURAL DESIGN' | 'INTERIOR DESIGN' | 'LANDSCAPE ARCHITECTURE';

export type SubCategory = string;

export interface CategoryStructure {
  main: MainCategory;
  subcategories: SubCategory[];
}

export const projectCategories: CategoryStructure[] = [
  {
    main: 'ARCHITECTURAL DESIGN',
    subcategories: [
      'Agricultural Buildings',
      'Commercial Architecture',
      'Conceptual Architecture',
      'Cultural Architecture',
      'Educational Buildings',
      'Green architecture',
      'Healthcare / Wellness',
      'Heritage Architecture',
      'High Rise Buildings',
      'Hospitality Architecture',
      'Industrial Buildings',
      'Infrastructure',
      'Institutional Architecture',
      'Misc. Architecture',
      'Mixed Use Architecture',
      'Other Architecture',
      'Recreational Architecture',
      'Residential Architecture - Multi Unit',
      'Residential Architecture - Single Family',
      'Restoration & Renovation',
      'Small Architecture',
      'Social Housing',
      'Transportation',
      'Virtual Architecture'
    ]
  },
  {
    main: 'INTERIOR DESIGN',
    subcategories: [
      'Apartments Interior',
      'Commercial Interior',
      'Conceptual Interior',
      'Exhibition',
      'Hospitality Interior',
      'Houses Interior',
      'Other Interior Design',
      'Public Spaces',
      'Residential Interior',
      'Retail Interior',
      'Rooms and Zones',
      'Workplaces Interior'
    ]
  },
  {
    main: 'LANDSCAPE ARCHITECTURE',
    subcategories: [
      'Commercial Landscape',
      'Conceptual Landscape',
      'Educational Landscape',
      'Gardens',
      'Installations & structures',
      'Large Scale Landscape Projects',
      'Other Landscape Architecture',
      'Outdoor Designs',
      'Public Landscape',
      'Residential Landscape',
      'Small Scale Landscape Projects',
      'Urban Design',
      'Urban Planning'
    ]
  }
];
