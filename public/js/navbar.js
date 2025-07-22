export function renderNavbar() {
  const nav = document.createElement("nav");
  nav.innerHTML = `
    <ul class="navbar">
      <li><a href="./homepage.html">Home</a></li>
      <li><a href="./history.html">History</a></li>
      <li><a href="./about.html">About</a></li>
      <li><a href="./profile.html">Profile</a></li>
      <li><a href="./login.html">Log Out</a></li>
    </ul>
  `;
  const target = document.getElementById("navbar");
  if (target) {
    target.appendChild(nav);
  }
}
