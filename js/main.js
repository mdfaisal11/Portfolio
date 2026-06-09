// Smooth scrolling for navigation links
document.querySelectorAll('.nav-links a, .hero-buttons a[href^="#"], .btn[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if(targetId && targetId !== '#' && targetId.startsWith('#')) {
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// Contact form handling (simulated submit - demo mode)
const contactForm = document.getElementById('network-contact');
const feedback = document.getElementById('form-feedback');

if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = contactForm.querySelector('input[placeholder="Full name"]');
        const emailInput = contactForm.querySelector('input[placeholder="Email address"]');
        const msgArea = contactForm.querySelector('textarea');
        
        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const message = msgArea ? msgArea.value.trim() : '';
        
        if(name === '' || email === '' || message === '') {
            if(feedback) {
                feedback.innerHTML = '<span style="color:#e11d48;">⚠️ Please fill all fields before sending.</span>';
                setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 3000);
            }
            return;
        }
        
        if(!email.includes('@')) {
            if(feedback) {
                feedback.innerHTML = '<span style="color:#e11d48;">📧 Enter a valid email address.</span>';
                setTimeout(() => { if(feedback) feedback.innerHTML = ''; }, 3000);
            }
            return;
        }
        
        if(feedback) {
            feedback.innerHTML = '<span style="color:#10b981;">✅ Thanks! (Demo mode) I\'ll get back to you soon.</span>';
        }
        
        if(contactForm) contactForm.reset();
        
        setTimeout(() => { 
            if(feedback) feedback.innerHTML = ''; 
        }, 4000);
    });
}

// Dynamic copyright year update
const footerParagraph = document.querySelector('footer p');
if(footerParagraph) {
    const currentYear = new Date().getFullYear();
    footerParagraph.innerHTML = footerParagraph.innerHTML.replace('2026', currentYear);
}

// Active nav link highlighting on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    const scrollPosition = window.scrollY + 120;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if(scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').substring(1);
        if(href === current) {
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