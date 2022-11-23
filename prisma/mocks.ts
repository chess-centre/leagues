import { Federation, GameType } from "@prisma/client";
import type { Facilities } from "@prisma/client";
/**
 * Mock data of the 2022-23 Wharfedale Junior League
 * Example: https://ecflms.org.uk/lms/node/64377/tables
 */

export const teams = [
  {
    id: 1,
    name: "Mountain Lions",
    divisionId: 1,
  },
  {
    id: 2,
    name: "Night Hawks",
    divisionId: 1,
  },
  {
    id: 3,
    name: "Leopards",
    divisionId: 1,
  },
  {
    id: 4,
    name: "Orangutans",
    divisionId: 1,
  },
];

export const players = [
  // Mountain Lions
  {
    id: 1,
    firstName: "Shriaansh",
    lastName: "Ganti",
    teamId: 1,
  },
  {
    id: 2,
    firstName: "Cora",
    lastName: "Wainwright",
    teamId: 1,
  },
  {
    id: 3,
    firstName: "Edward",
    lastName: "Freeman",
    teamId: 1,
  },
  {
    id: 4,
    firstName: "Alex",
    lastName: "Rawse",
    teamId: 1,
  },
  // Night Hawks
  {
    id: 5,
    firstName: "Caelan",
    lastName: "Batty",
    teamId: 2,
  },
  {
    id: 6,
    firstName: "Freya",
    lastName: "Bramall",
    teamId: 2,
  },
  {
    id: 7,
    firstName: "Kira",
    lastName: "Kapustina",
    teamId: 2,
  },
  {
    id: 8,
    firstName: "Heidi",
    lastName: "Emery",
    teamId: 2,
  },
  {
    id: 9,
    firstName: "Jacob",
    lastName: "Robinson",
    teamId: 2,
  },
  // Leopards
  {
    id: 10,
    firstName: "Pierre",
    lastName: "De Beco",
    teamId: 3,
  },
  {
    id: 11,
    firstName: "Lois",
    lastName: "Northage",
    teamId: 3,
  },
  {
    id: 12,
    firstName: "Leo",
    lastName: "Logan",
    teamId: 3,
  },
  {
    id: 13,
    firstName: "George",
    lastName: "Sparrow",
    teamId: 3,
  },
  {
    id: 14,
    firstName: "Dylan",
    lastName: "Parkinson",
    teamId: 3,
  },
  //Orangutans
  {
    id: 15,
    firstName: "Charlie",
    lastName: "Wainwright",
    teamId: 4,
  },
  {
    id: 16,
    firstName: "Dan",
    lastName: "Yoshino-Buntin",
    teamId: 4,
  },
  {
    id: 17,
    firstName: "Archie",
    lastName: "Sheen",
    teamId: 4,
  },
  {
    id: 18,
    firstName: "Ella",
    lastName: "Bradford",
    teamId: 4,
  },
];

export const ratings = [
  // Mountain Lions
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1154,
    playerId: 1,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 906,
    playerId: 2,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 792,
    playerId: 3,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 507,
    playerId: 4,
  },
  // Night Hawks
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 728,
    playerId: 5,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 749,
    playerId: 6,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 702,
    playerId: 7,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 397,
    playerId: 8,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 228,
    playerId: 9,
  },
  // Leopards
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1527,
    playerId: 10,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1306,
    playerId: 11,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1178,
    playerId: 12,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1223,
    playerId: 13,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 742,
    playerId: 14,
  },
  // Orangutans
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1188,
    playerId: 15,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 1088,
    playerId: 16,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 669,
    playerId: 17,
  },
  {
    type: GameType.rapidplay,
    federation: Federation.ECF,
    rating: 369,
    playerId: 18,
  },
];

export const fixtures = [
  {
    id: 1,
    date: `2022-09-24T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 1,
  },
  {
    id: 2,
    date: `2022-09-24T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 4,
  },
  {
    id: 3,
    date: `2022-10-08T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 1,
    awayTeamId: 4,
  },
  {
    id: 4,
    date: `2022-10-08T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 2,
  },
  {
    id: 5,
    date: `2022-11-12T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 1,
  },
  {
    id: 6,
    date: `2022-11-12T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 4,
    awayTeamId: 3,
  },
  {
    id: 7,
    date: `2022-12-10T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 1,
  },
  {
    id: 8,
    date: `2022-12-10T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 4,
  },
  {
    id: 9,
    date: `2023-01-28T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 1,
    awayTeamId: 4,
  },
  {
    id: 10,
    date: `2023-01-28T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 3,
    awayTeamId: 2,
  },
  {
    id: 11,
    date: `2023-02-18T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 2,
    awayTeamId: 1,
  },
  {
    id: 12,
    date: `2023-02-18T10:30:00.000Z`,
    seasonId: 1,
    divisionId: 1,
    homeTeamId: 4,
    awayTeamId: 3,
  },
];

export const venues = [
  {
    id: 1,
    name: "Springfield College",
    address: "123 South Street",
    city: "Springfield",
    postcode: "A123456",
  },
  {
    id: 2,
    name: "The Shard",
    address: "32 London Bridge St",
    city: "London",
    postcode: "SE1 9SG",
    long: "51.50463020430712",
    lat: "-0.08648927291608077",
    image: "https://images.unsplash.com/photo-1465850238811-80ce79442c7a",
  },
];

export const facilities = [
  {
    id: 1,
    venueId: 2,
    facility: "BAR" as Facilities,
    description: "Cocktail bar",
  },
  {
    id: 2,
    venueId: 2,
    facility: "SNACKS" as Facilities,
    description: "Premium snack",
  },
  {
    id: 3,
    venueId: 1,
    facility: "PARKING" as Facilities,
    description: "Secure car parking for 80 cars",
  },
];
