import { z } from "../zod";

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
  password: z.string(),
});

const tokenSchema = z.object({
  hwid: z.coerce.number(),
  token: z.string().refine((v) => /.{4}-.{4}-.{4}-.{4}/.test(v)),
  terms: z
    .boolean()
    .default(false)
    .refine((value) => value, {
      message: "Обов'язкове поле",
    }),
  expires: z.coerce.date().optional(),
});

const licenseSchema = z.object({
  license: tokenSchema,
  profile: profileSchema,
});

export { licenseSchema, tokenSchema, profileSchema };
export type TLicense = z.infer<typeof licenseSchema>;
export type TToken = z.infer<typeof tokenSchema>;
export type TProfile = z.infer<typeof profileSchema>;
