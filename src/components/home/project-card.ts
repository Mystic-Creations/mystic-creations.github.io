const template: HTMLTemplateElement = document.getElementById('project-card-template') as HTMLTemplateElement;

type ProjectCardAttributes = typeof ProjectCard.observedAttributes[number];

function fmtRelativeDate(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

function exaustiveGuard(value: never): never {
  throw new Error(`Got unexpected value: ${JSON.stringify(value)}`);
}

function fmtNum(n: number): string {
  return n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K' : n.toString();
}

export class ProjectCard extends HTMLElement {
  static observedAttributes = ['url-id', 'name', 'important-info', 'summary', 'updated', 'downloads', 'followers', 'icon'] as const;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: 'open',
    });
    shadowRoot.appendChild(document.importNode(template.content, true));
  }

  get #root(): HTMLAnchorElement {
    return this.shadowRoot.children[0] as HTMLAnchorElement;
  }

  set urlId(value: string) {
    this.setAttribute('url-id', value);
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  set importantInfo(value: string) {
    this.setAttribute('important-info', value);
  }

  set summary(value: string) {
    this.setAttribute('summary', value);
  }

  set updated(value: Date) {
    this.setAttribute('updated', fmtRelativeDate(value));
  }

  get downloads(): number {
    const text = this.getAttribute('downloads');
    return parseInt(text);
  }

  set downloads(value: number) {
    this.setAttribute('downloads', value.toString());
  }

  set followers(value: number) {
    this.setAttribute('followers', value.toString());
  }

  set icon(value: string) {
    this.setAttribute('icon', value);
  }

  attributeChangedCallback(name: ProjectCardAttributes, _oldValue: string, newValue: string): void {
    switch (name) {
      case 'url-id':
        this.#root.href = `https://modrinth.com/project/${newValue}`;
        break;

      case 'name':
      case 'summary':
        this.#root.querySelector(`.proj-${name}`)
          .textContent = newValue;
        break;

      case 'important-info': {
        const element = this.#root.querySelector('[part=important-info]') as HTMLSpanElement;
        element.textContent = newValue;
        element.style.display = newValue ? 'unset' : 'none';
        break;
      }

      case 'updated':
        this.#root.querySelector('[part=updated]')
          .textContent = newValue;
        break;

      case 'downloads':
      case 'followers': {
        const num = parseInt(newValue);
        this.#root.querySelector(`[part=${name}]`)
          .textContent = isNaN(num) ? 'error' : fmtNum(num);
        break;
      }

      case 'icon':
        (this.#root.querySelector('.proj-icon') as HTMLImageElement)
          .src = newValue;
        break;

      default:
        exaustiveGuard(name);
    }
  }

  addTag(name: string, slot: 'loaders' | 'categories', classes: string[] = []): void {
    const element = document.createElement('span');
    element.textContent = name;
    element.slot = slot;
    element.className = ['proj-tag'].concat(classes).join(' ');
    this.appendChild(element);
  }

  addLoader(name: string): void {
    this.addTag(name, 'loaders', ['proj-tag-loader', `proj-tag-loader-${name}`])
  }

  addCategory(name: string): void {
    this.addTag(name, 'categories')
  }
}

customElements.define('project-card', ProjectCard);
