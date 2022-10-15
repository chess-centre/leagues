import { z } from "zod";

export const PLAYER_SCHEMA = z.object({
  firstName: z.string().min(2).max(191),
  lastName: z.string().min(2).max(191),
  middleName: z.string().max(191).optional(),
});
export type Player = z.infer<typeof PLAYER_SCHEMA>;
