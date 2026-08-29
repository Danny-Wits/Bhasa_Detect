# Bhasa Detect

Bhasa Detect is a community-driven multilingual voice data collection platform. The application is designed to collect voice samples in various languages (currently English, Hindi, and Dogri) to help train state-of-the-art speech recognition AI models.

## 🚀 Features
- **Modern Landing Page:** Clean and engaging UI to convert visitors into contributors.
- **Seamless Onboarding:** Users can easily specify their demographic data and spoken languages.
- **Audio Collection Dashboard:** Interactive recording interface to collect speech samples based on target text lines.
- **Impact Analytics:** Visual feedback on user contributions, language distributions, and AI confidence scores using Mantine Charts.

## 🛠️ Tech Stack
- **Frontend Framework:** React (Vite)
- **UI Library:** Mantine UI v7 & Mantine Charts
- **Icons:** Tabler Icons
- **Routing:** React Router DOM
- **Data Management:** Custom React Context and Hooks (Mocking Backend/Supabase)

## 📦 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Danny-Wits/Bhasa_Detect.git
   cd Bhasa_Detect
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the provided local URL (usually `http://localhost:5173`).

## 📁 Project Structure

- `/src/pages` - Main application views (Landing, Login, Onboarding, Dashboard).
- `/src/components` - Reusable UI elements (AudioRecorder, AuthGuard, custom Logo).
- `/src/hooks` - Core business logic and mock data generation (`useProfile`, `useAudioSubmission`, etc.).
- `/src/lib` - Global Context providers (Mock Authentication).
- `/src/assets` - Static images and custom vector art.

## 🔜 Next Steps
- Connect to a live backend/database (e.g., Supabase) for persistent user sessions.
- Integrate the real Machine Learning prediction endpoint for audio processing and validation.
