import { prisma } from "~/db/db.server";
import type { Team } from "~/db/schemas.server";

type CreateTeamProps = {
  team: Team;
  select: { id?: boolean } & {
    [Property in keyof Team]?: boolean;
  };
};
export const createTeam = async ({ team, select }: CreateTeamProps) =>
  prisma.team.create({
    data: team,
    ...(select ? { select } : {}),
  });

export const getTeams = async () => {
  const teams = await prisma.team.findMany();

  return teams;
};
