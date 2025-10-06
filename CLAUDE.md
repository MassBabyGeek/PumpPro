# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native fitness application called "PompeurPro" that tracks push-ups using computer vision and face detection. The app uses the device's front camera to detect user movement (face distance changes) to automatically count push-ups.

## Development Commands

### Initial Setup (iOS)
```bash
# Install Ruby dependencies (CocoaPods)
bundle install

# Install iOS pods (required after initial clone or native dependency updates)
cd ios && bundle exec pod install && cd ..
```

### Running the App
```bash
# Start Metro bundler
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

### Testing & Linting
```bash
# Run tests
npm test

# Run linter
npm run lint
```

## Architecture

### Navigation Structure

The app uses React Navigation with a multi-layered stack/tab architecture:

1. **Root Level (App.tsx)**: Conditional rendering based on authentication state
   - `isAuthenticated = true` → AppStack
   - `isAuthenticated = false` → AuthStack

2. **AuthStack** ([src/components/Stacks/AuthStack/AuthStack.tsx](src/components/Stacks/AuthStack/AuthStack.tsx))
   - Stack navigator with Login and SignUp screens
   - Entry point for unauthenticated users

3. **AppStack** ([src/components/Stacks/AppStack/AppStack.tsx](src/components/Stacks/AppStack/AppStack.tsx))
   - Main navigation container post-authentication
   - Contains TabsNavigator as the primary route

4. **TabsNavigator** ([src/components/TabsNavigator/TabsNavigator.tsx](src/components/TabsNavigator/TabsNavigator.tsx))
   - Bottom tab navigation with 3 tabs:
     - Home: HomeScreen
     - Push Up: TrainingStack (nested stack)
     - Profile: ProfileScreen

5. **TrainingStack** ([src/components/Stacks/TrainingStack/TrainingStack.tsx](src/components/Stacks/TrainingStack/TrainingStack.tsx))
   - Nested stack within the "Push Up" tab
   - Routes: Training (main) → Libre (workout) → PushUpSummary

### Push-Up Detection System

The core feature uses Vision Camera with face detection:

- **PushUpCamera Component** ([src/components/PushUpCamera/PushUpCamera.tsx](src/components/PushUpCamera/PushUpCamera.tsx))
  - Uses `react-native-vision-camera` with front camera
  - Runs frame processor with face detection
  - Hidden camera (width/height: 0, opacity: 0) - only used for detection

- **Face Detection Logic** ([src/utils/faceDetector/faceDetector.util.ts](src/utils/faceDetector/faceDetector.util.ts))
  - Estimates distance based on face width (BASE_WIDTH: 200, DISTANCE_CM: 30)
  - State machine with 3 states: `idle` → `down_detected` → `up_detected`
  - Thresholds: CLOSE_THRESHOLD (4000), FAR_THRESHOLD (6000)
  - Increments count when transition from down → up detected
  - Uses worklets for performance (runs on UI thread)

### Key Technical Considerations

1. **Worklets**: The face detection callback uses `react-native-worklets-core` to run on the UI thread for better performance. This requires:
   - Babel plugin configuration ([babel.config.js](babel.config.js))
   - Functions passed as closures (e.g., `() => movementState`, not direct values)

2. **iOS Native Dependencies**:
   - Vision Camera requires camera permissions
   - Face detector uses native ML Kit (iOS/Android)
   - Always run `bundle exec pod install` after updating native dependencies

3. **Permissions**:
   - Camera permission requested at runtime
   - Android: uses PermissionsAndroid API
   - iOS: uses Camera.requestCameraPermission()

## Project Structure

```
src/
├── assets/
│   └── colors.ts              # App color scheme
├── components/
│   ├── AppButton/             # Reusable button component
│   ├── AppTitle/              # Title component
│   ├── Card/                  # Card component
│   ├── PushUpCamera/          # Vision camera + face detection
│   ├── TabsNavigator/         # Bottom tab navigation
│   └── Stacks/
│       ├── AuthStack/         # Pre-auth navigation
│       ├── AppStack/          # Post-auth navigation
│       └── TrainingStack/     # Training flow navigation
├── screens/
│   ├── HomeScreen/
│   ├── LoginScreen/
│   ├── SignUpScreen/
│   ├── ProfileScreen/
│   ├── TrainingScreen/        # Training mode selection
│   ├── PushUpScreen/          # Active push-up tracking
│   └── PushUpSummaryScreen/   # Workout summary
└── utils/
    └── faceDetector/          # Face detection logic
```

## Important Notes

- The app is currently in development with `isAuthenticated` hardcoded to `true` in [App.tsx](App.tsx)
- Face detection requires good lighting and proper camera positioning
- The camera is hidden (opacity: 0) but must remain active for detection to work
- All navigation stacks use `headerShown: false` for custom UI control
