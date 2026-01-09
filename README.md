# FlixBattle 🎬🔥

FlixBattle is an interactive voting platform where users compare two options,
vote for their favorite, share opinions, and see what the community thinks.

Battles can be about movies, actors, TV series, singers — or anything users create themselves.

---

## 🚀 Overview

FlixBattle lets users:
- Pick a side in head-to-head battles
- Vote once per battle
- Share opinions and like others’ opinions
- Create custom battles
- Discover trending and popular battles

FlixBattle is an interactive comparison platform designed to explore how people make choices when presented with two competing options.

Users participate in head-to-head battles, cast a single deliberate vote, share their reasoning, and engage with community opinions through likes and live results. The experience emphasizes clarity, feedback, and thoughtful interaction rather than passive polling.

The app focuses heavily on **UX polish**, **mobile-first design**, and **clear user flows**.



## Why This Project?

This project was built to simulate real-world frontend challenges rather than follow a tutorial-style implementation.

The focus was on designing a system that:
- Handles user decisions intentionally (one vote per battle)
- Persists interaction state without a backend
- Manages edge cases such as missing data and invalid navigation
- Prioritizes mobile usability and interaction feedback
- Remains backend-ready without premature complexity

FlixBattle reflects a product-oriented mindset, emphasizing UX clarity, architectural thinking, and future scalability over feature quantity.


---

## ✨ Live Features

- 🎬 Movie, Actor, TV Series & Singer battles
- 🗳️ One-vote-per-user logic (client-side)
- 💬 Opinion system with likes
- 🆕 Create your own battles
- 🔥 Battle of the Day
- 📊 Popular & Recently Created battles
- 📱 Fully mobile-responsive UI
- ⚡ Smooth micro-interactions and animations

---

## ⭐ Key Features

### 🔥 Battle System
- Two options per battle
- Live vote percentage calculation
- Winner highlight
- Smooth progress bar animations

### 💬 Opinion & Like System
- Users can explain their choice
- Opinions can be liked by other users
- Top opinion is highlighted

### ✨ Custom Battles
- Users can create battles in any category
- Custom battles are merged into the main battle flow
- Clicking a recent battle opens the exact battle

### 📱 Mobile-First UX
- Thumb-friendly buttons
- Vertical flow on mobile
- Clean layout for small screens

---

## 🧠 How It Works

- Default battles are stored as static data
- Custom battles are saved in `localStorage`
- Battle navigation supports both index-based and ID-based access
- Votes, opinions, and likes persist per battle
- UI gracefully handles missing or invalid battles

---

## 🛠 Tech Stack

- **Frontend:** React (CRA)
- **Routing:** React Router
- **State Management:** React Hooks
- **Styling:** CSS (mobile-first)
- **Persistence:** localStorage (temporary, frontend-only)

---

## 🧱 Project Architecture

- `/pages` – Main pages (Home, Battle, CreateBattle, Trends)
- `/components` – Reusable UI components
- `/data` – Static battle data
- `/utils` – Storage, discovery, and helper logic
- `/styles` – Global and page-level styles

---

## ⚠️ Current Limitations

- Data is stored locally (no backend yet)
- Votes are limited per browser/device
- No real authentication or database persistence

---

## 🚧 Future Improvements

- Backend with Node.js, Express & MongoDB
- Real user authentication
- Global voting & opinions
- Shareable public battle links
- User profiles
- Admin moderation tools

---

## 🧪 How to Run Locally

```bash
git clone https://github.com/your-username/flixbattle.git
cd flixbattle
npm install
npm start
