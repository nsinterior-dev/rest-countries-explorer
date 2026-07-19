type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "subtitle1"
  | "subtitle2"
  | "caption";

type TypographyColor =
  | "foreground"
  | "muted"
  | "accent"
  | "danger"
  | "inherit";

const variant: Record<TypographyVariant, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-bold tracking-tight",
  h3: "text-2xl font-semibold",
  h4: "text-xl font-semibold",
  h5: "text-lg font-medium",
  h6: "text-base font-medium",
  body1: "text-base",
  body2: "text-sm",
  subtitle1: "text-lg font-medium",
  subtitle2: "text-sm font-medium",
  caption: "text-xs",
};

const color: Record<TypographyColor, string> = {
  foreground: "text-foreground",
  muted: "text-muted",
  accent: "text-accent",
  danger: "text-danger",
  inherit: "text-inherit",
};

type TypographyTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

const defaultTag: Record<TypographyVariant, TypographyTag> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  subtitle1: "p",
  subtitle2: "p",
  caption: "span",
};

export {
  type TypographyVariant,
  type TypographyColor,
  type TypographyTag,
  variant,
  color,
  defaultTag,
};
