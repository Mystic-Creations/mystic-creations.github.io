fetch('public/files/home-about.md')
  .then(res => res.text())
  .then(html => {
    document.getElementById('home-about').innerHTML = `<p>${html}</p>`;
  });