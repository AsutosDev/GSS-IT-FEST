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

    // Generic Custom Select Logic
    function setupCustomSelect(selectElement) {
        const trigger = selectElement.querySelector('.select-trigger');
        const options = selectElement.querySelectorAll('.select-option');
        const label = selectElement.querySelector('.select-label');

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            // Close other selects
            document.querySelectorAll('.custom-select').forEach(s => {
                if(s !== selectElement) s.classList.remove('active');
            });
            selectElement.classList.toggle('active');
        });

        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent closing immediately
                const value = option.getAttribute('data-value');
                label.textContent = option.textContent;
                label.setAttribute('data-selected-value', value); // Store value
                selectElement.classList.remove('active');
            });
        });
    }

    // Initialize all custom selects
    document.querySelectorAll('.custom-select').forEach(setupCustomSelect);

    // Global click to close selects
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.custom-select')) {
             document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('active'));
        }
    });

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

    // Share Modal Logic
    const shareModal = document.getElementById('share-modal');
    const fabBtn = document.getElementById('fab-share-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const shareForm = document.getElementById('share-item-form');

    if (shareModal && fabBtn && closeModalBtn) {
        // Open Modal
        fabBtn.addEventListener('click', () => {
            shareModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        // Close Modal
        function closeShareModal() {
            shareModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeModalBtn.addEventListener('click', closeShareModal);

        // Close on outside click
        shareModal.addEventListener('click', (e) => {
            if (e.target === shareModal) closeShareModal();
        });

        // Form Submit
        if (shareForm) {
            shareForm.addEventListener('submit', (e) => {
                e.preventDefault();

                // Gather Data
                const itemName = shareForm.querySelector('[name="itemName"]').value;
                const itemPrice = shareForm.querySelector('[name="itemPrice"]').value;
                const itemExpiry = shareForm.querySelector('[name="itemExpiry"]').value;
                const itemLocation = shareForm.querySelector('[name="itemLocation"]').value;
                
                // Get Category from custom select
                const categoryLabel = document.getElementById('form-category-label');
                const category = categoryLabel.getAttribute('data-selected-value');

                if (!category) {
                    alert('Please select a category');
                    return;
                }

                // Create Item Object
                const newItem = {
                    id: Date.now(), // Simple unique ID
                    name: itemName,
                    category: category,
                    owner: "You", // Default owner for now
                    price: parseFloat(itemPrice),
                    available: true,
                    location: itemLocation,
                    expiryDate: itemExpiry,
                    // Image would normally be uploaded to a server. 
                    // For now, we'll placeholder or leave mock logic if available.
                };

                // Add to Global Items (Mock Backend)
                if (window.allItems) {
                    window.allItems.unshift(newItem); // Add to beginning
                    
                    // Save to LocalStorage for persistence across pages
                    const storedItems = JSON.parse(localStorage.getItem('userSharedItems') || '[]');
                    storedItems.unshift(newItem);
                    localStorage.setItem('userSharedItems', JSON.stringify(storedItems));

                    console.log('New Item Added & Saved:', newItem);
                    
                    // Re-render if possible (if on all-items page or if we want to show it somewhere)
                    if (window.renderItems) {
                        window.renderItems();
                    }
                    
                    alert('Item Shared Successfully!');
                    shareForm.reset();
                    categoryLabel.textContent = 'Select Category';
                    categoryLabel.removeAttribute('data-selected-value');
                    closeShareModal();
                    
                    // Optional: Navigate to All Items to see it?
                    // window.location.href = 'all-items.html';
                } else {
                    console.error('Window.allItems not found. Is all-items.js loaded?');
                    // Fallback for demo if all-items isn't loaded on this page
                     alert('Item ready to process for backend!\n' + JSON.stringify(newItem, null, 2));
                     closeShareModal();
                }
            });
        }
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
