const API_BASE = '/api';

// State
let currentEditId = null;
let currentType = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initial Load
    loadAchievements();
    loadTestimonials();
    loadSocials();
    loadUsers();
    loadSettings();

    // Tab Navigation
    document.querySelectorAll('.nav-link:not(.logout-link)').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Remove active
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.style.display = 'none');

            // Add active
            e.currentTarget.classList.add('active');
            const tab = e.currentTarget.dataset.tab;
            document.getElementById(`${tab}-section`).style.display = 'block';
        });
    });

    document.getElementById('cancel-modal').addEventListener('click', closeModal);
    document.getElementById('admin-form').addEventListener('submit', handleFormSubmit);
});

async function logout() {
    try { await fetch('/api/logout', { method: 'POST' }); }
    catch (e) { }
    window.location.href = '/login.html';
}

// Data Loaders
async function loadAchievements() {
    const data = await fetchAPI('/achievements');
    renderTable('achievements-table-body', data.data, (item) => `
        <td>${item.year}</td>
        <td>${item.title}</td>
        <td>${item.description.substring(0, 30)}...</td>
        <td><i class="fas ${item.icon}"></i></td>
        <td><a href="${item.link}" target="_blank">View</a></td>
        <td class="actions">
            <button class="btn-icon edit" onclick="editItem('achievement', ${item.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="deleteItem('achievement', ${item.id})"><i class="fas fa-trash"></i></button>
        </td>
    `);
}

async function loadTestimonials() {
    const data = await fetchAPI('/testimonials');
    renderTable('testimonials-table-body', data.data, (item) => `
        <td>${item.name}</td>
        <td>${item.role}</td>
        <td>${item.message.substring(0, 30)}...</td>
        <td class="actions">
            <button class="btn-icon edit" onclick="editItem('testimonial', ${item.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="deleteItem('testimonial', ${item.id})"><i class="fas fa-trash"></i></button>
        </td>
    `);
}

async function loadSocials() {
    const data = await fetchAPI('/socials');
    // In loadSocials
    renderTable('socials-table-body', data.data, (item) => `
        <td>${item.platform}</td>
        <td>${item.url}</td>
        <td><i class="fab ${item.icon}"></i> ${item.icon}</td>
        <td class="actions">
            <button class="btn-icon edit" onclick="editItem('social', ${item.id})"><i class="fas fa-edit"></i></button>
            <button class="btn-icon delete" onclick="deleteItem('social', ${item.id})"><i class="fas fa-trash"></i></button>
        </td>
    `);
}

// ... existing code ...

// In editItem


async function loadUsers() {
    const data = await fetchAPI('/users');
    renderTable('users-table-body', data.data, (item) => `
        <td>${item.username}</td>
        <td>${new Date(item.created_at).toLocaleDateString()}</td>
        <td class="actions">
            <button class="btn-icon delete" onclick="deleteItem('user', ${item.id})"><i class="fas fa-trash"></i></button>
        </td>
    `);
}

async function loadSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    const json = await res.json();
    if (json.success) {
        const d = json.data;
        if (d.seo_title) document.getElementById('seo_title').value = d.seo_title;
        if (d.seo_description) document.getElementById('seo_description').value = d.seo_description;
        if (d.seo_keywords) document.getElementById('seo_keywords').value = d.seo_keywords;
    }
}

// Helpers
async function fetchAPI(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`);
    return await res.json();
}

function renderTable(id, items, rowBuilder) {
    const tbody = document.getElementById(id);
    tbody.innerHTML = '';
    if (items) items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = rowBuilder(item);
        tbody.appendChild(tr);
    });
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();
    const els = e.target.elements;
    const formData = {};

    if (currentType === 'achievement') {
        formData.title = els['title'].value;
        formData.year = els['year'].value;
        formData.description = els['description'].value;
        formData.icon = els['icon'].value;
        formData.link = els['link'].value;
        formData.highlight = 0;
    } else if (currentType === 'testimonial') {
        formData.name = els['name'].value;
        formData.role = els['role'].value;
        formData.message = els['message'].value;
    } else if (currentType === 'social') {
        formData.platform = els['platform'].value;
        formData.url = els['url'].value;
        formData.icon = els['icon'].value;
    } else if (currentType === 'user') {
        formData.username = els['username'].value;
        formData.password = els['password'].value;
    }

    const method = currentEditId ? 'PUT' : 'POST';
    const url = currentEditId
        ? `${API_BASE}/${currentType}s/${currentEditId}`
        : `${API_BASE}/${currentType}s`;

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await res.json();
        if (result.success) {
            closeModal();
            refreshAll();
        } else {
            alert('Error: ' + result.error);
        }
    } catch (err) { alert('Failed to save'); }
}

window.saveSettings = async function () {
    const data = {
        seo_title: document.getElementById('seo_title').value,
        seo_description: document.getElementById('seo_description').value,
        seo_keywords: document.getElementById('seo_keywords').value
    };
    try {
        await fetch(`${API_BASE}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert('Settings Saved!');
    } catch (e) { alert('Failed to save settings'); }
};

