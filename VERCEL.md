# Vercel Deployment Guide (Unified Serverless Architecture)

This application is configured for a **unified serverless deployment** directly on Vercel. Both the React/Vite frontend and the Express API server run in a single Vercel project.

## Project Structure for Vercel

* **Frontend**: Compiled automatically via the `build` script in `package.json` to the `dist` folder, which Vercel serves as high-performance static assets.
* **Backend API**: Handled as a Vercel Serverless Function via [api/index.ts](file:///c:/Users/BISHAL/Desktop/council-for-mathematics-education/api/index.ts), which imports and mounts the Express app from [server.ts](file:///c:/Users/BISHAL/Desktop/council-for-mathematics-education/server.ts).
* **Routing**: Configured via [vercel.json](file:///c:/Users/BISHAL/Desktop/council-for-mathematics-education/vercel.json) to route all `/api/*` requests to the Express serverless function and route all browser path refreshes back to `/index.html` (for Single Page Application routing).

---

## How to Deploy on Vercel

### Step 1: Push Code to GitHub / GitLab / Bitbucket
Ensure all files—including [vercel.json](file:///c:/Users/BISHAL/Desktop/council-for-mathematics-education/vercel.json) and [api/index.ts](file:///c:/Users/BISHAL/Desktop/council-for-mathematics-education/api/index.ts)—are committed and pushed to your git repository.

### Step 2: Create a New Project on Vercel
1. Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New** -> **Project**.
2. Import your Git repository.
3. Vercel will automatically detect the **Vite** framework preset.

### Step 3: Configure Environment Variables
In the **Environment Variables** section of the Vercel project setup, add all the keys from your `.env` file:

| Variable Name | Value Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Gemini AI API Key |
| `APP_URL` | The Vercel deployment URL (e.g., `https://your-app.vercel.app`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `council.edu.developer@gmail.com` |
| `SMTP_PASS` | Gmail App Password (`ptcd unfl ruia mrhb`) |
| `SMTP_FROM` | `"Council for Mathematics Education" <council.edu.developer@gmail.com>` |

*Note: You do **not** need `FIRESTORE_EMULATOR_HOST` or `FIREBASE_AUTH_EMULATOR_HOST` in production, as the server will automatically connect to your live cloud Firebase database instead of local emulators.*

### Step 4: Click Deploy 🚀
Vercel will build the frontend assets, compile the serverless API function, and deploy your site.

---

## Live Database Seeding & Setup
Upon the first deployment, the server-side client will automatically register `council.edu.developer@gmail.com` as the default Administrator and seed the initial FAQ, blog posts, site settings, programs, and publications into your live cloud Firestore database!
