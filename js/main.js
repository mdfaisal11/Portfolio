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

/* ========================================================
   CERTIFICATION PHOTO UPLOAD, STORAGE & MODAL LIGHTBOX
   ======================================================== */
const certDetails = {
    'ccna': { title: 'CCNA (Cisco Certified)', issuer: 'Cisco Systems', defaultPath: 'certs/ccna.jpg' },
    'ccnp-encor': { title: 'CCNP ENCOR', issuer: 'Cisco Enterprise Core (Studying)', defaultPath: 'certs/ccnp-encor.jpg' },
    'ccnp-enarsi': { title: 'CCNP ENARSI', issuer: 'Cisco Enterprise Advanced Routing and Services (Studying)', defaultPath: 'certs/ccnp-enarsi.jpg' },
    'fortinet-nse3': { title: 'Fortinet NSE 3', issuer: 'Fortinet Network Security Expert', defaultPath: 'certs/fortinet-nse3.jpg' },
    'sophos-engineer': { title: 'Sophos Firewall Engineer', issuer: 'Sophos Certified Engineer', defaultPath: 'certs/sophos-engineer.jpg' },
    'siem-soc': { title: 'SIEM/SOC Fundamentals', issuer: 'Security Operations Center', defaultPath: 'certs/siem-soc.jpg' },
    'ethical-hacking': { title: 'Ethical Hacking Essentials', issuer: 'Cybersecurity Fundamentals', defaultPath: 'certs/ethical-hacking.jpg' },
    'digital-forensics': { title: 'Digital Forensics Essentials', issuer: 'Forensic Investigation', defaultPath: 'certs/digital-forensics.jpg' }
};

let currentModalCertId = null;

// Initialize certificate photos from localStorage or default folder
function initCertificates() {
    Object.keys(certDetails).forEach(certId => {
        const container = document.getElementById(`cert-photo-${certId}`);
        if (!container) return;
        
        const img = container.querySelector('.cert-photo-img');
        if (!img) return;
        
        const savedPhoto = localStorage.getItem(`cert_photo_${certId}`);
        if (savedPhoto) {
            img.src = savedPhoto;
            container.classList.add('has-photo');
        } else {
            // Test if default file exists in certs/ directory
            const testImg = new Image();
            testImg.onload = function() {
                img.src = certDetails[certId].defaultPath;
                container.classList.add('has-photo');
            };
            testImg.onerror = function() {
                container.classList.remove('has-photo');
            };
            testImg.src = certDetails[certId].defaultPath;
        }
    });
}

