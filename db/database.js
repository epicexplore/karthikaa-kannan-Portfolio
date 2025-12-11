const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'portfolio.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
    // Create achievements table
    // Create achievements table (Drop first to update schema)
    db.run('DROP TABLE IF EXISTS achievements', () => {
        db.run(`
            CREATE TABLE IF NOT EXISTS achievements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                year INTEGER,
                highlight INTEGER DEFAULT 0,
                icon TEXT DEFAULT 'fa-trophy',
                link TEXT DEFAULT '#',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating achievements table:', err.message);
            } else {
                console.log('Achievements table ready');
                seedAchievements();
            }
        });
    });

    // Create testimonials table
    db.run(`
        CREATE TABLE IF NOT EXISTS testimonials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT,
            message TEXT NOT NULL,
            rating INTEGER DEFAULT 5,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating testimonials table:', err.message);
        } else {
            console.log('Testimonials table ready');
            seedTestimonials();
        }
    });

    // Create contacts table
    db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating contacts table:', err.message);
        else console.log('Contacts table ready');
    });

    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating users table:', err.message);
        else {
            console.log('Users table ready');
            seedUsers();
        }
    });

    // Create socials table
    db.run(`
        CREATE TABLE IF NOT EXISTS socials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            platform TEXT NOT NULL,
            url TEXT NOT NULL,
            icon TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating socials table:', err.message);
        else {
            console.log('Socials table ready');
            seedSocials();
        }
    });

    // Create settings table (SEO)
    db.run(`
        CREATE TABLE IF NOT EXISTS settings (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    `, (err) => {
        if (err) console.error('Error creating settings table:', err.message);
        else {
            console.log('Settings table ready');
            seedSettings();
        }
    });
}

function seedUsers() {
    db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
        if (row && row.count === 0) {
            const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
            stmt.run('admin', 'admin123'); // Default admin
            stmt.finalize();
            console.log('Default admin user created');
        }
    });
}

function seedSocials() {
    db.get('SELECT COUNT(*) as count FROM socials', (err, row) => {
        if (row && row.count === 0) {
            const socials = [
                { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'fa-linkedin-in' },
                { platform: 'Twitter', url: 'https://twitter.com', icon: 'fa-twitter' },
                { platform: 'Instagram', url: 'https://instagram.com', icon: 'fa-instagram' }
            ];
            const stmt = db.prepare('INSERT INTO socials (platform, url, icon) VALUES (?, ?, ?)');
            socials.forEach(s => stmt.run(s.platform, s.url, s.icon));
            stmt.finalize();
            console.log('Default socials created');
        }
    });
}

function seedSettings() {
    db.get('SELECT COUNT(*) as count FROM settings', (err, row) => {
        if (row && row.count === 0) {
            const settings = [
                { key: 'seo_title', value: 'Karthikaa Portfolio | Creative Developer' },
                { key: 'seo_description', value: 'Personal portfolio highlighting web development and design projects.' },
                { key: 'seo_keywords', value: 'portfolio, developer, designer, react, node' }
            ];
            const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
            settings.forEach(s => stmt.run(s.key, s.value));
            stmt.finalize();
            console.log('Default settings created');
        }
    });
}

function seedAchievements() {
    db.get('SELECT COUNT(*) as count FROM achievements', (err, row) => {
        if (err) {
            console.error('Error checking achievements:', err.message);
            return;
        }

        if (row.count === 0) {
            const achievements = [
                {
                    title: 'Eureka Jr Finalist',
                    description: 'Top 0.04% finalist at one of India\'s premier entrepreneurship competitions hosted by IIT Bombay',
                    year: 2024,
                    highlight: 1,
                    icon: 'fa-trophy',
                    link: 'https://linkedin.com'
                },
                {
                    title: 'Brand Ambassador - CODLYNX',
                    description: 'Representing a fast-growing 5-figure digital agency',
                    year: 2024,
                    highlight: 1,
                    icon: 'fa-bullhorn',
                    link: '#'
                },
                {
                    title: 'Featured in CampusTalk UAE Newsletter',
                    description: 'Journey featured in prominent educational newsletter',
                    year: 2024,
                    highlight: 0,
                    icon: 'fa-newspaper',
                    link: '#'
                },
                {
                    title: '100+ Projects Delivered',
                    description: 'Successfully completed over 100 creative projects across various niches',
                    year: 2024,
                    highlight: 0,
                    icon: 'fa-project-diagram',
                    link: '#'
                },
                {
                    title: 'Featured in Tech Magazine',
                    description: 'Portfolio featured in leading tech publication for innovative design',
                    year: 2024,
                    highlight: 1,
                    icon: 'fa-newspaper',
                    link: 'https://example.com'
                },
                {
                    title: '500+ Community Members',
                    description: 'Built thriving student community across social platforms',
                    year: 2023,
                    highlight: 0,
                    icon: 'fa-users',
                    link: '#'
                },
                {
                    title: 'Award-Winning Designer',
                    description: 'Recognized for excellence in modern web design and creative branding',
                    year: 2024,
                    highlight: 1,
                    icon: 'fa-award',
                    link: '#'
                }
            ];

            const stmt = db.prepare('INSERT INTO achievements (title, description, year, highlight, icon, link) VALUES (?, ?, ?, ?, ?, ?)');
            achievements.forEach(achievement => {
                stmt.run(achievement.title, achievement.description, achievement.year, achievement.highlight, achievement.icon, achievement.link);
            });
            stmt.finalize();
            console.log('Sample achievements added');
        }
    });
}

function seedTestimonials() {
    db.get('SELECT COUNT(*) as count FROM testimonials', (err, row) => {
        if (err) {
            console.error('Error checking testimonials:', err.message);
            return;
        }

        if (row.count === 0) {
            const testimonials = [
                {
                    name: 'Bharath Ganesh',
                    role: 'CEO, Socialsphere',
                    message: 'I was truly surprised to see such immense levels of hard work, sincerity, and consistency in someone so young. From creative scriptwriting to experimenting with new applications and approaches, she has consistently shown not only creativity but also the discipline to refine and elevate her output.',
                    rating: 5
                },
                {
                    name: 'Shalini Robert',
                    role: 'Founder, The Robert\'s Trust',
                    message: 'What an inspiration you are! Every time I look at you, I wonder how you manage to do everything like a ROCKSTAR. The way your content is penned, edited, and communicated - ah, you\'re going to reach great heights, and I just can\'t wait for the world to celebrate you!',
                    rating: 5
                },
                {
                    name: 'Epaphra',
                    role: 'Founder, Townscholar',
                    message: 'Hope you are doing well! It was pleasure meeting you. Just saw few of your videos. You are onto great things. Keep at it.',
                    rating: 5
                }
            ];

            const stmt = db.prepare('INSERT INTO testimonials (name, role, message, rating) VALUES (?, ?, ?, ?)');
            testimonials.forEach(testimonial => {
                stmt.run(testimonial.name, testimonial.role, testimonial.message, testimonial.rating);
            });
            stmt.finalize();
            console.log('Sample testimonials added');
        }
    });
}

module.exports = db;
