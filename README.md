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
2.  Navigate to the application URL.
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

## Tech Stack

*   React 18
*   TypeScript
*   Tailwind CSS
*   Recharts
*   Google Gemini API (@google/genai)
*   Lucide React Icons
