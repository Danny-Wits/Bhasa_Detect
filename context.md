# Bhasa Detect - Project Context

## Overview
Bhasa Detect is a frontend web application for a data collection and model training platform. It collects voice samples of users speaking lines in different languages (Hindi, English, Dogri) and receives backend predictions.

## User Flow
1. **Authentication:** User logs into the application.
2. **Onboarding:** First-time users complete a profile taking their name, age, gender, and most importantly, the languages they speak (Hindi, English, Dogri).
3. **Dashboard:** 
   - User is presented with generated text lines.
   - User records themselves speaking the line in one of the languages they speak.
   - The audio data is sent to the backend.
   - Backend predicts the language on its own and returns a prediction.
   - Only metadata (e.g., accuracy, language spoken, prediction result) is stored, not the audio itself.

## Technical Stack & Constraints
- **Framework:** React (Vite)
- **UI Library:** Mantine UI (Mobile-first design)
- **State/Data Management:** TanStack Query
- **Backend/BaaS:** Supabase (for auth/metadata storage; ML backend will be attached later)
- **Language:** Pure JavaScript (.js, .jsx)

## Data Management Rules
- Data hooks must be split into separate, single-purpose JS files aligned precisely with database tables (e.g., `useUser.js`, `useAudioMetadata.js`).

## Current Status
- Frontend focus only. Backend ML prediction logic will be simulated/attached later.
