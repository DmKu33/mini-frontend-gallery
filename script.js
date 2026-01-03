// ==========================================
// CUSTOM CURSOR FOLLOWER
// ==========================================

const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursorFollower.style.left = e.clientX + 'px';
    cursorFollower.style.top = e.clientY + 'px';
});

// Scale up cursor on interactive elements
const interactiveElements = document.querySelectorAll('a, button, .project-card');

interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    });
    
    element.addEventListener('mouseleave', () => {
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// ==========================================
// SCROLL ANIMATIONS
// ==========================================

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const projectCards = document.querySelectorAll('.project-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay based on card index
            const delay = parseInt(entry.target.dataset.project) * 100;
            setTimeout(() => {
                entry.target.style.animation = 'slideInView 0.8s ease-out forwards';
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

projectCards.forEach(card => {
    observer.observe(card);
});

// ==========================================
// PARALLAX EFFECT ON SCROLL
// ==========================================

let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    const scrolled = window.scrollY;
    
    // Parallax effect for project cards
    projectCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const distance = cardCenter - windowCenter;
        
        // Apply subtle parallax to preview frames
        const preview = card.querySelector('.preview-frame');
        if (preview) {
            const parallaxAmount = distance * 0.02;
            preview.style.transform = `translateY(${parallaxAmount}px)`;
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

// ==========================================
// PROJECT CARD TILT EFFECT
// ==========================================

projectCards.forEach(card => {
    const content = card.querySelector('.project-content');
    
    card.addEventListener('mousemove', (e) => {
        const rect = content.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        content.style.transform = `
            perspective(1000px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
            translateY(-5px)
            scale(1.01)
        `;
    });
    
    card.addEventListener('mouseleave', () => {
        content.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
    });
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// ANIMATED COUNTER FOR PROJECT NUMBERS
// ==========================================

function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const range = target - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = String(Math.floor(current)).padStart(2, '0');
    }, 16);
}

// Animate numbers when they come into view
const numberObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target;
            const targetValue = parseInt(number.textContent);
            animateNumber(number, targetValue, 800);
            numberObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.project-number').forEach(number => {
    numberObserver.observe(number);
});

// ==========================================
// DYNAMIC GRADIENT SHIFT ON PREVIEW FRAMES
// ==========================================

projectCards.forEach(card => {
    const frameContent = card.querySelector('.frame-content');
    if (!frameContent) return;
    
    card.addEventListener('mouseenter', () => {
        frameContent.style.filter = 'brightness(1.1) saturate(1.2)';
        frameContent.style.transition = 'all 0.4s ease';
    });
    
    card.addEventListener('mouseleave', () => {
        frameContent.style.filter = 'brightness(1) saturate(1)';
    });
});

// ==========================================
// SCROLL PROGRESS INDICATOR
// ==========================================

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
    // Update timeline gradient based on scroll
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timeline.style.background = `linear-gradient(to bottom,
            transparent 0%,
            var(--text-primary) ${scrollPercent * 0.9}%,
            var(--border-color) ${scrollPercent * 0.9}%,
            var(--border-color) 90%,
            transparent 100%
        )`;
    }
}

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);

// ==========================================
// FLOATING ANIMATION FOR SCROLL INDICATOR
// ==========================================

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const opacity = Math.max(0, 1 - scrolled / 300);
        scrollIndicator.style.opacity = opacity;
        scrollIndicator.style.transform = `translateX(-50%) translateY(${scrolled * 0.5}px)`;
    });
}

// ==========================================
// LAZY LOAD ENHANCEMENT
// ==========================================

// Add shimmer loading effect to preview frames
projectCards.forEach(card => {
    const frameContent = card.querySelector('.frame-content');
    if (frameContent) {
        frameContent.style.position = 'relative';
        frameContent.style.overflow = 'hidden';
    }
});

// ==========================================
// KEYBOARD NAVIGATION SUPPORT
// ==========================================

document.addEventListener('keydown', (e) => {
    // Press 'h' to scroll to top
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Press number keys (1-5) to navigate to projects
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5) {
        const targetCard = document.querySelector(`[data-project="${num}"]`);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to resize events
window.addEventListener('resize', debounce(() => {
    updateScrollProgress();
}, 100));

// ==========================================
// INITIALIZE ON LOAD
// ==========================================

window.addEventListener('load', () => {
    // Initial scroll progress
    updateScrollProgress();
    
    // Add loaded class to body for any CSS transitions
    document.body.classList.add('loaded');
    
    // Log welcome message to console
    console.log('%c🎨 Web Development Journey', 
        'font-size: 24px; font-weight: bold; color: #ffffff;');
    console.log('%cExploring Critical Web Design through 5 projects', 
        'font-size: 14px; color: #b0b0b0;');
    console.log('%cKeyboard shortcuts:\n  • Press "h" to scroll to top\n  • Press 1-5 to jump to projects', 
        'font-size: 12px; color: #707070; font-family: monospace;');
});

// ==========================================
// EASTER EGG: KONAMI CODE
// ==========================================

let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode.splice(-konamiSequence.length - 1, konamiCode.length - konamiSequence.length);
    
    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg: Rainbow mode!
        document.body.style.animation = 'rainbow 5s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        console.log('%c🌈 RAINBOW MODE ACTIVATED! 🌈', 
            'font-size: 20px; font-weight: bold; background: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet); -webkit-background-clip: text; -webkit-text-fill-color: transparent;');
        
        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 5000);
    }
});

