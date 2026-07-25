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
