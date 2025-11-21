# Setup Notes for Remaining Features

## ✅ Completed Features

### 1. Authentication with Quick Auth
**Status**: ✅ Complete

- ✅ Installed `@farcaster/quick-auth` package
- ✅ Implemented JWT verification in `app/api/auth/route.ts`
- ✅ Frontend authentication in `lib/auth.ts` (already existed)

**Environment Variables Required**:
- `NEXT_PUBLIC_APP_URL` - Your app's public URL (defaults to localhost in dev)

**How it works**:
- Frontend calls `sdk.quickAuth.getToken()` to get a JWT token
- Token is sent to `/api/auth` with Bearer header
- Backend verifies the JWT using `createClient().verifyJwt()` from `@farcaster/quick-auth`
- Returns user's FID from verified JWT payload

---

### 2. Notifications with Webhook Verification
**Status**: ✅ Complete

- ✅ Installed `@farcaster/miniapp-node` package
- ✅ Implemented webhook verification in `app/api/webhook/route.ts`
- ✅ Handles all event types: `miniapp_added`, `miniapp_removed`, `notifications_enabled`, `notifications_disabled`
- ✅ Notification sending logic implemented

**Environment Variables Required**:
- `NEYNAR_API_KEY` - Get from https://dev.neynar.com/
- `NEXT_PUBLIC_APP_URL` - Your app's public URL (for notification targetUrl)

**How it works**:
- Webhook receives events from Base/Farcaster apps
- Events are verified using `parseWebhookEvent()` and `verifyAppKeyWithNeynar()`
- Notification tokens are stored (currently in-memory Map, should use database in production)
- Welcome notifications sent when mini app is added or notifications are enabled

**Note**: In development without `NEYNAR_API_KEY`, webhook verification is skipped (not production-safe).

---

### 3. Add Mini App Button
**Status**: ✅ Complete

- ✅ Created `AddMiniAppButton` component (`components/common/add-miniapp-button.tsx`)
- ✅ Added to Profile Overview (`components/profile/miniapp-card.tsx`)
- ✅ Added to Settings Modal (`components/profile/settings-modal.tsx`)

**How it works**:
- Uses `sdk.actions.addMiniApp()` to prompt users to save the mini app
- Shows loading state while processing
- Shows success state after mini app is added
- Handles errors gracefully (including user cancellation)

**Locations**:
1. Profile Overview tab - Prominent card at the top
2. Settings Modal - In "Mini App" section

---

## Environment Variables Setup

Add these to your `.env.local` file:

```bash
# Required
NEXT_PUBLIC_APP_URL=https://macro-tracker.vercel.app

# Required for webhook verification
NEYNAR_API_KEY=your_neynar_api_key_here
```

**To get NEYNAR_API_KEY**:
1. Go to https://dev.neynar.com/
2. Sign up or log in
3. Create a new API key
4. Copy the API key to your `.env.local` file

---

## Production Notes

### Webhook Token Storage
Currently, notification tokens are stored in an in-memory Map. For production:
- Replace with a database (PostgreSQL, MongoDB, etc.)
- Store tokens with `fid` and `appFid` as composite key
- Implement token expiration/cleanup

### Authentication Token Storage
Currently, auth tokens are stored in localStorage. Consider:
- Using secure HTTP-only cookies for server-side storage
- Implementing token refresh logic
- Adding token expiration checks

---

## Testing

### Test Authentication:
1. Open mini app in Base/Farcaster app
2. Call `authenticateUser()` from `lib/auth.ts`
3. Check that JWT is verified and FID is returned

### Test Webhook:
1. Add webhook URL to manifest: `"webhookUrl": "https://your-domain.com/api/webhook"`
2. Use `addMiniApp()` button to add the mini app
3. Check webhook logs for incoming events
4. Verify notifications are sent

### Test Add Mini App:
1. Click "Add Mini App" button in Profile or Settings
2. Follow the prompt to add mini app
3. Verify mini app appears in saved apps
4. Check that welcome notification is received

---

## Next Steps

1. **Get Neynar API Key** and add to environment variables
2. **Set up database** for notification token storage (if going to production)
3. **Test webhook** with actual Base/Farcaster app
4. **Complete manifest account association** once Base Build login is resolved

