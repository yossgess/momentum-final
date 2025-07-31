export interface MockProfile {
  id: string;
  name: string;
  age: number;
  distance: number;
  sports: string[];
  images: string[];
  bio?: string;
  location?: string;
}

export const mockProfiles: MockProfile[] = [
  {
    id: "p001",
    name: "Sofia",
    age: 26,
    distance: 2.1,
    sports: ["Padel", "Yoga", "Tennis"],
    images: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop"
    ],
    bio: "Love staying active and meeting new people through sports!",
    location: "Downtown"
  },
  {
    id: "p002",
    name: "David",
    age: 30,
    distance: 5.4,
    sports: ["Running", "Crossfit", "Basketball"],
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop"
    ],
    bio: "Fitness enthusiast looking for workout partners",
    location: "Midtown"
  },
  {
    id: "p003",
    name: "Emma",
    age: 24,
    distance: 1.8,
    sports: ["Swimming", "Volleyball", "Walking"],
    images: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop"
    ],
    bio: "Outdoor adventures and team sports are my passion",
    location: "Riverside"
  },
  {
    id: "p004",
    name: "Marcus",
    age: 28,
    distance: 3.2,
    sports: ["Football", "Crossfit", "Cycling"],
    images: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop"
    ],
    bio: "Competitive athlete seeking training partners",
    location: "Uptown"
  },
  {
    id: "p005",
    name: "Aria",
    age: 22,
    distance: 4.7,
    sports: ["Fitness", "Pilate", "Cycling"],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ],
    bio: "Creative movement and strength training enthusiast",
    location: "Arts District"
  }
];
