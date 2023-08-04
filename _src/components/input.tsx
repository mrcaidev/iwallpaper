import clsx from "clsx";
import { ComponentProps, useId } from "react";

type Props = ComponentProps<"input"> & {
  label?: string;
};

export function Input({
  label = "Field",
  type = "text",
  className,
  ...rest
}: Props) {
  const id = useId();

  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <input
        {...rest}
        type={type}
        id={id}
        className={clsx(
          "block min-w-0 w-full px-4 py-3 rounded border border-slate-600 dark:border-slate-400 bg-transparent disabled:opacity-40 transition-opacity disabled:cursor-not-allowed placeholder:text-slate-500",
          className,
        )}
      />
    </div>
  );
}
