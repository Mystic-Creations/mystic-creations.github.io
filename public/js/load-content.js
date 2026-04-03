// Home
fetch('public/files/home/home-about.md')
  .then(res => res.text())
  .then(html => { document.getElementById('home-about').innerHTML = `<div>${html}</div>`; });

fetch('public/files/home/home-projects.md')
  .then(res => res.text())
  .then(html => { document.getElementById('home-projects').innerHTML = `<div>${html}</div>`; });

fetch('public/files/home/home-news.md')
  .then(res => res.text())
  .then(html => { document.getElementById('home-news').innerHTML = `<div>${html}</div>`; });

fetch('public/files/home/home-dev.md') // temporary for development time
  .then(res => res.text())
  .then(html => { document.getElementById('home-dev').innerHTML = `<div>${html}</div>`; });

// Contact
fetch('public/files/contact/contact.md')
  .then(res => res.text())
  .then(html => { document.getElementById('contact').innerHTML = `<div>${html}</div>`; });

// Dev Docs
fetch('public/files/dev-docs/gradle-setups.md')
  .then(res => res.text())
  .then(html => { document.getElementById('dev-docs-gradle').innerHTML = `<div>${html}</div>`; });

fetch('public/files/dev-docs/project-publishing.md')
  .then(res => res.text())
  .then(html => { document.getElementById('dev-docs-publishing').innerHTML = `<div>${html}</div>`; });

fetch('public/files/dev-docs/project-structuring.md')
  .then(res => res.text())
  .then(html => { document.getElementById('dev-docs-structuring').innerHTML = `<div>${html}</div>`; });

fetch('public/files/dev-docs/useful-tools.md')
  .then(res => res.text())
  .then(html => { document.getElementById('dev-docs-useful-tools').innerHTML = `<div>${html}</div>`; });

fetch('public/files/dev-docs/work-tools.md')
  .then(res => res.text())
  .then(html => { document.getElementById('dev-docs-work-tools').innerHTML = `<div>${html}</div>`; });

// Meet The Team
fetch('public/files/meet-the-team/people.md')
  .then(res => res.text())
  .then(html => { document.getElementById('meet-the-team').innerHTML = `<div>${html}</div>`; });

// News
fetch('public/files/news/news.md')
  .then(res => res.text())
  .then(html => { document.getElementById('news').innerHTML = `<div>${html}</div>`; });

// Socials
fetch('public/files/socials/socials.md')
  .then(res => res.text())
  .then(html => { document.getElementById('socials').innerHTML = `<div>${html}</div>`; });

// Support
fetch('public/files/support/faq.md')
  .then(res => res.text())
  .then(html => { document.getElementById('support-faq').innerHTML = `<div>${html}</div>`; });

fetch('public/files/support/support.md')
  .then(res => res.text())
  .then(html => { document.getElementById('support').innerHTML = `<div>${html}</div>`; });