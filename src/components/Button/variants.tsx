type ButtonVariant = "primary" | "secondary" | "text" | "error";
type ButtonSize = "sm" | "md" | "lg";

const variant: Record<ButtonVariant, string> = {
  primary: "bg-accent text-white hover:opacity-90",
  secondary:
    "bg-surface-muted text-foreground border border-border hover:bg-surface",
  text: "bg-transparent text-accent hover:bg-accent-soft",
  error: "bg-danger text-white hover:opacity-90",
};
const size: Record<ButtonSize, string> = {
  sm: "px-2 py-1.5 text-sm",
  md: "px-3 py-1.5 text-base",
  lg: "px-4 py-2 text-lg",
};

export { type ButtonSize, type ButtonVariant, variant, size };
