// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const backToTopBtn = document.getElementById('back-to-top');
const navLinks = document.querySelector('.nav-links');
const themeIcon = document.getElementById('theme-icon');
const skillProgressBars = document.querySelectorAll('.skill-progress');
const skillCircles = document.querySelectorAll('.circle-fill');
const prevTestimonialBtn = document.querySelector('.prev-testimonial');
const nextTestimonialBtn = document.querySelector('.next-testimonial');
const testimonialSlider = document.querySelector('.testimonial-slider');
const contactForm = document.getElementById('contact-form');
const formMessage = document.querySelector('.form-message');
const navbar = document.querySelector('nav');

// Apply Theme
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add('dark-mode');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// On Document Ready
document.addEventListener('DOMContentLoaded', () => {
    applyTheme("light"); // Default to light mode
    initTypewriter();
    initBackToTop();
    initAOS();
    initSkillBars();
    initTestimonialSlider();
    initContactForm();
    initNavbarScroll();

    setTimeout(() => {
        document.querySelectorAll('.circle-fill').forEach(updateCircleProgress);
    }, 500);
});

// Navbar Scroll
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Toggle Theme
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    const newTheme = isDarkMode ? "dark" : "light";
    applyTheme(newTheme);
}

// Mobile Menu
function toggleMenu() {
    const isActive = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isActive);
    if (isActive) {
        const links = navLinks.querySelectorAll('a');
        links.forEach((link, index) => {
            link.style.animation = `fadeInDown 0.3s ease forwards ${index * 0.1}s`;
        });
    }
}

// Typewriter Effect
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        setTimeout(() => typeWriter(element, text, i + 1), 80);
    } else {
        setTimeout(() => eraseText(element, text), 2000);
    }
}

function eraseText(element, text, i = text.length) {
    if (i > 0) {
        element.textContent = text.substring(0, i - 1);
        setTimeout(() => eraseText(element, text, i - 1), 40);
    } else {
        setTimeout(() => typeWriter(element, text), 1000);
    }
}

function initTypewriter() {
    const isMobile = window.innerWidth <= 768;
    document.querySelectorAll('.typewriter').forEach(el => {
        el.textContent = '';
        if (isMobile) {
            el.textContent = el.dataset.text;
            el.style.borderRight = 'none';
        } else {
            setTimeout(() => typeWriter(el, el.dataset.text), 1000);
        }
    });
}

// Back to Top
function initBackToTop() {
    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// AOS Init
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}

// Skill Circles Progress Animation
function initSkillBars() {

    function getColorForPercentage(percent) {
        if (percent >= 80) return '#4CAF50'; // Green
        if (percent >= 60) return '#FFC107'; // Yellow
        return '#F44336'; // Red
    }

    function updateCircleProgress(circle) {
        const skillCircle = circle.closest('.skill-circle');
        const percent = parseInt(skillCircle.getAttribute('data-percent')) || 0;

        const isMobile = window.innerWidth <= 768;
        const radius = isMobile ? 55 : 50; // Mobile ke liye radius 50, Desktop ke liye 50
        const circumference = 2 * Math.PI * radius;

        // Update attributes
        circle.setAttribute('r', radius);
        circle.setAttribute('cx', "50%");
        circle.setAttribute('cy', "50%");
        circle.style.strokeDasharray = circumference;

        // Animate fill
        requestAnimationFrame(() => {
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });

        // Color adjustments
        const color = getColorForPercentage(percent);
        circle.style.stroke = color;

        const icon = skillCircle.querySelector('.circle-progress i');
        if (icon) icon.style.color = color;

        const percentLabel = skillCircle.parentElement.querySelector('.skill-percent');
        if (percentLabel) percentLabel.style.color = color;
    }


    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                updateCircleProgress(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.circle-fill').forEach(circle => {
        observer.observe(circle);
    });

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            document.querySelectorAll('.circle-fill').forEach(updateCircleProgress);
        }, 300);
    });

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                document.querySelectorAll('.circle-fill').forEach(updateCircleProgress);
            }, 100);
        });
    }
}

// Testimonial Slider
function initTestimonialSlider() {
    if (!testimonialSlider) return;

    let currentIndex = 0;
    const testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
    const testimonialWidth = testimonials[0].offsetWidth + 30;

    function showTestimonial(index) {
        if (index < 0) index = testimonials.length - 1;
        if (index >= testimonials.length) index = 0;
        currentIndex = index;
        testimonialSlider.scrollTo({
            left: testimonialWidth * currentIndex,
            behavior: 'smooth'
        });
    }

    if (prevTestimonialBtn) {
        prevTestimonialBtn.addEventListener('click', () => {
            showTestimonial(currentIndex - 1);
        });
    }

    if (nextTestimonialBtn) {
        nextTestimonialBtn.addEventListener('click', () => {
            showTestimonial(currentIndex + 1);
        });
    }

    let testimonialInterval = setInterval(() => {
        showTestimonial(currentIndex + 1);
    }, 5000);

    testimonialSlider.addEventListener('mouseenter', () => {
        clearInterval(testimonialInterval);
    });

    testimonialSlider.addEventListener('mouseleave', () => {
        testimonialInterval = setInterval(() => {
            showTestimonial(currentIndex + 1);
        }, 5000);
    });
}

// Contact Form Handling
function initContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        showFormMessage('Sending message...', 'info');

        setTimeout(() => {
            showFormMessage('Your message has been sent successfully!', 'success');
            contactForm.reset();
        }, 1500);
    });

    function showFormMessage(message, type) {
        if (!formMessage) return;

        formMessage.textContent = message;
        formMessage.className = 'form-message';
        formMessage.classList.add(type);

        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Resume Download
function downloadResume() {
    const link = document.createElement('a');
    link.href = 'assets/resume/piyushgosaviresume.pdf';
    link.download = 'Piyush_Gosavi_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
menuToggle.addEventListener('click', toggleMenu);

document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('active') &&
        !e.target.closest('.nav-links') &&
        !e.target.closest('.menu-toggle')) {
        navLinks.classList.remove('active');
    }
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
        }
    });
});
