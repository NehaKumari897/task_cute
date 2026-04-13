# TaskCute ✨ — Cute Todo App

A beautiful, responsive task manager with Firebase backend, 3 themes, and all features.

## Features
- Today's tasks with progress bar
- Weekly view with day selector
- Calendar view
- Categories (Work, Food, Sport, Idea, Music, Personal)
- Priority levels (High, Medium, Low)
- Due time for tasks
- Reminder toggle
- 3 Themes — Purple, Colorful, Dark
- Google Login
- Firebase Firestore — data synced across devices

## Setup

### Step 1 — Install
```bash
npm install
```

### Step 2 — Create `.env` file
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Step 3 — Firebase setup
1. Firebase Console → Authentication → Google → Enable
2. Firestore Database → Create (test mode)

### Step 4 — Run
```bash
npm run dev
```

### Deploy to Vercel
1. Push to GitHub
2. Vercel → New Project → Import → Add env vars → Deploy
3. Firebase → Auth → Authorized domains → add your vercel URL
