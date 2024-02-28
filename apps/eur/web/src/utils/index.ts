import { clsx, type ClassValue } from "clsx";
import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";
import { z } from "zod";

const tailwindMergeConfig = {
  // ↓ Set how many values should be stored in cache.
  cacheSize: 500,
  // ↓ Optional prefix from TaiLwind config
  prefix: "tw-",
  theme: {
    // Theme scales are defined here
    // This is not the theme object from your Tailwind config
  },
  classGroups: {
    // Class groups are defined here
  },
  conflictingClassGroups: {
    // Conflicts between class groups are defined here
  },
};

const customTwMerge = createTailwindMerge(
  getDefaultConfig,
  () => tailwindMergeConfig,
);

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}

export function schemaOptional(field: z.ZodTypeAny) {
  return field instanceof z.ZodOptional || field instanceof z.ZodNullable;
}
