import { useMemo } from "react";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { classNames } from "~/utils/styles";
import { Link, useMatches } from "@remix-run/react";
import { motion } from "framer-motion";

type NavLink = {
  label: string;
  link: string;
};
type HeaderProps = {
  links: NavLink[];
};

const Header = ({ links }: HeaderProps) => {
  const matches = useMatches();

  const matchedRoute = useMemo(
    () =>
      links.find(({ link }) => {
        return matches.find((matchingRoute) =>
          matchingRoute.pathname.startsWith(link)
        );
      }),
    [links, matches]
  );

  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center border-b border-gray-100 py-6">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Chess Centre Logo"
              />
            </div>

            <div className="flex h-16 justify-end sm:justify-center">
              <div className="flex">
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {links.map(({ label, link }) => (
                    <Link
                      key={link}
                      to={link}
                      className={classNames(
                        link === matchedRoute?.link
                          ? "text-gray-900"
                          : "text-gray-500 hover:border-b-2 hover:border-accent-300 hover:text-gray-700",
                        "relative inline-flex items-center px-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                      )}
                      aria-current={
                        link === matchedRoute?.link ? "page" : undefined
                      }
                    >
                      {label}
                      {link === matchedRoute?.link && (
                        <motion.div
                          className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary-500"
                          layoutId="underline"
                        />
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {links.map(({ label, link }) => (
                <Link key={link} to={link}>
                  <Disclosure.Button
                    as="span"
                    className={classNames(
                      link === matchedRoute?.link
                        ? "border-primary-500 text-primary-700"
                        : "border-transparent text-gray-600 hover:bg-accent-50 hover:border-accent-300 hover:text-gray-800",
                      "block pl-3 pr-4 py-2 border-l-4 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    )}
                    aria-current={
                      link === matchedRoute?.link ? "page" : undefined
                    }
                  >
                    {label}
                  </Disclosure.Button>
                </Link>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
