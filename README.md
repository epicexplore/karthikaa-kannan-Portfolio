# Karthikaa Kannan - Personal Portfolio

A modern, full-stack personal portfolio website with dynamic content management, built with Node.js, Express, SQLite, and Vanilla JavaScript.

## Features

### Frontend
- **Modern Dark UI**: Sleek dark theme with neon purple/pink gradient accents
- **Preloader Animation**: Smooth loading experience with animated progress bar
- **Custom Cursor**: Interactive cursor with ring effect
- **Scroll Progress Bar**: Visual indicator of page scroll position
- **Dynamic Hero Section**: 
  - Animated tagline with rotating words
  - Count-up statistics animation
- **Smooth Animations**: Fade-in effects on scroll, 3D tilt on cards
- **Responsive Design**: Mobile-first approach, works on all devices
- **SEO Optimized**: Meta tags, OpenGraph, and Twitter Card support

### Backend
- **RESTful API**: Full CRUD operations for achievements and testimonials
- **SQLite Database**: Lightweight, file-based database
- **Contact Form**: Store contact messages in database

### Admin Panel
- **Achievements Management**: Add, edit, delete achievements
- **Testimonials Management**: Add, edit, delete client testimonials
- **User-Friendly Interface**: Clean, intuitive admin dashboard

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Fonts**: Google Fonts (Inter, Outfit)
- **Icons**: Font Awesome 6

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd d:/Website/kk2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```

4. **Access the application**:
   - **Public Site**: http://localhost:3000
   - **Admin Panel**: http://localhost:3000/admin.html

## Project Structure

```
kk2/
├── public/                 # Static files
│   ├── css/
│   │   ├── style.css      # Main styles
│   │   └── additions.css  # Additional styles (preloader, cursor, etc.)
│   ├── js/
│   │   ├── script.js      # Main frontend logic
│   │   └── admin.js       # Admin panel logic
│   ├── assets/            # Images and media
│   ├── index.html         # Main public page
│   └── admin.html         # Admin dashboard
├── db/
│   ├── database.js        # Database initialization and seeding
│   └── portfolio.db       # SQLite database file (auto-created)
├── server.js              # Express server
├── package.json           # Dependencies
└── README.md              # This file
```

## API Endpoints

### Achievements
- `GET /api/achievements` - Get all achievements
- `POST /api/achievements` - Create new achievement
- `PUT /api/achievements/:id` - Update achievement
- `DELETE /api/achievements/:id` - Delete achievement

### Testimonials
- `GET /api/testimonials` - Get all testimonials
- `POST /api/testimonials` - Create new testimonial
- `PUT /api/testimonials/:id` - Update testimonial
- `DELETE /api/testimonials/:id` - Delete testimonial

### Contact
- `POST /api/contact` - Submit contact form

## Database Schema

### Achievements Table
```sql
id              INTEGER PRIMARY KEY AUTOINCREMENT
title           TEXT NOT NULL
description     TEXT
year            INTEGER
highlight       INTEGER DEFAULT 0
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Testimonials Table
```sql
id              INTEGER PRIMARY KEY AUTOINCREMENT
name            TEXT NOT NULL
role            TEXT
message         TEXT NOT NULL
rating          INTEGER DEFAULT 5
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

### Contacts Table
```sql
id              INTEGER PRIMARY KEY AUTOINCREMENT
name            TEXT NOT NULL
email           TEXT NOT NULL
subject         TEXT
message         TEXT NOT NULL
created_at      DATETIME DEFAULT CURRENT_TIMESTAMP
```

## Features Breakdown

### Animations & Interactions
- **Preloader**: Glitch effect on name, smooth progress bar
- **Custom Cursor**: Dot + ring that expands on hover
- **Scroll Progress**: Top bar fills as user scrolls
- **Dynamic Tagline**: Words rotate every 3 seconds
- **Stats Counter**: Numbers count up from 0 to target
- **3D Tilt**: Cards tilt based on mouse position
- **Testimonials Slider**: Auto-rotating carousel with manual controls

### Sections
1. **Hero**: Name, dynamic tagline, stats, CTAs
2. **About**: Bio, achievements, mission statement
3. **Services**: 6 service cards with icons
4. **Journey**: Timeline of career milestones
5. **Achievements**: Dynamic grid loaded from database
6. **Testimonials**: Slider with ratings
7. **Contact**: Form with social links

## Development

For development with auto-restart on file changes:

```bash
npm run dev
```

(Requires `nodemon` to be installed)

## Customization

### Colors
Edit CSS variables in `public/css/style.css`:
```css
:root {
    --bg-dark: #0a0a0a;
    --primary-color: #8b5cf6;
    --secondary-color: #ec4899;
    /* ... */
}
```

### Content
- **Static Content**: Edit `public/index.html`
- **Dynamic Content**: Use the admin panel at `/admin.html`

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - Feel free to use this project for your own portfolio!

## Author

**Karthikaa Kannan**
- Entrepreneur, Content Creator & Freelancer
- 17-year-old building brands, stories, and opportunities

---

Built with ❤️ using modern web technologies

## Deployment Guide (cPanel)

This portfolio is ready to be deployed to any cPanel hosting that supports Node.js.

### 1. Preparation
1. **Stop Local Server**: Press `Ctrl + C` in your terminal.
2. **Zip Project**: Create a zip file of the `kk2` folder.
   > **IMPORTANT**: EXTRACT `node_modules` from the zip! You must not upload `node_modules`.
   > **Include**: `public`, `db`, `server.js`, `package.json`, `.env`.

### 2. Upload to cPanel
1. Login to **cPanel > File Manager**.
2. Navigate to your desired folder (recommended: `/home/user/apps/portfolio`).
3. **Upload** and **Extract** your zip file there.

### 3. Setup Node.js App
1. Go to **cPanel > Setup Node.js App**.
2. Click **Create Application**.
   - **Version**: `18.x` or `20.x`.
   - **Mode**: `Production`.
   - **App Root**: Path to your extracted folder (e.g., `apps/portfolio`).
   - **App URL**: Choose your domain.
   - **Startup File**: `server.js`.
3. Click **Create**.

### 4. Install Dependencies
1. Copy the command shown at the top of the app page (starts with `source ...`).
2. Open **cPanel > Terminal**.
3. Paste the command to enter your virtual environment.
4. Run:
   ```bash
   npm install
   ```

### 5. Configure Secrets (Environment Variables)
1. Go back to **Setup Node.js App**.
2. Click "Edit" on your app.
3. Click "Add Variable" under **Environment Variables**:
   - `SESSION_SECRET`: (Random String)
   - `ADMIN_USER`: (Your Admin Username)
   - `ADMIN_PASS`: (Your Admin Password)
4. Click **Save** and then **Restart** the app.

### 6. Verify
Visit your URL. Your portfolio should be live!
