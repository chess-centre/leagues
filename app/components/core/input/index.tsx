import { AnimatePresence, motion } from "framer-motion";
import type {
  ChangeEvent,
  FocusEventHandler,
  ForwardedRef,
  HTMLInputTypeAttribute,
} from "react";
import { forwardRef } from "react";
import { useId } from "react";
import { classNames } from "~/utils/styles";

type InputProps = {
  id?: string;
  name: string;
  disabled?: boolean;
  placeholder?: string;
  label: string;
  defaultValue?: string;
  value?: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  required?: boolean;
  error?: string;
};

const Input = (
  {
    id,
    name,
    placeholder,
    label,
    disabled = false,
    required = false,
    value,
    defaultValue,
    error,
    type = "text",
    onChange = () => ({}),
    onBlur = () => ({}),
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const reactId = useId();
  const inputId = id || reactId;

  return (
    <div>
      <label className="flex flex-col font-medium text-gray-700">
        {label}
        <input
          id={inputId}
          ref={ref}
          className={classNames(
            error && "text-red-700 ring-offset-2 ring-2 ring-red-500",
            disabled && "cursor-not-allowed",
            "my-2 rounded-md bg-transparent shadow-sm border-gray-400  focus:border-primary-500 focus:ring-primary-500"
          )}
          disabled={disabled}
          required={required}
          name={name}
          placeholder={placeholder}
          type={type}
          defaultValue={defaultValue}
          value={value}
          onChange={(e) => onChange(e, e.currentTarget.value)}
          onBlur={onBlur}
        />
      </label>
      <div className="flex overflow-hidden">
        {error?.length && (
          <AnimatePresence>
            <motion.span
              key={inputId}
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

export default forwardRef(Input);
