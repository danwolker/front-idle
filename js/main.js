document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Lightbox Modal for Screenshots
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(imgSrc, captionText) {
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = captionText || '';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }, 300);
    }

    // Attach click listener to gallery cards
    document.querySelectorAll('.gallery-card, .clickable-img-container').forEach(card => {
        card.addEventListener('click', () => {
            const imgSrc = card.getAttribute('data-img');
            const titleText = card.getAttribute('data-title');
            if (imgSrc) {
                openLightbox(imgSrc, titleText);
            }
        });
    });

    // Close Lightbox events
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    // FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const icon = header.querySelector('.icon');
            
            // Toggle current content
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.textContent = '+';
                header.style.color = 'var(--text-main)';
            } else {
                // Close all others
                document.querySelectorAll('.accordion-content').forEach(item => {
                    item.style.maxHeight = null;
                });
                document.querySelectorAll('.accordion-header .icon').forEach(ic => {
                    ic.textContent = '+';
                });
                document.querySelectorAll('.accordion-header').forEach(h => {
                    h.style.color = 'var(--text-main)';
                });
                
                content.style.maxHeight = content.scrollHeight + "px";
                icon.textContent = '-';
                header.style.color = 'var(--primary-color)';
            }
        });
    });

    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-up').forEach(element => {
        observer.observe(element);
    });
    
});
