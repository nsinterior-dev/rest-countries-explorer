type IconButtonSize = "sm" | "md" | "lg";
type IconButtonVariant = "ghost" | "subtle" | "outline";

const size: Record<IconButtonSize, string> = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

const variant: Record<IconButtonVariant, string> = {
  ghost: "bg-transparent text-muted hover:text-foreground",
  subtle: "bg-transparent text-muted hover:bg-surface-muted hover:text-foreground",
  outline: "border border-border text-muted hover:text-foreground hover:bg-surface-muted",
};

export { type IconButtonSize, type IconButtonVariant, size, variant };
