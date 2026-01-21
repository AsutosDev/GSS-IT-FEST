// State
const state = {
    mode: 'login', // 'login' or 'signup'
    theme: 'dark'  // 'dark' or 'light'
};

// DOM Elements
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIconContainer = document.getElementById('theme-icon-container');

const formPanel = document.getElementById('form-panel');
const imagePanel = document.getElementById('image-panel');
const formTitle = document.getElementById('form-title');
const formDesc = document.getElementById('form-desc');
const submitBtn = document.getElementById('submit-btn');
const submitText = document.getElementById('submit-text');
const switchText = document.getElementById('switch-text');
const switchBtn = document.getElementById('switch-btn');

const fieldName = document.getElementById('field-name');
const fieldLocation = document.getElementById('field-location');
const passwordInput = document.getElementById('password-input');

const authImage = document.getElementById('auth-image');
const imageTitle = document.getElementById('image-title');
const imageDesc = document.getElementById('image-desc');
const formGradientBar = document.getElementById('form-gradient-bar');

const blur1 = document.getElementById('blur-1');
const blur2 = document.getElementById('blur-2');

// Config
const images = {
    login: {
        dark: 'dark-in.png',
        light: 'light-in.png'
    },
    signup: {
        dark: 'dark-up.png',
        light: 'light-up.png'
    }
};

// Initialize
function init() {
    // Check system preference or saved theme
    /*
    if (localStorage.getItem('theme') === 'light') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
    */
    // Defaulting to dark as per original code generic default but React state had 'dark'
    setTheme('dark');
    lucide.createIcons();
}

// Theme Handling
function setTheme(theme) {
    state.theme = theme;
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        themeToggleBtn.classList.remove('bg-white', 'text-slate-800', 'shadow-md');
        themeToggleBtn.classList.add('bg-white/10', 'text-yellow-300');
    } else {
        document.documentElement.classList.remove('dark');
        themeToggleBtn.classList.remove('bg-white/10', 'text-yellow-300');
        themeToggleBtn.classList.add('bg-white', 'text-slate-800', 'shadow-md');
    }

    updateImage();
}

function toggleTheme() {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);

    // Rotate icon
    const currentRotation = themeIconContainer.style.transform ? parseInt(themeIconContainer.style.transform.replace(/[^\d-]/g, '')) : 0;
    themeIconContainer.style.transform = `rotate(${currentRotation + 180}deg)`;
}

// Auth Mode Handling
function setMode(mode) {
    state.mode = mode;
    const isSignup = mode === 'signup';

    // Slide Panels
    if (window.innerWidth >= 768) {
        if (isSignup) {
            formPanel.classList.remove('md:translate-x-full');
            formPanel.classList.add('md:translate-x-0');
            imagePanel.classList.remove('translate-x-0');
            imagePanel.classList.add('translate-x-full');
        } else {
            formPanel.classList.remove('md:translate-x-0');
            formPanel.classList.add('md:translate-x-full');
            imagePanel.classList.remove('translate-x-full');
            imagePanel.classList.add('translate-x-0');
        }
    }

    // Update Text
    formTitle.textContent = isSignup ? 'Create Account' : 'Sign In';
    formDesc.textContent = isSignup ? 'Enter your details to get started.' : 'Enter your credentials to access your account.';
    submitText.textContent = isSignup ? 'Create Account' : 'Sign In';
    switchText.textContent = isSignup ? 'Already have an account?' : 'New to Sajha Share?';
    switchBtn.innerHTML = isSignup ? `Log in here <i data-lucide="arrow-left" class="w-3 h-3"></i>` : `Create an account <i data-lucide="arrow-right" class="w-3 h-3"></i>`;
    lucide.createIcons();

    // Toggle Fields visibility
    if (isSignup) {
        fieldName.classList.remove('max-h-0', 'opacity-0');
        fieldName.classList.add('max-h-16', 'opacity-100');
        fieldLocation.classList.remove('max-h-0', 'opacity-0');
        fieldLocation.classList.add('max-h-16', 'opacity-100');

        // Colors
        formGradientBar.classList.remove('from-share-pink');
        formGradientBar.classList.add('from-share-cyan');

        submitBtn.classList.remove('from-share-pink', 'hover:shadow-share-pink/40');
        submitBtn.classList.add('from-share-cyan', 'hover:shadow-share-cyan/40');

        switchBtn.classList.remove('text-share-pink');
        switchBtn.classList.add('text-share-cyan');

        blur1.classList.remove('bg-share-pink');
        blur1.classList.add('bg-share-cyan');

        blur2.classList.remove('bg-share-cyan');
        blur2.classList.add('bg-share-purple');

    } else {
        fieldName.classList.remove('max-h-16', 'opacity-100');
        fieldName.classList.add('max-h-0', 'opacity-0');
        fieldLocation.classList.remove('max-h-16', 'opacity-100');
        fieldLocation.classList.add('max-h-0', 'opacity-0');

        // Colors
        formGradientBar.classList.remove('from-share-cyan');
        formGradientBar.classList.add('from-share-pink');

        submitBtn.classList.remove('from-share-cyan', 'hover:shadow-share-cyan/40');
        submitBtn.classList.add('from-share-pink', 'hover:shadow-share-pink/40');

        switchBtn.classList.remove('text-share-cyan');
        switchBtn.classList.add('text-share-pink');

        blur1.classList.remove('bg-share-cyan');
        blur1.classList.add('bg-share-pink');

        blur2.classList.remove('bg-share-purple');
        blur2.classList.add('bg-share-cyan');
    }

    updateImage();
}

function toggleAuthMode() {
    setMode(state.mode === 'login' ? 'signup' : 'login');
}

function updateImage() {
    const isSignup = state.mode === 'signup';
    const isDark = state.theme === 'dark';

    // Select image source
    const src = isSignup
        ? (isDark ? images.signup.dark : images.signup.light)
        : (isDark ? images.login.dark : images.login.light);

    authImage.src = src;

    // Update image texts
    if (isSignup) {
        imageTitle.textContent = "Join the Community";
        imageDesc.textContent = "Connect with lenders and borrowers in your area today.";
    } else {
        imageTitle.textContent = "Welcome Back";
        imageDesc.textContent = "Continue your sharing journey with Sajha Share.";
    }
}

function togglePassword() {
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
}

// Event Listeners
themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent bubbling if needed
    toggleTheme();
});

// Run Init
window.addEventListener('DOMContentLoaded', init);
