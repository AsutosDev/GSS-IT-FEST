import { db } from '../firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// All Items Page Logic
document.addEventListener('DOMContentLoaded', async () => {
    let items = [];

    // Fetch items from Firestore
    try {
        const querySnapshot = await getDocs(collection(db, "items"));
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
        });
        
        // If no items in DB, fallback to some sample data or empty
        if (items.length === 0) {
            console.log("No items found in DB.");
        }
    } catch (e) {
        console.error("Error fetching documents: ", e);
    }

    // Expose items to global scope
    window.allItems = items;

    const container = document.getElementById('items-container');
    let currentFilter = 'All';

    // URL Search Param Logic
    const urlParams = new URLSearchParams(window.location.search);
    let initialSearch = urlParams.get('search');

    // Render items with optional search
    window.renderItems = function(filter = 'All', searchQuery = '') {
        if(!container) return; // Guard clause

        container.innerHTML = '';
        
        let filteredItems = window.allItems; // Use global items

        // Apply Category Filter
        if (filter !== 'All') {
            filteredItems = filteredItems.filter(item => item.category === filter);
        }

        // Apply Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filteredItems = filteredItems.filter(item => 
                item.name.toLowerCase().includes(lowerQuery) || 
                item.category.toLowerCase().includes(lowerQuery) ||
                item.owner.toLowerCase().includes(lowerQuery) ||
                (item.location && item.location.toLowerCase().includes(lowerQuery))
            );
        }

        if (filteredItems.length === 0) {
            container.innerHTML = '<div class="no-items">No items found.</div>';
            return;
        }

        filteredItems.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card scroll-animate';
            card.style.animationDelay = `${(index % 12) * 0.05}s`;
            
            card.innerHTML = `
                <div class="item-image">
                    <i data-lucide="${getCategoryIcon(item.category)}"></i>
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <div>
                            <h3 class="item-title">${item.name}</h3>
                            <span class="item-category">${item.category}</span>
                        </div>
                    </div>
                    <div class="item-owner">
                        <div class="owner-avatar">${item.owner[0]}</div>
                        <div class="owner-info">
                            <span>${item.owner}</span>
                            ${item.location ? `<span class="item-location">${item.location}</span>` : ''}
                        </div>
                    </div>
                    <div class="item-meta">
                        <div class="item-price">
                            $${item.price}<span>/day</span>
                        </div>
                        <div class="item-status ${item.available ? '' : 'unavailable'}">
                            <i data-lucide="${item.available ? 'check-circle' : 'x-circle'}"></i>
                            ${item.available ? 'Available' : 'Rented'}
                        </div>
                    </div>
                </div>
            `;
            
            container.appendChild(card);
        });

        // Reinitialize Lucide icons
        if(window.lucide) lucide.createIcons();

        // Trigger scroll animation
        setTimeout(() => {
            document.querySelectorAll('.scroll-animate').forEach(el => {
                el.classList.add('visible');
            });
        }, 100);
    }


    // Get category icon
    function getCategoryIcon(category) {
        const icons = {
            'Bag': 'backpack',
            'Bat': 'zap',
            'Ball': 'circle',
            'Skirt': 'shirt',
            'Cap': 'hat',
            'Gloves': 'hand',
            'Tools': 'wrench',
            'Vehicles': 'car-front',
            'Books': 'book-open',
            'Camping': 'tent',
            'Music': 'music',
            'Camera': 'camera',
            'Electronics': 'laptop',
            'Services': 'briefcase'
        };
        return icons[category] || 'package';
    }

    // Filter chips
    const chips = document.querySelectorAll('.filter-chips .chip');
    chips.forEach(chip => {
        chip.addEventListener('click', (e) => {
            // If it's a link chip (has href), let it navigate naturally.
            if (chip.tagName === 'A') return;

            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.textContent;
            renderItems(currentFilter);
        });
    });

    // View toggle
    const viewToggles = document.querySelectorAll('.view-toggle');
    viewToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            viewToggles.forEach(t => t.classList.remove('active'));
            toggle.classList.add('active');
            
            if (toggle.dataset.view === 'list') {
                container.classList.add('list-view');
            } else {
                container.classList.remove('list-view');
            }
        });
    });

    // Local Search Input Logic
    const localSearchInput = document.querySelector('.nav-input.search-grow');
    if (localSearchInput) {
        // If there was an initial search, populate the input
        if (initialSearch) {
            localSearchInput.value = initialSearch;
        }

        localSearchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            renderItems(currentFilter, query);
        });
    }

    // Initial render logic
    if (window.pageCategory) {
        currentFilter = window.pageCategory;
        const pageTitle = document.querySelector('.page-title');
        if(pageTitle) pageTitle.textContent = `${window.pageCategory} Items`;
        renderItems(currentFilter, initialSearch || '');
    } else {
        renderItems('All', initialSearch || '');
    }
});
