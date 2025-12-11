// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const db = require('./db/database');

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
    db.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, row) => {
        if (err) return res.status(500).json({ success: false, error: err.message });

        if (row) {
            req.session.isAdmin = true;
            req.session.username = row.username;
            res.json({ success: true });
        } else {
            res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
    });
});

/* 
// Old Login Route Removed - Consolidated Above
*/

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// ==================== ACHIEVEMENTS API ====================

// GET all achievements
app.get('/api/achievements', (req, res) => {
    db.all('SELECT * FROM achievements ORDER BY year DESC, created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, data: rows });
    });
});

// POST new achievement
app.post('/api/achievements', isAuthenticated, (req, res) => {
    const { title, description, year, highlight, icon, link } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const sql = 'INSERT INTO achievements (title, description, year, highlight, icon, link) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [title, description, year, highlight ? 1 : 0, icon || 'fa-trophy', link || '#'], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        res.json({
            success: true,
            message: 'Achievement created successfully',
            id: this.lastID
        });
    });
});

// PUT update achievement
app.put('/api/achievements/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { title, description, year, highlight, icon, link } = req.body;

    if (!title) {
        return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const sql = 'UPDATE achievements SET title = ?, description = ?, year = ?, highlight = ?, icon = ?, link = ? WHERE id = ?';
    db.run(sql, [title, description, year, highlight ? 1 : 0, icon || 'fa-trophy', link || '#', id], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ success: false, error: 'Achievement not found' });
            return;
        }
        res.json({ success: true, message: 'Achievement updated successfully' });
    });
});

// DELETE achievement
app.delete('/api/achievements/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM achievements WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ success: false, error: 'Achievement not found' });
            return;
        }
        res.json({ success: true, message: 'Achievement deleted successfully' });
    });
});

// ==================== TESTIMONIALS API ====================

// GET all testimonials
app.get('/api/testimonials', (req, res) => {
    db.all('SELECT * FROM testimonials ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ success: true, data: rows });
    });
});

// POST new testimonial
app.post('/api/testimonials', isAuthenticated, (req, res) => {
    const { name, role, message, rating } = req.body;

    if (!name || !message) {
        return res.status(400).json({ success: false, error: 'Name and message are required' });
    }

    const sql = 'INSERT INTO testimonials (name, role, message, rating) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, role, message, rating || 5], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        res.json({
            success: true,
            message: 'Testimonial created successfully',
            id: this.lastID
        });
    });
});

// PUT update testimonial
app.put('/api/testimonials/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;
    const { name, role, message, rating } = req.body;

    if (!name || !message) {
        return res.status(400).json({ success: false, error: 'Name and message are required' });
    }

    const sql = 'UPDATE testimonials SET name = ?, role = ?, message = ?, rating = ? WHERE id = ?';
    db.run(sql, [name, role, message, rating || 5, id], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ success: false, error: 'Testimonial not found' });
            return;
        }
        res.json({ success: true, message: 'Testimonial updated successfully' });
    });
});

// DELETE testimonial
app.delete('/api/testimonials/:id', isAuthenticated, (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM testimonials WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).json({ success: false, error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ success: false, error: 'Testimonial not found' });
            return;
        }
        res.json({ success: true, message: 'Testimonial deleted successfully' });
    });
});

// ==================== SOCIALS API ====================

app.get('/api/socials', (req, res) => {
    db.all('SELECT * FROM socials ORDER BY created_at ASC', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: rows });
    });
});

app.post('/api/socials', isAuthenticated, (req, res) => {
    const { platform, url, icon } = req.body;
    db.run('INSERT INTO socials (platform, url, icon) VALUES (?, ?, ?)', [platform, url, icon], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

app.delete('/api/socials/:id', isAuthenticated, (req, res) => {
    db.run('DELETE FROM socials WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

app.put('/api/socials/:id', isAuthenticated, (req, res) => {
    const { platform, url, icon } = req.body;
    db.run('UPDATE socials SET platform = ?, url = ?, icon = ? WHERE id = ?', [platform, url, icon, req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// ==================== USERS API ====================

app.get('/api/users', isAuthenticated, (req, res) => {
    // Security: Don't return passwords
    db.all('SELECT id, username, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, data: rows });
    });
});

app.post('/api/users', isAuthenticated, (req, res) => {
    const { username, password } = req.body;
    // Basic duplication check
    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true, id: this.lastID });
    });
});

app.delete('/api/users/:id', isAuthenticated, (req, res) => {
    // Prevent self-deletion if there's only 1 admin? For now, allow simple delete.
    db.run('DELETE FROM users WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json({ success: true });
    });
});

// ==================== SETTINGS API (SEO) ====================

app.get('/api/settings', (req, res) => {
    db.all('SELECT * FROM settings', [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        // Transform array to object { key: value }
        const settings = {};
        rows.forEach(row => settings[row.key] = row.value);
        res.json({ success: true, data: settings });
    });
});

app.post('/api/settings', isAuthenticated, (req, res) => {
    const settings = req.body; // Expects { seo_title: 'Val', ... }
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');

    db.serialize(() => {
        db.run('BEGIN TRANSACTION');
        Object.keys(settings).forEach(key => {
            stmt.run(key, settings[key]);
        });
        db.run('COMMIT', (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.json({ success: true });
        });
        stmt.finalize();
    });
});

// Login logic is now consolidated at the top.

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving static files from 'public' directory`);
    console.log(`💾 Database: SQLite (db/portfolio.db)\n`);
});
