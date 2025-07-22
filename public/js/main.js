const path = window.location.pathname;

if (path === '/' || path === '/index.html') {
  import('../js/homepage.js').then(m => m.initHomepage?.());
} else if (path.includes('register')) {
  import('../js/register.js').then(m => m.initRegister?.());
} else if (path.includes('login')) {
  import('../js/login.js').then(m => m.initLogin?.());
} else if (path.includes('history')) {
  import('../js/task-history.js').then(m => m.initHistory?.());
}
