import { prisma } from "~/db/db.server";
import type { League } from "~/db/schemas.server";

type CreateLeagueProps = {
  league: League;
  select: { id?: boolean } & {
    [Property in keyof League]?: boolean;
  };
};
export const createLeague = async ({ league, select }: CreateLeagueProps) =>
  prisma.league.create({
    data: league,
    ...(select ? { select } : {}),
  });

type DeleteLeagueProps = {
  leagueId: number;
};
export const deleteLeague = async ({ leagueId }: DeleteLeagueProps) =>
  prisma.league.delete({
    where: {
      id: leagueId,
    },
  });

export const getLeagues = async () => {
  const leagues = await prisma.league.findMany();

  return leagues;
};