// Upload file handler
function handleCertUpload(file, certId) {
    if (!file || !file.type.startsWith('image/')) {
        showCertToast('Please select a valid image file (PNG, JPG, JPEG, WEBP)', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        // Save to browser localStorage
        try {
            localStorage.setItem(`cert_photo_${certId}`, dataUrl);
        } catch (err) {
            console.warn('Storage quota exceeded or error saving to localStorage', err);
        }
        
        // Update card preview
        const container = document.getElementById(`cert-photo-${certId}`);
        if (container) {
            const img = container.querySelector('.cert-photo-img');
            if (img) {
                img.src = dataUrl;
                container.classList.add('has-photo');
            }
        }
        
        // Update modal if currently opened
        if (currentModalCertId === certId) {
            updateModalView(certId);
        }
        
        const certName = certDetails[certId] ? certDetails[certId].title : 'Certificate';
        showCertToast(`✅ ${certName} photo uploaded successfully!`);
    };
    reader.readAsDataURL(file);
}

// Open Certificate Modal Viewer
function openCertModal(certId) {
    const cert = certDetails[certId];
    if (!cert) return;
    
    currentModalCertId = certId;
    const modalBackdrop = document.getElementById('cert-modal-backdrop');
    const modalTitle = document.getElementById('cert-modal-title-text');
    const modalIssuer = document.getElementById('cert-modal-issuer-text');
    const filenameHint = document.getElementById('cert-modal-filename-hint');
    
    if (modalTitle) modalTitle.textContent = cert.title;
    if (modalIssuer) modalIssuer.textContent = cert.issuer;
    if (filenameHint) filenameHint.textContent = `certs/${certId}.jpg`;
    
    updateModalView(certId);
    
    if (modalBackdrop) {
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Update modal image or empty state
function updateModalView(certId) {
    const modalImg = document.getElementById('cert-modal-img');
    const emptyState = document.getElementById('cert-modal-empty-state');
    const downloadBtn = document.getElementById('cert-modal-download-btn');
    const cert = certDetails[certId];
    
    const savedPhoto = localStorage.getItem(`cert_photo_${certId}`);
    let photoSrc = savedPhoto || null;
    
    const container = document.getElementById(`cert-photo-${certId}`);
    if (!photoSrc && container && container.classList.contains('has-photo')) {
        const img = container.querySelector('.cert-photo-img');
        if (img && img.src) photoSrc = img.src;
    }
    
    if (photoSrc) {
        if (modalImg) {
            modalImg.src = photoSrc;
            modalImg.classList.add('active');
        }
        if (emptyState) emptyState.style.display = 'none';
        if (downloadBtn) {
            downloadBtn.style.display = 'inline-flex';
            downloadBtn.onclick = function() {
                const a = document.createElement('a');
                a.href = photoSrc;
                a.download = `${certId}-certificate.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        }
    } else {
        if (modalImg) {
            modalImg.classList.remove('active');
            modalImg.removeAttribute('src');
        }
        if (emptyState) emptyState.style.display = 'block';
        if (downloadBtn) downloadBtn.style.display = 'none';
    }
}

// Close Certificate Modal
function closeCertModal() {
    const modalBackdrop = document.getElementById('cert-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = '';
    }
    currentModalCertId = null;
}

// Toast notification helper
function showCertToast(message, type = 'success') {
    let toast = document.getElementById('cert-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cert-toast';
        toast.className = 'cert-toast';
        document.body.appendChild(toast);
    }
    
    toast.className = `cert-toast ${type === 'error' ? 'error' : 'success'}`;
    toast.innerHTML = `<i class="fas ${type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i> <span>${message}</span>`;
    toast.classList.add('active');
    
    setTimeout(() => {
        toast.classList.remove('active');
    }, 4000);
}

// Wire up event listeners for certificate buttons and inputs
document.addEventListener('DOMContentLoaded', () => {
    initCertificates();
    
    // Wire file inputs on cards
    document.querySelectorAll('.cert-upload-input').forEach(input => {
        input.addEventListener('change', function(e) {
            const certId = this.getAttribute('data-cert-id');
            if (this.files && this.files[0] && certId) {
                handleCertUpload(this.files[0], certId);
                this.value = ''; // Reset input to allow re-uploading same file
            }
        });
    });
    
    // Wire View Certificate buttons & containers
    document.querySelectorAll('.btn-view-cert, .cert-photo-container').forEach(el => {
        el.addEventListener('click', function(e) {
            // Prevent triggering if clicked directly on input or button inside container
            if (e.target.tagName.toLowerCase() === 'input') return;
            const certId = this.getAttribute('data-cert-id');
            if (certId) {
                openCertModal(certId);
            }
        });
    });
    
    // Modal Close handlers
    const modalCloseBtn = document.getElementById('cert-modal-close-btn');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeCertModal);
    }
    
    const modalBackdrop = document.getElementById('cert-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCertModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCertModal();
        }
    });
    
    // Modal upload input
    const modalUploadInput = document.getElementById('cert-modal-upload-input');
    if (modalUploadInput) {
        modalUploadInput.addEventListener('change', function() {
            if (this.files && this.files[0] && currentModalCertId) {
                handleCertUpload(this.files[0], currentModalCertId);
                this.value = '';
            }
        });
    }
    
    // Modal remove photo button
    const removePhotoBtn = document.getElementById('cert-modal-remove-btn');
    if (removePhotoBtn) {
        removePhotoBtn.addEventListener('click', function() {
            if (!currentModalCertId) return;
            localStorage.removeItem(`cert_photo_${currentModalCertId}`);
            
            const container = document.getElementById(`cert-photo-${currentModalCertId}`);
            if (container) {
                container.classList.remove('has-photo');
                const img = container.querySelector('.cert-photo-img');
                if (img) img.removeAttribute('src');
            }
            
            updateModalView(currentModalCertId);
            showCertToast('Certificate photo removed from browser cache.');
        });
    }
});

