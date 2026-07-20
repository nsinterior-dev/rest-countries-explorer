type IconSize = "sm" | "md" | "lg";
type IconColor = "primary" | "inherit" | "muted" | "danger";

const size: Record<IconSize, string> = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
};

const color: Record<IconColor, string> = {
  primary: "text-accent",
  inherit: "text-inherit",
  muted: "text-muted",
  danger: "text-danger",
};

export { type IconSize, type IconColor, size, color };
