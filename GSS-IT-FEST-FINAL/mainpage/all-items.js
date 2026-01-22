// All Items Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Sample item data (you can replace this with actual data)
    const items = [
        { id: "sample_1", name: "Sports Bag", category: "Bag", ownerName: "John D.", ownerId: "user_john", email: "john@gmail.com", price: 5, available: true, createdAt: new Date().toISOString() },
        { id: "sample_2", name: "Baseball Bat", category: "Bat", ownerName: "Sarah M.", ownerId: "user_sarah", email: "sarah@gmail.com", price: 8, available: true, createdAt: new Date().toISOString() },
        { id: "sample_3", name: "Soccer Ball", category: "Ball", ownerName: "Mike W.", ownerId: "user_mike", email: "mike@gmail.com", price: 3, available: false, createdAt: new Date().toISOString() },
        { id: "sample_4", name: "Tennis Ball Set", category: "Ball", ownerName: "Emma L.", ownerId: "user_emma", email: "emma@gmail.com", price: 4, available: true, createdAt: new Date().toISOString() },
        { id: "sample_5", name: "Designer Skirt", category: "Skirt", ownerName: "Lisa K.", ownerId: "user_lisa", email: "lisa@gmail.com", price: 12, available: true, createdAt: new Date().toISOString() },
        { id: "sample_6", name: "Baseball Cap", category: "Cap", ownerName: "Tom H.", ownerId: "user_tom", email: "tom@gmail.com", price: 6, available: true, createdAt: new Date().toISOString() },
        { id: "sample_7", name: "Winter Gloves", category: "Gloves", ownerName: "Anna P.", ownerId: "user_anna", email: "anna@gmail.com", price: 7, available: true, createdAt: new Date().toISOString() },
        { id: "sample_8", name: "Travel Bag", category: "Bag", ownerName: "David S.", ownerId: "user_david", email: "david@gmail.com", price: 10, available: true, createdAt: new Date().toISOString() },
        { id: "sample_9", name: "Cricket Bat", category: "Bat", ownerName: "James R.", ownerId: "user_james", email: "james@gmail.com", price: 15, available: false, createdAt: new Date().toISOString() },
        { id: "sample_10", name: "Basketball", category: "Ball", ownerName: "Chris B.", ownerId: "user_chris", email: "chris@gmail.com", price: 5, available: true, createdAt: new Date().toISOString() },
        { id: "sample_11", name: "Leather Bag", category: "Bag", ownerName: "Sophie T.", ownerId: "user_sophie", email: "sophie@gmail.com", price: 20, available: true, createdAt: new Date().toISOString() },
        { id: "sample_12", name: "Softball Bat", category: "Bat", ownerName: "Ryan G.", ownerId: "user_ryan", email: "ryan@gmail.com", price: 12, available: true, createdAt: new Date().toISOString() },
        { id: "sample_13", name: "Vintage Cap", category: "Cap", ownerName: "Olivia F.", ownerId: "user_olivia", email: "olivia@gmail.com", price: 8, available: true, createdAt: new Date().toISOString() },
        { id: "sample_14", name: "Summer Skirt", category: "Skirt", ownerName: "Mia C.", ownerId: "user_mia", email: "mia@gmail.com", price: 15, available: true, createdAt: new Date().toISOString() },
        { id: "sample_15", name: "Boxing Gloves", category: "Gloves", ownerName: "Noah A.", ownerId: "user_noah", email: "noah@gmail.com", price: 18, available: false, createdAt: new Date().toISOString() },
        { id: "sample_16", name: "Gym Bag", category: "Bag", ownerName: "Ella N.", ownerId: "user_ella", email: "ella@gmail.com", price: 9, available: true, createdAt: new Date().toISOString() },
        { id: "sample_17", name: "Football", category: "Ball", ownerName: "Liam V.", ownerId: "user_liam", email: "liam@gmail.com", price: 6, available: true, createdAt: new Date().toISOString() },
        { id: "sample_18", name: "Trucker Cap", category: "Cap", ownerName: "Ava M.", ownerId: "user_ava", email: "ava@gmail.com", price: 5, available: true, createdAt: new Date().toISOString() },
        { id: "sample_19", name: "Pleated Skirt", category: "Skirt", ownerName: "Sophia W.", ownerId: "user_sophia", email: "sophia@gmail.com", price: 14, available: true, createdAt: new Date().toISOString() },
        { id: "sample_20", name: "Cycling Gloves", category: "Gloves", ownerName: "Mason J.", ownerId: "user_mason", email: "mason@gmail.com", price: 10, available: true, createdAt: new Date().toISOString() },
        { id: "car_1", name: "Tesla Model 3", category: "Cars", ownerName: "Elon M.", ownerId: "user_elon", email: "elon@tesla.com", price: 150, available: true, createdAt: new Date().toISOString() },
        { id: "car_2", name: "Honda Civic", category: "Cars", ownerName: "Jane D.", ownerId: "user_jane", email: "jane@gmail.com", price: 45, available: true, createdAt: new Date().toISOString() },
    ];

    // Expanded Data Generation
    const navbarCategories = ["Tools", "Vehicles", "Cars", "Books", "Camping", "Music", "Camera", "Electronics", "Services"];
    const existingCategories = ["Bag", "Bat", "Ball", "Skirt", "Cap", "Gloves"];
    
    // Combine for random generation
    const allCategories = [...existingCategories, ...navbarCategories];

    // Helper for random names for new categories
    const newCategoryNames = {
        "Tools": ["Power Drill", "Hammer Set", "Wrench Kit", "Ladder", "Screwdriver Set"],
        "Vehicles": ["Mountain Bike", "Electric Scooter", "Roof Rack", "Car Trailer"],
        "Books": ["Sci-Fi Novel", "Textbook", "Cookbook", "History Book", "Biography"],
        "Camping": ["Tent 4-Person", "Sleeping Bag", "Portable Stove", "Camping Chair", "Cooler Box"],
        "Music": ["Acoustic Guitar", "Keyboard", "Microphone", "DJ Controller", "Ukulele"],
        "Camera": ["DSLR Camera", "GoPro Hero", "Tripod", "Camera Lens", "Ring Light"],
        "Electronics": ["Projector", "Bluetooth Speaker", "Tablet", "Power Bank", "VR Headset"],
        "Services": ["Cleaning", "Gardening", "Moving Help", "Photography", "Tutoring"],
        "Cars": ["Tesla Model S", "BMW 3 Series", "Audi A4", "Toyota Camry", "Ford Mustang"]
    };

    // Generate random mock data
    const locations = ["New York, NY", "Brooklyn, NY", "Jersey City, NJ", "Queens, NY", "Manhattan, NY"];
    
    // Helper to get random date in future
    function getRandomExpiry() {
        const date = new Date();
        date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1); // 1-30 days future
        return date.toISOString().split('T')[0];
    }

    // Generate items
    for (let i = 21; i <= 150; i++) { 
        const category = allCategories[Math.floor(Math.random() * allCategories.length)];
        let itemName;

        if (existingCategories.includes(category)) {
             const names = {
                "Bag": ["Backpack", "Duffel Bag", "Tote Bag", "Messenger Bag", "Laptop Bag"],
                "Bat": ["Wooden Bat", "Metal Bat", "Cricket Bat", "Training Bat"],
                "Ball": ["Volleyball", "Rugby Ball", "Golf Balls", "Ping Pong Balls"],
                "Skirt": ["Mini Skirt", "Maxi Skirt", "Denim Skirt", "Pencil Skirt"],
                "Cap": ["Snapback", "Beanie", "Fedora", "Sun Hat"],
                "Gloves": ["Leather Gloves", "Wool Gloves", "Gardening Gloves", "Work Gloves"]
            };
            const nameOptions = names[category];
            itemName = nameOptions[Math.floor(Math.random() * nameOptions.length)] + " #" + i;
        } else {
            const nameOptions = newCategoryNames[category];
            itemName = nameOptions[Math.floor(Math.random() * nameOptions.length)] + " #" + i;
        }
        
        const owners = ["Alex K.", "Sam P.", "Jordan L.", "Taylor M.", "Casey R.", "Jamie D.", "Morgan B."];
        const now = new Date().toISOString();
        
        items.push({
            id: `gen_${i}`,
            name: itemName,
            category: category,
            ownerName: owners[Math.floor(Math.random() * owners.length)],
            owner: owners[Math.floor(Math.random() * owners.length)], // Dual property
            ownerId: `user_gen_${i}`,
            price: Math.floor(Math.random() * 50) + 5,
            available: Math.random() > 0.2,
            location: locations[Math.floor(Math.random() * locations.length)],
            email: "owner" + i + "@gmail.com",
            expiryDate: getRandomExpiry(),
            createdAt: now,
            updatedAt: now
        });
    }

    // Load User Shared Items from LocalStorage
    const storedItems = JSON.parse(localStorage.getItem('userSharedItems') || '[]');
    if (storedItems.length > 0) {
        // Add stored items to the beginning of the list
        storedItems.forEach(item => {
            // Ensure no duplicate IDs if possible, or just push
            items.unshift(item);
        });
    }

    // Load Rented Items status from LocalStorage to update availability
    const rentedItems = JSON.parse(localStorage.getItem('userRentedItems') || '[]');
    if (rentedItems.length > 0) {
        rentedItems.forEach(rented => {
            // Find the item in our list and mark as unavailable
            // We use name + owner as a simple composite key since we don't have unique backend IDs for all items
            const item = items.find(i => i.name === rented.name && (i.owner === rented.owner || i.ownerName === rented.ownerName));
            if (item) {
                item.available = false;
            }
        });
    }

    // Expose items to global scope for Share Modal
    window.allItems = items;

    const container = document.getElementById('items-container');
    let currentFilter = 'All';

    // URL Search Param Logic
    const urlParams = new URLSearchParams(window.location.search);
    let initialSearch = urlParams.get('search');
    let initialLocation = urlParams.get('location');
    
    // State for search queries
    window.currentSearchQuery = initialSearch || '';
    window.currentLocationQuery = initialLocation || '';
    window.currentFilter = 'All';

    // Render items with optional search and location filter
    window.renderItems = function(filter = 'All', searchQuery = '', locationQuery = '') {
        if(!container) return; // Guard clause

        container.innerHTML = '';
        
        let filteredItems = window.allItems; // Use global items

        // Apply Category Filter
        if (filter !== 'All') {
            filteredItems = filteredItems.filter(item => item.category === filter);
        }

        // Apply Location Filter
        if (locationQuery) {
            const lowerLoc = locationQuery.toLowerCase();
            filteredItems = filteredItems.filter(item => 
                item.location && item.location.toLowerCase().includes(lowerLoc)
            );
        }

        // Apply Search Filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            filteredItems = filteredItems.filter(item => {
                const owner = item.ownerName || item.owner || '';
                return (item.name && item.name.toLowerCase().includes(lowerQuery)) || 
                       (item.category && item.category.toLowerCase().includes(lowerQuery)) ||
                       (owner.toLowerCase().includes(lowerQuery)) ||
                       (item.location && item.location.toLowerCase().includes(lowerQuery));
            });
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
                        <div class="owner-avatar">${(item.ownerName || item.owner || 'U')[0]}</div>
                        <div class="owner-info">
                            <span>${item.ownerName || item.owner || 'Unknown'}</span>
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
            'Services': 'briefcase',
            'Cars': 'car'
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
            window.currentFilter = chip.textContent;
            renderItems(window.currentFilter, window.currentSearchQuery, window.currentLocationQuery);
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
            window.currentSearchQuery = e.target.value;
            renderItems(window.currentFilter, window.currentSearchQuery, window.currentLocationQuery);
        });
    }

    // Location Search Input Logic
    const locationSearchInput = document.querySelector('.location-search-input');
    if (locationSearchInput) {
        if (initialLocation) {
            locationSearchInput.value = initialLocation;
        }
        locationSearchInput.addEventListener('input', (e) => {
            window.currentLocationQuery = e.target.value;
            renderItems(window.currentFilter, window.currentSearchQuery, window.currentLocationQuery);
        });
    }


    // Initial render logic
    if (window.pageCategory) {
        window.currentFilter = window.pageCategory;
        const pageTitle = document.querySelector('.page-title');
        if(pageTitle) pageTitle.textContent = `${window.pageCategory} Items`;
        renderItems(window.currentFilter, window.currentSearchQuery, window.currentLocationQuery);
    } else {
        renderItems(window.currentFilter, window.currentSearchQuery, window.currentLocationQuery);
    }

    // --- DYNAMIC RENT MODAL LOGIC ---
    function injectRentModal() {
        if (document.getElementById('simple-rent-modal')) return;

        const modalHtml = `
            <div class="modal-overlay" id="simple-rent-modal">
                <div class="modal-content rent-modal-redesign">
                    <button class="close-modal modern-close" id="close-simple-rent-modal">
                        <i data-lucide="x"></i>
                    </button>
                    
                    <div class="rent-modal-body">
                        <!-- Item Header with Icon and Basic Info -->
                        <div class="rent-header-section">
                            <div class="rent-icon-container">
                                <i id="modal-item-icon-el" data-lucide="package"></i>
                            </div>
                            <div class="rent-item-info">
                                <span id="modal-item-category-badge" class="category-badge">Category</span>
                                <h2 id="modal-item-name" class="rent-item-title">Item Name</h2>
                                <div class="rent-price-tag">
                                    <span id="modal-item-price" class="price-large">$0</span>
                                    <span class="price-period">/day</span>
                                </div>
                            </div>
                        </div>

                        <!-- Status Badge -->
                        <div class="status-badge-container">
                            <div id="modal-status-badge" class="status-badge available">
                                <i data-lucide="check-circle"></i>
                                <span id="modal-item-status">Available</span>
                            </div>
                        </div>

                        <!-- Item Details Grid -->
                        <div class="rent-details-grid">
                            <div class="detail-card">
                                <div class="detail-icon">
                                    <i data-lucide="user"></i>
                                </div>
                                <div class="detail-content">
                                    <span class="detail-label">Owner</span>
                                    <span id="modal-item-owner" class="detail-value">-</span>
                                </div>
                            </div>
                            
                            <div class="detail-card">
                                <div class="detail-icon">
                                    <i data-lucide="map-pin"></i>
                                </div>
                                <div class="detail-content">
                                    <span class="detail-label">Location</span>
                                    <span id="modal-item-location" class="detail-value">-</span>
                                </div>
                            </div>
                            
                            <div class="detail-card">
                                <div class="detail-icon">
                                    <i data-lucide="mail"></i>
                                </div>
                                <div class="detail-content">
                                    <span class="detail-label">Gmail</span>
                                    <span id="modal-item-email" class="detail-value">-</span>
                                </div>
                            </div>
                            
                            <div class="detail-card">
                                <div class="detail-icon">
                                    <i data-lucide="calendar-clock"></i>
                                </div>
                                <div class="detail-content">
                                    <span class="detail-label">Available Until</span>
                                    <span id="modal-item-expiry" class="detail-value">-</span>
                                </div>
                            </div>
                        </div>

                        <!-- Rental Period Selection -->
                        <div class="rental-period-section">
                            <label class="section-label">
                                <i data-lucide="calendar"></i>
                                Rental Period
                            </label>
                            <div class="date-inputs">
                                <div class="date-input-group">
                                    <label>From</label>
                                    <input type="date" id="rent-start-date" class="date-input">
                                </div>
                                <div class="date-separator">
                                    <i data-lucide="arrow-right"></i>
                                </div>
                                <div class="date-input-group">
                                    <label>To</label>
                                    <input type="date" id="rent-end-date" class="date-input">
                                </div>
                            </div>
                            <div class="rental-summary" id="rental-summary">
                                <span class="summary-days">Select dates to see total</span>
                            </div>
                        </div>
                        
                        <!-- Renter Information -->
                        <div class="rental-period-section">
                            <label class="section-label">
                                <i data-lucide="user"></i>
                                Your Information
                            </label>
                            <div class="date-inputs" style="margin-top: 10px; gap: 15px;">
                                <div class="date-input-group" style="flex: 1;">
                                    <label>Your Name</label>
                                    <input type="text" id="renter-name" class="date-input" style="width: 100%; height: 45px;" placeholder="Full Name">
                                </div>
                                <div class="date-input-group" style="flex: 1;">
                                    <label>Your Gmail</label>
                                    <input type="email" id="renter-email" class="date-input" style="width: 100%; height: 45px;" placeholder="username@gmail.com">
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons (Horizontal) -->
                        <div class="modal-actions-horizontal">
                            <button id="cancel-rent-btn" class="action-btn btn-secondary">
                                <i data-lucide="x"></i>
                                Cancel
                            </button>
                            <button id="confirm-rent-btn" class="action-btn btn-primary">
                                <i data-lucide="check"></i>
                                Confirm Rental
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Event Listeners for the new modal
        const modal = document.getElementById('simple-rent-modal');
        const closeBtn = document.getElementById('close-simple-rent-modal');
        const cancelBtn = document.getElementById('cancel-rent-btn');
        const rentBtn = document.getElementById('confirm-rent-btn');
        const startDateInput = document.getElementById('rent-start-date');
        const endDateInput = document.getElementById('rent-end-date');
        const rentalSummary = document.getElementById('rental-summary');

        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Reset form
            startDateInput.value = '';
            endDateInput.value = '';
            rentalSummary.innerHTML = '<span class="summary-days">Select dates to see total</span>';
        }

        // Calculate rental cost
        function calculateRental() {
            const startDate = new Date(startDateInput.value);
            const endDate = new Date(endDateInput.value);
            
            if (startDate && endDate && endDate >= startDate) {
                const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                const priceText = document.getElementById('modal-item-price').textContent;
                const pricePerDay = parseFloat(priceText.replace('$', ''));
                const total = days * pricePerDay;
                
                rentalSummary.innerHTML = `
                    <div class="summary-breakdown">
                        <span class="summary-days"><strong>${days}</strong> day${days > 1 ? 's' : ''}</span>
                        <span class="summary-separator">×</span>
                        <span class="summary-rate">$${pricePerDay}/day</span>
                        <span class="summary-equals">=</span>
                        <span class="summary-total">$${total.toFixed(2)}</span>
                    </div>
                `;
            } else {
                rentalSummary.innerHTML = '<span class="summary-days">Select valid dates</span>';
            }
        }

        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        startDateInput.setAttribute('min', today);
        endDateInput.setAttribute('min', today);

        startDateInput.addEventListener('change', () => {
            endDateInput.setAttribute('min', startDateInput.value || today);
            calculateRental();
        });

        endDateInput.addEventListener('change', calculateRental);

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        rentBtn.addEventListener('click', () => {
            const rName = document.getElementById('renter-name').value.trim();
            const rEmail = document.getElementById('renter-email').value.trim();

            if (!startDateInput.value || !endDateInput.value) {
                alert('Please select rental dates');
                return;
            }

            if (!rName || !rEmail) {
                alert('Please enter your Name and Gmail to proceed');
                return;
            }

            const itemName = document.getElementById('modal-item-name').textContent;
            const itemPrice = document.getElementById('modal-item-price').textContent;
            const itemOwnerName = document.getElementById('modal-item-owner').textContent;
            const itemCategory = document.getElementById('modal-item-category-badge').textContent;
            
            // Create Standardized Rental Record (Firebase Ready)
            const rentalId = `rent_${Date.now()}`;
            const rentalData = {
                id: rentalId,
                itemId: "item_placeholder_uid", // Should be passed from the item object
                ownerId: "owner_placeholder_uid",
                renterId: "current_user_uid",
                status: "pending",
                item: {
                    name: itemName,
                    price: parseFloat(itemPrice.replace('$', '')),
                    category: itemCategory
                },
                renter: {
                    name: rName,
                    email: rEmail
                },
                dates: {
                    start: startDateInput.value,
                    end: endDateInput.value
                },
                createdAt: new Date().toISOString()
            };
            
            // Create standardized notification object
            const notif = {
                id: `notif_${Date.now()}`,
                type: 'rental_request',
                status: 'pending',
                title: 'New Rental Request!',
                text: `${rName} (${rEmail}) wants to rent your "${itemName}" from ${startDateInput.value} to ${endDateInput.value}.`,
                item: { name: itemName },
                renter: { name: rName, email: rEmail },
                data: rentalData, // The full record for acceptance
                timestamp: new Date().toISOString()
            };

            const notifs = JSON.parse(localStorage.getItem('userNotifications') || '[]');
            notifs.unshift(notif);
            localStorage.setItem('userNotifications', JSON.stringify(notifs));

            alert('Rental request sent! 📩\n\nThe owner needs to accept your request. You can check the notification in the bell icon.');
            
            // Update the badge if updateNotifBadge exists (it's in script.js)
            if (typeof updateNotifBadge === 'function') {
                updateNotifBadge();
            } else {
                // Refresh to show badge if we can't call directly
                window.location.reload();
            }
            
            closeModal();
        });
    }

    // Call inject immediately/ensure it's ready
    injectRentModal();

    window.openRentModal = function(item) {
        injectRentModal(); // Ensure it exists
        const modal = document.getElementById('simple-rent-modal');
        
        // Populate Data
        document.getElementById('modal-item-name').textContent = item.name;
        document.getElementById('modal-item-category-badge').textContent = item.category;
        document.getElementById('modal-item-price').textContent = `$${item.price}`;
        document.getElementById('modal-item-owner').textContent = item.ownerName || item.owner;
        document.getElementById('modal-item-location').textContent = item.location || 'N/A';
        document.getElementById('modal-item-email').textContent = item.email || 'not provided';
        
        // Format and display expiry date
        const expiryElement = document.getElementById('modal-item-expiry');
        if (item.expiryDate) {
            const expiryDate = new Date(item.expiryDate);
            const formattedDate = expiryDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });
            expiryElement.textContent = formattedDate;
        } else {
            expiryElement.textContent = 'Not specified';
        }
        
        const statusBadge = document.getElementById('modal-status-badge');
        const statusSpan = document.getElementById('modal-item-status');
        const rentBtn = document.getElementById('confirm-rent-btn');
        
        if(item.available) {
            statusSpan.textContent = 'Available Now';
            statusBadge.className = 'status-badge available';
            statusBadge.innerHTML = '<i data-lucide="check-circle"></i><span id="modal-item-status">Available Now</span>';
            rentBtn.disabled = false;
            rentBtn.classList.remove('disabled');
        } else {
            statusSpan.textContent = 'Currently Unavailable';
            statusBadge.className = 'status-badge unavailable';
            statusBadge.innerHTML = '<i data-lucide="x-circle"></i><span id="modal-item-status">Currently Unavailable</span>';
            rentBtn.disabled = true;
            rentBtn.classList.add('disabled');
        }

        // Icon
        const iconContainer = document.querySelector('.rent-icon-container');
        iconContainer.innerHTML = `<i data-lucide="${getCategoryIcon(item.category)}"></i>`;
        if (window.lucide) lucide.createIcons();

        // Show
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Attach Click Event to Cards
    if (container) {
        container.addEventListener('click', (e) => {
            const card = e.target.closest('.item-card');
            if (card) {
                const title = card.querySelector('.item-title').textContent;
                const item = window.allItems.find(i => i.name === title);
                
                if (item) {
                    window.openRentModal(item);
                }
            }
        });
        
        // Add cursor pointer logic if needed, though CSS handles most hover states
    }
});
