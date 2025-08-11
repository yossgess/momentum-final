import { t } from './i18n';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: number; // 0-4 (weak to very strong)
  feedback: string[];
  isValid: boolean;
}

export class AuthValidation {
  /**
   * Validates email format and common issues
   */
  static validateEmail(email: string): ValidationResult {
    if (!email.trim()) {
      return { isValid: false, error: t('auth.errors.emailRequired') };
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: t('auth.errors.emailInvalid') };
    }

    // Check for common typos in domains
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    const domain = email.split('@')[1]?.toLowerCase();
    const typos: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'yahooo.com': 'yahoo.com',
      'hotmial.com': 'hotmail.com',
    };

    if (domain && typos[domain]) {
      const suggestedEmail = email.replace(domain, typos[domain]);
      return { 
        isValid: false, 
        error: t('auth.errors.emailTypo').replace('{{suggested}}', suggestedEmail)
      };
    }

    return { isValid: true };
  }

  /**
   * Validates password strength with detailed feedback
   */
  static validatePassword(password: string): PasswordStrength {
    if (!password) {
      return {
        score: 0,
        feedback: [t('auth.errors.passwordRequired')],
        isValid: false,
      };
    }

    const feedback: string[] = [];
    let score = 0;

    // Length check
    if (password.length < 8) {
      feedback.push(t('auth.errors.passwordTooShort'));
    } else if (password.length >= 12) {
      score += 1;
    }

    // Character variety checks
    if (!/[a-z]/.test(password)) {
      feedback.push(t('auth.errors.passwordNeedsLowercase'));
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push(t('auth.errors.passwordNeedsUppercase'));
    } else {
      score += 1;
    }

    if (!/\d/.test(password)) {
      feedback.push(t('auth.errors.passwordNeedsNumber'));
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      feedback.push(t('auth.errors.passwordNeedsSpecial'));
    } else {
      score += 1;
    }

    // Common password checks
    const commonPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty',
      'letmein', 'welcome', 'monkey', '1234567890'
    ];
    
    if (commonPasswords.some(common => password.toLowerCase().includes(common))) {
      feedback.push(t('auth.errors.passwordTooCommon'));
      score = Math.max(0, score - 2);
    }

    // Sequential characters check
    if (/123|abc|qwe/i.test(password)) {
      feedback.push(t('auth.errors.passwordNoSequential'));
      score = Math.max(0, score - 1);
    }

    const isValid = password.length >= 8 && score >= 2 && feedback.length === 0;

    return {
      score: Math.min(4, score),
      feedback,
      isValid,
    };
  }

  /**
   * Validates password confirmation match
   */
  static validatePasswordConfirmation(password: string, confirmPassword: string): ValidationResult {
    if (!confirmPassword.trim()) {
      return { isValid: false, error: t('auth.errors.confirmPasswordRequired') };
    }

    if (password !== confirmPassword) {
      return { isValid: false, error: t('auth.errors.passwordsDoNotMatch') };
    }

    return { isValid: true };
  }

  /**
   * Gets password strength label and color
   */
  static getPasswordStrengthInfo(score: number): { label: string; color: string } {
    switch (score) {
      case 0:
      case 1:
        return { label: t('auth.passwordStrength.weak'), color: '#FF4444' };
      case 2:
        return { label: t('auth.passwordStrength.fair'), color: '#FF8800' };
      case 3:
        return { label: t('auth.passwordStrength.good'), color: '#FFBB00' };
      case 4:
        return { label: t('auth.passwordStrength.strong'), color: '#00AA00' };
      default:
        return { label: t('auth.passwordStrength.weak'), color: '#FF4444' };
    }
  }

  /**
   * Parses Supabase auth errors into user-friendly messages
   */
  static parseAuthError(error: any): string {
    if (!error) return t('auth.errors.unknown');

    const message = error.message || error.error_description || '';

    // Email already exists
    if (message.includes('User already registered') || 
        message.includes('email_address_not_authorized') ||
        message.includes('duplicate key value')) {
      return t('auth.errors.emailAlreadyExists');
    }

    // Invalid credentials
    if (message.includes('Invalid login credentials') ||
        message.includes('Email not confirmed') ||
        message.includes('invalid_credentials')) {
      return t('auth.errors.invalidCredentials');
    }

    // Email not confirmed
    if (message.includes('Email not confirmed') ||
        message.includes('email_not_confirmed')) {
      return t('auth.errors.emailNotConfirmed');
    }

    // Rate limiting
    if (message.includes('rate limit') ||
        message.includes('too many requests')) {
      return t('auth.errors.rateLimited');
    }

    // Network errors
    if (message.includes('network') ||
        message.includes('fetch')) {
      return t('auth.errors.networkError');
    }

    // Weak password
    if (message.includes('Password should be') ||
        message.includes('weak password')) {
      return t('auth.errors.passwordTooWeak');
    }

    // Default to the original message if we can't parse it
    return message || t('auth.errors.unknown');
  }
}
