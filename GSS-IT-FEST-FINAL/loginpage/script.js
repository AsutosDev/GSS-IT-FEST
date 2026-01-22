// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Icons
const moonIcon = '🌙';
const sunIcon = '☀️';

// Functions to handle theme
function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? sunIcon : moonIcon;
}

function getPreferredTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme) {
    return storedTheme;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);
});

// Event Listener
themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
});


// Button Navigation & Animation
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const container = document.querySelector('.hero-container');

if (signUpBtn && signInBtn && container) {
  signUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.add('sign-up-mode');
  });

  signInBtn.addEventListener('click', (e) => {
    e.preventDefault();
    container.classList.remove('sign-up-mode');
  });
}

