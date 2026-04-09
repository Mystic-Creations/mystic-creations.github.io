import type { ProjectCard } from './project.ts';

const MODRINTH_ORG = 'lumynity-studios';
const UA = 'Lumynity-Studios/lumynity-studios-site (https://mystic-creations.github.io)';

const CONTAINER = document.getElementById('projects-grid-container');

// See https://docs.modrinth.com/api/operations/getuserprojects/
interface ModrinthProject {
  slug: string,
  name: string,
  summary: string,
  categories: string[],
  additional_categories: string[],
  downloads: number,
  icon_url?: string,
  followers: number,
  loaders: string[],
  updated: string,
}

function buildCard(project: ModrinthProject): HTMLElement {
  const element = document.createElement('project-card') as ProjectCard;

  element.slug = project.slug;
  element.name = project.name;
  element.summary = project.summary;
  if (project.icon_url !== undefined)
    element.icon = project.icon_url;
  element.downloads = project.downloads;
  element.followers = project.followers;
  element.updated = new Date(project.updated);

  for (const l of project.loaders)
    element.addLoader(l);

  for (const c of project.categories.concat(project.additional_categories))
    element.addCategory(c.replace('-', ' '));

  return element;
}

async function fetchAndRender() {
  try {
    const res = await fetch(`https://api.modrinth.com/v3/organization/${MODRINTH_ORG}/projects`, {
      headers: { 'User-Agent': UA }
    });
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const projects = await res.json() as ModrinthProject[];

    if (projects.length === 0) {
      CONTAINER.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No projects found.</p>';
      return;
    }

    projects.sort((a, b) => b.downloads - a.downloads);

    const grid = document.createElement('div');
    grid.className = 'projects-grid';
    for (const p of projects) grid.appendChild(buildCard(p));

    CONTAINER.appendChild(grid);
  } catch (err) {
    CONTAINER.innerHTML = `<p style="color:var(--text-muted);text-align:center;">Could not load projects: ${err.message}</p>`;
  }
}

fetchAndRender();
