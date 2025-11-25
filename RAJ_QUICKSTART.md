# Running Frontend Without Docker

You can run the Next.js frontend directly without Docker Compose.

## Prerequisites

* Node.js 20+ installed
* npm or pnpm installed

## Authentication Flow Quick Reference

This application uses **Supabase** for authentication. The frontend Next.js application communicates directly with Supabase for signing in, signing up, and managing user sessions.

### How Login Works: A Summary

1. **Sign-in:** The user enters their credentials on the `/signin` page. The browser sends these directly to Supabase.
2. **JWT Session:** Upon successful login, Supabase returns a JWT (JSON Web Token). The Supabase client library stores this token securely in an `httpOnly` cookie in the browser.
3. **Requesting a Protected Page:** When the user navigates to a protected page (e.g., `/documents`), the browser automatically sends the JWT cookie with the request to the Next.js server.
4. **Middleware Validation:** A **Middleware** (gatekeeper) on the Next.js server intercepts the request. It validates the JWT with Supabase to ensure the user is authenticated. If valid, the request proceeds. If not, the user is redirected to `/signin`.
5. **Data Fetching:** The server-side code for the page then uses the same JWT to identify the user and fetch their specific data from the database.

**Key Model:** `Browser ---> Next.js Server { Middleware (Auth Check) ---> Page Rendering (Data Fetching) }`

### Backend API Authentication (The Missing Link)

While the frontend authenticates users with Supabase, it communicates with the `langconnect` backend API by passing along the Supabase JWT.

1. **Axios Interceptor:** Every API request from the frontend to the backend is intercepted by a helper (`next-connect-ui/src/lib/axios.ts`).
2. **JWT Injection:** This interceptor automatically fetches the current session token from Supabase and adds it to the request as an `Authorization: Bearer <token>` header.
3. **Backend Validation:** Your `langconnect` backend is configured to accept and validate these Supabase JWTs, confirming the user's identity on every API call.

#### Why was there an `/auth/signin` endpoint before?

The original project structure suggests a more traditional, two-step authentication flow. The `mcpserver` scripts (and likely a previous version of the backend) expected to have their own dedicated sign-in endpoint.

* **Original Intent (Likely):** The user would sign in to the `langconnect` backend's `/auth/signin` endpoint. The backend would then *itself* talk to Supabase to validate the credentials and, upon success, would issue its *own* separate JWT to the client.
* **Current, Refactored Model:** The current setup is more direct and modern. The frontend gets the token directly from Supabase, and the backend simply validates it. This makes the backend more stateless and simpler, as it doesn't need to manage issuing or refreshing its own tokens.

The `axios` interceptor is the key piece of "glue" that makes this direct validation model work seamlessly. The `mcpserver` scripts were never updated to reflect this refactored, more direct authentication pattern.

### Managing Users in Supabase

You can manage users directly from your Supabase project dashboard.

#### Adding a New User

1. Go to your Supabase project dashboard.
2. Navigate to the **Authentication** section in the sidebar.
3. Click the **"Add user"** button.
4. Fill in the user's email and password.
5. For local development, choosing to auto-confirm the user is often easiest.

#### Changing a User's Password

1. Go to your Supabase project dashboard.
2. Navigate to the **Authentication** section.
3. Find the user in the list and click on their entry.
4. In the user details view, click **"Send password reset"** to send a reset link to the user's email.

## Quick Start

1. **Navigate to the frontend directory:**
   ```Shell
   cd next-connect-ui
   ```

2. **Install dependencies:**
   ```Shell
   npm install
   # or if you prefer pnpm:
   # pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the `next-connect-ui` directory:

   ```env
   # Supabase Configuration (required for authentication)
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_KEY=your-supabase-anon-key

   # API Configuration - Point to your existing LangConnect backend
   NEXT_PUBLIC_API_URL=http://localhost:8080
   API_URL=http://localhost:8080
   ```

   **Note:** The frontend now authenticates via Supabase directly. The `NEXT_PUBLIC_SUPABASE_KEY` is your anon public key (safe to expose in the frontend).

4. **Run the development server:**
   ```Shell
   npm run dev
   # or
   # pnpm dev
   ```

5. **Access the frontend:**
   Open <http://localhost:3011> in your browser

## Notes

* The frontend will connect to your existing LangConnect backend at `http://localhost:8080`
* Make sure your backend's CORS settings allow requests from `http://localhost:3011`
* The `.env.local` file is gitignored, so your secrets won't be committed

## Production Build

If you want to build for production:

```Shell
npm run build
npm start
```

