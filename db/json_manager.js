const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'portfolio_data.json');

// Initial Schema
const defaultData = {
    users: [],
    socials: [],
    achievements: [],
    testimonials: [],
    settings: {}
};

// Ensure DB exists
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
}

class JsonDB {
    constructor() {
        this.data = this.load();
    }

    load() {
        try {
            return JSON.parse(fs.readFileSync(DB_FILE));
        } catch (e) {
            return defaultData;
        }
    }

    save() {
        fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2));
    }

    // --- GENERIC HELPERS ---

    getAll(collection) {
        return this.data[collection] || [];
    }

    getById(collection, id) {
        const list = this.data[collection] || [];
        return list.find(item => item.id == id);
    }

    add(collection, item) {
        if (!this.data[collection]) this.data[collection] = [];
        const list = this.data[collection];

        // Auto-increment ID adaptation
        const maxId = list.reduce((max, i) => Math.max(max, i.id || 0), 0);
        item.id = maxId + 1;
        item.created_at = new Date().toISOString();

        list.push(item);
        this.save();
        return item.id;
    }

    update(collection, id, updates) {
        if (!this.data[collection]) return false;

        const index = this.data[collection].findIndex(item => item.id == id);
        if (index === -1) return false;

        this.data[collection][index] = { ...this.data[collection][index], ...updates };
        this.save();
        return true;
    }

    delete(collection, id) {
        if (!this.data[collection]) return false;

        const initialLen = this.data[collection].length;
        this.data[collection] = this.data[collection].filter(item => item.id != id);

        if (this.data[collection].length !== initialLen) {
            this.save();
            return true;
        }
        return false;
    }

    // --- SPECIFIC QUERIES ---

    findUser(username, password) {
        return this.data.users.find(u => u.username === username && u.password === password);
    }

    getSettings() {
        return this.data.settings || {};
    }

    setSettings(newSettings) {
        this.data.settings = { ...this.data.settings, ...newSettings };
        this.save();
    }
}

module.exports = new JsonDB();
