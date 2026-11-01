// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a, .hero-buttons a[href^="#"], .btn[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId && targetId !== '#' && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Mobile menu toggle
const mobileToggle = document.getElementById('mobile-toggle');
const navLinksContainer = document.getElementById('nav-links');

if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            if (navLinksContainer.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        }
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// Contact form handling with prefilled mailto email trigger
const contactForm = document.getElementById('network-contact');
const feedback = document.getElementById('form-feedback');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const msgArea = document.getElementById('form-message');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = msgArea ? msgArea.value.trim() : '';
        
        if (name === '' || email === '' || message === '') {
            if (feedback) {
                feedback.innerHTML = '<span style="color:#e11d48;">⚠️ Please fill in all fields before sending.</span>';
                setTimeout(() => { if (feedback) feedback.innerHTML = ''; }, 3500);
            }
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            if (feedback) {
                feedback.innerHTML = '<span style="color:#e11d48;">📧 Please enter a valid email address.</span>';
                setTimeout(() => { if (feedback) feedback.innerHTML = ''; }, 3500);
            }
            return;
        }
        
        // Open default email client with pre-filled message
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:mdfaisalansari2202@gmail.com?subject=${subject}&body=${body}`;
        
        if (feedback) {
            feedback.innerHTML = '<span style="color:#10b981;">✅ Opening your email client to send your message...</span>';
        }

        window.location.href = mailtoUrl;
        contactForm.reset();
        
        setTimeout(() => { 
            if (feedback) feedback.innerHTML = ''; 
        }, 5000);
    });
}

// Dynamic copyright year update
const yearSpan = document.getElementById('year');
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// Active nav link highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 140;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if (href === current) {
            link.style.color = '#1e6b9e';
            link.style.fontWeight = '700';
        } else {
            link.style.color = '#1e293b';
            link.style.fontWeight = '600';
        }
    });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);
