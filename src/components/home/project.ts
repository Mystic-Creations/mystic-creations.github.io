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
  #iconElement: HTMLImageElement;
  #downloadsElement: HTMLSpanElement;
  #followersElement: HTMLSpanElement;
  #updatedElement: HTMLSpanElement;

  static observedAttributes = ['slug', 'name', 'summary', 'icon', 'downloads', 'followers', 'updated'] as const;

  constructor() {
    super();

    const shadowRoot = this.attachShadow({
      mode: 'open',
    });
    shadowRoot.appendChild(document.importNode(template.content, true));

    this.#root = shadowRoot.querySelector('.proj-card');
    this.#nameElement = shadowRoot.querySelector('.proj-name');
    this.#summaryElement = shadowRoot.querySelector('.proj-summary');
    this.#iconElement = shadowRoot.querySelector('.proj-icon');
    this.#downloadsElement = shadowRoot.querySelector('[part=downloads]');
    this.#followersElement = shadowRoot.querySelector('[part=followers]');
    this.#updatedElement = shadowRoot.querySelector('[part=updated]');
  }

  set slug(value: string) {
    this.setAttribute('slug', value);
  }

  set name(value: string) {
    this.setAttribute('name', value);
  }

  set summary(value: string) {
    this.setAttribute('summary', value);
  }

  set icon(value: string) {
    this.setAttribute('icon', value);
  }

  set downloads(value: number) {
    this.setAttribute('downloads', fmtNum(value));
  }

  set followers(value: number) {
    this.setAttribute('followers', fmtNum(value));
  }

  set updated(value: Date) {
    this.setAttribute('updated', fmtRelativeDate(value));
  }

  attributeChangedCallback(name: ProjectCardAttributes, _oldValue: string, newValue: string): void {
    switch (name) {
      case 'slug':
        this.#root.href = `https://modrinth.com/project/${newValue}`;
        break;

      case 'name':
        this.#nameElement.textContent = newValue;
        console.log('Setting textContent of ', this.#nameElement, newValue);
        break;

      case 'summary':
        this.#summaryElement.textContent = newValue;
        break;

      case 'icon':
        this.#iconElement.src = newValue;
        break;

      case 'downloads':
        this.#downloadsElement.textContent = newValue;
        break;

      case 'followers':
        this.#followersElement.textContent = newValue;
        break;

      case 'updated':
        this.#updatedElement.textContent = newValue;
        break;

      default:
        exaustiveGuard(name);
    }
  }

  addLoader(name: string): void {
    const element = document.createElement('span');
    element.textContent = name;
    element.slot = 'loaders';
    element.className = `proj-tag proj-tag-loader proj-tag-loader-${name}`;
    this.appendChild(element);
  }

  addCategory(name: string): void {
    const element = document.createElement('span');
    element.textContent = name;
    element.slot = 'categories';
    element.className = 'proj-tag';
    this.appendChild(element);
  }
}

customElements.define('project-card', ProjectCard);
