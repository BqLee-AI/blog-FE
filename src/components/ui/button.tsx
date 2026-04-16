import * as React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
}

const buttonVariants: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-700",
  outline: "border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-50 dark:hover:bg-gray-800",
  ghost: "bg-transparent text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
};

const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3",
  icon: "h-10 w-10",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "default", size = "default", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };