import { z } from "zod";

export const hwidSchema = z.object({
  hddid: z.string(),
});

export const generateTokenSchema = z.object({
  hwid: z.coerce.number(),
  prog_id: z.coerce.number(),
  user_date: z.coerce.date(),
  expires_at: z.coerce.date(),
  code_np: z.coerce.number(),
  work_seats: z.coerce.number().optional(),
});

export const validateSchema = z.object({
  hwid: z.coerce.number(),
  token: z
    .string()
    .min(19)
    .max(19)
    .refine((v) => /.{4}-.{4}-.{4}-.{4}/.test(v)),
  email: z.string().email().optional(),
  password: z.string().optional(),
  userId: z.coerce.number().optional(),
});

export type THwid = z.infer<typeof hwidSchema>;
export type TGenerateToken = z.infer<typeof generateTokenSchema>;
export type TValidate = z.infer<typeof validateSchema>;
