import { defineConfig } from 'astro/config';
import deno from '@deno/astro-adapter';

// https://astro.build/config
export default defineConfig({
  site: "https://mystic-creations.github.io",
  adapter: deno(),
  build: {
    format: 'preserve',
    // Entry file must be in chunks/ for the shim (@deno/astro-adapter/__deno_imports.ts) to be replaced
    // https://github.com/denoland/deno-astro-adapter/blob/c25caa3d8f13590c840b9e919dd27b4a51c27747/src/index.ts#L151
    serverEntry: "chunks/entry.mjs",
  },
});
