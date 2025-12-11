// =========================================
// 1. INITIALIZATION & UTILS
// =========================================

// Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

// Force Execution Check
console.log("Main.js Version 13 - 3D CAROUSEL LOADED");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Loaded - Initializing...");
    const loader = document.getElementById('loader');
    if (loader) setTimeout(() => loader.classList.add('hidden'), 500);

    initThreeJSBackground();
    init3DTilt();
    initScrollAnimations();

    // Explicit calls with logs
    console.log("Calling fetchAchievements...");
    fetchAchievements();

    console.log("Calling fetchTestimonials...");
    fetchTestimonials();
});

// Fallback: If DOMContentLoaded already fired (rare but possible in some cache states)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log("DOM already ready - forcing fetch...");
    fetchAchievements();
    fetchTestimonials();
}

// ... existing code ...

// =========================================
// 5. API & RENDER Logic (3D CAROUSEL)
// =========================================
async function fetchAchievements() {
    console.log("fetchAchievements started (3D Carousel)");
    let items = [];
    try {
        const res = await fetch('/api/achievements');
        const data = await res.json();
        if (data.success && data.data.length) items = data.data;
    } catch (e) { console.warn(e); }

    // Fallback
    if (items.length === 0) {
        items = [
            { year: '2024', title: 'Eureka Jr Finalist', description: "Top 0.04% finalist at IIT Bombay.", icon: 'fa-trophy', link: '#' },
            { year: '2024', title: 'Brand Ambassador', description: "Representing CODLYNX, a digital agency.", icon: 'fa-bullhorn', link: '#' },
            { year: '2023', title: '100+ Projects', description: "Delivered over 100 creative projects.", icon: 'fa-check-circle', link: '#' },
            { year: '2022', title: 'Startup Launch', description: "Founded a tech startup.", icon: 'fa-rocket', link: '#' }
        ];
    }

    const container = document.getElementById('achievements-container');
    if (container) {
        // Render 3D Cards
        container.innerHTML = items.map((a, i) => `
            <div class="carousel-card-3d" data-index="${i}">
                <div class="card-glass-glow"></div>
                <div class="ac-icon-3d"><i class="fas ${a.icon || 'fa-trophy'}"></i></div>
                <div class="ac-content-3d">
                    <span class="ac-year-3d">${a.year}</span>
                    <h3 class="ac-title-3d">${a.title}</h3>
                    <p class="ac-desc-3d">${a.description}</p>
                    <a href="${a.link || '#'}" target="_blank" class="ac-btn-3d">Details</a>
                </div>
            </div>
        `).join('');

        init3DCarousel();
    }
}

function init3DCarousel() {
    const track = document.querySelector('.achievements-track');
    const cards = gsap.utils.toArray('.carousel-card-3d');

    // Center the track
    if (!track) return;

    const container = document.querySelector('.achievements-marquee-wrapper');
    const scrollMax = container.scrollWidth - container.clientWidth;

    // AUTO SCROLL ANIMATION
    const autoScroll = gsap.to(container, {
        scrollLeft: scrollMax,
        duration: 30, // Slow scroll
        ease: "none",
        repeat: -1,
        yoyo: true // Go back and forth
    });

    // Pause on Hover
    container.addEventListener('mouseenter', () => autoScroll.pause());
    container.addEventListener('mouseleave', () => autoScroll.play());

    const containerEl = document.querySelector('.achievements-marquee-wrapper');
    containerEl.addEventListener('scroll', () => {
        const center = containerEl.scrollLeft + (containerEl.offsetWidth / 2);
        cards.forEach(card => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const dist = (center - cardCenter) / 500; // Normalized

            // 3D Rotate Effect (Enhanced)
            gsap.to(card, {
                rotationY: dist * 45,
                scale: 1 - Math.abs(dist) * 0.15,
                z: -Math.abs(dist) * 150,
                opacity: 1 - Math.abs(dist) * 0.3,
                duration: 0.1,
                overwrite: 'auto'
            });

            // Highlight Center Card
            if (Math.abs(dist) < 0.2) {
                card.classList.add('active-card');
                gsap.to(card.querySelector('.ac-btn-3d'), { autoAlpha: 1 });
            } else {
                card.classList.remove('active-card');
                gsap.to(card.querySelector('.ac-btn-3d'), { autoAlpha: 0.5 });
            }
        });
    });

    // Trigger initial calculation
    containerEl.dispatchEvent(new Event('scroll'));
}

