# Running Frontend Without Docker

You can run the Next.js frontend directly without Docker Compose.

## Prerequisites

- Node.js 20+ installed
- npm or pnpm installed

## Quick Start

1. **Navigate to the frontend directory:**
   ```bash
   cd next-connect-ui
   ```

2. **Install dependencies:**
   ```bash
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
   ```bash
   npm run dev
   # or
   # pnpm dev
   ```

5. **Access the frontend:**
   Open http://localhost:3011 in your browser

## Notes

- The frontend will connect to your existing LangConnect backend at `http://localhost:8080`
- Make sure your backend's CORS settings allow requests from `http://localhost:3011`
- The `.env.local` file is gitignored, so your secrets won't be committed

## Production Build

If you want to build for production:

```bash
npm run build
npm start
```

This will run the production server on port 3011.

