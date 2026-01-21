document.addEventListener('DOMContentLoaded', () => {
    // Brand Slider Interaction
    const brandItems = document.querySelectorAll('.brand-item');
    brandItems.forEach(item => {
        item.addEventListener('click', () => {
            brandItems.forEach(b => b.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Filter Chips Interaction
    const chips = document.querySelectorAll('.chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px" // Adjusted margin to trigger slightly before bottom
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    // Select elements to animate and add the base class
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-visual, .car-card, .feature-card, .modern-app > div, .footer-cta-card');
    
    elementsToAnimate.forEach((el, index) => {
        el.classList.add('scroll-animate');
        // Add a slight delay for staggered items like cards
        if(el.classList.contains('car-card') || el.classList.contains('feature-card')) {
             el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        }
        observer.observe(el);
    });

    // Custom Select Dropdown
    const customSelect = document.querySelector('.custom-select');
    if (customSelect) {
        const trigger = customSelect.querySelector('.select-trigger');
        const options = customSelect.querySelectorAll('.select-option');
        const label = customSelect.querySelector('.select-label');

        // Toggle dropdown
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('active');
        });

        // Select option
        options.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.getAttribute('data-value');
                label.textContent = option.textContent;
                customSelect.classList.remove('active');
                // You can add additional logic here (e.g., filter items)
                console.log('Selected:', value);
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                 customSelect.classList.remove('active');
            }
            // Search Input Redirect (Home Page)
    const searchInput = document.querySelector('.nav-input.search-grow');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `all-items.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    }
});
    }

    // Settings Menu Interaction
    const settingsBtn = document.getElementById('settings-btn');
    const settingsMenu = document.getElementById('settings-menu');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    if (settingsBtn && settingsMenu) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!settingsMenu.contains(e.target) && !settingsBtn.contains(e.target)) {
                settingsMenu.classList.remove('active');
            }
        });
    }

    // Dark Mode Toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
        });
    }
});
