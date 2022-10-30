import type { ReactNode } from "react";
import { classNames } from "~/utils/styles";
import FillLoader from "../fill-loader";

type ActionButtonProps = {
  label: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  name?: string;
  value?: string;
  icon: ReactNode;
};

const ActionButton = ({
  label,
  className,
  icon,
  type,
  loading,
  name,
  value,
  disabled = false,
  onClick,
}: ActionButtonProps) => {
  return (
    <button
      type={type}
      name={name}
      value={value}
      disabled={disabled || loading}
      onClick={onClick}
      className={classNames(
        className,
        (loading || disabled) && "opacity-80 cursor-not-allowed",
        "rounded-full bg-transparent p-1 text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
      )}
    >
      <span className="sr-only">{label}</span>
      <div className={classNames("flex items-center justify-center")}>
        {loading ? <FillLoader size="sm" className="ml-2" /> : icon}
      </div>
    </button>
  );
};

export default ActionButton;
