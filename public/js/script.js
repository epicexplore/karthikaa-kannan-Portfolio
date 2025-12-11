// ==================== PRELOADER ====================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const preloaderProgress = document.querySelector('.preloader-progress');

    // Simulate loading progress
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress > 100) progress = 100;
        preloaderProgress.style.width = progress + '%';

        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 500);
            }, 500);
        }
    }, 200);
});

// ==================== CUSTOM CURSOR ====================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = e.clientX + 'px';
    cursorDot.style.top = e.clientY + 'px';

    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top = e.clientY + 'px';
});

// Expand cursor on hover over clickable elements
const clickables = document.querySelectorAll('a, button, .service-card, .testimonial-card, .achievement-card');
clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// ==================== SCROLL PROGRESS BAR ====================
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
});

// ==================== MOBILE MENU ====================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('active');
    });
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('active');
            }

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ==================== DYNAMIC TAGLINE ====================
const dynamicWords = ['brands', 'stories', 'movements', 'experiences', 'opportunities'];
let wordIndex = 0;
const dynamicWord = document.getElementById('dynamicWord');

setInterval(() => {
    wordIndex = (wordIndex + 1) % dynamicWords.length;
    dynamicWord.style.opacity = '0';
    setTimeout(() => {
        dynamicWord.textContent = dynamicWords[wordIndex];
        dynamicWord.style.opacity = '1';
    }, 300);
}, 3000);

// ==================== STATS COUNTER ====================
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const animateStats = () => {
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target + '+';
            }
        };
        updateCounter();
    });
};

// Trigger stats animation on scroll
const heroSection = document.querySelector('.hero');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (heroSection) observer.observe(heroSection);

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

const sections = document.querySelectorAll('.section, .hero');
sections.forEach(section => {
    section.classList.add('fade-in-section');
    scrollObserver.observe(section);
});

// ==================== 3D TILT EFFECT ====================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card, .testimonial-card, .achievement-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});

// ==================== FETCH ACHIEVEMENTS ====================
async function loadAchievements() {
    try {
        const response = await fetch('/api/achievements');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            const grid = document.getElementById('achievementsGrid');
            grid.innerHTML = '';

            data.data.forEach(achievement => {
                const card = document.createElement('div');
                card.className = 'achievement-card' + (achievement.highlight ? ' highlight' : '');
                card.innerHTML = `
                    ${achievement.highlight ? '<div class="badge">Featured</div>' : ''}
                    <div class="achievement-year">${achievement.year}</div>
                    <h3>${achievement.title}</h3>
                    <p>${achievement.description}</p>
                `;
                grid.appendChild(card);
            });
        }
    } catch (error) {
        console.error('Error loading achievements:', error);
        document.getElementById('achievementsGrid').innerHTML = '<p class="error">Failed to load achievements</p>';
    }
}

// ==================== FETCH TESTIMONIALS ====================
let currentTestimonial = 0;
let testimonials = [];

async function loadTestimonials() {
    try {
        const response = await fetch('/api/testimonials');
        const data = await response.json();

        if (data.success && data.data.length > 0) {
            testimonials = data.data;
            renderTestimonials();
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        document.getElementById('testimonialsSlider').innerHTML = '<p class="error">Failed to load testimonials</p>';
    }
}

function renderTestimonials() {
    const slider = document.getElementById('testimonialsSlider');
    slider.innerHTML = '';

    testimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'testimonial-card' + (index === currentTestimonial ? ' active' : '');
        card.innerHTML = `
            <div class="quote-icon"><i class="fa-solid fa-quote-left"></i></div>
            <p>"${testimonial.message}"</p>
            <div class="rating">
                ${'<i class="fas fa-star"></i>'.repeat(testimonial.rating)}
            </div>
            <div class="client-info">
                <h4>${testimonial.name}</h4>
                <span>${testimonial.role}</span>
            </div>
        `;
        slider.appendChild(card);
    });
}

function showTestimonial(index) {
    const cards = document.querySelectorAll('.testimonial-card');
    cards.forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });
}

document.getElementById('prevBtn')?.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
    showTestimonial(currentTestimonial);
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
});

// Auto-rotate testimonials
setInterval(() => {
    if (testimonials.length > 0) {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }
}, 5000);

// ==================== CONTACT FORM ====================
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const submitBtn = document.getElementById('submitBtn');

contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        subject: document.getElementById('contactSubject').value,
        message: document.getElementById('contactMessage').value
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (data.success) {
            formMessage.className = 'form-message success';
            formMessage.textContent = data.message;
            contactForm.reset();

            submitBtn.textContent = 'Sent!';
            setTimeout(() => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                formMessage.textContent = '';
            }, 3000);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Failed to send message. Please try again.';
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
    }
});

// ==================== LOAD DYNAMIC CONTENT ====================
window.addEventListener('DOMContentLoaded', () => {
    loadAchievements();
    loadTestimonials();
});
