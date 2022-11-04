import { AnimatePresence, motion } from "framer-motion";
import type { ChangeEvent, FocusEventHandler } from "react";
import { useId } from "react";
import { classNames } from "~/utils/styles";

type Option = {
  label: string;
  value: string | number;
};

type SelectProps = {
  id?: string;
  name: string;
  disabled?: boolean;
  label: string;
  defaultValue?: string;
  value?: string | number;
  options: Option[];
  onChange?: (e: ChangeEvent<HTMLSelectElement>, value: string) => void;
  onBlur?: FocusEventHandler<HTMLSelectElement>;
  required?: boolean;
  error?: string;
};

const Select = ({
  id,
  name,
  label,
  disabled = false,
  required = false,
  value,
  options,
  defaultValue = "none",
  error,
  onChange = () => ({}),
  onBlur = () => ({}),
}: SelectProps) => {
  const reactId = useId();
  const selectId = id || reactId;

  return (
    <div>
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={classNames(
          error && "text-red-700 ring-offset-2 ring-2 ring-red-500",
          disabled && "cursor-not-allowed",
          "w-full my-2 rounded-md bg-transparent shadow-sm border-gray-400  focus:border-primary-500 focus:ring-primary-500"
        )}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        required={required}
        value={value}
        onChange={(e) => onChange(e, e.currentTarget.value)}
        onBlur={onBlur}
      >
        <option disabled value="none">
          None selected
        </option>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="flex overflow-hidden">
        {error?.length && (
          <AnimatePresence>
            <motion.span
              key={selectId}
              style={{ color: "red" }}
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.4,
              }}
            >
              {error}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Select;
