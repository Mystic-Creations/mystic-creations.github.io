import { defineConfig } from 'astro/config';
import deno from '@deno/astro-adapter';

// https://astro.build/config
export default defineConfig({
  site: "https://mystic-creations.github.io",
  adapter: deno(),
});
