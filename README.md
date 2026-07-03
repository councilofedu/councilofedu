# Council for Mathematics Education (CME)

The official web platform for the Council for Mathematics Education (CME), Nepal's pioneer government-recognized academic society established in 1991 (2048 B.S.). CME connects mathematics educators, researchers, and scholars under one unified national framework to modernize the teaching and learning of mathematics.

## Features

- **Membership Portal**: Apply online for General or Life memberships and verify digital cards instantly.
- **Admin Dashboard**: Manage members, team applications, FAQs, site settings, testimonials, and blog posts.
- **Bulk Newsletters**: Distribute newsletters to approved, pending, or custom subscriber lists via SMTP (Nodemailer).
- **Secure Media Storage**: Integrated with Cloudinary for handling media and file uploads.
- **AI pedagogical Search**: Incorporates Gemini API models for educational searches and math pedagogy assistance.

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **Java Runtime Environment (JRE)** (Optional, required only for local Firebase Emulators)

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:
   ```bash
   npm install
   ```

### Configuration

Create a `.env` file in the root directory (based on `.env.example`) and fill in the necessary keys:

```env
# Gemini API Key for pedagogical AI helpers
GEMINI_API_KEY="your-gemini-api-key"

# Express server port and URL configuration
APP_URL="http://localhost:3000"

# Cloudinary credentials for media storage
CLOUDINARY_CLOUD_NAME="your-cloudinary-name"
CLOUDINARY_API_KEY="your-cloudinary-key"
CLOUDINARY_API_SECRET="your-cloudinary-secret"

# SMTP Email credentials (for newsletter broadcasts)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-gmail-app-password"
SMTP_FROM='"Council for Mathematics Education" <your-email@gmail.com>'

# Firebase Emulator config (optional, comment out to connect to cloud database)
FIRESTORE_EMULATOR_HOST=127.0.0.1:8080
FIREBASE_AUTH_EMULATOR_HOST=127.0.0.1:9099
```

### Running Locally

To start the local development server (Express backend + Vite frontend proxy):
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Firebase Emulators

If you have Java installed, you can start the local Firebase Emulator suite:
```bash
npm run emulator
```

### Building for Production

To build the production frontend assets and bundle the server:
```bash
npm run build
```

To run the production build:
```bash
npm run start
```
