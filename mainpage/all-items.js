// All Items Page Logic
document.addEventListener('DOMContentLoaded', () => {
    // Sample item data (you can replace this with actual data)
    const items = [
        { id: 1, name: "Sports Bag", category: "Bag", owner: "John D.", price: 5, available: true },
        { id: 2, name: "Baseball Bat", category: "Bat", owner: "Sarah M.", price: 8, available: true },
        { id: 3, name: "Soccer Ball", category: "Ball", owner: "Mike W.", price: 3, available: false },
        { id: 4, name: "Tennis Ball Set", category: "Ball", owner: "Emma L.", price: 4, available: true },
        { id: 5, name: "Designer Skirt", category: "Skirt", owner: "Lisa K.", price: 12, available: true },
        { id: 6, name: "Baseball Cap", category: "Cap", owner: "Tom H.", price: 6, available: true },
        { id: 7, name: "Winter Gloves", category: "Gloves", owner: "Anna P.", price: 7, available: true },
        { id: 8, name: "Travel Bag", category: "Bag", owner: "David S.", price: 10, available: true },
        { id: 9, name: "Cricket Bat", category: "Bat", owner: "James R.", price: 15, available: false },
        { id: 10, name: "Basketball", category: "Ball", owner: "Chris B.", price: 5, available: true },
        { id: 11, name: "Leather Bag", category: "Bag", owner: "Sophie T.", price: 20, available: true },
        { id: 12, name: "Softball Bat", category: "Bat", owner: "Ryan G.", price: 12, available: true },
        { id: 13, name: "Vintage Cap", category: "Cap", owner: "Olivia F.", price: 8, available: true },
        { id: 14, name: "Summer Skirt", category: "Skirt", owner: "Mia C.", price: 15, available: true },
        { id: 15, name: "Boxing Gloves", category: "Gloves", owner: "Noah A.", price: 18, available: false },
        { id: 16, name: "Gym Bag", category: "Bag", owner: "Ella N.", price: 9, available: true },
        { id: 17, name: "Football", category: "Ball", owner: "Liam V.", price: 6, available: true },
        { id: 18, name: "Trucker Cap", category: "Cap", owner: "Ava M.", price: 5, available: true },
        { id: 19, name: "Pleated Skirt", category: "Skirt", owner: "Sophia W.", price: 14, available: true },
        { id: 20, name: "Cycling Gloves", category: "Gloves", owner: "Mason J.", price: 10, available: true },
    ];

    // Expanded Data Generation
    const navbarCategories = ["Tools", "Vehicles", "Books", "Camping", "Music", "Camera", "Electronics", "Services"];
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
        "Services": ["Cleaning", "Gardening", "Moving Help", "Photography", "Tutoring"]
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
        
        items.push({
            id: i,
            name: itemName,
            category: category,
            owner: owners[Math.floor(Math.random() * owners.length)],
            price: Math.floor(Math.random() * 50) + 5,
            available: Math.random() > 0.2,
            location: locations[Math.floor(Math.random() * locations.length)],
            expiryDate: getRandomExpiry()
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

    // Expose items to global scope for Share Modal
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
