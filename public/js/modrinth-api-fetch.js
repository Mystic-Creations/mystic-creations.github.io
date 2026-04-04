// Fetches projects from Mystic Creations Team org on Modrinth (v3 API)

const MODRINTH_ORG = 'mystic-creations-team';
const UA = 'Mystic-Creations/mystic-creations-site (https://mystic-creations.github.io)';

function fmtNum(n) {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : n;
}

function fmtDate(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

const LOADER_STYLES = {
  fabric:   { color: '#dbb69b', border: '#dbb69b96' },
  forge:    { color: '#959eef', border: '#959eef96' },
  neoforge: { color: '#f19969', border: '#f1996996' },
  quilt:    { color: '#c192f2', border: '#c192f296' },
};

const ICON_DOWNLOAD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 8a1 1 0 0 1 1 1v2a1 1 0 0 0 1 1h3.293a.707.707 0 0 1 .5 1.207l-6.939 6.939a1.207 1.207 0 0 1-1.708 0l-6.94-6.94a.707.707 0 0 1 .5-1.206H8a1 1 0 0 0 1-1V9a1 1 0 0 1 1-1z"/><path d="M9 4h6"/></svg>`;
const ICON_HEART    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>`;
const ICON_CLOCK    = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 1 7.38 16.75"/><path d="M12 6v6l4 2"/><path d="M2.5 8.875a10 10 0 0 0-.5 3"/><path d="M2.83 16a10 10 0 0 0 2.43 3.4"/><path d="M4.636 5.235a10 10 0 0 1 .891-.857"/><path d="M8.644 21.42a10 10 0 0 0 7.631-.38"/></svg>`;

/* Capitalize first letter of each word, handle hyphenated slugs like "game-mechanics" */
function titleCase(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function buildCard(p) {
  const name = p.name || p.title || p.slug;
  const summary = p.summary || p.description || '';

  /* Row 1: loaders */
  const loaderTags = (p.loaders || [])
    .filter(l => LOADER_STYLES[l.toLowerCase()])
    .map(l => {
      const s = LOADER_STYLES[l.toLowerCase()];
      return `<span class="proj-tag proj-tag-loader" style="color:${s.color};border-color:${s.border}">${titleCase(l)}</span>`;
    }).join('');

  /* Row 2: categories */
  const categoryTags = (p.categories || [])
    .map(c => `<span class="proj-tag">${titleCase(c)}</span>`)
    .join('');

  /* Only render rows that have content */
  const tagBlock = [
    loaderTags   ? `<div class="proj-tags proj-tags-loaders">${loaderTags}</div>`     : '',
    categoryTags ? `<div class="proj-tags proj-tags-categories">${categoryTags}</div>` : '',
  ].join('');

  const card = document.createElement('a');
  card.className = 'proj-card';
  card.href = `https://modrinth.com/project/${p.slug}`;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.innerHTML = `
    <div class="proj-card-top">
      <img class="proj-icon" src="${p.icon_url || 'public/assets/logo.png'}" alt="${name}" onerror="this.src='public/assets/logo.png'">
      <div class="proj-info">
        <span class="proj-name">${name}</span>
        <p class="proj-summary">${summary}</p>
      </div>
    </div>
    ${tagBlock}
    <div class="proj-footer">
      <span class="proj-stat">${ICON_DOWNLOAD} ${fmtNum(p.downloads)}</span>
      <span class="proj-stat">${ICON_HEART} ${p.followers}</span>
      <span class="proj-stat proj-updated">${ICON_CLOCK} ${fmtDate(p.updated)}</span>
    </div>
  `;
  return card;
}

async function fetchAndRender(container) {
  try {
    const res = await fetch(`https://api.modrinth.com/v3/organization/${MODRINTH_ORG}/projects`, {
      headers: { 'User-Agent': UA }
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const projects = await res.json();

    if (!projects.length) {
      container.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No projects found.</p>';
      return;
    }

    projects.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));

    const grid = document.createElement('div');
    grid.className = 'projects-grid';
    for (const p of projects) grid.appendChild(buildCard(p));
    container.appendChild(grid);

  } catch (err) {
    container.innerHTML = `<p style="color:var(--text-muted);text-align:center;">Could not load projects: ${err.message}</p>`;
  }
}

function waitForContainer() {
  const existing = document.getElementById('projects-grid-container');
  if (existing) { fetchAndRender(existing); return; }

  const observer = new MutationObserver(() => {
    const el = document.getElementById('projects-grid-container');
    if (el) { observer.disconnect(); fetchAndRender(el); }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

waitForContainer();