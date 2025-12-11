// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./db/json_manager'); // CHANGED: Use JSON Manager

const app = express();
const PORT = process.env.PORT || 3001;
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_key';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin123';

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Setup
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Auth Middleware Definition
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.status(401).json({ success: false, error: 'Unauthorized access' });
};

// Route Protection (Before Static)
app.use((req, res, next) => {
    if (req.path === '/admin.html' && (!req.session || !req.session.isAdmin)) {
        return res.redirect('/login.html');
    }
    next();
});

app.use(express.static('public'));

// ==================== AUTH API ====================

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    // 1. Check Env Vars (Super Admin)
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;
        req.session.username = 'SuperAdmin';
        return res.json({ success: true });
    }

    // 2. Check Database Users
    const user = db.findUser(username, password);

    if (user) {
        req.session.isAdmin = true;
        req.session.username = user.username;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ==================== ACHIEVEMENTS API ====================

// GET all achievements
app.get('/api/achievements', (req, res) => {
    const rows = db.getAll('achievements');
    // Sort: year DESC
    rows.sort((a, b) => b.year - a.year);
    res.json({ success: true, data: rows });
});

// POST new achievement
app.post('/api/achievements', isAuthenticated, (req, res) => {
    const { title, description, year, highlight, icon, link } = req.body;

    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });

    const id = db.add('achievements', {
        title, description, year,
        highlight: highlight ? 1 : 0,
        icon: icon || 'fa-trophy',
        link: link || '#'
    });

    res.json({ success: true, message: 'Achievement created successfully', id });
});

// PUT update achievement
app.put('/api/achievements/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { title, description, year, highlight, icon, link } = req.body;

    if (!title) return res.status(400).json({ success: false, error: 'Title is required' });

    const success = db.update('achievements', id, {
        title, description, year,
        highlight: highlight ? 1 : 0,
        icon: icon || 'fa-trophy',
        link: link || '#'
    });

    if (!success) return res.status(404).json({ success: false, error: 'Achievement not found' });
    res.json({ success: true, message: 'Achievement updated successfully' });
});

// DELETE achievement
app.delete('/api/achievements/:id', isAuthenticated, (req, res) => {
    const success = db.delete('achievements', req.params.id);
    if (!success) return res.status(404).json({ success: false, error: 'Achievement not found' });
    res.json({ success: true, message: 'Achievement deleted successfully' });
});

// ==================== TESTIMONIALS API ====================

app.get('/api/testimonials', (req, res) => {
    const rows = db.getAll('testimonials');
    res.json({ success: true, data: rows });
});

app.post('/api/testimonials', isAuthenticated, (req, res) => {
    const { name, role, message, rating } = req.body;
    if (!name || !message) return res.status(400).json({ success: false, error: 'Name required' });

    const id = db.add('testimonials', { name, role, message, rating: rating || 5 });
    res.json({ success: true, message: 'Testimonial created', id });
});

app.put('/api/testimonials/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { name, role, message, rating } = req.body;
    if (!name || !message) return res.status(400).json({ success: false, error: 'Name required' });

    const success = db.update('testimonials', id, { name, role, message, rating: rating || 5 });
    if (!success) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Updated' });
});

app.delete('/api/testimonials/:id', isAuthenticated, (req, res) => {
    const success = db.delete('testimonials', req.params.id);
    if (!success) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, message: 'Deleted' });
});

// ==================== SOCIALS API ====================

app.get('/api/socials', (req, res) => {
    res.json({ success: true, data: db.getAll('socials') });
});

app.post('/api/socials', isAuthenticated, (req, res) => {
    const { platform, url, icon } = req.body;
    const id = db.add('socials', { platform, url, icon });
    res.json({ success: true, id });
});

app.delete('/api/socials/:id', isAuthenticated, (req, res) => {
    db.delete('socials', req.params.id);
    res.json({ success: true });
});

app.put('/api/socials/:id', isAuthenticated, (req, res) => {
    const { platform, url, icon } = req.body;
    db.update('socials', req.params.id, { platform, url, icon });
    res.json({ success: true });
});

// ==================== USERS API ====================

app.get('/api/users', isAuthenticated, (req, res) => {
    // Return safe data
    const users = db.getAll('users').map(u => ({ id: u.id, username: u.username, created_at: u.created_at }));
    res.json({ success: true, data: users });
});

app.post('/api/users', isAuthenticated, (req, res) => {
    const { username, password } = req.body;
    const id = db.add('users', { username, password });
    res.json({ success: true, id });
});

app.delete('/api/users/:id', isAuthenticated, (req, res) => {
    db.delete('users', req.params.id);
    res.json({ success: true });
});

// ==================== SETTINGS API ====================

app.get('/api/settings', (req, res) => {
    res.json({ success: true, data: db.getSettings() });
});

app.post('/api/settings', isAuthenticated, (req, res) => {
    db.setSettings(req.body);
    res.json({ success: true });
});

// Export for Serverless
module.exports = app;

// Only start server if NOT running as a Lambda (Local/cPanel)
if (!process.env.LAMBDA_TASK_ROOT) {
    app.listen(PORT, () => {
        console.log(`\n🚀 Server running on http://localhost:${PORT}`);
        console.log(`📁 Serving static files from 'public' directory`);
        console.log(`💾 Database: JSON (db/portfolio_data.json)\n`);
    });
}
