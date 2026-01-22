import { db, auth, storage } from "./firebase.js";
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    getDocs, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { db, auth } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

async function handleRentItem(item) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to rent items!");
        return;
    }

    try {
        // This creates the "link" between the item and the person renting it
        await addDoc(collection(db, "rentals"), {
            itemId: item.id,
            itemName: item.name,
            itemImage: item.imageUrl,
            ownerEmail: item.ownerEmail,
            renterEmail: user.email, // This is how the dashboard finds it
            price: item.price,
            rentedAt: serverTimestamp()
        });
        
        alert(`Success! You have rented: ${item.name}`);
        window.location.href = "dashboard.html"; // Redirect to see it in history
    } catch (error) {
        console.error("Rental failed:", error);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    

    // --- 2. UI Elements ---
    const userDisplay = document.getElementById('user-display');
    const shareForm = document.getElementById('share-item-form');
    const categoryTrigger = document.querySelector('.select-trigger');
    const categoryOptions = document.querySelector('.select-options');
    const categoryLabel = document.getElementById('form-category-label');
    const modal = document.getElementById('share-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const fabBtn = document.getElementById('fab-share-btn');

    // --- 3. Custom Category Dropdown Logic ---
    categoryTrigger.addEventListener('click', () => {
        categoryOptions.classList.toggle('active');
    });

    document.querySelectorAll('.select-option').forEach(option => {
        option.addEventListener('click', () => {
            categoryLabel.textContent = option.dataset.value;
            categoryOptions.classList.remove('active');
        });
    });

    // Close dropdown when clicking outside
    window.addEventListener('click', (e) => {
        if (!categoryTrigger.contains(e.target)) categoryOptions.classList.remove('active');
    });

    // --- 4. Modal Logic ---
    fabBtn.addEventListener('click', () => modal.classList.add('active'));
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

    // --- 5. Tab Switching Logic ---
    const tabs = document.querySelectorAll('.tab-btn');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${target}-section`).classList.add('active');
        });
    });

    // --- 6. Form Submission (Firestore + Storage) ---
    shareForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return alert("Please log in first!");

        const submitBtn = document.getElementById('share-submit-btn');
        submitBtn.disabled = true;
        submitBtn.textContent = "Uploading...";

        try {
            const formData = new FormData(shareForm);
            const imageFile = shareForm.itemImage.files[0];
            let imageUrl = "";

            // Upload Image to Storage
            if (imageFile) {
                const storageRef = ref(storage, `items/${Date.now()}_${imageFile.name}`);
                const snapshot = await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(snapshot.ref);
            }

            // Save to Firestore
            await addDoc(collection(db, "items"), {
                name: formData.get('itemName'),
                category: categoryLabel.textContent,
                price: parseFloat(formData.get('itemPrice')),
                expiryDate: formData.get('itemExpiry'),
                location: formData.get('itemLocation'),
                ownerEmail: user.email,
                imageUrl: imageUrl,
                createdAt: serverTimestamp()
            });

            alert("Item shared successfully!");
            shareForm.reset();
            categoryLabel.textContent = "Select Category";
            modal.classList.remove('active');
            renderDashboard(user); 

        } catch (error) {
            console.error("Error:", error);
            alert("Upload failed. Check console.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Share Item";
        }
    });

    // --- 7. Data Fetching & Rendering ---
    async function renderDashboard(user) {
        if (!user) return;

        // Fetch Shared Items
        const qShared = query(collection(db, "items"), where("ownerEmail", "==", user.email));
        const sharedSnap = await getDocs(qShared);
        const sharedItems = sharedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch Rented Items (from 'rentals' collection)
        const qRented = query(collection(db, "rentals"), where("renterEmail", "==", user.email));
        const rentedSnap = await getDocs(qRented);
        const rentedItems = rentedSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        renderSharedItems(sharedItems);
        renderRentedItems(rentedItems);
        updateStats(sharedItems, rentedItems);
    }



    function renderSharedItems(items) {
        const container = document.getElementById('shared-container');
        const badge = document.getElementById('shared-badge');
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No items shared yet.</p></div>`;
            badge.textContent = '0 Items';
            return;
        }

        badge.textContent = `${items.length} Item${items.length > 1 ? 's' : ''}`;
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'item-card visible';
            div.innerHTML = `
                <div class="item-image">
                    ${item.imageUrl ? `<img src="${item.imageUrl}" style="width:100%; height:100%; object-fit:cover; border-radius:12px;">` : `<i data-lucide="${getCategoryIcon(item.category)}"></i>`}
                </div>
                <div class="item-content">
                    <h3 class="item-title">${item.name}</h3>
                    <div class="item-meta">
                        <span class="item-price">$${item.price}/day</span>
                        <span class="item-status"><i data-lucide="map-pin"></i>${item.location}</span>
                    </div>
                </div>`;
            container.appendChild(div);
        });
        lucide.createIcons();
    }

    function renderRentedItems(items) {
        const container = document.getElementById('rented-container');
        const badge = document.getElementById('rented-badge');
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = `<div class="empty-state"><p>No rentals yet.</p></div>`;
            badge.textContent = '0 Items';
            return;
        }

        badge.textContent = `${items.length} Items`;
        // ... rendering logic for rentals ...
    }

    function updateStats(shared, rented) {
        document.getElementById('shared-count').textContent = shared.length;
        document.getElementById('rented-count').textContent = rented.length;
        document.getElementById('savings-value').textContent = `$${rented.length * 15}`;
    }

    function getCategoryIcon(cat) {
        const icons = { 'Camera': 'camera', 'Books': 'book', 'Tools': 'wrench', 'Electronics': 'tv' };
        return icons[cat] || 'package';
    }

    // --- 8. Auth State Listener ---
    onAuthStateChanged(auth, (user) => {
        if (user) {
            userDisplay.textContent = `Logged in as: ${user.email}`;
            renderDashboard(user);
        } else {
            userDisplay.textContent = 'Not logged in';
        }
    });
});