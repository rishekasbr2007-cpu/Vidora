# Vidora — Professional AI Video Editor

> **Vidora** · Antigravity Studio · v2.0

A pixel-perfect DaVinci Resolve–inspired browser-based video editor with built-in AI video generation (Veo 3 · Runway · Sora), MongoDB authentication, Creator Space, and Developer portal.

---

## ✦ What's Inside

### 🎬 Editor (DaVinci Resolve Layout)
- Exact DaVinci Resolve 20 interface replica
- **Smart Bins** panel + **Project Folders** with rename & delete
- **Media Pool** — grid/list view, drag & drop import
- **6-track Timeline** — V1 V2 V3 · A1 A2 A3
- Auto-linked video+audio clips on drop
- Drag to reposition clips, resize handles on each clip
- **Playhead** with click-to-seek ruler
- Real video + audio playback via HTML5 elements
- **Effects Library** — Blur / Color / Looks / Distort / Transitions / Audio FX
- Drag effects onto clips, double-click to apply
- **Inspector** — Video (Transform, Speed, Sizing) · Audio (Volume, Pan, Pitch, EQ) · Effects · Color (Lift/Gamma/Gain)
- **Transport** — Play/Pause (Space), Step (←→), Zoom (0.25×–8×), Scrubber
- Timecode display HH:MM:SS:FF

### ✦ AI Video Generation (bottom-left panel)
- Text prompt with negative prompt support
- **Style presets**: Cinematic, Anime, Realistic, 3D Render, Noir, Retro 8mm, Neon Cyber, Documentary
- **Durations**: 3s · 5s · 8s · 10s · 15s · 20s
- **Resolutions**: 720p · 1080p · 4K
- **Aspect ratios**: 16:9 · 9:16 · 1:1 · 4:3 · 2.39:1
- Credit-based system (10 free on signup)
- Generated clips added to Media Pool automatically
- AI badge on timeline clips
- Powered by: **Veo 3 · Runway · Sora** (plug in API keys)

### 👤 Authentication (MongoDB + JWT)
- Signup / Login (optional — app opens without login)
- 30-day JWT tokens · bcrypt password hashing
- User roles: **Developer** / **Creator** / **Both**

### 🌟 Creator Space
- Public profile with banner, avatar, handle
- Project portfolio grid (rename, delete, publish)
- Follow / Followers system
- Explore creators feed
- Analytics tab

### 💻 Developer Portal
- Unique Developer icon (code/terminal themed)
- API key display
- Full API reference table

### 📊 Antigravity Dashboard
- Stats: Projects · AI Credits · Views · Followers
- Recent projects list
- **Developer Card** + **Creator Card** with separate icons
- API reference

---

## 🗂 Project Structure

```
cineai/
├── index.html
├── vite.config.js
├── package.json
├── eslint.config.js
├── .gitignore
├── public/
│   └── favicon.svg              ← C!ne vintage camera icon
├── src/
│   ├── main.jsx
│   ├── App.jsx                  ← No login wall — opens directly
│   ├── index.css                ← Full DaVinci dark theme
│   ├── store/
│   │   ├── AuthContext.jsx      ← JWT auth (optional login)
│   │   ├── EditorContext.jsx    ← Timeline engine, playback, effects
│   │   └── ProjectContext.jsx   ← Folders, projects, rename/delete
│   ├── components/
│   │   ├── CameraIcon.jsx       ← C!ne vintage camera SVG logo
│   │   ├── DeveloperIcon.jsx    ← Code/terminal themed icon
│   │   ├── CreatorIcon.jsx      ← Film star/reel themed icon
│   │   ├── MenuBar.jsx          ← DaVinci top menu + page tabs
│   │   ├── LeftSidebar.jsx      ← Smart Bins + Media Pool
│   │   ├── Viewer.jsx           ← Video preview + timecode
│   │   ├── Transport.jsx        ← Playback controls
│   │   ├── Timeline.jsx         ← 6-track multi-track timeline
│   │   ├── Inspector.jsx        ← Clip properties panel
│   │   ├── FXPanel.jsx          ← Effects & Transitions library
│   │   └── AIPanel.jsx          ← AI video generation UI
│   └── pages/
│       ├── AuthPage.jsx         ← Login/Signup (not shown by default)
│       ├── Editor.jsx           ← Full DaVinci-layout workspace
│       ├── CreatorSpace.jsx     ← Creator profile & feed
│       └── Dashboard.jsx        ← Antigravity home
└── backend/
    ├── server.js
    ├── package.json
    ├── .env                     ← Add MongoDB URI here
    ├── middleware/auth.js
    ├── models/
    │   ├── User.js              ← MongoDB user (creator + developer spaces)
    │   └── Project.js           ← MongoDB project + clips
    └── routes/
        ├── auth.js
        ├── projects.js
        ├── ai.js
        └── creator.js
```

---

## 🚀 Quick Start

### Frontend
```bash
npm install
npm run dev
# → http://localhost:5173
```
App opens **directly** — no login required.

### Backend (optional, for auth + save)
```bash
cd backend
npm install
```

Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/cineai
JWT_SECRET=your_secret_key
```

```bash
npm run dev
# → http://localhost:5000
```

### AI Video APIs
Add to `backend/.env`:
```env
RUNWAY_API_KEY=your_key
VEO_API_KEY=your_key
```
Then wire real calls in `backend/routes/ai.js`.

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play / Pause |
| `←` `→` | Step frame |
| `Delete` / `Backspace` | Delete selected clip |
| Right-click clip | Delete clip |
| Double-click folder | Rename folder |
| Double-click project | Rename project |

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | — | Create account |
| POST | `/api/auth/login` | — | Sign in |
| GET | `/api/auth/me` | ✓ | Current user |
| PUT | `/api/auth/profile` | ✓ | Update profile |
| GET | `/api/projects` | ✓ | List projects |
| POST | `/api/projects` | ✓ | Create project |
| PUT | `/api/projects/:id` | ✓ | Save project |
| DELETE | `/api/projects/:id` | ✓ | Delete project |
| POST | `/api/ai/generate-video` | ✓ | Generate AI video |
| GET | `/api/ai/status/:jobId` | ✓ | Poll generation |
| GET | `/api/ai/credits` | ✓ | Credit balance |
| GET | `/api/creator/:handle` | — | Public profile |
| POST | `/api/creator/follow/:id` | ✓ | Follow/unfollow |
| PUT | `/api/creator/publish/:id` | ✓ | Publish project |

---

## 🔑 Code

```
Vidora
```

---

*Built with React 19 · Vite 6 · Express · MongoDB · Mongoose · JWT · bcrypt*
