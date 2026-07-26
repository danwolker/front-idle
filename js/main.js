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

    // Mobile Menu Toggle & Auto-Close Drawer
    const menuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-active');
            document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : '';
        });

        // Fechar ao clicar em qualquer link de navegação
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            });
        });

        // Fechar ao clicar fora da gaveta
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('mobile-active') && !navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('mobile-active');
                document.body.style.overflow = '';
            }
        });
    }

    // Modules Category Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const moduleCards = document.querySelectorAll('.module-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to current
            button.classList.add('active');

            const category = button.getAttribute('data-category');

            moduleCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
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

    // Scroll Ladder Robot Animation
    const ladderWidget = document.querySelector('.scroll-ladder-widget');
    const robotEl = document.getElementById('scrollClimbingRobot');

    if (ladderWidget && robotEl) {
        let currentY = 0;
        let targetY = 0;
        let scrollStopTimer = null;
        let isTicking = false;

        function updateRobotPosition() {
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;
            const maxScroll = Math.max(1, scrollHeight - clientHeight);
            
            const scrollProgress = Math.min(1, Math.max(0, window.scrollY / maxScroll));

            const ladderHeight = ladderWidget.clientHeight;
            const robotHeight = robotEl.clientHeight;

            // Travel range inside the ladder container (from top to bottom margin)
            const minPadding = 8;
            const maxPadding = 12;
            const travelDistance = Math.max(0, ladderHeight - robotHeight - minPadding - maxPadding);

            targetY = minPadding + (scrollProgress * travelDistance);
            
            // Smooth lerp for fluid motion
            currentY += (targetY - currentY) * 0.16;

            // Apply smooth CSS transform Y
            robotEl.style.transform = `translate(-50%, ${currentY.toFixed(2)}px)`;

            // Continue animation frame if not yet reached target
            if (Math.abs(targetY - currentY) > 0.1) {
                requestAnimationFrame(updateRobotPosition);
            } else {
                isTicking = false;
            }
        }

        function onScroll() {
            // Activate limb movement class while scrolling
            robotEl.classList.add('is-climbing');

            if (scrollStopTimer) clearTimeout(scrollStopTimer);

            scrollStopTimer = setTimeout(() => {
                robotEl.classList.remove('is-climbing');
            }, 160);

            if (!isTicking) {
                isTicking = true;
                requestAnimationFrame(updateRobotPosition);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            updateRobotPosition();
        }, { passive: true });

        // Initial calculation
        updateRobotPosition();
    }

    // Image Lightbox & Zoom Feature
    const lightboxModal = document.getElementById('imageLightboxModal');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxDesc = document.getElementById('lightboxDescription');
    const closeBtn = document.getElementById('lightboxCloseBtn');
    const backdrop = document.querySelector('.lightbox-backdrop');
    const zoomInBtn = document.getElementById('zoomInBtn');
    const zoomOutBtn = document.getElementById('zoomOutBtn');
    const zoomResetBtn = document.getElementById('zoomResetBtn');

    let currentZoom = 1;
    const minZoom = 0.8;
    const maxZoom = 3.2;
    const zoomStep = 0.3;

    function updateZoom(newZoom) {
        currentZoom = Math.min(maxZoom, Math.max(minZoom, newZoom));
        if (lightboxImg) {
            lightboxImg.style.transform = `scale(${currentZoom})`;
            lightboxImg.style.cursor = currentZoom > 1 ? 'zoom-out' : 'zoom-in';
        }
    }

    function openLightbox(imgSrc, titleText, descText) {
        if (!lightboxModal || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        if (lightboxTitle) lightboxTitle.textContent = titleText;
        if (lightboxDesc) lightboxDesc.textContent = descText;
        currentZoom = 1;
        updateZoom(1);

        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click listener to module cards
    document.querySelectorAll('.module-card').forEach(card => {
        const imgContainer = card.querySelector('.module-img-container');
        const img = card.querySelector('.module-img');
        const title = card.querySelector('.module-content h3');
        const desc = card.querySelector('.module-content p');

        if (imgContainer && img) {
            // Add zoom hint badge on image hover
            const hint = document.createElement('div');
            hint.className = 'img-zoom-hint';
            hint.innerHTML = '<span>🔍 Clique para ampliar</span>';
            imgContainer.appendChild(hint);

            imgContainer.addEventListener('click', () => {
                openLightbox(img.src, title ? title.textContent : '', desc ? desc.textContent : '');
            });
        }
    });

    // Zoom Controls
    if (zoomInBtn) zoomInBtn.addEventListener('click', (e) => { e.stopPropagation(); updateZoom(currentZoom + zoomStep); });
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', (e) => { e.stopPropagation(); updateZoom(currentZoom - zoomStep); });
    if (zoomResetBtn) zoomResetBtn.addEventListener('click', (e) => { e.stopPropagation(); updateZoom(1); });

    // Toggle Zoom on clicking image inside modal
    if (lightboxImg) {
        lightboxImg.addEventListener('click', (e) => {
            e.stopPropagation();
            updateZoom(currentZoom > 1 ? 1 : 1.8);
        });
    }

    // Close Modal Events
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal && lightboxModal.classList.contains('active')) {
            closeLightbox();
        }
    });
});


