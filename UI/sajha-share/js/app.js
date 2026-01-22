window.APP_STATE = {
  theme: 'dark',
  mode: 'login'
};

const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

themeBtn.onclick = () => {
  APP_STATE.theme = APP_STATE.theme === 'dark' ? 'light' : 'dark';
  html.classList.toggle('dark');
  document.body.classList.toggle('bg-share-dark');
  document.body.classList.toggle('bg-share-light');
};
