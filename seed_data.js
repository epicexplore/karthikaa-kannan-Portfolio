const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'db', 'portfolio.db');
const db = new sqlite3.Database(dbPath);

const achievements = [
    {
        title: 'Eureka Jr Finalist',
        description: 'Top 0.04% finalist at one of India\'s premier entrepreneurship competitions hosted by IIT Bombay',
        year: 2024,
        highlight: 1
    },
    {
        title: 'Brand Ambassador - CODLYNX',
        description: 'Representing a fast-growing 5-figure digital agency',
        year: 2024,
        highlight: 1
    },
    {
        title: 'Featured in CampusTalk UAE Newsletter',
        description: 'Journey featured in prominent educational newsletter',
        year: 2024,
        highlight: 0
    },
    {
        title: '100+ Projects Delivered',
        description: 'Successfully completed over 100 creative projects across various niches',
        year: 2024,
        highlight: 0
    }
];

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

db.serialize(() => {
    // Clear existing
    db.run("DELETE FROM achievements");
    db.run("DELETE FROM testimonials");

    // Seed Achievements
    const stmtA = db.prepare('INSERT INTO achievements (title, description, year, highlight) VALUES (?, ?, ?, ?)');
    achievements.forEach(a => {
        stmtA.run(a.title, a.description, a.year, a.highlight);
    });
    stmtA.finalize();
    console.log("Achievements seeded.");

    // Seed Testimonials
    const stmtT = db.prepare('INSERT INTO testimonials (name, role, message, rating) VALUES (?, ?, ?, ?)');
    testimonials.forEach(t => {
        stmtT.run(t.name, t.role, t.message, t.rating);
    });
    stmtT.finalize();
    console.log("Testimonials seeded.");
});

db.close();
