import { prisma } from "~/db/db.server";
import type { Player } from "~/db/schemas.server";

type CreatePlayerProps = {
  player: Player;
  select: { id?: boolean } & {
    [Property in keyof Player]?: boolean;
  };
};
export const createPlayer = async ({ player, select }: CreatePlayerProps) =>
  prisma.player.create({
    data: player,
    ...(select ? { select } : {}),
  });

type DeletePlayerProps = {
  playerId: number;
};
export const deletePlayer = async ({ playerId }: DeletePlayerProps) =>
  prisma.player.delete({
    where: {
      id: playerId,
    },
  });

export const getPlayers = async () => {
  const players = await prisma.player.findMany();

  return players;
};
