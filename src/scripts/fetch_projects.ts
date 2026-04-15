import type { ProjectCard } from './create_projects.ts';

const MODRINTH_ORG = 'lumynity-studios';
const UA = 'Lumynity-Studios/lumynity-studios-site (https://lumynity-studios.github.io)';

const CONTAINER = document.getElementById('projects-grid-container');

// See https://github.com/modrinth/code/blob/1a51e582970f9851051b9eb962f40f3371f0eb1f/apps/labrinth/src/models/v3/projects.rs#L19-L104
interface ModrinthProject {
  id: string,
  slug?: string,
  name: string,
  summary: string,
  categories: string[],
  additional_categories: string[],
  loaders: string[],
  updated: string,
  downloads: number,
  followers: number,
  icon_url?: string,
}

function buildCard(project: ModrinthProject): HTMLElement {
  const element = document.createElement('project-card') as ProjectCard;

  element.urlId = project.slug ?? project.id;
  element.name = project.name;
  element.summary = project.summary;
  element.updated = new Date(project.updated);
  element.downloads = project.downloads;
  element.followers = project.followers;
  if (project.icon_url !== undefined)
    element.icon = project.icon_url;

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