// =========================================
// 5. API & RENDER Logic (3D CAROUSEL)
// =========================================
async function fetchAchievements() {
    console.log("fetchAchievements started (3D Carousel)");
    let items = [];
    try {
        const res = await fetch('/api/achievements');
        const data = await res.json();
        if (data.success && data.data.length) items = data.data;
    } catch (e) { console.warn(e); }

    // Fallback
    if (items.length === 0) {
        items = [
            { year: '2024', title: 'Eureka Jr Finalist', description: "Top 0.04% finalist at IIT Bombay.", icon: 'fa-trophy', link: '#' },
            { year: '2024', title: 'Brand Ambassador', description: "Representing CODLYNX, a digital agency.", icon: 'fa-bullhorn', link: '#' },
            { year: '2023', title: '100+ Projects', description: "Delivered over 100 creative projects.", icon: 'fa-check-circle', link: '#' },
            { year: '2022', title: 'Startup Launch', description: "Founded a tech startup.", icon: 'fa-rocket', link: '#' }
        ];
    }

    const container = document.getElementById('achievements-container');
    if (container) {
        // Render 3D Cards
        container.innerHTML = items.map((a, i) => `
            <div class="carousel-card-3d" data-index="${i}">
                <div class="card-glass-glow"></div>
                <div class="ac-icon-3d"><i class="fas ${a.icon || 'fa-trophy'}"></i></div>
                <div class="ac-content-3d">
                    <span class="ac-year-3d">${a.year}</span>
                    <h3 class="ac-title-3d">${a.title}</h3>
                    <p class="ac-desc-3d">${a.description}</p>
                    <a href="${a.link || '#'}" target="_blank" class="ac-btn-3d">Details</a>
                </div>
            </div>
        `).join('');

        init3DCarousel();
    }
}

function init3DCarousel() {
    const track = document.querySelector('.achievements-track');
    const cards = gsap.utils.toArray('.carousel-card-3d');
    const gap = 40; // spacing
    const depth = 300; // Z-depth

    // Center the track
    if (!track) return;

    const container = document.querySelector('.achievements-marquee-wrapper');
    const scrollMax = container.scrollWidth - container.clientWidth;

    // AUTO SCROLL ANIMATION
    // We animate the 'scrollLeft' property of the container
    // This naturally triggers the 'scroll' event listener below
    const autoScroll = gsap.to(container, {
        scrollLeft: scrollMax,
        duration: 30, // Slow scroll
        ease: "none",
        repeat: -1,
        yoyo: true // Go back and forth
    });

    // Pause on Hover
    container.addEventListener('mouseenter', () => autoScroll.pause());
    container.addEventListener('mouseleave', () => autoScroll.play());

    const containerEl = document.querySelector('.achievements-marquee-wrapper');
    containerEl.addEventListener('scroll', () => {
        const center = containerEl.scrollLeft + (containerEl.offsetWidth / 2);
        cards.forEach(card => {
            const cardCenter = card.offsetLeft + (card.offsetWidth / 2);
            const dist = (center - cardCenter) / 500; // Normalized distance (Closer to 0 is center)

            // 3D Rotate Effect (Enhanced)
            gsap.to(card, {
                rotationY: dist * 45, // More rotation
                scale: 1 - Math.abs(dist) * 0.15,
                z: -Math.abs(dist) * 150,
                opacity: 1 - Math.abs(dist) * 0.3,
                duration: 0.1, // Super fast update for smoothness
                overwrite: 'auto'
            });

            // Highlight Center Card
            if (Math.abs(dist) < 0.2) {
                card.classList.add('active-card');
                gsap.to(card.querySelector('.ac-btn-3d'), { autoAlpha: 1 });
            } else {
                card.classList.remove('active-card');
                gsap.to(card.querySelector('.ac-btn-3d'), { autoAlpha: 0.5 });
            }
        });
    });

    // Trigger initial calculation
    containerEl.dispatchEvent(new Event('scroll'));
}
// Old Pin function removed


