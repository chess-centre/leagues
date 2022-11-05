import { prisma } from "~/db/db.server";
import type { Fixture } from "~/db/schemas.server";

type CreateFixtureProps = {
  fixture: Fixture;
  select: { id?: boolean } & {
    [Property in keyof Fixture]?: boolean;
  };
};
export const createFixture = async ({ fixture, select }: CreateFixtureProps) =>
  prisma.fixture.create({
    data: fixture,
    ...(select ? { select } : {}),
  });

type DeleteFixtureProps = {
  fixtureId: number;
};
export const deleteFixture = async ({ fixtureId }: DeleteFixtureProps) =>
  prisma.fixture.delete({
    where: {
      id: fixtureId,
    },
  });

export const getFixtures = async () => {
  const fixtures = await prisma.fixture.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      division: true,
    },
  });

  return fixtures;
};
