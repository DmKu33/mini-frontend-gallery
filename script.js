// Scroll animations for project cards

const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const projectCards = document.querySelectorAll('.project-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
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

// Parallax effect on scroll

let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    const scrolled = window.scrollY;
    
    projectCards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const windowCenter = window.innerHeight / 2;
        const distance = cardCenter - windowCenter;
        
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

// Card tilt effect on mouse move

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

// Smooth scroll for anchor links

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

// Animated counter for project numbers

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

// Dynamic gradient shift on preview frames

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

// Scroll progress indicator

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    
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

// Floating animation for scroll indicator

const scrollIndicator = document.querySelector('.scroll-indicator');

if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const opacity = Math.max(0, 1 - scrolled / 300);
        scrollIndicator.style.opacity = opacity;
        scrollIndicator.style.transform = `translateX(-50%) translateY(${scrolled * 0.5}px)`;
    });
}

// Lazy load enhancement for preview frames
projectCards.forEach(card => {
    const frameContent = card.querySelector('.frame-content');
    if (frameContent) {
        frameContent.style.position = 'relative';
        frameContent.style.overflow = 'hidden';
    }
});

// Keyboard navigation support

document.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5) {
        const targetCard = document.querySelector(`[data-project="${num}"]`);
        if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
});

// Performance optimization

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

window.addEventListener('resize', debounce(() => {
    updateScrollProgress();
}, 100));

// Initialize on load

window.addEventListener('load', () => {
    updateScrollProgress();
    document.body.classList.add('loaded');
    
    console.log('%c🎨 Web Development Journey', 
        'font-size: 24px; font-weight: bold; color: #ffffff;');
    console.log('%cExploring Critical Web Design through 5 projects', 
        'font-size: 14px; color: #b0b0b0;');
    console.log('%cKeyboard shortcuts:\n  • Press "h" to scroll to top\n  • Press 1-5 to jump to projects', 
        'font-size: 12px; color: #707070; font-family: monospace;');
});

