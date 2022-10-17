import type { ReactNode } from "react";
import { classNames } from "~/utils/styles";
import FillLoader from "../fill-loader";

type ButtonProps = {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
};

const Button = ({
  children,
  disabled = false,
  loading = false,
  type = "button",
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        loading && "opacity-80 cursor-not-allowed",
        "inline-flex items-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-base font-medium text-gray-100 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow ring-1 ring-black ring-opacity-5"
      )}
      disabled={disabled}
      type={type}
    >
      {children}
      {loading && (
        <FillLoader
          size="sm"
          className={classNames(children ? "ml-2" : "mx-1")}
        />
      )}
    </button>
  );
};

export default Button;
