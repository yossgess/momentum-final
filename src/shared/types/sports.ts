export interface Sport {
  id: string;
  name: string;
  icon: string;
  skillLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface UserSport extends Sport {
  yearsOfExperience?: number;
  lastPlayed?: Date;
}
