export function renderNavbar() {
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <ul class="navbar">
      <li><a href="../html/homepage.html">Home</a></li>
      <li><a href="../html/history.html">History</a></li>
      <li><a href="../html/about.html">About</a></li>
      <li><a href="../html/profile.html">Profile</a></li>
      <li><a href="../html/login.html">Log Out</a></li>
    </ul>
  `;
  const target = document.getElementById("navbar");
  if (target) {
    target.appendChild(nav);
  }
}
