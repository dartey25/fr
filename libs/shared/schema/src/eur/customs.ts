import { z } from "../zod";

const customsInfoSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  custCode: z.string(),
});

type TCustomsInfo = z.infer<typeof customsInfoSchema>;

export { customsInfoSchema };
export type { TCustomsInfo };
