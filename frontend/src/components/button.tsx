import clsx from "clsx";
import { ComponentProps } from "react";
import { Icon, Loader } from "react-feather";

type ColorScheme = "slate" | "red";
type Variant = "solid" | "outline" | "ghost" | "link";
type Size = "normal" | "small";

type Props = ComponentProps<"button"> & {
  colorScheme?: ColorScheme;
  variant?: Variant;
  size?: Size;
  icon?: Icon;
  isLoading?: boolean;
};

export function Button({
  colorScheme = "slate",
  variant = "solid",
  size = "normal",
  icon: Icon,
  isLoading = false,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: Props) {
  const color = getColor(variant, colorScheme);
  const layout = getLayout(variant, size);
  const iconSize = getIconSize(size);

  return (
    <button
      {...rest}
      type={type}
      disabled={isLoading || disabled}
      className={clsx(
        "flex justify-center items-center gap-2 w-full disabled:opacity-40 transition disabled:cursor-not-allowed",
        color,
        layout,
        className,
      )}
    >
      {Icon && isLoading && <Loader size={iconSize} className="animate-spin" />}
      {Icon && !isLoading && <Icon size={iconSize} />}
      {children}
    </button>
  );
}

function getColor(variant: Variant, colorScheme: ColorScheme) {
  const colorMap = {
    solid: {
      common: "hover:opacity-85",
      slate:
        "bg-slate-800 dark:bg-slate-200 text-slate-200 dark:text-slate-800",
      red: "bg-red-700 dark:bg-red-600 text-slate-200",
    },
    outline: {
      common: "border hover:border-transparent",
      slate:
        "border-slate-600 dark:border-slate-400 hover:bg-slate-800 dark:hover:bg-slate-200 hover:text-slate-200 dark:hover:text-slate-800",
      red: "border-red-700 dark:border-red-600 hover:bg-red-700 dark:hover:bg-red-600 text-red-700 dark:text-red-600 hover:text-slate-200",
    },
    ghost: {
      common: "",
      slate: "hover:bg-slate-800/15 dark:hover:bg-slate-200/15",
      red: "hover:bg-red-700/15 dark:hover:bg-red-600/15",
    },
    link: {
      common: "hover:opacity-85",
      slate: "",
      red: "text-red-600 dark:text-red-400",
    },
  };
  return clsx(colorMap[variant].common, colorMap[variant][colorScheme]);
}

function getLayout(variant: Variant, size: Size) {
  if (variant === "link") {
    const sizeMap = {
      normal: "",
      small: "text-sm",
    };
    return sizeMap[size];
  }

  const sizeMap = {
    normal: "px-4 py-3 rounded-md font-medium",
    small: "px-2 py-1 rounded text-sm",
  };
  return sizeMap[size];
}

function getIconSize(size: Size) {
  const sizeMap = {
    normal: 16,
    small: 14,
  };
  return sizeMap[size];
}