window.deleteItem = async (type, id) => {
    if (!confirm('Delete this item?')) return;
    await fetch(`${API_BASE}/${type}s/${id}`, { method: 'DELETE' });
    refreshAll();
};

window.editItem = async (type, id) => {
    currentType = type;
    currentEditId = id;
    // Just re-fetch list for simplicity of finding item, or fetch single if needed
    // For now assuming finding in refreshed list is okay, but to be robust let's fetch list
    const data = await fetchAPI(`/${type}s`);
    const item = data.data.find(i => i.id === id);
    if (item) {
        setupFormFor(type);
        openModal(type); // Reset form
        // Populate
        const els = document.getElementById('admin-form').elements;
        // ... (Population logic similar to before, simplified for brevity in this replace)
        // Note: For full robustness I should reimplement the population map.
        // Let's rely on the previous implementation structure but adapted.
        if (type === 'achievement') {
            els['title'].value = item.title;
            els['year'].value = item.year;
            els['description'].value = item.description;
            els['icon'].value = item.icon;
            els['link'].value = item.link;
        } else if (type === 'testimonial') {
            els['name'].value = item.name;
            els['role'].value = item.role;
            els['message'].value = item.message;
        } else if (type === 'social') {
            els['platform'].value = item.platform;
            els['url'].value = item.url;
            els['icon'].value = item.icon;
        }
        currentEditId = id; // Ensure ID is set after openModal clears it
    }
};

function refreshAll() {
    loadAchievements();
    loadTestimonials();
    loadSocials();
    loadUsers();
}

window.openModal = function (type) {
    currentType = type;
    currentEditId = null;
    setupFormFor(type);
    document.getElementById('admin-form').reset();
    document.getElementById('modal-title').innerText = `Add ${type}`;
    document.getElementById('modal-overlay').style.display = 'flex';
};

window.closeModal = function () {
    document.getElementById('modal-overlay').style.display = 'none';
};

function setupFormFor(type) {
    const c = document.getElementById('dynamic-fields');
    c.innerHTML = '';
    let html = '';
    if (type === 'achievement') {
        html = `<input type="number" name="year" placeholder="Year" required class="form-control mb-2">
                <input type="text" name="title" placeholder="Title" required class="form-control mb-2">
                <textarea name="description" placeholder="Description" class="form-control mb-2"></textarea>
                <input type="text" name="icon" placeholder="Icon (fa-trophy)" class="form-control mb-2">
                <input type="text" name="link" placeholder="Link" class="form-control mb-2">`;
    } else if (type === 'testimonial') {
        html = `<input type="text" name="name" placeholder="Name" required class="form-control mb-2">
                <input type="text" name="role" placeholder="Role" class="form-control mb-2">
                <textarea name="message" placeholder="Message" required class="form-control mb-2"></textarea>`;
    } else if (type === 'social') {
        html = `<input type="text" name="platform" placeholder="Platform (e.g. GitHub)" required class="form-control mb-2">
                <input type="text" name="url" placeholder="URL" required class="form-control mb-2">
                <input type="text" name="icon" placeholder="Icon Class (fa-github)" required class="form-control mb-2">`;
    } else if (type === 'user') {
        html = `<input type="text" name="username" placeholder="Username" required class="form-control mb-2">
                <input type="password" name="password" placeholder="Password" required class="form-control mb-2">`;
    }
    c.innerHTML = html;
}
