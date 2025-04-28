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
});

// Initialize Navbar Scroll Behavior
function initNavbarScroll() {
    // Add scrolled class to navbar when scrolling down
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
        // Animate each link with a delay
        const links = navLinks.querySelectorAll('a');
        links.forEach((link, index) => {
            link.style.animation = `fadeInDown 0.3s ease forwards ${index * 0.1}s`;
        });
    }
}

// We've updated the header structure, so we don't need this anymore
// The text is now static in the HTML


// Typewriter Effect
function typeWriter(element, text, i = 0) {
    if (i < text.length) {
        element.textContent = text.substring(0, i + 1);
        setTimeout(() => typeWriter(element, text, i + 1), 80); // Slightly faster typing
    } else {
        // When typing is complete, wait and then start erasing
        setTimeout(() => eraseText(element, text), 2000);
    }
}

// Erase text effect
function eraseText(element, text, i = text.length) {
    if (i > 0) {
        element.textContent = text.substring(0, i - 1);
        setTimeout(() => eraseText(element, text, i - 1), 40); // Faster erasing
    } else {
        // When erasing is complete, wait and then start typing again
        setTimeout(() => typeWriter(element, text), 1000);
    }
}

// Initialize Typewriter
function initTypewriter() {
    document.querySelectorAll('.typewriter').forEach(el => {
        // Clear the element first
        el.textContent = '';
        // Start the typewriter effect with a slight delay
        setTimeout(() => typeWriter(el, el.dataset.text), 1000);
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
    // Animate circular skill indicators
    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const circle = entry.target;
                const skillCard = circle.closest('.skill-card');
                const percentElement = skillCard.querySelector('.skill-percent');
                const percentText = percentElement.textContent;
                const percentValue = parseInt(percentText.replace('%', ''));

                // Set color based on percentage
                const color = getColorForPercentage(percentValue);
                circle.style.stroke = color;

                // Also update the icon color to match
                const icon = skillCard.querySelector('.circle-progress i');
                if (icon) icon.style.color = color;

                // Update percent text color
                percentElement.style.color = color;

                // Calculate the correct stroke-dashoffset based on percentage
                // The formula is: total length - (total length * percentage / 100)
                const totalLength = 315; // Circumference of the circle
                const offset = totalLength - (totalLength * percentValue / 100);

                // Reset to starting position (empty circle)
                circle.style.strokeDashoffset = totalLength;

                // Animate to final position (filled according to percentage)
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                    console.log(`Setting ${percentValue}% circle to offset: ${offset}`);
                }, 300);
                circleObserver.unobserve(circle);
            }
        });
    }, { threshold: 0.1 });

    // Function to determine color based on percentage
    function getColorForPercentage(percent) {
        if (percent >= 80) return '#4CAF50'; // Green for high proficiency (80-100%)
        if (percent >= 60) return '#FFC107'; // Yellow/Amber for medium proficiency (60-79%)
        return '#F44336'; // Red for lower proficiency (0-59%)
    }

    skillCircles.forEach(circle => {
        circleObserver.observe(circle);
    });

    // For legacy skill bars (if still in use)
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

    // Add event listener for theme toggle to ensure animations work in both themes
    themeToggle.addEventListener('click', () => {
        setTimeout(() => {
            // Re-animate circles on theme change
            skillCircles.forEach(circle => {
                const skillCard = circle.closest('.skill-card');
                const percentElement = skillCard.querySelector('.skill-percent');
                const percentText = percentElement.textContent;
                const percentValue = parseInt(percentText.replace('%', ''));

                // Set color based on percentage
                const color = getColorForPercentage(percentValue);
                circle.style.stroke = color;

                // Also update the icon color to match
                const icon = skillCard.querySelector('.circle-progress i');
                if (icon) icon.style.color = color;

                // Update percent text color
                percentElement.style.color = color;

                // Re-calculate the correct stroke-dashoffset based on percentage
                const totalLength = 315; // Circumference of the circle
                const offset = totalLength - (totalLength * percentValue / 100);

                // Reset to starting position (empty circle)
                circle.style.strokeDashoffset = totalLength;

                // Animate to final position (filled according to percentage)
                setTimeout(() => {
                    circle.style.strokeDashoffset = offset;
                }, 300);
            });

            // Re-animate bars on theme change (if still in use)
            if (skillProgressBars.length > 0) {
                skillProgressBars.forEach(bar => {
                    const currentWidth = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = currentWidth;
                    }, 50);
                });
            }
        }, 100);
    });
}

// Initialize Testimonial Slider
function initTestimonialSlider() {
    if (!testimonialSlider) return;

    let currentIndex = 0;
    const testimonials = testimonialSlider.querySelectorAll('.testimonial-card');
    const testimonialWidth = testimonials[0].offsetWidth + 30; // Width + gap

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

    // Auto-scroll testimonials
    let testimonialInterval = setInterval(() => {
        showTestimonial(currentIndex + 1);
    }, 5000);

    // Pause auto-scroll on hover
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

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simple form validation
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            showFormMessage('Please fill in all fields', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        showFormMessage('Sending message...', 'info');

        // Simulate API call with timeout
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

        // Clear message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    }
}

// Event Listeners
themeToggle.addEventListener('click', toggleTheme);
menuToggle.addEventListener('click', toggleMenu);

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (navLinks.classList.contains('active') &&
        !e.target.closest('.nav-links') &&
        !e.target.closest('.menu-toggle')) {
        navLinks.classList.remove('active');
    }
});

// Close mobile menu when clicking on a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
        }
    });
});
