// JARVIS Portfolio - Main JavaScript File

class JarvisPortfolio {
    constructor() {
        this.init();
        this.bindEvents();
        this.startAnimations();
    }

    init() {
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.hamburger = document.getElementById('hamburger');
        this.loadingScreen = document.getElementById('loading-screen');
        // this.contactForm = document.getElementById('contact-form'); // Removed contact form
        
        // Initialize components
        this.initializeLoader();
        this.initializeTypingEffect();
        this.initializeScrollEffects();
        this.initializeSkillBars();
    }

    bindEvents() {
        // Navigation events
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        
        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Scroll events
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Contact form removed
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Key events
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    // Loading Screen Animation
    initializeLoader() {
        setTimeout(() => {
            this.loadingScreen.classList.add('hidden');
            this.startMainAnimations();
        }, 3000);
    }

    startMainAnimations() {
        // Start hero animations
        this.animateHero();
        
        // Initialize scroll animations
        this.observeElements();
    }

    // Typing Effect
    initializeTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach((element, index) => {
            const text = element.dataset.text;
            const delay = element.dataset.delay ? parseInt(element.dataset.delay) : index * 1000;
            
            setTimeout(() => {
                this.typeText(element, text);
            }, delay);
        });
    }

    typeText(element, text) {
        element.textContent = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 100);
    }

    // Navigation
    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : 'auto';
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        
        if (href.startsWith('#')) {
            const targetId = href.substring(1);
            this.scrollToSection(targetId);
            
            // Close mobile menu if open
            if (this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
            
            // Update active link
            this.updateActiveNavLink(e.target);
        }
    }

    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Smooth Scrolling
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const offsetTop = section.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Scroll Effects
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Navbar scroll effect
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active navigation based on scroll position
        this.updateNavOnScroll();
        
        // Parallax effects
        this.handleParallax(scrollY);
    }

    updateNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    handleParallax(scrollY) {
        // Hero section parallax
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroOffset = scrollY * 0.5;
            hero.style.transform = `translateY(${heroOffset}px)`;
        }
        
        // Arc reactor rotation based on scroll
        const arcReactor = document.querySelector('.arc-reactor');
        if (arcReactor) {
            const rotation = scrollY * 0.2;
            arcReactor.style.transform = `rotate(${rotation}deg)`;
        }
    }

    // Scroll Animations
    initializeScrollEffects() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
        animatedElements.forEach(element => {
            element.classList.add('fade-in'); // Default animation class
        });
    }

    observeElements() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger skill bar animations
                    if (entry.target.classList.contains('skills')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);
        
        // Observe sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
        
        // Observe individual elements
        document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(element => {
            observer.observe(element);
        });
    }

    // Skill Bars Animation
    initializeSkillBars() {
        this.skillBarsAnimated = false;
    }

    animateSkillBars() {
        if (this.skillBarsAnimated) return;
        
        const skillFills = document.querySelectorAll('.skill-fill');
        
        skillFills.forEach((fill, index) => {
            const width = fill.dataset.width;
            
            setTimeout(() => {
                fill.style.width = width + '%';
            }, index * 200);
        });
        
        this.skillBarsAnimated = true;
    }

    // Hero Animations
    animateHero() {
        const heroElements = document.querySelectorAll('.hero-content > *');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 300);
        });
    }

    // Form Handling
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const formObject = {};
        
        formData.forEach((value, key) => {
            formObject[key] = value;
        });
        
        // Validate form
        if (this.validateForm(formObject)) {
            this.submitForm(formObject);
        }
    }

    validateForm(data) {
        const { name, email, subject, message } = data;
        
        // Basic validation
        if (!name || name.trim().length < 2) {
            this.showFormMessage('Please enter a valid name.', 'error');
            return false;
        }
        
        if (!email || !this.isValidEmail(email)) {
            this.showFormMessage('Please enter a valid email address.', 'error');
            return false;
        }
        
        if (!subject || subject.trim().length < 3) {
            this.showFormMessage('Please enter a valid subject.', 'error');
            return false;
        }
        
        if (!message || message.trim().length < 10) {
            this.showFormMessage('Please enter a message with at least 10 characters.', 'error');
            return false;
        }
        
        return true;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    submitForm(data) {
        // Show loading state
        const submitBtn = this.contactForm.querySelector('.form-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>TRANSMITTING...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            this.showFormMessage('Message transmitted successfully! I will respond soon.', 'success');
            this.contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    showFormMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.textContent = message;
        
        // Style the message
        messageElement.style.cssText = `
            padding: 15px;
            margin: 20px 0;
            border-radius: 8px;
            font-family: var(--font-primary);
            font-size: 0.9rem;
            font-weight: 500;
            letter-spacing: 1px;
            background: ${type === 'success' ? 'rgba(0, 188, 212, 0.1)' : 'rgba(255, 82, 82, 0.1)'};
            color: ${type === 'success' ? 'var(--primary-color)' : '#ff5252'};
            border: 1px solid ${type === 'success' ? 'rgba(0, 188, 212, 0.3)' : 'rgba(255, 82, 82, 0.3)'};
            animation: slideInDown 0.3s ease;
        `;
        
        // Insert message
        this.contactForm.appendChild(messageElement);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    // Utility Functions
    handleResize() {
        // Close mobile menu on resize
        if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }

    handleKeyPress(e) {
        // Close mobile menu on Escape key
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }

    // Sound Effects (Optional)
    playSound(type) {
        // Create audio context for futuristic sound effects
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioCtx = new AudioContext();
            
            let frequency;
            switch (type) {
                case 'hover':
                    frequency = 800;
                    break;
                case 'click':
                    frequency = 1000;
                    break;
                case 'success':
                    frequency = 600;
                    break;
                default:
                    frequency = 500;
            }
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
        }
    }

    // Animation Helpers
    startAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInDown {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .hero-content > * {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease;
            }
        `;
        document.head.appendChild(style);
    }
}

// Global functions for button clicks
function scrollToSection(sectionId) {
    const portfolio = window.jarvisPortfolio;
    if (portfolio) {
        portfolio.scrollToSection(sectionId);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.jarvisPortfolio = new JarvisPortfolio();
});

// Add interactive button effects
document.addEventListener('DOMContentLoaded', () => {
    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
        });
    });
    
    // Add click ripple effect
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
});

// Console welcome message
console.log(`
    ╔══════════════════════════════════════════════════════════════════╗
    ║                         JARVIS PORTFOLIO                         ║
    ║                      SYSTEM INITIALIZATION                       ║
    ║                                                                  ║
    ║  > All systems operational                                       ║
    ║  > User interface loaded successfully                            ║
    ║  > Interactive elements active                                   ║
    ║  > Ready for user interaction                                    ║
    ║                                                                  ║
    ║  Welcome to the digital universe!                               ║
    ╚══════════════════════════════════════════════════════════════════╝
`);
