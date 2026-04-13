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
  #root: HTMLAnchorElement;
  #nameElement: HTMLSpanElement;
  #summaryElement: HTMLParagraphElement;
  #updatedElement: HTMLSpanElement;
  #downloadsElement: HTMLSpanElement;
  #followersElement: HTMLSpanElement;
  #iconElement: HTMLImageElement;

  static observedAttributes = ['url-id', 'name', 'summary', 'updated', 'downloads', 'followers', 'icon'] as const;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: 'open',
    });
    shadowRoot.appendChild(document.importNode(template.content, true));

    this.#root = shadowRoot.querySelector('.proj-card');
    this.#nameElement = shadowRoot.querySelector('.proj-name');
    this.#summaryElement = shadowRoot.querySelector('.proj-summary');
    this.#updatedElement = shadowRoot.querySelector('[part=updated]');
    this.#downloadsElement = shadowRoot.querySelector('[part=downloads]');
    this.#followersElement = shadowRoot.querySelector('[part=followers]');
    this.#iconElement = shadowRoot.querySelector('.proj-icon');
  }

  set urlId(value: string) {
    this.setAttribute('url-id', value);
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  set summary(value: string) {
    this.setAttribute('summary', value);
  }

  set updated(value: Date) {
    this.setAttribute('updated', fmtRelativeDate(value));
  }

  set downloads(value: number) {
    this.setAttribute('downloads', fmtNum(value));
  }

  set followers(value: number) {
    this.setAttribute('followers', fmtNum(value));
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
        this.#nameElement.textContent = newValue;
        break;

      case 'summary':
        this.#summaryElement.textContent = newValue;
        break;

      case 'updated':
        this.#updatedElement.textContent = newValue;
        break;

      case 'downloads':
        this.#downloadsElement.textContent = newValue;
        break;

      case 'followers':
        this.#followersElement.textContent = newValue;
        break;

      case 'icon':
        this.#iconElement.src = newValue;
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
