import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/articles" }),
});

export const collections = { news };
