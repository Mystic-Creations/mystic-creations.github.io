const BASE_URL = '/news/';

const container = document.getElementById('Posts') as HTMLDivElement;
const observerElement = document.getElementById('Observer') as HTMLSpanElement;
const prerendered = parseInt(observerElement.dataset.prerendered);
let rendered = prerendered;

const index: string[] = await fetch(BASE_URL + 'index.json')
  .then(res => res.json());

const observer = new IntersectionObserver(async (entries, observer) => {
  if (entries.length === 0)
    return;
  const { isIntersecting, target } = entries[0];
  if (!isIntersecting)
    return;

  if (await loadNextPost())
    // Do we need a timeout or mutation observer to make sure the
    // post has rendered before re-enabling the intersection observer?
    observer.observe(target);
});
observer.observe(observerElement);

async function loadNextPost() {
  observer.unobserve(observerElement);

  const id = index[rendered++];
  if (id === undefined)
    return false;

  const response = await fetch(BASE_URL + id);
  let postText: string;
  if (response.ok) {
    postText = await response.text();
  } else {
    postText = `${response.status} - ${response.statusText}`;
  }

  const article = document.createElement('article');
  article.innerHTML = postText;
  container.insertBefore(article, observerElement);

  return true;
}
