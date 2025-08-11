# Email Confirmation Troubleshooting Guide

## Issue: Email confirmation not sent or received

This guide provides comprehensive steps to diagnose and fix email confirmation issues in the Momentum app.

## 🔍 Diagnosis Tools

### 1. EmailDebugScreen
- Created `src/features/auth/screens/EmailDebugScreen.tsx` for testing
- Provides comprehensive email flow testing
- Includes detailed console logging and error reporting

### 2. EmailDebugService
- Created `src/shared/utils/emailDebug.ts` for programmatic testing
- Functions: `debugEmailConfirmation()`, `checkEmailSettings()`, `testEmailFlow()`

## 🚨 Common Issues & Solutions

### 1. Supabase SMTP Not Configured
**Symptoms:**
- Console shows SMTP-related errors
- No emails sent at all

**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Configure SMTP settings:
   - SMTP Host (e.g., smtp.gmail.com)
   - SMTP Port (587 for TLS, 465 for SSL)
   - SMTP Username/Password
   - Enable SMTP

### 2. Email Confirmation Disabled
**Symptoms:**
- Users created but no confirmation required
- `email_confirmed_at` is immediately set

**Solution:**
1. Go to Supabase Dashboard → Authentication → Settings
2. Enable "Enable email confirmations"
3. Set confirmation URL template

### 3. Email Templates Not Configured
**Symptoms:**
- Emails sent but look generic or broken
- Missing app branding

**Solution:**
1. Go to Supabase Dashboard → Authentication → Email Templates
2. Configure "Confirm signup" template
3. Add proper redirect URL: `momentum://onboarding-form`

### 4. Rate Limiting Issues
**Symptoms:**
- "Too many requests" errors
- Emails stop sending after multiple attempts

**Solution:**
1. Wait 5-10 minutes between attempts
2. Check Supabase Dashboard → Authentication → Rate Limits
3. Adjust rate limits if needed

### 5. Deep Link Configuration
**Symptoms:**
- Emails sent but links don't work
- App doesn't open from email links

**Solution:**
1. Verify `app.json` includes proper scheme configuration
2. Test deep link: `momentum://onboarding-form`
3. Ensure URL scheme is registered

## 🔧 Enhanced AuthService Features

### Improved Signup Method
```typescript
// Enhanced with comprehensive logging and error handling
async signUp(email: string, password: string) {
  // Detailed console logging
  // Enhanced error messages for SMTP issues
  // Analytics tracking for email confirmation status
}
```

### Improved Resend Confirmation
```typescript
// Enhanced with user status checking and better error handling
async resendConfirmation(email: string) {
  // Check current user status
  // Enhanced error messages for common issues
  // Rate limiting detection
}
```

## 🧪 Testing Steps

### 1. Use EmailDebugScreen
1. Add EmailDebugScreen to navigation (development only)
2. Test with real email address
3. Check console logs for detailed output

### 2. Manual Testing
1. Sign up with real email
2. Check email inbox (including spam)
3. Click confirmation link
4. Verify app opens to onboarding form

### 3. Console Debugging
```javascript
// Test email flow programmatically
import { debugEmailConfirmation } from '../shared/utils/emailDebug';
await debugEmailConfirmation('test@gmail.com');
```

## 📋 Checklist for Email Confirmation

- [ ] Supabase SMTP configured and enabled
- [ ] Email confirmations enabled in Auth settings
- [ ] Email templates configured with proper redirect URL
- [ ] Deep link scheme properly configured
- [ ] Rate limits not exceeded
- [ ] Test email not in spam folder
- [ ] Console shows successful email sending
- [ ] User record shows `confirmation_sent_at` timestamp

## 🔍 Debug Information to Collect

When reporting issues, include:

1. **Console Logs**: Full signup/resend attempt logs
2. **Supabase Dashboard**: Auth settings screenshot
3. **User Record**: Database user record with timestamps
4. **Email Provider**: SMTP configuration status
5. **Network**: Any network-related errors
6. **Rate Limits**: Current rate limit status

## 🛠️ Development Tools

### EmailDebugScreen Actions:
- **Run Complete Email Test**: Full end-to-end testing
- **Test Signup Only**: Isolated signup testing
- **Test Resend Confirmation**: Isolated resend testing
- **Check Email Settings**: Verify Supabase configuration

### Console Commands:
```javascript
// Quick debug
await emailDebugService.testEmailFlow('your-email@example.com');

// Check settings only
await emailDebugService.checkEmailSettings();

// Get debug info
await emailDebugService.getDebugInfo();
```

## 📧 Email Provider Specific Notes

### Gmail SMTP
- Host: smtp.gmail.com
- Port: 587 (TLS) or 465 (SSL)
- Requires App Password (not regular password)

### SendGrid
- Host: smtp.sendgrid.net
- Port: 587
- Username: apikey
- Password: Your SendGrid API key

### Mailgun
- Host: smtp.mailgun.org
- Port: 587
- Username: Your Mailgun SMTP username
- Password: Your Mailgun SMTP password

## 🔄 Next Steps

1. **Immediate**: Use EmailDebugScreen to identify specific issue
2. **Configuration**: Fix Supabase SMTP/Auth settings based on findings
3. **Testing**: Verify email flow works end-to-end
4. **Production**: Ensure production SMTP credentials are configured
5. **Monitoring**: Set up logging for email delivery status

## 📞 Support Resources

- Supabase Documentation: https://supabase.com/docs/guides/auth
- Email Provider Documentation
- Momentum App Debug Tools (EmailDebugScreen)
