# CardioTrack Pro

A modern, mobile-first blood pressure and heart rate tracker built with React, Tailwind CSS, and AI-powered insights.

## Features

*   **Track Vitals**: Log Systolic, Diastolic, and Pulse readings easily.
*   **Visualizations**: Interactive charts for trends and distribution analysis (Normal, Elevated, Hypertension stages).
*   **AI Insights**: Get personalized health analysis and tips powered by Google Gemini.
*   **Data Sync**: Sync your records to your own Google Sheet for safekeeping and analysis.
*   **PWA Support**: Installable as a native-like app on Android and iOS.
*   **Local Storage**: Your data stays on your device by default.
*   **Export Options**: Download your data in CSV or JSON format.

## How to Install on Android

CardioTrack Pro is a Progressive Web App (PWA), meaning you can install it directly from your browser without using the Play Store.

1.  **Open Chrome** on your Android device.
2.  Navigate to the application URL (after deploying).
3.  Tap the **Three Dots** menu icon in the top-right corner.
4.  Select **"Add to Home Screen"** or **"Install App"**.
5.  Tap **"Install"** to confirm.
6.  The app will appear in your app drawer and home screen. Launching it will open the app in full-screen mode.

## Google Sheet Sync Setup

To sync your data to your personal Google Sheet:

1.  Open the app and tap the **Settings (Gear)** icon.
2.  Expand the **"How to set up..."** section.
3.  Copy the provided Google Apps Script code.
4.  Create a new Google Sheet, go to **Extensions > Apps Script**, and paste the code.
5.  Deploy as a **Web App** (Execute as: "Me", Who has access: "Anyone").
6.  Paste the generated **Web App URL** back into CardioTrack Pro settings.

## Deployment Guide

Since this app uses TypeScript and React, it needs to be "built" before it can be hosted.

### Prerequisites
*   You should have this code in a GitHub repository.
*   The project should be set up with a build tool like **Vite** (recommended).
    *   Build Command: `npm run build`
    *   Output Directory: `dist`

### Option 1: Cloudflare Pages (Recommended - Free & Fast)

1.  **Log in** to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2.  In the sidebar, go to **Compute (Workers & Pages)**.
3.  Click the **Create application** button (usually top right).
4.  Switch to the **Pages** tab and click **Connect to Git**.
5.  **Select your repository**:
    *   You may need to authorize Cloudflare to access your GitHub account.
    *   Select the repository containing your CardioTrack code.
    *   Click **Begin setup**.
6.  **Configure Build Settings**:
    *   **Project name**: Leave as is or customize (this affects your URL).
    *   **Production branch**: Usually `main` or `master`.
    *   **Framework preset**: Select **Vite** (or React, but Vite is preferred if available).
    *   **Build command**: Ensure it is set to `npm run build`.
    *   **Build output directory**: Ensure it is set to `dist`.
7.  **Environment Variables**:
    *   Scroll down and click on **Environment variables (advanced)**.
    *   Click **Add variable**.
    *   **Variable name**: `API_KEY`
    *   **Value**: Your Google Gemini API Key.
8.  Click **Save and Deploy**.
9.  Wait for the build to complete. Once finished, Cloudflare will provide a unique URL (e.g., `https://cardiotrack.pages.dev`). You can now open this URL on your phone to install the app.

### Option 2: Firebase Hosting (Google - Free Tier)

1.  Install Firebase CLI: `npm install -g firebase-tools`
2.  Login: `firebase login`
3.  Initialize in your project folder: `firebase init`
    *   Select **Hosting**.
    *   Use an existing project or create a new one.
    *   **Public directory**: `dist` (if using Vite).
    *   **Configure as a single-page app**: `Yes`.
4.  Build the app: `npm run build`
5.  Deploy: `firebase deploy`

**Note for Firebase**: Environment variables usually need to be set in your build process (e.g., creating a `.env` file before running `npm run build`) because Firebase Hosting serves static files.

## Tech Stack

*   React 18
*   TypeScript
*   Tailwind CSS
*   Recharts
*   Google Gemini API (@google/genai)
*   Lucide React Icons
