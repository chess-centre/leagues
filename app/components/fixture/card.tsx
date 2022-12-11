import { motion } from "framer-motion";
import { ClockIcon } from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";

type FixtureCardProps = {
  homeTeam: string;
  awayTeam: string;
  league: string;
  division: string;
  start: string;
};

const FixtureCard = ({
  homeTeam,
  awayTeam,
  league,
  division,
  start,
}: FixtureCardProps) => {
  return (
    <motion.div
      className="shadow ring-1 ring-black ring-opacity-5 rounded-md p-4 w-full"
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex flex-col gap-4">
        <div className="p-3">
          <div>
            <span className="font-medium text-gray-800">{league}</span>
            <span> | </span>
            <span className="text-gray-500">{division}</span>
          </div>

          <h1 className="text-3xl font-medium pb-2">
            <span className="text-primary-600 font-bold">{homeTeam}</span>
            <span className="text-sm px-3">v</span>
            <span className="text-accent-600 font-bold">{awayTeam}</span>
          </h1>

          <div className="text-gray-800 flex items-center gap-2">
            <ClockIcon className="h-5 w-5" />

            <div>
              <span>{format(parseISO(start), "dd MMMM yyyy")}</span>
              <span> at </span>
              <span className="font-bold">
                {format(parseISO(start), "HH:mm")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FixtureCard;
