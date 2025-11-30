# Google OAuth Setup for Vercel Deployments

## Issue: Google Sign-In Button Not Working on Vercel Preview

### Root Cause
Google OAuth requires pre-authorized redirect URLs. Vercel preview deployments have dynamic URLs.

### Solution Steps

#### 1. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project (or create one)
3. Navigate to **APIs & Services** → **Credentials**
4. Click on your OAuth 2.0 Client ID (or create one)

#### 2. Add Authorized Redirect URIs

Under **Authorized redirect URIs**, add the following:

**For Development:**
```
http://localhost:3000/api/auth/callback/google
```

**For Vercel Preview Deployments** (choose one option):

**Option A - Wildcard (Recommended for testing):**
```
https://*.vercel.app/api/auth/callback/google
```

**Option B - Specific Preview URL:**
```
https://devisio-git-develop-[your-username].vercel.app/api/auth/callback/google
```

**For Production:**
```
https://your-custom-domain.com/api/auth/callback/google
```

#### 3. Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

**Add these for ALL environments (Production, Preview, Development):**

| Variable | Value | Environment |
|----------|-------|-------------|
| `GOOGLE_CLIENT_ID` | Your Client ID from Google Console | All |
| `GOOGLE_CLIENT_SECRET` | Your Client Secret from Google Console | All |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | All |

**IMPORTANT: Do NOT set `NEXTAUTH_URL` for Preview deployments**
- NextAuth will auto-detect the URL
- Only set it for Production if using custom domain

#### 4. Redeploy

After updating environment variables:
1. Go to Vercel → Deployments
2. Find your latest preview deployment
3. Click **...** menu → **Redeploy**
4. Test Google OAuth again

### Debugging

If still not working, check browser console for errors:
1. Open DevTools (F12)
2. Go to Console tab
3. Click "Google" button
4. Look for errors like:
   - `redirect_uri_mismatch` → Check Google Console authorized URIs
   - `Missing GOOGLE_CLIENT_ID` → Check Vercel env vars
   - Network errors → Check if request is being made

### Testing Checklist

- [ ] Google Console has correct redirect URIs (with wildcard for Vercel)
- [ ] Vercel environment variables are set for Preview environment
- [ ] Redeployed after adding environment variables
- [ ] Browser console shows no errors when clicking Google button
- [ ] Google OAuth consent screen appears

### Common Errors

**Error: `redirect_uri_mismatch`**
- **Cause**: The redirect URI used doesn't match Google Console
- **Fix**: Add the exact URI shown in error to Google Console

**Error: `Missing GOOGLE_CLIENT_ID`**
- **Cause**: Environment variables not set on Vercel
- **Fix**: Add env vars and redeploy

**Error: `Invalid client`**
- **Cause**: Wrong Client ID or Secret
- **Fix**: Double-check values in Google Console and Vercel

### Best Practices for Production

1. **Separate OAuth Clients**: Create separate Google OAuth clients for:
   - Development (localhost)
   - Staging/Preview (Vercel preview)
   - Production (custom domain)

2. **Environment-Specific Variables**: Use Vercel's environment-specific settings

3. **Security**: Never commit OAuth credentials to git
