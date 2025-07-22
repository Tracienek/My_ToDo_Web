export function renderNavbar() {
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <ul class="navbar">
      <li><a href="/src/templates/homepage.html">Home</a></li>
      <li><a href="/src/templates/history.html">History</a></li>
      <li><a href="/src/templates/about.html">About</a></li>
      <li><a href="/src/templates/profile.html">Profile</a></li>
      <li><a href="/src/templates/login.html">Log Out</a></li>
    </ul>
  `;
  const target = document.getElementById("navbar");
  if (target) {
    target.appendChild(nav);
  }
}
