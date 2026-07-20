import { ButtonHTMLAttributes, ReactNode } from "react";
import {
  IconButtonSize,
  IconButtonVariant,
  size as Size,
  variant as Variant,
} from "./variants";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  children: ReactNode;
}

export default function IconButton({
  variant = "ghost",
  size = "md",
  children,
  className = "",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={[
        "inline-flex items-center justify-center rounded-md transition-colors cursor-pointer",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        Variant[variant],
        Size[size],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
