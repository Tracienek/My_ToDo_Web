const path = window.location.pathname;

if (path === '/' || path === '/index.html') {
  import('./homepage.js').then(m => m.initHomepage?.());
} else if (path.includes('register')) {
  import('./register.js').then(m => m.initRegister?.());
} else if (path.includes('login')) {
  import('./login.js').then(m => m.initLogin?.());
} else if (path.includes('history')) {
  import('./task-history.js').then(m => m.initHistory?.());
}
