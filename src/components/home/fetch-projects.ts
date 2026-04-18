import type { ProjectCard } from './project-card.ts';

const MODRINTH_API_BASE = 'https://api.modrinth.com/v3/';
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

  // Custom additions:
  importantInfo?: string,
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

  if (project.importantInfo !== undefined)
    element.importantInfo = project.importantInfo;

  return element;
}

async function apiCall<ReturnType>(endpoint: string): Promise<ReturnType> {
  const res = await fetch(MODRINTH_API_BASE + endpoint, {
    headers: { 'User-Agent': UA }
  });

  if (!res.ok) throw new Error(`API returned ${res.status}`);
  return await res.json();
}

function fetchProjects(): Promise<ModrinthProject[]> {
  return apiCall(`organization/${MODRINTH_ORG}/projects`);
}

function fetchProject(urlId: string): Promise<ModrinthProject> {
  return apiCall(`project/${urlId}`);
}

function insertProject(container: HTMLDivElement, project: ModrinthProject) {
  // With the current number of project, this is unnecessary but why not?
  // Based on Rust's slice::binary_search_by
  // https://doc.rust-lang.org/1.95.0/src/core/slice/mod.rs.html#2970-3022
  function binaryInsert(collection: HTMLCollection) {
    let base = 0, size = collection.length;
    if (size === 0) return 0;

    while (size > 1) {
      const half = Math.floor(size / 2);
      const mid = base + half;
      if ((collection[mid] as ProjectCard).downloads > project.downloads)
        base = mid;
      size -= half;
    }

    return base + +((collection[base] as ProjectCard).downloads > project.downloads);
  }

  const projects = container.children;
  const position = binaryInsert(projects);
  const element = buildCard(project);
  container.insertBefore(element, projects[position]);
}

async function fetchAndRender() {
  const grid = document.createElement('div');
  grid.className = 'projects-grid';
  CONTAINER.appendChild(grid);

  const insert = insertProject.bind(undefined, grid);
  const additions = [
    fetchProjects().then(projects => projects.forEach(insert)),
    fetchProject('create-totem-factory').then(project => {
      project.importantInfo = 'Collaborative Project';
      return project
    }).then(insert),
  ];

  try {
    await Promise.all(additions);
  } catch (err) {
    CONTAINER.innerHTML = `<p style="color:var(--text-muted);text-align:center;">Could not load projects: ${err.message}</p>`;
    return;
  }

  if (grid.children.length === 0) {
    CONTAINER.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No projects found.</p>';
  }
}

fetchAndRender();
