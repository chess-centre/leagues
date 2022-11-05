import { prisma } from "~/db/db.server";
import type { Season } from "~/db/schemas.server";

type CreateSeasonProps = {
  season: Season;
  select: { id?: boolean } & {
    [Property in keyof Season]?: boolean;
  };
};
export const createSeason = async ({ season, select }: CreateSeasonProps) => {
  const { fixtures, ...rest } = season;
  return prisma.season.create({
    data: {
      fixtures: {
        connect: [...fixtures],
      },
      ...rest,
    },
    ...(select ? { select } : {}),
  });
};

type DeleteSeasonProps = {
  seasonId: number;
};
export const deleteSeason = async ({ seasonId }: DeleteSeasonProps) =>
  prisma.season.delete({
    where: {
      id: seasonId,
    },
  });

export const getSeasons = async () => {
  const seasons = await prisma.season.findMany();

  return seasons;
};
