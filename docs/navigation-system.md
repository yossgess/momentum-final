# Momentum App Navigation System Documentation

## Overview

The Momentum app uses a centralized navigation system that provides consistent, rule-based navigation based on user authentication and onboarding status.

## Navigation Rules

The navigation system follows these precise rules based on user state:

### 1. **Completely New User**
**Flow:** Onboarding Slides → Authentication → Onboarding Form → Discover Screen
- User has never opened the app before
- No authentication session exists
- Onboarding slides have not been seen

### 2. **Old User (Account Created) - Signed In**
- **Profile Complete:** → Discover Screen (direct access)
- **Profile Incomplete:** → Onboarding Form → Discover Screen

### 3. **Old User (Account Created) - Not Signed In**
- **Profile Complete:** → Sign In → Discover Screen
- **Profile Incomplete:** → Sign In → Onboarding Form → Discover Screen

## Implementation Architecture

### NavigationService (`src/shared/services/navigationService.ts`)
Central service that handles all navigation logic:

```typescript
class NavigationService {
  // Core navigation decision logic
  static async determineNavigationScreen(userState: UserState): Promise<NavigationDecision>
  
  // Onboarding state management
  static async hasSeenOnboarding(): Promise<boolean>
  static async markOnboardingSeen(): Promise<void>
  static async resetOnboardingState(): Promise<void>
  
  // User state evaluation
  static async getUserState(authState): Promise<UserState>
  
  // Logging and debugging
  static logNavigationDecision(decision: NavigationDecision): void
  static validateNavigationRules(): boolean
}
```

### AppNavigator (`src/navigation/AppNavigator.tsx`)
Main navigation component that:

1. **Initializes** auth store and navigation service
2. **Evaluates** user state using NavigationService
3. **Determines** appropriate screen based on rules
4. **Re-evaluates** navigation when auth state changes
5. **Logs** navigation decisions for debugging

### Key Components Integration

#### OnboardingSlider
- Marks onboarding as seen when completed
- Uses NavigationService.markOnboardingSeen()
- Triggers navigation re-evaluation

#### AuthNavigator
- Handles authentication flows
- Updates auth state which triggers navigation re-evaluation
- Includes SignIn, SignUp, EmailConfirmation, PasswordReset screens

#### OnboardingForm
- Marks profile as complete when submitted
- Updates hasCompletedProfile state
- Triggers navigation to main app

## State Management

### User State Properties
```typescript
type UserState = {
  isAuthenticated: boolean;     // User has valid session
  hasCompletedProfile: boolean; // User has filled onboarding form
  hasSeenOnboarding: boolean;   // User has seen intro slides
  isNewUser: boolean;           // First time user (derived)
}
```

### Navigation Decision
```typescript
type NavigationDecision = {
  screen: NavigationScreen;     // Screen to show
  reason: string;               // Why this screen was chosen
  userState: UserState;         // Current user state
}
```

## Developer Configuration

### DEV_CONFIG Options
```typescript
export const DEV_CONFIG = {
  FORCE_ONBOARDING: false,      // Always show onboarding slides
  FORCE_ONBOARDING_FORM: false, // Always show onboarding form
  CYCLE_SCREENS: true,          // Cycle through all screens on reload
  SCREENS: ['OnboardingSlider', 'Auth', 'OnboardingForm', 'Main']
};
```

### Developer Mode Features
- **Screen Cycling**: Reload app to cycle through all screens
- **Visual Indicator**: Red badge showing current screen and position
- **Console Logging**: Detailed navigation decisions and state changes
- **State Reset**: Automatically resets onboarding state for testing

## Debugging and Logging

### Navigation Logging
Every navigation decision is logged with:
- Screen chosen and reason
- Complete user state
- Analytics events for tracking

### Console Output Example
```
[NAVIGATION] Initializing navigation system...
[NAVIGATION] Decision: OnboardingSlider
[NAVIGATION] Reason: New user: show onboarding slides first
[NAVIGATION] User State: {
  isAuthenticated: false,
  hasCompletedProfile: false,
  hasSeenOnboarding: false,
  isNewUser: true
}
```

## Testing Navigation Rules

### Manual Testing Scenarios
1. **Fresh Install**: Clear app data → Should show onboarding slides
2. **Returning User**: Complete onboarding → Close app → Reopen → Should show sign in
3. **Authenticated User**: Sign in → Should show main app or onboarding form
4. **Developer Mode**: Enable cycling → Reload to test all screens

### Validation Function
```typescript
NavigationService.validateNavigationRules()
```
Tests all navigation rules against expected outcomes.

## Troubleshooting

### Common Issues
1. **Stuck on Loading**: Check auth store initialization
2. **Wrong Screen Shown**: Verify user state properties
3. **Navigation Loops**: Check onboarding completion logic
4. **Dev Mode Issues**: Verify DEV_CONFIG settings

### Debug Steps
1. Check console logs for navigation decisions
2. Verify user state properties in auth store
3. Test with developer mode disabled
4. Clear AsyncStorage to reset state

## Migration from Old System

### Changes Made
1. **Centralized Logic**: All navigation rules in NavigationService
2. **Consistent State**: Single source of truth for user state
3. **Better Debugging**: Comprehensive logging and validation
4. **Developer Tools**: Enhanced testing capabilities
5. **Rule Compliance**: Strict adherence to specified navigation rules

### Backward Compatibility
- Existing stores still work
- Gradual migration of state management
- Fallback to auth screen on errors

## Future Enhancements

### Potential Improvements
1. **Deep Linking**: Handle app URLs and navigation
2. **State Persistence**: Better offline state management
3. **A/B Testing**: Different navigation flows for testing
4. **Analytics**: Enhanced tracking of navigation patterns
5. **Performance**: Lazy loading of navigation components

### Monitoring
- Track navigation decision analytics
- Monitor user flow completion rates
- Identify common navigation issues
- Optimize based on user behavior data
