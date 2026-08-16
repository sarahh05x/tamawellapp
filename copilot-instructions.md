# Project Overview
This repository contains "TamagotchiWellness," a mobile application built to reduce screen time and increase physical productivity. 
The app revolves around a digital pet whose stats (Energy, Hunger, Happiness) deplete over time. The pet is kept healthy through real-world user actions (walking, sleeping, focused offline hobbies, eating well) rather than digital screen time.

# Tech Stack
*   **Framework:** React Native with Expo (Expo Router for navigation).
*   **Language:** TypeScript (Strict mode enabled).
*   **Hardware APIs:** `expo-sensors` (Pedometer, Accelerometer).
*   **Local Storage:** `expo-sqlite` or `AsyncStorage` for local game state.
*   **UI/Styling:** React Native Core Components (Flexbox) and standard StyleSheet objects. No third-party heavy CSS libraries unless explicitly requested.

# Global Coding Guidelines
*   **Component Architecture:** Use React functional components and hooks (`useState`, `useEffect`, `useContext`) exclusively. Never use class components.
*   **TypeScript:** Provide explicit type definitions for all component props, API payloads, and game state objects. Do not use `any`.
*   **Imports:** Always use absolute imports where configured, and group React/Expo imports separately from local components.
*   **File Structure:** Follow Expo Router conventions. Keep screens in the `app/` directory and reusable elements in `components/`.
*   **Performance:** The app relies on background processes and hardware sensors. Always clean up sensor subscriptions (e.g., `subscription.remove()`) inside the `useEffect` return block to prevent memory leaks.