async function fetchTestimonials() {
    console.log("fetchTestimonials started");
    let items = [];
    try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data.success && data.data.length) {
            items = data.data;
        }
    } catch (e) { console.warn("API Error, using fallback:", e); }

    // FALLBACK DATA
    if (items.length === 0) {
        console.log("Using Fallback Data for Testimonials");
        items = [
            { name: 'Bharath Ganesh', role: 'CEO', message: 'Truly surprised by such immense levels of hard work and sincerity.' },
            { name: 'Shalini Robert', role: 'Founder', message: 'You are an inspiration! Managing everything like a Rockstar.' },
            { name: 'Epaphra', role: 'Founder', message: 'You are onto great things. Keep at it!' }
        ];
    }

    const container = document.getElementById('testimonials-container');
    if (container) {
        console.log("Rendering Testimonials");
        // Triple data for smooth marquee
        const loopData = [...items, ...items, ...items];
        container.innerHTML = loopData.map(t => `
            <div class="testimonial-card-modern">
                <p style="font-size:1.1rem; color:#ddd; font-style:italic; line-height:1.6; margin-bottom:1.5rem;">"${t.message}"</p>
                <div style="display:flex; align-items:center; gap:1rem;">
                    <div style="width:40px; height:40px; background:#333; border-radius:50%;"></div>
                    <div>
                        <h4 style="color:#fff; margin:0; font-size:1rem;">${t.name}</h4>
                        <span style="color:#666; font-size:0.8rem;">${t.role}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } else {
        console.error("Testimonials Container NOT found!");
    }
}

// =========================================
// 2. THREE.JS WAVE BACKGROUND
// =========================================
function initThreeJSBackground() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Wave Parameters
    const SEPARATION = 40, AMOUNTX = 60, AMOUNTY = 60;
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(AMOUNTX * AMOUNTY * 3);
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x666666,
        size: 2,
        transparent: true,
        opacity: 0.6
    });

    let count = 0;
    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            positions[i + 1] = 0; // y (height)
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
            i += 3;
        }
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 1000;
    camera.position.y = 500;
    camera.lookAt(0, 0, 0);

    // Animation Loop
    let count2 = 0;
    const animate = () => {
        const positions = particles.geometry.attributes.position.array;
        let i = 0;

        // Sine Wave Logic
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                positions[i + 1] = (Math.sin((ix + count2) * 0.3) * 50) +
                    (Math.sin((iy + count2) * 0.5) * 50);
                i += 3;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        count2 += 0.05;

        // Slight rotation for depth
        particles.rotation.y = 0.5;

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    };

    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// =========================================
// 3. 3D TILT INTERACTION
// =========================================
function init3DTilt() {
    const tiltElements = document.querySelectorAll('[data-tilt]');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            const xPct = mouseX / width - 0.5;
            const yPct = mouseY / height - 0.5;

            gsap.to(el, {
                transformPerspective: 1000,
                rotationX: yPct * -20,
                rotationY: xPct * 20,
                scale: 1.05,
                duration: 0.5,
                ease: "power2.out"
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                rotationX: 0,
                rotationY: 0,
                scale: 1,
                duration: 0.8,
                ease: "elastic.out(1, 0.5)"
            });
        });
    });
}

// =========================================
// 4. SCROLL ANIMATIONS
// =========================================
function initScrollAnimations() {
    // Advanced 3D Marquee with Velocity Skew
    let box = document.querySelectorAll('.marquee-text');

    gsap.to(".marquee-content", {
        scrollTrigger: {
            trigger: ".marquee-section",
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5, // Smooooth
            onUpdate: (self) => {
                const skew = self.getVelocity() / 300;
                const clampedSkew = Math.max(-10, Math.min(10, skew));

                // Animate the text lines inside
                gsap.to(box, {
                    skewX: -clampedSkew,
                    rotationZ: clampedSkew * 0.2, // Slight tilt
                    overwrite: 'auto',
                    duration: 0.5,
                    ease: "power3.out"
                });
            }
        },
        xPercent: -50,
        ease: "none"
    });

    // Independent Float/Wave Animation for Text letters
    gsap.to(".marquee-text span", {
        y: -15,
        duration: 1.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.2
    });

    // Also animate the stroke text slightly differently for depth
    gsap.to(".marquee-text", {
        textShadow: "0 0 20px rgba(255,255,255,0.3)",
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });

    // Hero Redesign: 3D In/Out + Strong Parallel X + Typography
    // ------------------------------------------------

    // Helper: Split text into chars for h2 styling (Manual SplitText)
    // FIX: Split by words first to prevent mid-word line breaks when wrapping
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const words = subtitle.textContent.split(" ");
        subtitle.innerHTML = words.map(word => {
            const chars = word.split("").map(char => `<span class="char" style="display:inline-block">${char}</span>`).join("");
            return `<span class="word-wrapper" style="display:inline-block; white-space:nowrap; margin-right:0.3em;">${chars}</span>`;
        }).join("");
    }

    // 1. INTRO (3D Fly-In + Typography)
    const introTl = gsap.timeline();

    // Set Initials
    gsap.set('.hero-title .word', { y: 100, opacity: 0, rotationX: -45 });
    gsap.set('.hero-subtitle .char', { opacity: 0, y: 20 });
    gsap.set('.hero-bio', { opacity: 0, x: -50 });
    gsap.set('.hero-cta', { opacity: 0, scale: 0.8 });
    gsap.set('.hero-image', { z: -500, opacity: 0, rotateY: 90 });

    introTl
        // Scene / Image Entrance
        .to('.hero-image', {
            z: 0,
            opacity: 1,
            rotateY: 0,
            duration: 1.8,
            ease: "power4.out"
        })
        // Title: Word by Word Fly-up
        .to('.hero-title .word', {
            y: 0,
            opacity: 1,
            rotationX: 0,
            stagger: 0.1,
            duration: 1.2,
            ease: "back.out(1.7)"
        }, "-=1.2")
        // Subtitle: Typewriter effect (Char by Char)
        .to('.hero-subtitle .char', {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            duration: 0.5,
            ease: "none"
        }, "-=0.8")
        // Bio: Slide in
        .to('.hero-bio', {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out"
        }, "-=0.5")
        // Buttons
        .to('.hero-cta', {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.5)"
        }, "-=0.8");

    // 2. SCROLL (Parallel X + 3D Out)
    const heroScroll = gsap.timeline({
        scrollTrigger: {
            trigger: '.hero',
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });

    heroScroll
        .to('#bg-canvas', { scale: 1.5, opacity: 0.5, ease: "none" }, 0)
        .to('.hero-image', {
            xPercent: 100, rotationY: -45, z: -200, opacity: 0, ease: "power1.in"
        }, 0)
        .to('.hero-content', {
            xPercent: -100, rotationY: 45, z: 100, opacity: 0, ease: "power1.in"
        }, 0);

    // 3. MOUSE TILT (Interactive)
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const xPct = (e.clientX / window.innerWidth) - 0.5;
            const yPct = (e.clientY / window.innerHeight) - 0.5;

            gsap.to('.hero-image', {
                rotationY: xPct * 15,
                rotationX: -yPct * 15,
                duration: 1,
                ease: "power2.out"
            });

            gsap.to('.hero-content', {
                rotationY: xPct * 10,
                rotationX: -yPct * 10,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    // Sections
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: { trigger: title, start: "top 80%" },
            rotateX: 90, opacity: 0, y: 50, duration: 1
        });
    });

    // 3. MOUSE TILT (Interactive)
    /* ... existing tilt logic ... */

    // ------------------------------------------------
    // ABOUT SECTION (Storytelling + Masking)
    // ------------------------------------------------

    // 1. Heading Horizontal Wipe
    gsap.fromTo('.mask-reveal-x',
        { clipPath: "polygon(0 0, 0% 0, 0% 100%, 0 100%)", opacity: 0, x: -50 },
        {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            opacity: 1,
            x: 0,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
                trigger: '.about-section',
                start: "top 70%"
            }
        }
    );

    // 2. Paragraphs Vertical Wipe (Line by line feel)
    gsap.utils.toArray('.story-text').forEach(text => {
        gsap.fromTo(text,
            { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)", y: 30, opacity: 0 },
            {
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: text,
                    start: "top 85%"
                }
            }
        );
    });

    // 3. Icon Pop-In
    gsap.utils.toArray('.icon-3d').forEach(icon => {
        gsap.from(icon, {
            scale: 0,
            rotation: -180,
            opacity: 0,
            duration: 0.8,
            ease: "back.out(1.7)",
            scrollTrigger: {
                trigger: icon,
                start: "top 90%"
            }
        });
    });

    // 4. Subtle Image Parallax (Float Up)
    gsap.to('.parallax-img', {
        y: -50, // Gentle float up
        scrollTrigger: {
            trigger: '.about-section',
            start: "top bottom",
            end: "bottom top",
            scrub: 1 // Smooth, no sound effects
        }
    });

    // Services Horizontal Scroll (Parallel X with 3D Skew)
    const servicesSection = document.querySelector('.services-pin-wrapper');
    const track = document.querySelector('.services-track');

    if (track) {
        // Calculate scroll amount: Total width - Viewport width
        // We add some buffer so the last card clears
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.2);

        const tween = gsap.to(track, {
            x: getScrollAmount,
            ease: "none",
        });

        ScrollTrigger.create({
            trigger: servicesSection,
            start: "top top",
            end: () => "+=" + track.scrollWidth, // Scroll distance = width of track
            pin: true,
            animation: tween,
            scrub: 1.2, // Smooth scrubbing
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                // Animated Wave (Sine) based on progress
                // As we scroll (self.progress), mix in some Y movement
                const progress = self.progress * Math.PI * 4; // 2 loops

                document.querySelectorAll('.service-card-3d').forEach((card, i) => {
                    // Staggered Wave (i * 0.5)
                    const yWave = Math.sin(progress + i) * 30;

                    gsap.to(card, {
                        y: yWave, // Float up/down while scrolling
                        overwrite: 'auto',
                        duration: 0.5,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    // Services Horizontal Scroll (Parallel X with 3D Skew)
    /* ... existing services scroll ... */

    // ------------------------------------------------
    // JOURNEY SECTION (Horizontal Pin)
    // ------------------------------------------------
    const journeySection = document.querySelector('.journey-section-pin');
    const journeyTrack = document.querySelector('.journey-track');

    if (journeyTrack) {
        // Calculate total scroll distance
        const getJourneyScroll = () => -(journeyTrack.scrollWidth - window.innerWidth + window.innerWidth * 0.1);

        const journeyTween = gsap.to(journeyTrack, {
            x: getJourneyScroll,
            ease: "none",
            scrollTrigger: {
                trigger: journeySection,
                start: "top top",
                end: () => "+=" + (journeyTrack.scrollWidth + window.innerWidth), // More scroll space
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });

        // Mask Reveal Effect "One by one"
        // Ensure cards stay visible once revealed
        gsap.utils.toArray('.journey-card').forEach((card) => {
            gsap.from(card, {
                opacity: 0,
                x: 100, // Slide in from right slightly
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: journeyTween,
                    start: "left 80%", // Trigger earlier
                    end: "right 20%",
                    toggleActions: "play reverse play reverse"
                }
            })
        });
    }

    // Advanced Cursor & Holographic Logic
    const cursor = document.getElementById('cursor');
    const cursorBlur = document.getElementById('cursor-blur');

    document.addEventListener('mousemove', (e) => {
        // Move Custom Cursor
        if (cursor) gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
        if (cursorBlur) gsap.to(cursorBlur, { x: e.clientX, y: e.clientY, duration: 0.8, ease: 'power3.out' }); // Laggy Blur

        // Holographic Card Effect
        document.querySelectorAll('.service-card-3d').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS Variable for the radial gradient
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Scramble Text Effect on Hover
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    document.querySelectorAll('.char-animate').forEach(header => {
        header.dataset.value = header.innerText; // Store original

        header.addEventListener('mouseover', event => {
            let iterations = 0;
            const interval = setInterval(() => {
                event.target.innerText = event.target.innerText.split("")
                    .map((letter, index) => {
                        if (index < iterations) return event.target.dataset.value[index];
                        return letters[Math.floor(Math.random() * 26)];
                    })
                    .join("");

                if (iterations >= event.target.dataset.value.length) clearInterval(interval);
                iterations += 1 / 3;
            }, 30);
        });
    });

    // Typography Reveal inside Cards on Enter (Removed obsolete service-card-3d logic)

}

// =========================================
// 5. API & RENDER Logic (With Fail-Safe)
// =========================================
async function fetchAchievements() {
    let items = [];
    try {
        const res = await fetch('/api/achievements');
        const data = await res.json();
        if (data.success && data.data.length) {
            items = data.data;
        }
    } catch (e) { console.warn("API Error, using fallback:", e); }

    // FALLBACK DATA (If API/DB fails)
    if (items.length === 0) {
        items = [
            { year: '2024', title: 'Eureka Jr Finalist', description: "Top 0.04% finalist at IIT Bombay's entrepreneurship competition." },
            { year: '2024', title: 'Brand Ambassador', description: "Representing CODLYNX, a fast-growing digital agency." },
            { year: '2023', title: '100+ Projects', description: "Delivered over 100 creative projects seamlessly." }
        ];
    }

    const container = document.getElementById('achievements-container');
    if (container) {
        container.innerHTML = items.map(a => `
            <div class="achievement-card">
                <span style="color:#666; text-transform:uppercase; letter-spacing:1px; font-size:0.8rem;">${a.year}</span>
                <h3 style="color:#fff; font-size:1.5rem; margin:1rem 0;">${a.title}</h3>
                <p style="color:#999; line-height:1.5;">${a.description}</p>
            </div>
        `).join('');
        initAchievementsScroll();
    }
}

function initAchievementsScroll() {
    const section = document.querySelector('.achievements-pin');
    const track = document.querySelector('.achievements-track');

    if (section && track) {
        // Simple Horizontal Scroll
        gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth + 100),
            ease: "none",
            scrollTrigger: {
                trigger: section,
                pin: true,
                scrub: 1,
                start: "top top",
                end: () => "+=" + track.scrollWidth,
                invalidateOnRefresh: true
            }
        });
    }
}

async function fetchTestimonials() {
    let items = [];
    try {
        const res = await fetch('/api/testimonials');
        const data = await res.json();
        if (data.success && data.data.length) {
            items = data.data;
        }
    } catch (e) { console.warn("API Error, using fallback:", e); }

    // FALLBACK DATA
    if (items.length === 0) {
        items = [
            { name: 'Bharath Ganesh', role: 'CEO', message: 'Truly surprised by such immense levels of hard work and sincerity.' },
            { name: 'Shalini Robert', role: 'Founder', message: 'You are an inspiration! Managing everything like a Rockstar.' },
            { name: 'Epaphra', role: 'Founder', message: 'You are onto great things. Keep at it!' }
        ];
    }

    const container = document.getElementById('testimonials-container');
    if (container) {
        // Triple data for smooth marquee
        const loopData = [...items, ...items, ...items];
        container.innerHTML = loopData.map(t => `
            <div class="testimonial-card-modern">
                <p style="font-size:1.1rem; color:#ddd; font-style:italic; line-height:1.6; margin-bottom:1.5rem;">"${t.message}"</p>
                <div style="display:flex; align-items:center; gap:1rem;">
                    <div style="width:40px; height:40px; background:#333; border-radius:50%;"></div>
                    <div>
                        <h4 style="color:#fff; margin:0; font-size:1rem;">${t.name}</h4>
                        <span style="color:#666; font-size:0.8rem;">${t.role}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Mobile Menu
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        const isHidden = mobileMenu.style.display === 'none' || mobileMenu.style.display === '';
        mobileMenu.style.display = isHidden ? 'flex' : 'none';
        mobileMenu.style.flexDirection = 'column';
        mobileMenu.style.position = 'absolute';
    });
}
