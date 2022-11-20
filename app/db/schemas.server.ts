import { z } from "zod";

export const VALID_ISO_8601_UTC =
  /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3}Z$/;

export const PLAYER_SCHEMA = z.object({
  teamId: z.number().optional(),
  firstName: z.string().min(2).max(191),
  lastName: z.string().min(2).max(191),
  middleName: z.string().max(191).optional(),
});
export type Player = z.infer<typeof PLAYER_SCHEMA>;

export const TEAM_SCHEMA = z.object({
  divisionId: z.number().optional(),
  name: z.string().min(2).max(191),
});
export type Team = z.infer<typeof TEAM_SCHEMA>;

export const LEAGUE_SCHEMA = z.object({
  name: z.string().min(2).max(191),
});
export type League = z.infer<typeof LEAGUE_SCHEMA>;

export const DIVISION_SCHEMA = z.object({
  leagueId: z.number(),
  name: z.string().min(2).max(191),
});
export type Division = z.infer<typeof DIVISION_SCHEMA>;

export const FIXTURE_SCHEMA = z.object({
  date: z.string().regex(VALID_ISO_8601_UTC),
  seasonId: z.number(),
  divisionId: z.number(),
  homeTeamId: z.number(),
  awayTeamId: z.number(),
});
export type Fixture = z.infer<typeof FIXTURE_SCHEMA>;

export const SEASON_SCHEMA = z.object({
  name: z.string().min(2).max(191),
  start: z.string().regex(VALID_ISO_8601_UTC),
  end: z.string().regex(VALID_ISO_8601_UTC),
  fixtures: z.array(
    z.object({
      id: z.number(),
    })
  ),
});
export type Season = z.infer<typeof SEASON_SCHEMA>;

export const VENUE_SCHEMA = z.object({
  name: z.string(),
  address: z.string(),
  city: z.string(),
  postcode: z.string(),
  long: z.string().nullish(),
  lat: z.string().nullish(),
  image: z.string().nullish(),
  facilities: z
    .array(
      z.object({
        facility: z.enum(["PARKING", "BAR", "DRINKS", "SNACKS"]),
      })
    )
    .nullish(),
});
export type Venue = z.infer<typeof VENUE_SCHEMA>;
