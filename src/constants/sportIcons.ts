// Centralized sport icon mapping for consistent icons across the app
export const sportIconMap: Record<string, string> = {
  // Team Sports
  'Football': 'football',
  'Basketball': 'basketball', 
  'Handball': 'american-football',
  'Volleyball': 'american-football',
  
  // Racket Sports
  'Tennis': 'tennisball',
  'Padel': 'tennisball',
  'Paddle': 'boat',
  
  // Fitness
  'Crossfit': 'fitness',
  'Pilate': 'body',
  'Yoga': 'body',
  'Fitness': 'fitness',
  
  // Individual Sports
  'Swimming': 'water',
  'Cycling': 'bicycle',
  'Walking': 'walk',
  'Running': 'walk',
};

// Function to get sport icon with fallback
export const getSportIcon = (sportName: string): string => {
  return sportIconMap[sportName] || 'fitness'; // Default fallback icon
};

// Category icon mapping
export const categoryIconMap: Record<string, string> = {
  'team': '🤝',
  'racket': '🎾', 
  'fitness': '🏋️',
  'individual': '🏃‍♂️',
};
