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

// Button Navigation (Safe navigation)
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

if (loginBtn) {
  loginBtn.onclick = () => location.href = 'login.html';
}

if (registerBtn) {
  registerBtn.onclick = () => location.href = 'register.html';
}

