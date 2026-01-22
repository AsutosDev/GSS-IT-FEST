// Import Firebase Auth
import { auth } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.dataset.tab;
            console.log('Switching to tab:', target);

            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const targetSection = document.getElementById(`${target}-section`);
            if (targetSection) {
                targetSection.classList.add('active');
            } else {
                console.error(`Section not found: ${target}-section`);
            }
        });
    });

    // **Step 4: Display logged-in user**
    function displayCurrentUser() {
        const userDisplay = document.getElementById('user-display');
        const user = auth.currentUser;
        if (user) {
            userDisplay.textContent = `Logged in as: ${user.email}`;
        } else {
            userDisplay.textContent = `Not logged in`;
        }
    }

    // Step 5: Listen for auth state changes
    onAuthStateChanged(auth, user => {
        displayCurrentUser();
    });

    // Data Rendering
    function renderDashboard() {
        const sharedItems = JSON.parse(localStorage.getItem('userSharedItems') || '[]');
        const rentedItems = JSON.parse(localStorage.getItem('userRentedItems') || '[]');

        renderSharedItems(sharedItems);
        renderRentedItems(rentedItems);
        updateStats(sharedItems, rentedItems);
    }

    function renderSharedItems(items) {
        const container = document.getElementById('shared-container');
        const badge = document.getElementById('shared-badge');

        if (!items || items.length === 0) {
            badge.textContent = '0 Items';
            return;
        }

        badge.textContent = `${items.length} Item${items.length > 1 ? 's' : ''}`;
        container.innerHTML = '';

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card scroll-animate visible';
            card.style.animationDelay = `${index * 0.1}s`;

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
                    <div class="item-meta">
                        <div class="item-price">
                            $${item.price}<span>/day</span>
                        </div>
                        <div class="item-status">
                            <i data-lucide="map-pin"></i>
                            ${item.location || 'N/A'}
                        </div>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }

    function renderRentedItems(items) {
        const container = document.getElementById('rented-container');
        const badge = document.getElementById('rented-badge');

        if (!items || items.length === 0) {
            badge.textContent = '0 Items';
            return;
        }

        badge.textContent = `${items.length} Item${items.length > 1 ? 's' : ''}`;
        container.innerHTML = '';

        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'item-card scroll-animate visible';
            card.style.animationDelay = `${index * 0.1}s`;

            const itemName = item.item ? item.item.name : item.name;
            const category = item.item ? item.item.category : item.category;
            const price = item.item ? `$${item.item.price}` : item.price;
            const startDate = item.dates ? item.dates.start : item.startDate;
            const endDate = item.dates ? item.dates.end : item.endDate;
            const owner = item.ownerName || item.owner || 'Unknown';

            const start = startDate ? new Date(startDate).toLocaleDateString() : 'N/A';
            const end = endDate ? new Date(endDate).toLocaleDateString() : 'N/A';

            card.innerHTML = `
                <div class="item-image" style="background: rgba(255, 45, 85, 0.1); color: #FF2D55;">
                    <i data-lucide="${getCategoryIcon(category)}"></i>
                </div>
                <div class="item-content">
                    <div class="item-header">
                        <div>
                            <h3 class="item-title">${itemName}</h3>
                            <span class="item-category">${category} • from ${owner}</span>
                        </div>
                    </div>
                    <div class="item-meta">
                        <div class="item-price">
                            ${price}<span>/day</span>
                        </div>
                    </div>
                    <div class="rental-date-range">
                        <i data-lucide="calendar"></i>
                        <span>${start} - ${end}</span>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        if (window.lucide) lucide.createIcons();
    }

    function updateStats(shared, rented) {
        document.getElementById('shared-count').textContent = shared.length;
        document.getElementById('rented-count').textContent = rented.length;
        const savings = rented.length * 15;
        document.getElementById('savings-value').textContent = `$${savings}`;
    }

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

    // Initial load
    renderDashboard();
    displayCurrentUser();

    // Listen for storage changes
    window.addEventListener('storage', () => {
        renderDashboard();
    });

    // Update periodically
    setInterval(() => {
        const sharedItems = JSON.parse(localStorage.getItem('userSharedItems') || '[]');
        const rentedItems = JSON.parse(localStorage.getItem('userRentedItems') || '[]');
        updateStats(sharedItems, rentedItems);

        if (sharedItems.length !== parseInt(document.getElementById('shared-count').textContent)) {
            renderSharedItems(sharedItems);
        }
        if (rentedItems.length !== parseInt(document.getElementById('rented-count').textContent)) {
            renderRentedItems(rentedItems);
        }
    }, 2000);
});
