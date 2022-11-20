import type { Facilities } from "@prisma/client";
import { motion } from "framer-motion";
import { getFacilityDisplayName } from "~/utils/styles";
import {
  InformationCircleIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

type VenueCardProps = {
  name: string;
  address: string;
  city: string;
  postcode: string;
  location: {
    long?: string | null;
    lat?: string | null;
  };
  image?: string | null;
  facilities?: { value: Facilities; description?: string | null }[];
};

const VenueCard = ({
  name,
  address,
  city,
  postcode,
  location,
  image,
  facilities = [],
}: VenueCardProps) => {
  return (
    <motion.div
      className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-4 w-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col gap-4">
        {image && (
          <div className="aspect-w-2 aspect-h-3 overflow-hidden rounded-lg">
            <img
              src={image}
              className="object-cover object-center"
              alt={name}
            />
          </div>
        )}
        <div className="p-3">
          <h2 className="text-xl font-medium sm:pr-12">{name}</h2>

          <div className="text-gray-500">
            <div>{address}</div>
            <div>{city}</div>
            <div>{postcode}</div>
          </div>

          {!!location?.lat?.length && !!location?.long?.length && (
            <section aria-labelledby={`${name}-location`} className="mt-1">
              <h3 id={`${name}-location`} className="sr-only">
                {`${name} lat ${location.lat} long ${location.long}`}
              </h3>

              <a
                href={`https://www.google.com/maps/place/${location.lat},${location.long}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2"
              >
                <span>View in Maps</span>
                <ArrowTopRightOnSquareIcon className="h-6 w-6" />
              </a>
            </section>
          )}

          <section aria-labelledby={`${name}-facilities`} className="mt-1">
            <h3 id={`${name}-facilities`} className="sr-only">
              Facilities
            </h3>

            <div className="flex flex-row flex-wrap gap-2">
              {facilities.map(({ value }) => (
                <div
                  key={value}
                  className="flex text-primary-700 font-bold gap-2 py-2"
                >
                  <InformationCircleIcon className="h-6 w-6" />
                  {getFacilityDisplayName(value)}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard;
