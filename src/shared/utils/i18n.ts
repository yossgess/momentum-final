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
  'common.ok': {
    en: 'OK',
    fr: 'OK',
  },
  'common.tryAgain': {
    en: 'Try Again',
    fr: 'Réessayer',
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
  'filters.minAge': {
    en: 'Min Age',
    fr: 'Âge min',
  },
  'filters.maxAge': {
    en: 'Max Age',
    fr: 'Âge max',
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
    en: 'years',
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
  'discovery.profileDetails': {
    en: 'Profile Details',
    fr: 'Détails du profil',
  },
  'discovery.locationUnknown': {
    en: 'Location unknown',
    fr: 'Localisation inconnue',
  },
  'discovery.profileBioPlaceholder': {
    en: 'Hi, I\'m {{name}}! I love sports and I\'m looking for new partners to play with.',
    fr: 'Salut, je suis {{name}} ! J\'adore le sport et je cherche de nouveaux partenaires pour jouer.',
  },
  'discovery.profileBioDefault': {
    en: 'Sports enthusiast looking for new partners to play with!',
    fr: 'Passionné de sport à la recherche de nouveaux partenaires de jeu !',
  },
  'profile.about': {
    en: 'About',
    fr: 'À propos',
  },
  'profile.availability': {
    en: 'Availability',
    fr: 'Disponibilité',
  },

  // Location functionality
  'discovery.location.title': {
    en: 'Location Required',
    fr: 'Localisation Requise',
  },
  'discovery.location.description': {
    en: 'To discover people near you and show accurate distances, we need access to your location.',
    fr: 'Pour découvrir des personnes près de vous et afficher des distances précises, nous avons besoin d\'accéder à votre localisation.',
  },
  'discovery.location.reason1': {
    en: 'Find people nearby',
    fr: 'Trouver des personnes à proximité',
  },
  'discovery.location.reason2': {
    en: 'Show accurate distances',
    fr: 'Afficher des distances précises',
  },
  'discovery.location.reason3': {
    en: 'Your privacy is protected',
    fr: 'Votre vie privée est protégée',
  },
  'discovery.location.enableButton': {
    en: 'Enable Location',
    fr: 'Activer la Localisation',
  },
  'discovery.location.privacyNote': {
    en: 'Your exact location is never shared with other users. Only approximate distances are shown.',
    fr: 'Votre position exacte n\'est jamais partagée avec d\'autres utilisateurs. Seules les distances approximatives sont affichées.',
  },
  'discovery.location.success.title': {
    en: 'Location Enabled',
    fr: 'Localisation Activée',
  },
  'discovery.location.success.message': {
    en: 'Great! You can now discover people near you.',
    fr: 'Parfait ! Vous pouvez maintenant découvrir des personnes près de vous.',
  },
  'discovery.location.error.title': {
    en: 'Location Error',
    fr: 'Erreur de Localisation',
  },
  'discovery.location.error.message': {
    en: 'We couldn\'t access your location. Please check your permissions and try again.',
    fr: 'Nous n\'avons pas pu accéder à votre localisation. Veuillez vérifier vos autorisations et réessayer.',
  },

  // Arena tab
  'arena.title': {
    en: 'Arena',
    fr: 'Arène',
  },
  'arena.comingSoon': {
    en: 'Coming Soon',
    fr: 'Bientôt Disponible',
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
  'auth.confirmPassword': {
    en: 'Confirm Password',
    fr: 'Confirmer le mot de passe',
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
  'auth.confirmPasswordPlaceholder': {
    en: 'Confirm your password',
    fr: 'Confirmez votre mot de passe',
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

  // Auth Error Messages
  'auth.errors.emailRequired': {
    en: 'Email is required',
    fr: 'L\'email est requis',
  },
  'auth.errors.emailInvalid': {
    en: 'Please enter a valid email address',
    fr: 'Veuillez entrer une adresse email valide',
  },
  'auth.errors.emailTypo': {
    en: 'Did you mean {{suggested}}?',
    fr: 'Vouliez-vous dire {{suggested}} ?',
  },
  'auth.errors.emailAlreadyExists': {
    en: 'An account with this email already exists. Try signing in instead.',
    fr: 'Un compte avec cet email existe déjà. Essayez de vous connecter à la place.',
  },
  'auth.errors.emailNotConfirmed': {
    en: 'Please check your email and click the confirmation link to activate your account.',
    fr: 'Veuillez vérifier votre email et cliquer sur le lien de confirmation pour activer votre compte.',
  },
  'auth.errors.passwordRequired': {
    en: 'Password is required',
    fr: 'Le mot de passe est requis',
  },
  'auth.errors.passwordTooShort': {
    en: 'Password must be at least 8 characters long',
    fr: 'Le mot de passe doit contenir au moins 8 caractères',
  },
  'auth.errors.passwordTooWeak': {
    en: 'Password is too weak. Please choose a stronger password.',
    fr: 'Le mot de passe est trop faible. Veuillez choisir un mot de passe plus fort.',
  },
  'auth.errors.passwordNeedsLowercase': {
    en: 'Add at least one lowercase letter',
    fr: 'Ajoutez au moins une lettre minuscule',
  },
  'auth.errors.passwordNeedsUppercase': {
    en: 'Add at least one uppercase letter',
    fr: 'Ajoutez au moins une lettre majuscule',
  },
  'auth.errors.passwordNeedsNumber': {
    en: 'Add at least one number',
    fr: 'Ajoutez au moins un chiffre',
  },
  'auth.errors.passwordNeedsSpecial': {
    en: 'Add at least one special character (!@#$%^&*)',
    fr: 'Ajoutez au moins un caractère spécial (!@#$%^&*)',
  },
  'auth.errors.passwordTooCommon': {
    en: 'This password is too common. Please choose something more unique.',
    fr: 'Ce mot de passe est trop commun. Veuillez choisir quelque chose de plus unique.',
  },
  'auth.errors.passwordNoSequential': {
    en: 'Avoid sequential characters like "123" or "abc"',
    fr: 'Évitez les caractères séquentiels comme "123" ou "abc"',
  },
  'auth.errors.confirmPasswordRequired': {
    en: 'Please confirm your password',
    fr: 'Veuillez confirmer votre mot de passe',
  },
  'auth.errors.passwordsDoNotMatch': {
    en: 'Passwords do not match',
    fr: 'Les mots de passe ne correspondent pas',
  },
  'auth.errors.invalidCredentials': {
    en: 'Invalid email or password. Please check your credentials and try again.',
    fr: 'Email ou mot de passe invalide. Veuillez vérifier vos identifiants et réessayer.',
  },
  'auth.errors.rateLimited': {
    en: 'Too many attempts. Please wait a moment before trying again.',
    fr: 'Trop de tentatives. Veuillez attendre un moment avant de réessayer.',
  },
  'auth.errors.networkError': {
    en: 'Network error. Please check your connection and try again.',
    fr: 'Erreur réseau. Veuillez vérifier votre connexion et réessayer.',
  },
  'auth.errors.unknown': {
    en: 'An unexpected error occurred. Please try again.',
    fr: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
  },

  // Password Strength
  'auth.passwordStrength.weak': {
    en: 'Weak',
    fr: 'Faible',
  },
  'auth.passwordStrength.fair': {
    en: 'Fair',
    fr: 'Correct',
  },
  'auth.passwordStrength.good': {
    en: 'Good',
    fr: 'Bon',
  },
  'auth.passwordStrength.strong': {
    en: 'Strong',
    fr: 'Fort',
  },

  // Email Confirmation
  'auth.emailConfirmation.title': {
    en: 'Check Your Email',
    fr: 'Vérifiez Votre Email',
  },
  'auth.emailConfirmation.message': {
    en: 'We\'ve sent a confirmation link to {{email}}. Click the link to activate your account and start your sports journey!',
    fr: 'Nous avons envoyé un lien de confirmation à {{email}}. Cliquez sur le lien pour activer votre compte et commencer votre parcours sportif !',
  },
  'auth.emailConfirmation.resend': {
    en: 'Resend Email',
    fr: 'Renvoyer l\'Email',
  },
  'auth.emailConfirmation.changeEmail': {
    en: 'Change Email',
    fr: 'Changer l\'Email',
  },
  'auth.emailConfirmation.resendSuccess': {
    en: 'Confirmation email sent successfully!',
    fr: 'Email de confirmation envoyé avec succès !',
  },
  'auth.emailConfirmation.alreadyConfirmed': {
    en: 'Your email address is already confirmed. You can now sign in to your account.',
    fr: 'Votre adresse email est déjà confirmée. Vous pouvez maintenant vous connecter à votre compte.',
  },

  // Password Reset
  'auth.passwordReset.title': {
    en: 'Reset Password',
    fr: 'Réinitialiser le Mot de Passe',
  },
  'auth.passwordReset.message': {
    en: 'Enter your email address and we\'ll send you a link to reset your password.',
    fr: 'Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
  },
  'auth.passwordReset.send': {
    en: 'Send Reset Link',
    fr: 'Envoyer le lien de réinitialisation',
  },
  'auth.passwordReset.success': {
    en: 'Password reset email sent! Check your inbox and follow the instructions.',
    fr: 'E-mail de réinitialisation envoyé ! Vérifiez votre boîte de réception et suivez les instructions.',
  },
  'auth.passwordReset.backToSignIn': {
    en: 'Back to Sign In',
    fr: 'Retour à la connexion',
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

  // Match translations
  'matches.title': {
    en: 'Your Matches',
    fr: 'Vos Matchs',
  },
  'matches.noMatchesYet': {
    en: 'No matches yet',
    fr: 'Aucun match pour le moment',
  },
  'matches.youHaveMatches': {
    en: 'You have {{count}} matches',
    fr: 'Vous avez {{count}} matchs',
  },
  'matches.newMatches': {
    en: '{{count}} new matches!',
    fr: '{{count}} nouveaux matchs !',
  },
  'matches.loadingMatches': {
    en: 'Loading matches...',
    fr: 'Chargement des matchs...',
  },
  'matches.errorLoadingMatches': {
    en: 'Failed to load matches. Please try again.',
    fr: 'Échec du chargement des matchs. Veuillez réessayer.',
  },
  'matches.noMatches': {
    en: 'No Matches Yet',
    fr: 'Aucun Match Pour Le Moment',
  },
  'matches.noMatchesDesc': {
    en: 'Start swiping in Discovery to find your perfect sports partner!',
    fr: 'Commencez à swiper dans Découverte pour trouver votre partenaire sportif idéal !',
  },
  'matches.yourMatches': {
    en: 'Your Matches',
    fr: 'Vos Matchs',
  },
  'matches.unknownUser': {
    en: 'Unknown User',
    fr: 'Utilisateur Inconnu',
  },
  'matches.commonSports': {
    en: 'Common sports',
    fr: 'Sports en commun',
  },
  'matches.matchedOn': {
    en: 'Matched on',
    fr: 'Match le',
  },
  'matches.startChat': {
    en: 'Start Chat',
    fr: 'Commencer la Discussion',
  },
  'matches.startChatWith': {
    en: 'Start a conversation with {{name}}?',
    fr: 'Commencer une conversation avec {{name}} ?',
  },
  'matches.sendMessage': {
    en: 'Send Message',
    fr: 'Envoyer un Message',
  },
  'matches.developmentTools': {
    en: 'Development Tools',
    fr: 'Outils de Développement',
  },
  'matches.createTestMatches': {
    en: 'Create Test Matches',
    fr: 'Créer des Matchs de Test',
  },
  'matches.cleanupTestData': {
    en: 'Cleanup Test Data',
    fr: 'Nettoyer les Données de Test',
  },
  'matches.creating': {
    en: 'Creating...',
    fr: 'Création...',
  },
  'matches.cleaning': {
    en: 'Cleaning...',
    fr: 'Nettoyage...',
  },
  'matches.testMatchesCreated': {
    en: 'Test Matches Created',
    fr: 'Matchs de Test Créés',
  },
  'matches.testMatchesCreatedDesc': {
    en: 'Test matches have been created successfully. Pull to refresh to see them.',
    fr: 'Les matchs de test ont été créés avec succès. Tirez pour actualiser pour les voir.',
  },
  'matches.testDataCleaned': {
    en: 'Test Data Cleaned',
    fr: 'Données de Test Nettoyées',
  },
  'matches.testDataCleanedDesc': {
    en: 'All test data has been removed successfully.',
    fr: 'Toutes les données de test ont été supprimées avec succès.',
  },
  'matches.errorCreatingTestMatches': {
    en: 'Failed to create test matches. Please try again.',
    fr: 'Échec de la création des matchs de test. Veuillez réessayer.',
  },
  'matches.errorCleaningTestData': {
    en: 'Failed to clean test data. Please try again.',
    fr: 'Échec du nettoyage des données de test. Veuillez réessayer.',
  },

  // Common gender and distance translations
  'common.man': {
    en: 'Man',
    fr: 'Homme',
  },
  'common.woman': {
    en: 'Woman',
    fr: 'Femme',
  },
  'common.away': {
    en: 'away',
    fr: 'de distance',
  },
  'common.error': {
    en: 'Error',
    fr: 'Erreur',
  },

  // Availability translations
  'availability.displayMode': {
    en: 'Display Mode',
    fr: 'Mode Affichage',
  },

  // Discovery translations
  'discovery.loading': {
    en: 'Finding profiles...',
    fr: 'Recherche de profils...',
  },
  'discovery.checkingLocation': {
    en: 'Checking location...',
    fr: 'Vérification de la localisation...',
  },
  'discovery.noMoreProfiles': {
    en: 'No more profiles',
    fr: 'Plus de profils',
  },
  'discovery.tryAdjustingFilters': {
    en: 'Try adjusting your filters to discover more people',
    fr: 'Essayez d\'ajuster vos filtres pour découvrir plus de personnes',
  },
  'discovery.editFilters': {
    en: 'Edit Filters',
    fr: 'Modifier les filtres',
  },
  'discovery.refreshProfiles': {
    en: 'Refresh',
    fr: 'Actualiser',
  },
  'discovery.loadingMoreProfiles': {
    en: 'Loading more profiles...',
    fr: 'Chargement de plus de profils...',
  },
  
  // Profile translations
  'profile.signOut': {
    en: 'Sign Out',
    fr: 'Se déconnecter',
  },
  'profile.signOutConfirmation': {
    en: 'Are you sure you want to sign out?',
    fr: 'Êtes-vous sûr de vouloir vous déconnecter ?',
  },
  'profile.signOutError': {
    en: 'Failed to sign out. Please try again.',
    fr: 'Échec de la déconnexion. Veuillez réessayer.',
  },

  // Welcome Screen translations
  'welcome.newUser.title': {
    en: 'Welcome to Momentum',
    fr: 'Bienvenue sur Momentum',
  },
  'welcome.newUser.subtitle': {
    en: 'Ready to find your perfect sports partner?',
    fr: 'Prêt à trouver votre partenaire sportif parfait ?',
  },
  'welcome.newUser.description': {
    en: 'Discover athletes near you, join exciting events, and challenge players on real courts.',
    fr: 'Découvrez des athlètes près de vous, rejoignez des événements passionnants et défiez des joueurs sur de vrais terrains.',
  },
  'welcome.newUser.startExploring': {
    en: 'Start Exploring',
    fr: 'Commencer à Explorer',
  },
  'welcome.newUser.autoNavigate': {
    en: 'You will be redirected automatically...',
    fr: 'Vous serez redirigé automatiquement...',
  },
  'welcome.returningUser.title': {
    en: 'Welcome back!',
    fr: 'Bon retour',
  },
  'welcome.returningUser.subtitle': {
    en: 'Ready to continue your sports journey?',
    fr: 'Prêt à continuer votre parcours sportif ?',
  },
  'welcome.returningUser.continueButton': {
    en: 'Continue',
    fr: 'Continuer',
  },
  'welcome.returningUser.autoNavigate': {
    en: 'You will be redirected automatically...',
    fr: 'Vous serez redirigé automatiquement...',
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
