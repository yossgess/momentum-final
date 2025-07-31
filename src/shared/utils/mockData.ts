import { Event } from '../../components/business/EventCard/EventCard.types';
import { Coach } from '../../components/business/CoachCard/CoachCard.types';
import { Court } from '../../components/business/CourtCard/CourtCard.types';

// NOTE: Sports data has been moved to the canonical source at:
// src/constants/sports.ts - use `allSports` for complete Sport objects
// This ensures consistency across the entire application

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Morning Tennis Match',
    dateTime: new Date(2024, 7, 15, 9, 0),
    location: 'Central Park Courts',
    sportType: 'Tennis',
    participants: { current: 4, max: 6 },
    image: 'https://example.com/tennis.jpg',
  },
  {
    id: '2',
    title: 'Weekend Football Game',
    dateTime: new Date(2024, 7, 16, 14, 30),
    location: 'City Stadium',
    sportType: 'Football',
    participants: { current: 18, max: 22 },
  },
  {
    id: '3',
    title: 'Swimming Session',
    dateTime: new Date(2024, 7, 17, 7, 0),
    location: 'Aquatic Center',
    sportType: 'Swimming',
    participants: { current: 8, max: 12 },
  },
];

export const mockCoaches: Coach[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    specialty: 'Tennis Coach',
    rating: 4.8,
    available: true,
    avatarImage: 'https://example.com/coach1.jpg',
  },
  {
    id: '2',
    name: 'Mike Rodriguez',
    specialty: 'Football Trainer',
    rating: 4.6,
    available: false,
  },
  {
    id: '3',
    name: 'Emma Chen',
    specialty: 'Swimming Instructor',
    rating: 4.9,
    available: true,
    avatarImage: 'https://example.com/coach3.jpg',
  },
];

export const mockCourts: Court[] = [
  {
    id: '1',
    courtName: 'Central Tennis Court 1',
    type: 'Hard Court',
    location: 'Downtown',
    image: 'https://example.com/court1.jpg',
  },
  {
    id: '2',
    courtName: 'Olympic Pool',
    type: 'Indoor Pool',
    location: 'Sports Complex',
  },
  {
    id: '3',
    courtName: 'Basketball Arena',
    type: 'Indoor Court',
    location: 'University Campus',
    image: 'https://example.com/court3.jpg',
  },
];
