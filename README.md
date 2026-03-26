# ECAP — Educational Content & Academic Portal

A minimal, accessible academic portal built with React + Vite. Inspired by Apple's design language.

---

## Features

| Feature | Access | Description |
|---------|--------|-------------|
| Browse Subjects | Public | Search & filter courses by department — no login needed |
| Course Materials | Public | Download lecture notes, lab manuals, videos |
| Student Dashboard | Login | View CGPA, attendance, fee dues, qualifications |
| Achievements | Login | Add and view academic achievements |
| Reset Password | Login | Change password with validation |
| Admin — Student List | Admin | View, search, edit any student record |
| Admin — Bulk Upload | Admin | Add students via CSV paste or file upload |
| Admin — Event Logs | Admin | View all login/logout/modification events, export as .txt |
| Dark / Light Mode | All | Toggle theme with one click |

## Design Principles

- **Apple-minimal aesthetic** — clean whitespace, frosted-glass nav, subtle borders
- **Segoe UI font** — screen-reader friendly, accessible
- **Black text only** — links in blue (`#06c` light / `#2997ff` dark)
- **Fully responsive** — works on mobile, tablet, desktop

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/ecap-portal.git
cd ecap-portal

# 2. Install
npm install

# 3. Run
npm run dev
```

Open http://localhost:3000

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Student | aarav@ecap.edu | pass123 |
| Student | priya@ecap.edu | pass123 |
| Admin | admin@ecap.edu | admin123 |

---

## Project Structure

```
ecap-portal/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Icon.jsx          # SVG icon component
│   ├── data/
│   │   └── seedData.js       # 10 students + subjects (simulates MySQL)
│   ├── utils/
│   │   ├── logger.js         # Event logger (all logins/logouts/edits)
│   │   └── theme.js          # Light/dark color tokens
│   ├── App.jsx               # Main application (all pages)
│   ├── main.jsx              # Entry point
│   └── index.css             # Global styles
├── sql/
│   └── schema.sql            # MySQL schema + seed data
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── README.md
```

---

## MySQL Setup (for production)

The `sql/schema.sql` file contains the complete database schema with:

- `students` — student records (10 pre-seeded)
- `achievements` — student achievements
- `subjects` — course catalog
- `materials` — downloadable resources
- `event_logs` — all system events
- `admins` — admin accounts

### Free MySQL hosting options:

| Provider | Free Tier |
|----------|-----------|
| [PlanetScale](https://planetscale.com) | 1 database, 1 billion row reads/mo |
| [Railway](https://railway.app) | $5 free credits/mo |
| [Aiven](https://aiven.io) | 1 free MySQL instance |
| [TiDB Cloud](https://tidbcloud.com) | Serverless tier free |
| [FreeSQLDatabase](https://freesqldatabase.com) | 5 MB free MySQL |

Run the schema:
```bash
mysql -u root -p < sql/schema.sql
```

---

## GitHub Deployment

### Upload to GitHub:

```bash
cd ecap-portal
git init
git add .
git commit -m "Initial commit — ECAP Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ecap-portal.git
git push -u origin main
```

### Deploy for free (static hosting):

**GitHub Pages (via Vite):**
1. In `vite.config.js`, add: `base: '/ecap-portal/'`
2. Run: `npm run build`
3. Push the `dist/` folder or use `gh-pages` package

**Vercel (recommended):**
1. Connect your GitHub repo at [vercel.com](https://vercel.com)
2. It auto-detects Vite — zero config needed
3. Every push deploys automatically

**Netlify:**
1. Connect repo at [netlify.com](https://netlify.com)
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## Connecting MySQL Backend (Next Steps)

To move from simulated data to a real MySQL backend:

1. Create a backend (Node.js + Express recommended):
   ```
   npm install express mysql2 cors bcrypt jsonwebtoken
   ```

2. Build API routes:
   - `POST /api/login` — authenticate against `students`/`admins` table
   - `GET /api/students` — fetch student list
   - `POST /api/students/bulk` — bulk CSV upload
   - `PUT /api/students/:id` — edit student
   - `GET /api/subjects` — public subject list
   - `POST /api/logs` — write event log
   - `GET /api/logs` — read event logs (admin only)

3. Replace `seedData.js` imports with `fetch()` calls in `App.jsx`

---

## Event Logging

Every action is logged with timestamp, event type, user, and details:

- `SYSTEM_START` — portal initialized
- `LOGIN` / `LOGIN_FAILED` / `LOGOUT`
- `PASSWORD_RESET`
- `DATA_MODIFIED` — any student record edit
- `BULK_UPLOAD` — CSV import
- `ACHIEVEMENT_ADDED`
- `THEME_TOGGLE`
- `LOG_EXPORT`

Logs are exportable as `.txt` from the Admin panel.

---

## License

MIT
