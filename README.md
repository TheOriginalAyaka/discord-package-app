# Discord Package Data Explorer

> **⚠️ Work in Progress** - This application is currently under active development.

A React Native mobile application for exploring Discord data packages, built with Expo and powered by a custom Rust library for efficient data processing.

## Overview

This app allows users to parse and explore Discord data packages on both iOS and Android devices. The core parsing logic is implemented in Rust ([dpkg-rs/](dpkg-rs/)) by [@Arikatsu](https://github.com/Arikatsu) and exposed to the React Native layer through native modules.

## Architecture

- **Frontend**: React Native with Expo
- **Backend**: Rust library (`dpkg-rs`) compiled for mobile platforms
- **Native Bridge**: Expo modules for iOS and Android integration
- **Supported Platforms**: iOS, Android

## Prerequisites

- Node.js and npm
- Rust toolchain
- Android NDK (for Android builds)
- Xcode (for iOS builds, macOS only)

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Build native libraries**:

   For Android:

   ```bash
   ./build-android-lib.sh
   ```

   For iOS:

   ```bash
   ./build-ios-lib.sh
   ```

## Development

Start the Expo development server:

```bash
npm start
```

Run on specific platforms:

```bash
npm run android    # Android
npm run ios        # iOS
```
