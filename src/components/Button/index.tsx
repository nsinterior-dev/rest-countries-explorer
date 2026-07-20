import React, { ButtonHTMLAttributes, ReactNode } from "react";
import {
  ButtonVariant,
  ButtonSize,
  size as Size,
  variant as Variant,
} from "./variants";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        'inline-flex items-center justify-center rounded-md font-medium',
        'transition-opacity disabled:opacity-50 disabled:cursor-not-allowed',
        Variant[variant], 
        Size[size],
        className
    ].join(' ')}
    {...props}
    >
      {children}
    </button>
  );
}
