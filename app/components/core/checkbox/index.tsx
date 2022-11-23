import { AnimatePresence, motion } from "framer-motion";
import type { ChangeEvent, FocusEventHandler } from "react";
import { useId } from "react";

type CheckBoxProps = {
  id?: string;
  name: string;
  label: string;
  value: string;
  checked?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  error?: string;
};

const CheckBox = ({
  id,
  label,
  name,
  value,
  checked,
  onChange = () => ({}),
  onBlur = () => ({}),
  error,
}: CheckBoxProps) => {
  const reactId = useId();
  const checkboxId = id || reactId;
  return (
    <div className="py-2">
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={checkboxId}
            aria-describedby="offers-description"
            name={name}
            value={value}
            type="checkbox"
            checked={checked}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            onChange={(e) => onChange(e, e.currentTarget.checked)}
            onBlur={onBlur}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor={checkboxId} className="font-medium">
            {label}
          </label>
        </div>
      </div>
      <div className="flex overflow-hidden">
        {error?.length && (
          <AnimatePresence>
            <motion.span
              key={checkboxId}
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

export default CheckBox;
