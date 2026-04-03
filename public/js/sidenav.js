// Sidenav expand/collapse toggle
// Persists state in localStorage so it stays open/closed across page navigations

const nav    = document.getElementById('sidenav');
const toggle = document.getElementById('sidenavToggle');
const body   = document.body;

const STORAGE_KEY = 'mc-nav-open';

// Restore saved state on load
if (localStorage.getItem(STORAGE_KEY) === 'true') {
  nav.classList.add('expanded');
  body.classList.add('nav-open');
}

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('expanded');
  body.classList.toggle('nav-open', isOpen);
  localStorage.setItem(STORAGE_KEY, isOpen);
});