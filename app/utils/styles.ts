import type { Facilities } from "@prisma/client";

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};

export const getFacilityDisplayName = (facility: Facilities) => {
  switch (facility) {
    case "PARKING":
      return "Parking";
    case "BAR":
      return "Bar";
    case "DRINKS":
      return "Drinks";
    case "SNACKS":
      return "Snacks";
    default:
      return "";
  }
};
