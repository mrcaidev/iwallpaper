"use client";

import clsx from "clsx";
import { ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  id: string;
  label: string;
};

export function Input({ id, label, type = "text", className, ...rest }: Props) {
  return (
    <div className="space-y-2">
      <label htmlFor={id}>{label}</label>
      <input
        {...rest}
        type={type}
        id={id}
        className={clsx(
          "block min-w-0 w-full px-4 py-3 rounded border-2 border-slate-600 dark:border-slate-400 bg-transparent disabled:opacity-40 transition-opacity disabled:cursor-not-allowed placeholder:text-slate-500",
          className,
        )}
      />
    </div>
  );
}
