# Smart Habit Tracker

Smart Habit Tracker is a full-featured habit tracking application built with React, Vite, and Framer Motion, with dual-deployment support for **Web / PWA (GitHub Pages)** and native **Android (Capacitor)** from a single codebase.

---

## 🚀 Getting Started (Development)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   The app will run at `http://localhost:5173` (proxying `/api` backend requests to `http://localhost:5000`).

---

## 🌐 Web/PWA Deployment (GitHub Pages)

The Web deployment is configured for GitHub Pages with path base `/smart-habit-tracker/` and an auto-updating PWA Service Worker.

1. **Build Web App**:
   ```bash
   npm run build:web
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```
   *Note: `npm run deploy` automatically builds the web version (`predeploy` script) and pushes the `dist` folder to the `gh-pages` branch.*

---

## 📱 Android Build (Capacitor)

The Android build runs standalone inside a Capacitor webview wrapper.

### Configuration
Set your deployed production backend API URL in `.env` before building for Android:
```env
VITE_API_BASE_URL=https://your-backend-api.onrender.com
```

### Build & Sync Steps

1. **Build Capacitor Web Assets & Sync Native Android Project**:
   ```bash
   npm run cap:sync
   ```
   *(This builds Vite with base `/`, disables web PWA service workers for native wrapper compatibility, and syncs `dist` into `android/app/src/main/assets/public`)*

2. **Generate Android App Icons & Splash Screens**:
   ```bash
   npm run assets:generate
   ```
   *(Resizes `public/pwa-512x512.png` into all Android launcher icon mipmaps and splash screen drawables)*

3. **Open Project in Android Studio**:
   ```bash
   npm run cap:open
   ```
   *(Or run `npx cap open android`)*

---

## 🛠 Building APK / AAB in Android Studio

Once Android Studio opens the `android/` directory:

1. **Wait for Gradle Sync**: Allow Gradle to finish indexing dependencies.
2. **Debug APK**:
   - Go to top menu: **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
   - Once completed, click **locate** in the popup to retrieve `app-debug.apk`.
3. **Production Signed APK / App Bundle (AAB for Play Store)**:
   - Go to top menu: **Build** > **Generate Signed Bundle / APK...**
   - Choose **Android App Bundle** (for Google Play Store) or **APK**.
   - Create or select your keystore, set key alias/passwords, and select **Release** build variant.
   - Click **Create**. The generated AAB/APK will be saved under `android/app/release/`.

---

## 📂 Project Structure

```
Smart Habit Tracker/
├── android/                   # Capacitor Android native project folder
├── assets/                    # Capacitor source assets for icon & splash
├── public/                    # Static assets & PWA icons
├── scripts/
│   └── generate-android-assets.js  # Android icon & splash generator script
├── src/                       # React frontend source code
├── .env                       # Environment configuration (VITE_API_BASE_URL)
├── capacitor.config.json      # Capacitor configuration
├── package.json               # NPM package dependencies & build scripts
├── README.md                  # Project documentation
└── vite.config.js             # Environment-aware Vite build configuration
```

