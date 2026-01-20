<div id="top"></div>

<div align="left">

# ![Typing SVG](https://readme-typing-svg.demolab.com/?lines=Ramadan+Planner+2026+🌙;Track+your+daily+activities+🌙+✨+🕌;&color=D4AF37&weight=1200&font=Cairo&center=false&width=435&height=50&duration=2000&pause=500)

A modern **Ramadan Planner 2026** built with React to help you track your worship and daily plans across the 30 days of Ramadan. Includes a 30-day calendar, daily tracker, Qur’an Juz’ progress (with completion modal), prayer table, adhkar library, and an Eid preparation checklist .

<img src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=react&logoColor=black" alt="React">
<img src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=vite&logoColor=white" alt="Vite">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=javascript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=json&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/Redux_Toolkit-764ABC.svg?style=flat&logo=redux&logoColor=white" alt="Redux Toolkit">
<img src="https://img.shields.io/badge/React_Router-CA4245.svg?style=flat&logo=react-router&logoColor=white" alt="React Router">
<img src="https://img.shields.io/badge/CSS_Modules-000000.svg?style=flat&logo=cssmodules&logoColor=white" alt="CSS Modules">

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Run The App](#run)
- [Project Structure](#projectstructure)
- [License](#license)

---

## Overview

Ramadan Planner 2026 is a simple React app to help you stay consistent during Ramadan by tracking your daily worship, plans, and progress across the 30 days.

- Pick your Ramadan start date (used to calculate the current day)
- Use the Calendar to jump to any day (and see progress status)
- Track your daily plans & worship (Suhoor/Iftar, prayers, du’a, charity, gratitude, self-improvement)
- Plan and complete your Qur’an Juz’ across Ramadan (with progress bar + completion modal)
- Keep everything saved automatically using Redux Toolkit + localStorage
- Prepare for Eid with a simple Eid checklist
  
---

## Features

- Ramadan Calendar (30-day grid)
  - Shows Today, Selected day, and a time-based status (not started / partial / complete)
  - Highlights nights in the last 10 that may be Laylatul Qadr candidates (🌙)
- Daily Tracker (per day)
  - Suhoor plan + Iftar plan (save multiple entries)
  - Prayer checklist (Fajr, Dhuhr, Asr, Maghrib, Isha, Taraweeh, Witr)
  - Du’a list (save multiple entries) + quick link to Adhkar
  - Charity / good deeds + gratitude + self-improvement notes
  - Auto “Past day” Summary section (prayers, assigned Juz completion, dhikr done/missed, charity items)
- Quran Tracker (30 Juz’)
  - Progress bar (x / 30 Juz’)
  - Mark Juz as completed
  - Assign a Juz to the currently selected day (and prevent assigning the same Juz to multiple days)
  - Responsive layout (tables on desktop, cards on mobile)
  - Shows a congratulations modal when 30/30 is completed
- Prayer Tracker (table)
  - Table view to quickly mark the 5 daily prayers across all 30 days
- Adhkar (Dhikr)
  - Built-in adhkar sections (Morning/Evening, Adhan, Prayer, Wudu)
  - Add/remove specific dhikr to the current day so it appears inside the Daily Tracker
- Eid Preparation Checklist
  - Simple checklist with completion counter + completion message
- Persistence
  - Your data is saved to localStorage automatically (no backend needed)

--- 

## 🚀Getting Started

### Prerequisites

- **Node.js** 
- **npm** 

### Installation

1. **Clone the repository:**

    ```sh
     git clone https://github.com/AAshry10/Foodies-App.git
    ```

2. **Navigate to the project Backend directory (If not already navigated):**

    ```sh
     cd Ramadan-Planner-2026
    ```

3. **Install the dependencies:**

   ```sh
    npm install
   ```
### Run 
  
4. Run the project with:

   ```sh
    npm run dev
   ```

**Navigate to your [localhost:5173](https://localhost:5173)**

--- 

## 🏗️Project Structure

```sh
ramadanPlanner/
  ├── src/
  │   ├── assets/
  │   ├── components/
  │   │   ├── Adhkar/
  │   │   ├── CalendarGrid/
  │   │   ├── DailyTracker/
  │   │   ├── EidCheclist/
  │   │   ├── PryerTracker/
  │   │   ├── QuranCompletionModal/
  │   │   └── QuranTracker/
  │   ├── jsonDB/
  │   │   └── Athkar.json
  │   ├── layout/
  │   │   └── AppLayout.jsx
  │   ├── store/
  │   │   ├── ramadanSlice.js
  │   │   └── store.js
  │   ├── utils/
  │   │   └── ramadanDates.js
  │   ├── App.jsx
  │   ├── main.jsx
  │   └── router.jsx
  ├── index.html
  ├── package.json
  ├── vite.config.js
  └── .gitignore
```

---

## 🧾License

[MIT License](https://choosealicense.com/licenses). For more details, refer to the [LICENSE](./LICENSE) file.

---

💖 *Built with love by [Ahmed ELashry](https://github.com/AAshry10)*  

---


