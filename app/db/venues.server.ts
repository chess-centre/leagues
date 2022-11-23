import type { Facilities } from "@prisma/client";
import { prisma } from "~/db/db.server";
import type { Venue } from "~/db/schemas.server";

type CreateVenueProps = {
  venue: Venue;
  select: { id?: boolean } & {
    [Property in keyof Venue]?: boolean;
  };
};
export const createVenue = async ({
  venue: { facilities, ...venueInfo },
  select,
}: CreateVenueProps) => {
  const venue = await prisma.venue.create({
    data: {
      ...venueInfo,
    },
    ...(select ? { select } : {}),
  });

  if (facilities) {
    await prisma.facility.createMany({
      data: facilities.map(({ facility }) => ({
        venueId: venue.id,
        facility: facility as Facilities,
      })),
    });
  }

  return venue;
};

type DeleteVenueProps = {
  venueId: number;
};
export const deleteVenue = async ({ venueId }: DeleteVenueProps) =>
  prisma.venue.delete({
    where: {
      id: venueId,
    },
  });

export const getVenues = async () => {
  const venues = await prisma.venue.findMany({
    include: {
      facilities: true,
    },
  });

  return venues;
};
