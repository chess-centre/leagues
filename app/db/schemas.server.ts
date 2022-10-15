import { z } from "zod";

export const PLAYER_SCHEMA = z.object({
  firstName: z.string().min(2).max(191),
  lastName: z.string().min(2).max(191),
  middleName: z.string().max(191).optional(),
});
export type Player = z.infer<typeof PLAYER_SCHEMA>;

export const TEAM_SCHEMA = z.object({
  name: z.string().min(2).max(191),
});
export type Team = z.infer<typeof TEAM_SCHEMA>;

export const LEAGUE_SCHEMA = z.object({
  name: z.string().min(2).max(191),
});
export type League = z.infer<typeof LEAGUE_SCHEMA>;
