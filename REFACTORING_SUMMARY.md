# Authentication Refactoring: NextAuth → Supabase Direct

## Summary

The frontend has been refactored to use **Supabase authentication directly** instead of NextAuth with backend auth endpoints. This aligns the project with the reference implementation and eliminates the need for backend authentication endpoints.

## Why This Change?

Your backend only provides RAG API endpoints (collections, documents) without authentication endpoints. The original design tried to add a NextAuth layer that called non-existent `/auth/signin` endpoints, causing 404 errors.

**Solution:** Authenticate users via Supabase directly, then pass the Supabase access token to backend API calls.

## Changes Made

### 1. **Auth Library Structure** (`src/lib/auth/`)
- `types.ts` - Standard auth interfaces
- `supabase-client.ts` - Singleton Supabase client setup
- `supabase.ts` - Supabase auth provider implementation
- Removed: NextAuth configuration and middleware

### 2. **Auth Provider** (`src/providers/auth-provider.tsx`)
- Now uses Supabase directly instead of NextAuth
- Provides context: `useAuthContext()`
- Methods: `signIn`, `signUp`, `signOut`, `getSession`, `updateUser`, etc.
- Handles session lifecycle and auth state changes

### 3. **Middleware** (`src/middleware.ts`)
- Uses Supabase server client to check authentication
- No longer depends on NextAuth
- Redirects unauthenticated users to `/signin`
- Automatically manages session cookies

### 4. **Auth Pages** (`src/app/(auth)/`)
- `signin/page.tsx` - Sign in with email/password
- `signup/page.tsx` - Create new account
- Both use Supabase auth provider directly

### 5. **Environment Configuration**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_KEY` - Supabase anon public key
- Removed: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`

## How It Works

1. **User signs in** → Supabase authenticates and returns access token
2. **Session stored** → Supabase handles session persistence
3. **API calls** → Access token included in `Authorization: Bearer <token>` header
4. **Backend validates** → Your backend accepts token from any source (doesn't care where it came from)
5. **Token refresh** → Supabase handles automatically

## Migration Checklist

- [x] Create Supabase auth types and provider
- [x] Create Supabase client setup
- [x] Update Auth context provider
- [x] Update middleware for Supabase
- [x] Update sign-in page
- [x] Update sign-up page
- [x] Update environment template
- [x] Update layout to use new provider
- [ ] **TODO:** Remove old NextAuth packages from package.json
- [ ] **TODO:** Remove NextAuth route handlers (if any)
- [ ] **TODO:** Update API utilities to use session from new context

## Configuration

Update `.env.local` in `next-connect-ui/`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_KEY=your-anon-public-key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8080
API_URL=http://localhost:8080
```

Get these from your Supabase project settings.

## Next Steps

1. Clean up NextAuth packages
2. Update API utilities to use the session from `useAuthContext()`
3. Test sign-in/sign-up flow
4. Verify API calls include Supabase access token

## Architecture

```
User → Supabase Auth → Access Token → RAG Backend API
                ↓
            Session Storage
                ↓
            Middleware Check
```

This is now much cleaner and aligns with the reference project architecture!
