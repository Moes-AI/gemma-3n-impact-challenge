# Gemini Build Notes for Gemma RN Project

## Goal
Build the React Native app to run a large local LLM (Gemma 3N, ~2.9GB) on an Android device for on-device inference.

## Summary of Issues Encountered
Local builds using `npx expo run:android` have consistently failed due to a series of cascading errors:
1.  **Asset Bundling Failure:** The large `.task` model file was not being included in the APK, causing the app to crash on launch when it couldn't find the model.
2.  **Native Build Errors:** Attempts to fix this by placing the asset in the native `android/app/src/main/assets` folder led to new problems.
3.  **Out of Memory:** The Android Gradle process ran out of memory (`Required array size too large`) when trying to process the 2.9GB model file.
4.  **Configuration Conflicts:** Fixes for the memory issue (like adding a `gradle.properties` file) introduced new build errors, such as missing `hermesEnabled` and `android.useAndroidX` properties.
5.  **Incorrect Project Root:** We discovered that the IDE was opened one level above the actual project root (`rn/`), which is a likely cause of many path-related build failures.

## The Chosen Solution
We have abandoned the local build process (`npx expo run:android`) in favor of **EAS Build**, Expo's cloud build service. This is the recommended approach because:
- It uses powerful cloud servers with high memory limits, solving the out-of-memory issue.
- It has a robust and reliable process for bundling large assets.

## Current State of the Codebase
The following critical fixes are in place and should be preserved:
- **`rn/assets/models/gemma-3n-E2B-it-int4.task`**: The model file exists in this path.
- **`rn/src/utils/llm.ts`**: The `MODEL_PATH` constant is correctly set to `'assets/models/gemma-3n-E2B-it-int4.task'`.
- **`rn/app.json`**: The `"assetBundlePatterns": ["assets/models/*"]` key is present to instruct Expo to bundle the model.
- **`rn/android/app/build.gradle`**: An `aaptOptions { noCompress 'task' }` block was added to prevent compression of the model file.
- **`rn/android/gradle.properties`**: This file was created to increase Gradle's memory (`org.gradle.jvmargs=-Xmx4g`) and set required properties (`hermesEnabled=true`, `android.useAndroidX=true`).

## Plan for New Chat Session
1.  **Confirm Project Root:** Ensure the new IDE session is opened with `/home/greg/pro/moes/gem1/rn` as the root directory.
2.  **Install EAS CLI:** Run `npm install -g eas-cli` to install the Expo Application Services command-line tool.
3.  **Login to Expo:** Run `eas login` and log in with your Expo account credentials.
4.  **Configure EAS Build:** Run `eas build:configure` to generate an `eas.json` file tailored for the project. Select Android when prompted.
5.  **Start Cloud Build:** Run `eas build --platform android --profile development` to start the build on Expo's servers. This will produce a development client build that you can install on your phone.
