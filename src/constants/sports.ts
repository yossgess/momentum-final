import { Sport } from '../shared/types/sports';
import { getSportIcon } from './sportIcons';

// Categorized sports as string arrays (for filtering UI)
export const categorizedSports: Record<string, string[]> = {
  team: [
    'Football',
    'Basketball',
    'Handball',
    'Volleyball',
  ],
  racket: [
    'Tennis',
    'Padel',
  ],
  fitness: [
    'Crossfit',
    'Pilate',
    'Yoga',
    'Fitness',
  ],
  individual: [
    'Swimming',
    'Cycling',
    'Walking',
    'Running',
    'Paddle',
  ],
};

// Full Sport objects with icons and skill levels (canonical source)
export const allSports: Sport[] = [
  // Team Sports
  { id: 'football', name: 'Football', icon: getSportIcon('Football'), skillLevel: 'Advanced' },
  { id: 'basketball', name: 'Basketball', icon: getSportIcon('Basketball'), skillLevel: 'Beginner' },
  { id: 'handball', name: 'Handball', icon: getSportIcon('Handball'), skillLevel: 'Intermediate' },
  { id: 'volleyball', name: 'Volleyball', icon: getSportIcon('Volleyball'), skillLevel: 'Beginner' },
  
  // Racket Sports
  { id: 'tennis', name: 'Tennis', icon: getSportIcon('Tennis'), skillLevel: 'Intermediate' },
  { id: 'padel', name: 'Padel', icon: getSportIcon('Padel'), skillLevel: 'Intermediate' },
  { id: 'paddle', name: 'Paddle', icon: getSportIcon('Paddle'), skillLevel: 'Beginner' },
  
  // Fitness
  { id: 'crossfit', name: 'Crossfit', icon: getSportIcon('Crossfit'), skillLevel: 'Advanced' },
  { id: 'pilate', name: 'Pilate', icon: getSportIcon('Pilate'), skillLevel: 'Beginner' },
  { id: 'yoga', name: 'Yoga', icon: getSportIcon('Yoga'), skillLevel: 'Beginner' },
  { id: 'fitness', name: 'Fitness', icon: getSportIcon('Fitness'), skillLevel: 'Intermediate' },
  
  // Individual Sports
  { id: 'swimming', name: 'Swimming', icon: getSportIcon('Swimming'), skillLevel: 'Intermediate' },
  { id: 'cycling', name: 'Cycling', icon: getSportIcon('Cycling'), skillLevel: 'Intermediate' },
  { id: 'walking', name: 'Walking', icon: getSportIcon('Walking'), skillLevel: 'Beginner' },
  { id: 'running', name: 'Running', icon: getSportIcon('Running'), skillLevel: 'Advanced' },
];

// Helper functions to get sports by category
export const getSportsByCategory = (category: string): Sport[] => {
  const sportNames = categorizedSports[category] || [];
  return allSports.filter(sport => 
    sportNames.some(name => name.toLowerCase() === sport.name.toLowerCase())
  );
};

// Helper function to get sport by name
export const getSportByName = (name: string): Sport | undefined => {
  return allSports.find(sport => 
    sport.name.toLowerCase() === name.toLowerCase()
  );
};

// Helper function to get sport by id
export const getSportById = (id: string): Sport | undefined => {
  return allSports.find(sport => sport.id === id);
};
