import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const advice = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/advice" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    summary: z.string(),
    category: z.enum(["Genetics & science", "Nutrition & sleep", "Growth timelines"]),
    readTime: z.string(),
    updated: z.coerce.date(),
    featured: z.boolean().default(false),
    faq: z.array(z.object({ question: z.string(), answer: z.string() })).default([])
  })
});

export const collections = { advice };
