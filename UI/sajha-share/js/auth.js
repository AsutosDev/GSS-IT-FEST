const card = document.getElementById('authCard');

function renderAuth() {
  const signup = APP_STATE.mode === 'signup';

  card.innerHTML = `
    <div class="auth-form">
      <h2 class="text-xl font-bold mb-1">
        ${signup ? 'Create Account' : 'Sign In'}
      </h2>
      <p class="text-xs text-gray-400 mb-4">
        ${signup ? 'Enter your details to get started.' : 'Welcome back.'}
      </p>

      ${signup ? `<input class="input mb-2" placeholder="Full Name">` : ''}
      <input class="input mb-2" placeholder="Email">
      <input class="input mb-4" type="password" placeholder="Password">

      <button class="btn mb-4">
        ${signup ? 'Create Account' : 'Sign In'}
      </button>

      <button class="text-xs text-share-pink"
        onclick="toggleMode()">
        ${signup ? 'Log in here' : 'Create an account'}
      </button>
    </div>
  `;
}

window.toggleMode = () => {
  APP_STATE.mode = APP_STATE.mode === 'login' ? 'signup' : 'login';
  renderAuth();
};

renderAuth();
