import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: "https://lumynity-studios.github.io",
  build: {
    format: 'preserve',
  },
  image: {
    responsiveStyles: true,
  }
});
