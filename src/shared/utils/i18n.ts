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
    en: 'MatchZone',
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
  'common.filter': {
    en: 'Filter',
    fr: 'Filtrer',
  },
  'common.loading': {
    en: 'Loading...',
    fr: 'Chargement...',
  },
  'common.error': {
    en: 'An error occurred',
    fr: 'Une erreur est survenue',
  },

  'auth.login': {
    en: 'Log In',
    fr: 'Se connecter',
  },
  'auth.signup': {
    en: 'Sign Up',
    fr: "S'inscrire",
  },
  'auth.logout': {
    en: 'Log Out',
    fr: 'Se déconnecter',
  },
  'auth.email': {
    en: 'Email',
    fr: 'E-mail',
  },
  'auth.password': {
    en: 'Password',
    fr: 'Mot de passe',
  },

  'profile.age': {
    en: 'Age',
    fr: 'Âge',
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
  
  'common.minimum': {
    en: 'Minimum',
    fr: 'Minimum',
  },
  'common.maximum': {
    en: 'Maximum',
    fr: 'Maximum',
  },
  'common.within': {
    en: 'Within',
    fr: 'À moins de',
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
