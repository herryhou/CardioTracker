# CardioTrack Pro

A modern, mobile-first blood pressure and heart rate tracker built with React, Tailwind CSS, and AI-powered insights.

## Features

*   **Track Vitals**: Log Systolic, Diastolic, and Pulse readings easily.
*   **Visualizations**: Interactive charts for trends and distribution analysis (Normal, Elevated, Hypertension stages).
*   **AI Insights**: Get personalized health analysis and tips powered by Google Gemini.
*   **Data Sync**: Sync your records to your own Google Sheet for safekeeping and analysis.
*   **PWA Support**: Installable as a native-like app on Android and iOS.
*   **Local Storage**: Your data stays on your device by default.

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
2.  Go to **Compute (Workers & Pages)** > **Pages**.
3.  Click **Connect to Git** and select your GitHub repository.
4.  **Configure Build Settings**:
    *   **Framework preset**: Select `Vite` (or `Create React App` depending on your setup).
    *   **Build command**: `npm run build`
    *   **Build output directory**: `dist`
5.  **Environment Variables**:
    *   Go to the "Environment variables" section.
    *   Add variable: `API_KEY`
    *   Value: Your Google Gemini API Key.
6.  Click **Save and Deploy**.

Cloudflare will give you a URL (e.g., `https://cardiotrack.pages.dev`). Open this on your phone to install.

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
