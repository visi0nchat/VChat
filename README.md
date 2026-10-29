# VisionChat

VisionChat is an early React/Vite interface prototype for a messaging platform.

## Run in GitHub Codespaces

Open the repository in Codespaces, open Terminal, and run:

```bash
npm install
npm run dev
```

Codespaces will show a forwarded port for Vite (usually 5173). Open it in the browser.

## Build for static hosting

```bash
npm run build
```

The production files are written to `dist/`.

## Important status

This starter is a front-end prototype. Messages are stored only in the current browser session and are not sent to other users. Authentication, Firestore persistence, file uploads, push notifications, and audio/video calling are not connected yet. Do not enter real passwords or private information into this prototype.
