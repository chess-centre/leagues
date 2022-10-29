import { PrismaClient } from "@prisma/client";
import { teams, players, ratings, fixtures } from "./mocks";

const prisma = new PrismaClient();

async function seed() {

  // League
  await prisma.league.create({
    data: {
      id: 1,
      name: 'Wharfedale Junior League',
    }
  });

  // Division
  await prisma.division.create({
    data: {
      id: 1,
      name: 'Division One',
      leagueId: 1
    }
  });

  // Season
  await prisma.season.create({
    data: {
      id: 1,
      displayName: '2022-23',
      start: `2022-09-01T00:00:00.000Z`,
      end: `2022-08-31T00:00:00.000Z`,
    }
  });

  // Teams
  await prisma.team.createMany({ data: teams });

  // Players
  await prisma.player.createMany({ data: players });

  // Ratings
  await prisma.playerRating.createMany({ data: ratings });

  // Fixtures
  // TODO: see issue - https://github.com/chess-centre/leagues/issues/9
  await prisma.fixture.createMany({ data: fixtures });

  console.log(`Database has been seeded. 🌱`);

}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
