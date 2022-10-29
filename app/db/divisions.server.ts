import { prisma } from "~/db/db.server";
import type { Division } from "~/db/schemas.server";

type CreateDivisionProps = {
  division: Division;
  select: { id?: boolean } & {
    [Property in keyof Division]?: boolean;
  };
};
export const createDivision = async ({
  division,
  select,
}: CreateDivisionProps) =>
  prisma.division.create({
    data: division,
    ...(select ? { select } : {}),
  });

export const getDivisions = async () => {
  const divisions = await prisma.division.findMany();

  return divisions;
};
