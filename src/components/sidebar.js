// Sidenav expand/collapse toggle
// Persists state in localStorage so it stays open/closed across page navigations

const nav = document.getElementById('sidenav');
const toggle = document.getElementById('sidenavToggle');
const body = document.body;

const STORAGE_KEY = 'mc-nav-open';

// Restore saved state on load
if (localStorage.getItem(STORAGE_KEY) === 'true') {
  nav.classList.add('expanded');
  body.classList.add('nav-open');
}

// Funny easter egg
const navLabels = [
  { text: "Navigation", weight: 82 },
  { text: "Where to?", weight: 10 },
  { text: "Menu", weight: 5 },
  { text: "Hi twin", weight: 1 },
];

function pickLabel() {
  const total = navLabels.reduce((sum, l) => sum + l.weight, 0);
  let rand = Math.random() * total;
  for (const label of navLabels) {
    rand -= label.weight;
    if (rand <= 0) return label.text;
  }
  return navLabels[0].text;
}

toggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('expanded');
  body.classList.toggle('nav-open', isOpen);
  localStorage.setItem(STORAGE_KEY, isOpen);
  document.getElementById("sidenavLabel").textContent = pickLabel();
});