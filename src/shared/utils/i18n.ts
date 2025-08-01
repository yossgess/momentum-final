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
  'common.done': {
    en: 'Done',
    fr: 'Terminé',
  },
  'common.selectDate': {
    en: 'Select Date',
    fr: 'Sélectionner la date',
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
  'common.loading': {
    en: 'Loading...',
    fr: 'Chargement...',
  },
  'common.retry': {
    en: 'Retry',
    fr: 'Réessayer',
  },

  // Auth translations
  'auth.login': {
    en: 'Login',
    fr: 'Connexion',
  },
  'auth.signUp': {
    en: 'Sign Up',
    fr: 'S’inscrire',
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
  'discovery.error.title': {
    en: 'Error Loading Profiles',
    fr: 'Erreur de chargement des profils',
  },
  'discovery.noMoreProfiles': {
    en: 'No More Profiles',
    fr: 'Plus de profils',
  },
  'discovery.tryAdjustingFilters': {
    en: 'Try adjusting your filters to find more people',
    fr: 'Essayez d\'ajuster vos filtres pour trouver plus de personnes',
  },
  'discovery.refreshProfiles': {
    en: 'Refresh',
    fr: 'Actualiser',
  },
  'discovery.loading': {
    en: 'Loading profiles...',
    fr: 'Chargement des profils...',
  },
  'discovery.editFilters': {
    en: 'Edit Filters',
    fr: 'Modifier les filtres',
  },

  // Sports categories - short labels to prevent wrapping
  'sports.categories.team': {
    en: 'Team',
    fr: 'Équipe',
  },
  'sports.categories.racket': {
    en: 'Racket',
    fr: 'Raquette',
  },
  'sports.categories.fitness': {
    en: 'Fitness',
    fr: 'Fitness',
  },
  'sports.categories.individual': {
    en: 'Solo',
    fr: 'Solo',
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

  'onboarding.form.title': {
    en: 'Complete Your Profile',
    fr: 'Complétez votre profil',
  },
  'onboarding.form.subtitle': {
    en: 'Tell us about yourself to find the perfect sports partners',
    fr: 'Parlez-nous de vous pour trouver les partenaires sportifs parfaits',
  },
  'onboarding.form.step': {
    en: 'Step',
    fr: 'Étape',
  },
  'onboarding.form.of': {
    en: 'of',
    fr: 'sur',
  },
  'onboarding.form.fullName': {
    en: 'Full Name',
    fr: 'Nom complet',
  },
  'onboarding.form.fullNamePlaceholder': {
    en: 'Enter your full name',
    fr: 'Entrez votre nom complet',
  },
  'onboarding.form.dateOfBirth': {
    en: 'Date of Birth',
    fr: 'Date de naissance',
  },
  'onboarding.form.selectDateOfBirth': {
    en: 'Select your date of birth',
    fr: 'Sélectionnez votre date de naissance',
  },
  'onboarding.form.gender': {
    en: 'Gender',
    fr: 'Genre',
  },
  'onboarding.form.man': {
    en: 'Man',
    fr: 'Homme',
  },
  'onboarding.form.woman': {
    en: 'Woman',
    fr: 'Femme',
  },
  'onboarding.form.interestedIn': {
    en: 'Interested In',
    fr: 'Intéressé par',
  },
  'onboarding.form.men': {
    en: 'Men',
    fr: 'Hommes',
  },
  'onboarding.form.women': {
    en: 'Women',
    fr: 'Femmes',
  },
  'onboarding.form.any': {
    en: 'Anyone',
    fr: 'Tout le monde',
  },
  'onboarding.form.preferredSports': {
    en: 'Preferred Sports',
    fr: 'Sports préférés',
  },
  'onboarding.form.availability': {
    en: 'Availability',
    fr: 'Disponibilité',
  },
  'onboarding.form.days': {
    en: 'Days',
    fr: 'Jours',
  },
  'onboarding.form.periods': {
    en: 'Time Periods',
    fr: 'Périodes',
  },
  'onboarding.form.monday': {
    en: 'Monday',
    fr: 'Lundi',
  },
  'onboarding.form.tuesday': {
    en: 'Tuesday',
    fr: 'Mardi',
  },
  'onboarding.form.wednesday': {
    en: 'Wednesday',
    fr: 'Mercredi',
  },
  'onboarding.form.thursday': {
    en: 'Thursday',
    fr: 'Jeudi',
  },
  'onboarding.form.friday': {
    en: 'Friday',
    fr: 'Vendredi',
  },
  'onboarding.form.saturday': {
    en: 'Saturday',
    fr: 'Samedi',
  },
  'onboarding.form.sunday': {
    en: 'Sunday',
    fr: 'Dimanche',
  },
  'onboarding.form.morning': {
    en: 'Morning',
    fr: 'Matin',
  },
  'onboarding.form.afternoon': {
    en: 'Afternoon',
    fr: 'Après-midi',
  },
  'onboarding.form.evening': {
    en: 'Evening',
    fr: 'Soir',
  },
  'onboarding.form.photos.label': {
    en: 'Photos',
    fr: 'Photos',
  },
  'onboarding.form.photos.description': {
    en: 'Add up to 5 photos to show your personality',
    fr: 'Ajoutez jusqu\'à 5 photos pour montrer votre personnalité',
  },
  'onboarding.form.back': {
    en: 'Back',
    fr: 'Retour',
  },
  'onboarding.form.continue': {
    en: 'Continue',
    fr: 'Continuer',
  },
  'onboarding.form.finish': {
    en: 'Finish',
    fr: 'Terminer',
  },
  'onboarding.form.submitting': {
    en: 'Creating your profile...',
    fr: 'Création de votre profil...',
  },
  'onboarding.form.error.minLength': {
    en: 'Name must be at least 2 characters',
    fr: 'Le nom doit contenir au moins 2 caractères',
  },
  'onboarding.form.error.invalidDate': {
    en: 'Please select a valid date',
    fr: 'Veuillez sélectionner une date valide',
  },
  'onboarding.form.error.minAge': {
    en: 'You must be at least 18 years old',
    fr: 'Vous devez avoir au moins 18 ans',
  },
  'onboarding.form.error.selectGender': {
    en: 'Please select your gender',
    fr: 'Veuillez sélectionner votre genre',
  },
  'onboarding.form.error.selectInterest': {
    en: 'Please select your interest',
    fr: 'Veuillez sélectionner votre intérêt',
  },
  'onboarding.form.error.selectSports': {
    en: 'Please select at least one sport',
    fr: 'Veuillez sélectionner au moins un sport',
  },
  'onboarding.form.error.selectAvailability': {
    en: 'Please select your availability',
    fr: 'Veuillez sélectionner votre disponibilité',
  },
  'onboarding.form.error.submitFailed': {
    en: 'Failed to create profile. Please try again.',
    fr: 'Échec de la création du profil. Veuillez réessayer.',
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

  // Auth
  'auth.welcomeBack': {
    en: 'Welcome back!',
    fr: 'Bon retour !',
  },
  'auth.subtitle': {
    en: 'Let\'s get you in and start challenging.',
    fr: 'Connectons-nous et commençons à défier.',
  },
  'auth.email': {
    en: 'Email',
    fr: 'Email',
  },
  'auth.emailPlaceholder': {
    en: 'Enter your email',
    fr: 'Entrez votre email',
  },
  'auth.password': {
    en: 'Password',
    fr: 'Mot de passe',
  },
  'auth.signIn': {
    en: 'Sign In',
    fr: 'Se connecter',
  },
  'auth.signup': {
    en: 'Sign Up',
    fr: 'S\'inscrire',
  },
  'auth.passwordPlaceholder': {
    en: 'Enter your password',
    fr: 'Entrez votre mot de passe',
  },
  'auth.forgotPassword': {
    en: 'Forgot Password?',
    fr: 'Mot de passe oublié ?',
  },
  'auth.noAccount': {
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte ?",
  },
  'auth.loading': {
    en: 'Loading...',
    fr: 'Chargement...',
  },
  'auth.errorInvalidCredentials': {
    en: 'Invalid email or password',
    fr: 'E-mail ou mot de passe invalide',
  },

  // Onboarding
  'onboarding.title1': {
    en: 'Find Your Sports Buddy',
    fr: 'Trouvez Votre Partenaire Sportif',
  },
  'onboarding.subtitle1': {
    en: 'Swipe, connect and challenge athletes nearby.',
    fr: 'Glissez, connectez-vous et défiez les athlètes à proximité.',
  },
  'onboarding.title2': {
    en: 'Join Exciting Events',
    fr: 'Rejoignez des Événements Passionnants',
  },
  'onboarding.subtitle2': {
    en: 'Discover and join sport events around you.',
    fr: 'Découvrez et rejoignez des événements sportifs autour de vous.',
  },
  'onboarding.title3': {
    en: 'Compete on Real Courts',
    fr: 'Compétitionnez sur de Vrais Terrains',
  },
  'onboarding.subtitle3': {
    en: 'Book courts and challenge players near you.',
    fr: 'Réservez des terrains et défiez les joueurs près de chez vous.',
  },
  'onboarding.ctaNext': {
    en: 'Next',
    fr: 'Suivant',
  },
  'onboarding.ctaStart': {
    en: 'Get Started',
    fr: 'Commencer',
  },

  
  // Photo selector translations
  'photo.permissionRequired': {
    en: 'Permission Required',
    fr: 'Autorisation requise',
  },
  'photo.permissionMessage': {
    en: 'Please allow access to your photo library to upload images.',
    fr: 'Veuillez autoriser l\'accès à votre photothèque pour télécharger des images.',
  },
  'photo.cameraPermissionRequired': {
    en: 'Camera Permission Required',
    fr: 'Autorisation de caméra requise',
  },
  'photo.cameraPermissionMessage': {
    en: 'Please allow camera access to take photos.',
    fr: 'Veuillez autoriser l\'accès à la caméra pour prendre des photos.',
  },
  'photo.selectPhoto': {
    en: 'Select Photo',
    fr: 'Sélectionner une photo',
  },
  'photo.selectPhotoMessage': {
    en: 'Choose how you\'d like to add a photo',
    fr: 'Choisissez comment vous souhaitez ajouter une photo',
  },
  'photo.camera': {
    en: 'Camera',
    fr: 'Caméra',
  },
  'photo.gallery': {
    en: 'Photo Library',
    fr: 'Photothèque',
  },
  'photo.error': {
    en: 'Error',
    fr: 'Erreur',
  },
  'photo.selectError': {
    en: 'Failed to select photo. Please try again.',
    fr: 'Échec de la sélection de photo. Veuillez réessayer.',
  },
  'photo.cameraError': {
    en: 'Failed to take photo. Please try again.',
    fr: 'Échec de la prise de photo. Veuillez réessayer.',
  },
  'photo.replaceError': {
    en: 'Failed to replace photo. Please try again.',
    fr: 'Échec du remplacement de photo. Veuillez réessayer.',
  },
  'photo.photoOptions': {
    en: 'Photo Options',
    fr: 'Options de photo',
  },
  'photo.setAsMain': {
    en: 'Set as Main Photo',
    fr: 'Définir comme photo principale',
  },
  'photo.replace': {
    en: 'Replace Photo',
    fr: 'Remplacer la photo',
  },
  'photo.delete': {
    en: 'Delete Photo',
    fr: 'Supprimer la photo',
  },
  'photo.deletePhoto': {
    en: 'Delete Photo',
    fr: 'Supprimer la photo',
  },
  'photo.deletePhotoMessage': {
    en: 'Are you sure you want to delete this photo?',
    fr: 'Êtes-vous sûr de vouloir supprimer cette photo ?',
  },
  'photo.addPhoto': {
    en: 'Add Photo',
    fr: 'Ajouter une photo',
  },
  'photo.addYourFirstPhoto': {
    en: 'Add your first photo to get started',
    fr: 'Ajoutez votre première photo pour commencer',
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
