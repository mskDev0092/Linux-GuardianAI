// --- 1. Canvas Background Animation (Neural Network) ---
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(0, 242, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = Math.min(window.innerWidth / 10, 100); // Responsive count
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Draw connections
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(112, 0, 255, ${1 - distance / 150})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

initParticles();
animate();


// --- 2. Typewriter Effect ---
const textElement = document.getElementById('typewriter');
const phrases = ["Detect. Analyze. Protect.", "AI-Powered Security.", "Guarding Linux Systems.", "Zero Trust Architecture."];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        textElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        textElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500; // Pause before new word
    }

    setTimeout(typeWriter, typeSpeed);
}

document.addEventListener('DOMContentLoaded', typeWriter);


// --- 3. Scroll Animations (Intersection Observer) ---
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// --- 4. Smooth Scroll for Anchors ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// --- 5. Interactive Video Showcase ---
const showcaseData = {
    dashboard: {
        title: "Full System Visibility",
        desc: "Real-time metrics for CPU, RAM, Network, and Hard Drives. Watch your system pulse in a beautiful, reactive interface.",
        video: "assets/dashboardcast.webm",
        checks: ["60fps Data Visualization", "Per-core Temperature Tracking", "Sub-millisecond Update Rate"]
    },
    security: {
        title: "Autonomous Hardening",
        desc: "Deep security audits and AppArmor profile management powered by AI behavioral analysis.",
        video: "assets/securityanalysiscast.webm",
        checks: ["Real-time Audit Logs", "One-click Fix Assistant", "Profile Sandboxing"]
    },
    ai: {
        title: "Your Linux Companion",
        desc: "Ask questions, generate scripts, or troubleshoot complex issues in natural language.",
        video: "assets/ai-chatcast.webm",
        checks: ["Local-first Privacy", "Context-aware Help", "Script Generation"]
    }
};

function switchShowcase(feature) {
    const data = showcaseData[feature];
    const video = document.getElementById('feature-video');
    const desc = document.getElementById('showcase-desc');
    const buttons = document.querySelectorAll('.feature-btn');

    // Update buttons
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(feature));
    });

    // Update Content with animation
    desc.style.opacity = 0;
    video.parentElement.classList.add('video-animation');
    
    setTimeout(() => {
        desc.innerHTML = `
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
            <ul class="check-list">
                ${data.checks.map(item => `<li><i class="fa-solid fa-check"></i> ${item}</li>`).join('')}
            </ul>
        `;
        video.src = data.video;
        video.load();
        video.play();
        desc.style.opacity = 1;
        desc.style.transition = 'opacity 0.3s ease';
    }, 300);

    setTimeout(() => {
        video.parentElement.classList.remove('video-animation');
    }, 800);
}
