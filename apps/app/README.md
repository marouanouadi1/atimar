# atimar

A React Native mobile app built with Expo, supporting iOS, Android, and Web.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [Expo Go](https://expo.dev/go) app on your device, **or** platform simulators:
  - **iOS**: Xcode with iOS Simulator (macOS only)
  - **Android**: Android Studio with an Android Virtual Device

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/marouanouadi1/atimar.git
cd atimar
npm install
```

### 2. Start the development server

```bash
npm start
```

Then choose how to open the app:

- **Physical device** — scan the QR code with the [Expo Go](https://expo.dev/go) app
- **iOS Simulator** — press `i` in the terminal (macOS only)
- **Android Emulator** — press `a` in the terminal
- **Web browser** — press `w` in the terminal

Or use the dedicated scripts:

| Command           | Platform              |
| ----------------- | --------------------- |
| `npm run ios`     | iOS Simulator (macOS) |
| `npm run android` | Android Emulator      |
| `npm run web`     | Browser               |

## Project Structure

```
app/          # File-based routing (expo-router)
components/   # Reusable UI components
constants/    # Theme and shared constants
hooks/        # Custom React hooks
styles/       # Shared stylesheets
utils/        # Supabase client and utilities
assets/       # Images and static assets
```

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
npm install -g eas-cli
eas build --platform android   # or ios / all
```

Build profiles are configured in `eas.json`.

## Linting

```bash
npm run lint
```
