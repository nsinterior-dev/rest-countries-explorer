type InputSize = "sm" | "md" | "lg";

const size: Record<InputSize, string> = {
  sm: "px-2 py-1.5 text-sm",
  md: "px-3 py-2 text-base",
  lg: "px-4 py-2.5 text-lg",
};

export { type InputSize, size };
