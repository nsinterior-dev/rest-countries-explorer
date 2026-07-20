import { InputHTMLAttributes, forwardRef } from "react";
import { InputSize, size as Size } from "./variants";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = "md", className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={[
          "w-full rounded-sm border border-border bg-surface text-foreground ",
          "placeholder:text-muted",
          "focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent focus:shadow-md focus:shadow-accent/25",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          Size[inputSize],
          className,
        ].join(" ")}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
