document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================
       SCROLL ANIMATIONS (Intersection Observer)
       ========================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const hiddenSections = document.querySelectorAll('.section-hidden');
    hiddenSections.forEach(section => {
        observer.observe(section);
    });

    /* ==========================================================
       NAVBAR SCROLL EFFECT
       ========================================================== */
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================
       3D TILT EFFECT
       ========================================================== */
    const tiltElements = document.querySelectorAll('.tilt-element');

    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            
            // Calculate mouse position strictly bounded within the element
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate max rotation based on distance from center 
            // Max rotation is 10deg. The further from center, the higher the rotation.
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            element.style.transition = 'none'; // removing transition for snappy feel while moving
        });

        element.addEventListener('mouseleave', () => {
            // Reset to defaults
            element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
        });
        
        element.addEventListener('mouseenter', () => {
            element.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)';
        });
    });
});