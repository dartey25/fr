import { z } from "../zod";

const databaseSchema = z.object({
  provider: z
    .string()
    .refine(
      (type) => /sqlite|postgres(ql)?|mysql/.test(type),
      "Підтримуються лише бази типу SQLite, PostgreSQL, MySQL",
    ),
  host: z.string(),
  port: z.coerce.number(),
  username: z.string(),
  password: z.string(),
  database: z.string(),
  connectionUrl: z.string(),
  backUpPath: z.string().optional(),
});

type TDatabaseSchema = z.infer<typeof databaseSchema>;

export { databaseSchema };
export type { TDatabaseSchema };
