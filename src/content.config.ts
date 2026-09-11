import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Blog posts.
 *
 * The schema is the point: a post with a missing description or a malformed
 * date fails `astro build`, which means it fails CI, which means it never
 * reaches the site. Frontmatter typos are a build error rather than a
 * production bug.
 */
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1).max(80),
    // Used as the meta description and the excerpt on the index, so it is
    // required rather than optional — a post without one is a worse result
    // in search and a worse listing.
    description: z.string().min(40).max(180),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    // Lets a post exist in the repo without appearing anywhere public.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
