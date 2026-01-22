import { db, auth } from "./firebase.js";
import { collection, addDoc, getDocs, query, orderBy, where } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    // Brand Slider Interaction
    const brandItems = document.querySelectorAll('.brand-item');
    brandItems.forEach(item => {
        item.addEventListener('click', () => {
            brandItems.forEach(b => b.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Filter Chips Interaction (Homepage Fleet Section)
    const chips = document.querySelectorAll('.vehicle-fleet .chip');
    const fleetGrid = document.querySelector('.fleet-grid');
    
    // Mock data for homepage categories
    const categoryIcons = {
        'Bag': 'backpack', 'Bat': 'zap', 'ball': 'circle', 'skirt': 'shirt', 'Cap': 'hat', 'Gloves': 'hand',
        'Tools': 'wrench', 'Vehicles': 'car-front', 'Books': 'book-open', 'Camping': 'tent', 
        'Music': 'music', 'Camera': 'camera', 'Electronics': 'laptop', 'Services': 'briefcase',
        'Cars': 'car'
    };

    function updateFleetGrid(category) {
        if (!fleetGrid) return;

        // Keep the "View All" card
        const viewAllCard = fleetGrid.querySelector('.view-all-card');
        fleetGrid.innerHTML = '';
        
        // Generate 6-7 cards for the category
        const count = 7;
        for (let i = 0; i < count; i++) {
            const isLarge = i < 3;
            const card = document.createElement('div');
            card.className = `car-card ${isLarge ? 'large' : 'small'} scroll-animate visible`;
            card.style.animationDelay = `${i * 0.05}s`;
            
            // For "Vehicles" and "Cars", we can show car images
            let content = '';
            const catLower = category.toLowerCase();
            if (catLower === 'vehicles' || catLower === 'cars') {
                // Mock car images for vehicles or some placeholder images
                const imgNum = (i % 4) + 1;
                content = `<img src="assets/car_thumb_${imgNum}.png" alt="${category}">`;
            } else {
                const iconName = categoryIcons[category] || 'package';
                content = `
                    <div class="item-icon-display" style="font-size: 4rem; display: flex; align-items: center; justify-content: center; height: 100%; width: 100%; color: #999;">
                        <i data-lucide="${iconName}" style="width: 60px; height: 60px;"></i>
                    </div>
                `;
            }
            
            card.innerHTML = content;
            fleetGrid.appendChild(card);
        }
        
        // Re-append view all card
        if (viewAllCard) {
            fleetGrid.appendChild(viewAllCard);
        }
        
        // Re-init icons
        if (window.lucide) lucide.createIcons();
    }

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const category = chip.textContent;
            updateFleetGrid(category);
        });
    });

    // Initialize with the first active chip found
    const activeChip = document.querySelector('.vehicle-fleet .chip.active');
    if (activeChip) {
        updateFleetGrid(activeChip.textContent);
    }

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
    const elementsToAnimate = document.querySelectorAll('.hero-content, .hero-visual, .car-card, .feature-card, .modern-app > div, .footer-cta-card, .app-mockup-image');
    
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

    // Search & Location Input Redirect (Home Page)
    const searchInput = document.querySelector('.nav-input.search-grow');
    const locationInput = document.querySelector('.location-search-input');

    function performRedirect() {
        const query = searchInput ? searchInput.value.trim() : '';
        const loc = locationInput ? locationInput.value.trim() : '';
        
        if (query || loc) {
            const params = new URLSearchParams();
            if (query) params.append('search', query);
            if (loc) params.append('location', loc);
            window.location.href = `all-items.html?${params.toString()}`;
        }
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performRedirect();
        });
    }

    if (locationInput) {
        locationInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performRedirect();
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
            shareForm.addEventListener('submit', async (e) => {

                e.preventDefault();

                // Gather Data
                const itemName = shareForm.querySelector('[name="itemName"]').value;
                const itemPrice = shareForm.querySelector('[name="itemPrice"]').value;
                const itemExpiry = shareForm.querySelector('[name="itemExpiry"]').value;
                const itemLocation = shareForm.querySelector('[name="itemLocation"]').value;
                const itemEmail = shareForm.querySelector('[name="itemEmail"]').value;
                
                // Get Category from custom select
                const categoryLabel = document.getElementById('form-category-label');
                const category = categoryLabel.getAttribute('data-selected-value');

                if (!category) {
                    alert('Please select a category');
                    return;
                }
                // Create Standardized Item Object (Firebase Ready)
                const now = new Date().toISOString();
                const user = auth.currentUser;
                
                const newItem = {
                    ownerId: user ? user.uid : "user_placeholder_123",
                    ownerName: user ? (user.displayName || "You") : "You",
                    ownerEmail: user ? user.email : itemEmail,
                    name: itemName,
                    category: category,
                    price: parseFloat(itemPrice),
                    available: true,
                    location: itemLocation,
                    email: itemEmail,
                    expiryDate: itemExpiry,
                    createdAt: now,
                    updatedAt: now
                };

                try {
                    // Add to Firestore (Let Firestore generate the ID)
                    const docRef = await addDoc(collection(db, "items"), newItem);
                    console.log("Document written with ID: ", docRef.id);
                    
                    // Add the generated ID to our local object
                    newItem.id = docRef.id;

                    // Save to LocalStorage for persistence across pages (optional backup/cache)
                    const storedItems = JSON.parse(localStorage.getItem('userSharedItems') || '[]');
                    storedItems.unshift(newItem);
                    localStorage.setItem('userSharedItems', JSON.stringify(storedItems));

                    console.log('New Item Added & Saved:', newItem);
                    
                    // Add to Global Items if available (on all-items page)
                    if (window.allItems) {
                        window.allItems.unshift(newItem); // Add to beginning
                        
                        // Re-render if possible
                        if (window.renderItems) {
                            window.renderItems();
                        }
                    }
                    
                    // Reset form
                    shareForm.reset();
                    categoryLabel.textContent = 'Select Category';
                    categoryLabel.removeAttribute('data-selected-value');
                    closeShareModal();
                    
                    // Show success message with option to view
                    const viewItem = confirm('Item shared successfully! 🎉\n\nWould you like to view your items in the dashboard?');
                    
                    if (viewItem) {
                        window.location.href = 'history.html';
                    }
                } catch (e) {
                    console.error("Error adding document: ", e);
                    alert("Error sharing item: " + e.message);
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

    // Logout Button Handler
    const logoutBtn = document.querySelector('.menu-link.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Clear any user data if needed
            // localStorage.clear(); // Uncomment if you want to clear all data
            // Redirect to login page
            window.location.href = '../loginpage/index.html';
        });
    }

    // Profile Button Handler
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }


    // Make Car Cards Clickable (Homepage Only)
    const carCards = document.querySelectorAll('.car-card:not(.view-all-card)');
    carCards.forEach(card => {
        // Add cursor pointer style
        card.style.cursor = 'pointer';
        
        // Add click handler
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on a link inside the card
            if (e.target.closest('a')) return;
            
            // Navigate to all-items page
            window.location.href = 'all-items.html';
        });

        // Add hover effect
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    // Notifications Logic
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-list');
    const clearNotifBtn = document.getElementById('clear-notif');

    window.updateNotifBadge = function() {
        if (!notifBadge) return;
        const notifs = JSON.parse(localStorage.getItem('userNotifications') || '[]');
        const count = notifs.length;
        if (count > 0) {
            notifBadge.textContent = count;
            notifBadge.classList.add('active');
        } else {
            notifBadge.classList.remove('active');
        }
    }

    function renderNotifications() {
        if (!notifList) return;
        const notifs = JSON.parse(localStorage.getItem('userNotifications') || '[]');
        
        if (notifs.length === 0) {
            notifList.innerHTML = '<div class="notif-empty">No new notifications</div>';
            return;
        }

        notifList.innerHTML = notifs.map(n => `
            <div class="notif-item" data-id="${n.id}">
                <div class="notif-title">${n.title}</div>
                <div class="notif-text">${n.text}</div>
                ${n.type === 'rental_request' ? `
                    <div class="notif-actions" style="margin-top: 10px;">
                        <button class="notif-btn notif-accept" onclick="handleRentalNotif('${n.id}', 'accepted')">Accept</button>
                        <button class="notif-btn notif-decline" onclick="handleRentalNotif('${n.id}', 'declined')">Decline</button>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    if (notifBtn && notifDropdown) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('active');
            if (notifDropdown.classList.contains('active')) {
                renderNotifications();
            }
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                notifDropdown.classList.remove('active');
            }
        });
    }

    if (clearNotifBtn) {
        clearNotifBtn.addEventListener('click', () => {
            localStorage.setItem('userNotifications', '[]');
            renderNotifications();
            updateNotifBadge();
        });
    }

    // Global handler for notification actions (Firebase structure)
    window.handleRentalNotif = function(notifId, action) {
        const notifs = JSON.parse(localStorage.getItem('userNotifications') || '[]');
        const notif = notifs.find(n => n.id === notifId);
        
        if (notif && action === 'accepted') {
            notif.status = 'accepted';
            
            // Add to rented history
            const rentedItems = JSON.parse(localStorage.getItem('userRentedItems') || '[]');
            const rentalRecord = {
                ...notif.data,
                status: 'accepted',
                updatedAt: new Date().toISOString()
            };
            rentedItems.unshift(rentalRecord);
            localStorage.setItem('userRentedItems', JSON.stringify(rentedItems));
            
            alert(`Rental for "${notif.item.name}" accepted!\n\nYou can now contact the requester ${notif.renter.name} at ${notif.renter.email}.`);
            
            // Re-render current page if applicable
            if (window.renderItems) window.renderItems(window.currentFilter, window.currentSearchQuery, window.currentLocationQuery);
        } else if (action === 'declined') {
            alert(`Rental for "${notif.item.name}" declined.`);
        }

        // Remove the notification from active list
        const updatedNotifs = notifs.filter(n => n.id !== notifId);
        localStorage.setItem('userNotifications', JSON.stringify(updatedNotifs));
        renderNotifications();
        updateNotifBadge();
    };

    window.updateNotifBadge();

    // Hero Car Scroll Animation
    const heroCar = document.getElementById('hero-car');
    if (heroCar) {
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroHeight = document.querySelector('.hero').offsetHeight;
            const progress = Math.min(scrollY / (heroHeight * 1.5), 1);
            
            // Driving off screen to the left and tilting
            const moveX = -progress * 1500; // Drive away
            const rotate = progress * 5; // Slight tilt
            const scale = 1 + (progress * 0.2); // Get larger as it comes "closer" or smaller if moving away (let's go with away)
            
            // Combined with existing float/slide animation if any, but we'll control it here
            heroCar.style.transform = `translateX(${moveX}px) rotate(${rotate}deg) scale(${1 - progress * 0.1})`;
            heroCar.style.opacity = 1 - progress;
        });
    }

    // App Mockup 3D Tilt Interaction
    const appVisual = document.querySelector('.app-visual');
    const appMockup = document.querySelector('.app-mockup-image');
    
    if (appVisual && appMockup) {
        function handleTilt(e) {
            const rect = appVisual.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            appMockup.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        }
        
        function resetTilt() {
            appMockup.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
        }
        
        appVisual.addEventListener('mousemove', handleTilt);
        appVisual.addEventListener('mouseleave', resetTilt);
        appVisual.addEventListener('touchstart', handleTilt, { passive: true });
        appVisual.addEventListener('touchend', resetTilt);
    }
});
