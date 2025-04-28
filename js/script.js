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

// Function to Apply Theme
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

// Ensure Light Mode on First Load
document.addEventListener('DOMContentLoaded', () => {
    applyTheme("light"); // Force Light mode on first load
    initTypewriter();
    initBackToTop();
    initAOS();
    initSkillBars();
    initTestimonialSlider();
    initContactForm();
    initNavbarScroll();

    // Force recalculation of skill circles after a short delay
    setTimeout(() => {
        const skillCircles = document.querySelectorAll('.circle-fill');
        skillCircles.forEach(circle => {
            updateCircleProgress(circle);
        });
    }, 500);
});

// Initialize Navbar Scroll Behavior
function initNavbarScroll() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Toggle Theme and Save Preference
function toggleTheme() {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    const newTheme = isDarkMode ? "dark" : "light";
    applyTheme(newTheme);
}

// Mobile Menu Toggle
function toggleMenu() {
    const isActive = navLinks.classList.toggle('active');

    // Add aria-expanded attribute for accessibility
    menuToggle.setAttribute('aria-expanded', isActive);

    // Add animation effect
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

// Erase text effect
function eraseText(element, text, i = text.length) {
    if (i > 0) {
        element.textContent = text.substring(0, i - 1);
        setTimeout(() => eraseText(element, text, i - 1), 40);
    } else {
        setTimeout(() => typeWriter(element, text), 1000);
    }
}

// Initialize Typewriter
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

// Back to Top Button
function initBackToTop() {
    window.addEventListener('scroll', () => {
        backToTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize AOS
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });
}

// Initialize Skill Bars Animation
function initSkillBars() {
    function updateCircleProgress(circle) {
        const skillCard = circle.closest('.skill-card');
        const percentElement = skillCard.querySelector('.skill-percent');
        const percentText = percentElement.textContent;
        const percentValue = parseInt(percentText.replace('%', ''));

        const color = getColorForPercentage(percentValue);
        circle.style.stroke = color;

        const icon = skillCard.querySelector('.circle-progress i');
        if (icon) icon.style.color = color;

        percentElement.style.color = color;

        const radius = parseInt(circle.getAttribute('r'));
        const circumference = 2 * Math.PI * radius;
        circle.style.strokeDasharray = circumference;
        const offset = circumference - (circumference * percentValue / 100);

        circle.style.strokeDashoffset = circumference;
        requestAnimationFrame(() => {
            circle.style.strokeDashoffset = offset;
        });

        circle.setAttribute('data-percent', percentValue);
    }

    function getColorForPercentage(percent) {
        if (percent >= 80) return '#4CAF50';
        if (percent >= 60) return '#FFC107';
        return '#F44336';
    }

    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                updateCircleProgress(circle);
                circleObserver.unobserve(circle);
            }
        });
    }, { threshold: 0.1 });

    const skillCircles = document.querySelectorAll('.circle-fill');
    skillCircles.forEach(circle => {
        const skillCircle = circle.closest('.skill-circle');
        const percentValue = parseInt(skillCircle.getAttribute('data-percent'));

        circle.setAttribute('data-percent', percentValue);
        const color = getColorForPercentage(percentValue);
        circle.style.stroke = color;

        const icon = skillCircle.querySelector('.circle-progress i');
        if (icon) icon.style.color = color;

        circleObserver.observe(circle);
    });

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            skillCircles.forEach(circle => {
                updateCircleProgress(circle);
            });
        }, 250);
    });

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            setTimeout(() => {
                skillCircles.forEach(circle => {
                    updateCircleProgress(circle);
                });
            }, 100);
        });
    }

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0';
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                barObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.1 });

    if (skillProgressBars.length > 0) {
        skillProgressBars.forEach(bar => {
            barObserver.observe(bar);
        });
    }
}

// Initialize Testimonial Slider
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

// Initialize Contact Form
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