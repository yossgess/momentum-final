import { getLocales } from 'expo-localization';

export type Language = 'en' | 'fr';

export interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

export const translations: Translations = {
  'nav.discovery': {
    en: 'Discover',
    fr: 'Découvrir',
  },
  'nav.events': {
    en: 'Events',
    fr: 'Événements',
  },
  'nav.matchzone': {
    en: 'Arena',
    fr: 'Zone Match',
  },
  'nav.chat': {
    en: 'Chat',
    fr: 'Discussion',
  },
  'nav.profile': {
    en: 'Profile',
    fr: 'Profil',
  },

  'common.save': {
    en: 'Save',
    fr: 'Enregistrer',
  },
  'common.cancel': {
    en: 'Cancel',
    fr: 'Annuler',
  },
  'common.delete': {
    en: 'Delete',
    fr: 'Supprimer',
  },
  'common.edit': {
    en: 'Edit',
    fr: 'Modifier',
  },
  'common.search': {
    en: 'Search',
    fr: 'Rechercher',
  },
  'common.all': {
    en: 'All',
    fr: 'Tous',
  },
  'common.clear': {
    en: 'Clear',
    fr: 'Effacer',
  },
  'common.within': {
    en: 'Within',
    fr: 'Dans un rayon de',
  },
  'common.minimum': {
    en: 'Minimum',
    fr: 'Minimum',
  },
  'common.maximum': {
    en: 'Maximum',
    fr: 'Maximum',
  },

  'filters.title': {
    en: 'Filters',
    fr: 'Filtres',
  },
  'filters.distance': {
    en: 'Distance',
    fr: 'Distance',
  },
  'filters.ageRange': {
    en: 'Age Range',
    fr: 'Tranche d\'âge',
  },
  'filters.gender': {
    en: 'Gender',
    fr: 'Genre',
  },
  'filters.men': {
    en: 'Men',
    fr: 'Hommes',
  },
  'filters.women': {
    en: 'Women',
    fr: 'Femmes',
  },
  'filters.any': {
    en: 'Any',
    fr: 'Tous',
  },
  'filters.sports': {
    en: 'Sports',
    fr: 'Sports',
  },
  'filters.reset': {
    en: 'Reset',
    fr: 'Réinitialiser',
  },
  'filters.apply': {
    en: 'Apply',
    fr: 'Appliquer',
  },

  'profile.age': {
    en: 'years old',
    fr: 'ans',
  },
  'profile.bio': {
    en: 'Bio',
    fr: 'Biographie',
  },
  'profile.sports': {
    en: 'Sports',
    fr: 'Sports',
  },
  'profile.skillLevel': {
    en: 'Skill Level',
    fr: 'Niveau de compétence',
  },

  'discovery.like': {
    en: 'Like',
    fr: 'Aimer',
  },
  'discovery.pass': {
    en: 'Pass',
    fr: 'Passer',
  },
  'discovery.superLike': {
    en: 'Super Like',
    fr: 'Super Like',
  },
  'discovery.match': {
    en: "It's a Match!",
    fr: 'Match trouvé !',
  },

  // Sports categories
  'sports.categories.team': {
    en: 'Team Sports',
    fr: 'Sports d\'équipe',
  },
  'sports.categories.racket': {
    en: 'Racket Sports',
    fr: 'Sports de raquette',
  },
  'sports.categories.fitness': {
    en: 'Fitness',
    fr: 'Fitness',
  },
  'sports.categories.individual': {
    en: 'Individual Sports',
    fr: 'Sports individuels',
  },

  // Individual sports
  'sports.Football': {
    en: 'Football',
    fr: 'Football',
  },
  'sports.Basketball': {
    en: 'Basketball',
    fr: 'Basketball',
  },
  'sports.Handball': {
    en: 'Handball',
    fr: 'Handball',
  },
  'sports.Volleyball': {
    en: 'Volleyball',
    fr: 'Volleyball',
  },
  'sports.Tennis': {
    en: 'Tennis',
    fr: 'Tennis',
  },
  'sports.Padel': {
    en: 'Padel',
    fr: 'Padel',
  },
  'sports.Paddle': {
    en: 'Paddle',
    fr: 'Paddle',
  },
  'sports.Crossfit': {
    en: 'Crossfit',
    fr: 'Crossfit',
  },
  'sports.Pilate': {
    en: 'Pilates',
    fr: 'Pilates',
  },
  'sports.Yoga': {
    en: 'Yoga',
    fr: 'Yoga',
  },
  'sports.Fitness': {
    en: 'Fitness',
    fr: 'Fitness',
  },
  'sports.Swimming': {
    en: 'Swimming',
    fr: 'Natation',
  },
  'sports.Cycling': {
    en: 'Cycling',
    fr: 'Cyclisme',
  },
  'sports.Walking': {
    en: 'Walking',
    fr: 'Marche',
  },
  'sports.Running': {
    en: 'Running',
    fr: 'Course',
  },

  'events.create': {
    en: 'Create Event',
    fr: 'Créer un événement',
  },
  'events.join': {
    en: 'Join Event',
    fr: 'Rejoindre',
  },
  'events.participants': {
    en: 'Participants',
    fr: 'Participants',
  },

  'chat.typeMessage': {
    en: 'Type a message...',
    fr: 'Tapez un message...',
  },
  'chat.send': {
    en: 'Send',
    fr: 'Envoyer',
  },

  'settings.notifications': {
    en: 'Notifications',
    fr: 'Notifications',
  },
  'settings.privacy': {
    en: 'Privacy',
    fr: 'Confidentialité',
  },
  'settings.language': {
    en: 'Language',
    fr: 'Langue',
  },
  'common.selectDateTime': {
    en: 'Select Date & Time',
    fr: 'Sélectionner Date et Heure',
  },
  'common.addPhoto': {
    en: 'Add Photo',
    fr: 'Ajouter Photo',
  },
  
  'discovery.commonSports': {
    en: 'Sports in common',
    fr: 'Sports en commun',
  },
  'discovery.otherSports': {
    en: 'Common Sports',
    fr: 'Sports communs',
  },
  
  'common.selectAll': {
    en: 'Select All',
    fr: 'Tout sélectionner',
  },
  
  'discovery.sendMessage': {
    en: 'Send Message',
    fr: 'Envoyer un message',
  },
  'discovery.keepSwiping': {
    en: 'Keep Swiping',
    fr: 'Continuer',
  },

  // New DiscoveryScreen translations
  'discover.title': {
    en: 'Discovery',
    fr: 'Découverte',
  },
  'discover.challenge': {
    en: 'Challenge',
    fr: 'Défier',
  },
  'discover.nope': {
    en: 'Pass',
    fr: 'Passer',
  },
  'discover.revert': {
    en: 'Undo',
    fr: 'Annuler',
  },
  'discover.matchAccepted': {
    en: 'Challenge Accepted!',
    fr: 'Défi accepté !',
  },
  'discover.sendMessage': {
    en: 'Send Message',
    fr: 'Envoyer un message',
  },
  'discover.continue': {
    en: 'Continue',
    fr: 'Continuer',
  },
  'discover.distance': {
    en: 'km away',
    fr: 'km',
  },
  'discover.commonSportsCount': {
    en: 'sports in common',
    fr: 'sports en commun',
  },

  // MatchModal translations
  'match.challengeAccepted': {
    en: 'CHALLENGE ACCEPTED!',
    fr: 'DÉFI ACCEPTÉ !',
  },
  'match.youBothLove': {
    en: 'You both love',
    fr: 'Vous aimez tous les deux',
  },
  'match.sendMessage': {
    en: 'Send Message',
    fr: 'Envoyer un message',
  },
  'match.keepSwiping': {
    en: 'Keep Swiping',
    fr: 'Continuer à swiper',
  },
  'match.congratulations': {
    en: 'Congratulations!',
    fr: 'Félicitations !',
  },
  'match.perfectMatch': {
    en: 'It\'s a perfect match!',
    fr: 'C\'est un match parfait !',
  },

  // Notifications
  'screens.notifications': {
    en: 'Notifications',
    fr: 'Notifications',
  },
  'notifications.matchTitle': {
    en: 'New Match!',
    fr: 'Nouveau Match !',
  },
  'notifications.matchSubtitle': {
    en: 'You matched with {name}!',
    fr: 'Vous avez matché avec {name} !',
  },
  'notifications.messageTitle': {
    en: 'New Message',
    fr: 'Nouveau Message',
  },
  'notifications.messageSubtitle': {
    en: '{sender}: {preview}',
    fr: '{sender} : {preview}',
  },
  'notifications.eventInviteTitle': {
    en: 'Event Invitation',
    fr: 'Invitation à un Événement',
  },
  'notifications.eventInviteSubtitle': {
    en: '{inviter} invited you to {event}',
    fr: '{inviter} vous a invité à {event}',
  },
  'notifications.eventUpdateTitle': {
    en: 'Event Update',
    fr: 'Mise à Jour d\'Événement',
  },
  'notifications.eventUpdateSubtitle': {
    en: '{event} has been {updateType}',
    fr: '{event} a été {updateType}',
  },
  'notifications.eventCancelled': {
    en: 'cancelled',
    fr: 'annulé',
  },
  'notifications.eventRescheduled': {
    en: 'rescheduled',
    fr: 'reporté',
  },
  'notifications.eventUpdated': {
    en: 'updated',
    fr: 'mis à jour',
  },
  'notifications.profileViewTitle': {
    en: 'Profile View',
    fr: 'Vue de Profil',
  },
  'notifications.profileViewSubtitle': {
    en: '{viewer} viewed your profile',
    fr: '{viewer} a consulté votre profil',
  },
  'notifications.challengeTitle': {
    en: 'Challenge Received',
    fr: 'Défi Reçu',
  },
  'notifications.challengeSubtitle': {
    en: '{challenger} challenged you to {sport}',
    fr: '{challenger} vous a défié en {sport}',
  },
  'notifications.defaultTitle': {
    en: 'Notification',
    fr: 'Notification',
  },
  'notifications.defaultSubtitle': {
    en: 'You have a new notification',
    fr: 'Vous avez une nouvelle notification',
  },
  'notifications.empty': {
    en: 'No notifications yet',
    fr: 'Aucune notification pour le moment',
  },
  'notifications.emptyMessage': {
    en: 'When you get matches, messages, or event invites, they\'ll appear here.',
    fr: 'Quand vous recevrez des matchs, messages ou invitations d\'événements, ils apparaîtront ici.',
  },
  'notifications.addTest': {
    en: 'Add Test Notification',
    fr: 'Ajouter une Notification Test',
  },
  'notifications.markAllReadTitle': {
    en: 'Mark All as Read',
    fr: 'Tout Marquer comme Lu',
  },
  'notifications.markAllReadMessage': {
    en: 'Are you sure you want to mark all notifications as read?',
    fr: 'Êtes-vous sûr de vouloir marquer toutes les notifications comme lues ?',
  },
  'notifications.markAllRead': {
    en: 'Mark All Read',
    fr: 'Tout Marquer Lu',
  },
  'notifications.clearAllTitle': {
    en: 'Clear All Notifications',
    fr: 'Effacer Toutes les Notifications',
  },
  'notifications.clearAllMessage': {
    en: 'This will permanently delete all notifications. This action cannot be undone.',
    fr: 'Ceci supprimera définitivement toutes les notifications. Cette action ne peut pas être annulée.',
  },
  'notifications.clearAll': {
    en: 'Clear All',
    fr: 'Tout Effacer',
  },
  'notifications.options': {
    en: 'Notification Options',
    fr: 'Options de Notification',
  },
  'notifications.simulateNew': {
    en: 'Add Test Notification',
    fr: 'Ajouter une Notification Test',
  },
};

class I18nService {
  private currentLanguage: Language = 'en';

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage() {
    const deviceLocales = getLocales();
    const deviceLanguage = deviceLocales[0]?.languageCode;
    
    if (deviceLanguage === 'fr') {
      this.currentLanguage = 'fr';
    } else {
      this.currentLanguage = 'en';
    }
  }

  setLanguage(language: Language) {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  t(key: string, fallback?: string): string {
    const translation = translations[key];
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return fallback || key;
    }

    return translation[this.currentLanguage] || translation.en || fallback || key;
  }

  isRTL(): boolean {
    return false;
  }
}

export const i18n = new I18nService();

export const t = (key: string, fallback?: string) => i18n.t(key, fallback);
