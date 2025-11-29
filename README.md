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
2.  In the left sidebar menu, find the **BUILD** section. Click **Compute & AI** to expand it, then select **Workers & Pages**.
3.  On the "Workers & Pages" overview screen, click the **Create application** button.
4.  **⚠️ CRITICAL STEP**: On the next screen ("Ship something new"), look at the top or center tabs.
    *   **Select the "Pages" tab.** (Do NOT select "Workers").
    *   If you see "Configure your Worker project", you are in the wrong place. Go back.
5.  Click the **Connect to Git** button.
6.  **Connect your repository**:
    *   If prompted, authorize Cloudflare Pages to access your GitHub account.
    *   From the list of repositories, find and select the one containing your CardioTrack code.
    *   Click the **Begin setup** button.
7.  **Configure Build Settings** (If you are in the right place, you will see "Framework preset"):
    *   **Project name**: Defaults to your repo name.
    *   **Framework preset**: Click the dropdown and select **Vite**.
        *   *Check*: Build command should be `npm run build`.
        *   *Check*: Build output directory should be `dist`.
    *   *If you do not see "Framework preset" and see "Deploy command: npx wrangler deploy" instead, you selected Workers in step 4. Go back and select Pages.*
8.  **Set Environment Variables**:
    *   Look for the **Environment variables (advanced)** section and click to expand it.
    *   Click **Add variable**.
    *   **Variable name**: `API_KEY`
    *   **Value**: Paste your Google Gemini API Key here (starts with `AIza...`).
9.  **Deploy**:
    *   Click the **Save and Deploy** button.
    *   Cloudflare will now build the app.
10. **Finish**:
    *   Once you see the "Success!" message, you will see a link to your live site (e.g., `https://cardiotrack-pro.pages.dev`).
    *   Open this link on your Android phone to install it.

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