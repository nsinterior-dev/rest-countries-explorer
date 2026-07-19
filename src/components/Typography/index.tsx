import { HTMLAttributes, ReactNode } from "react";
import {
  TypographyVariant,
  TypographyColor,
  TypographyTag,
  variant as Variant,
  color as Color,
  defaultTag,
} from "./variants";

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  variant?: TypographyVariant;
  color?: TypographyColor;
  as?: TypographyTag;
  children: ReactNode;
}

export default function Typography({
  variant = "body1",
  color = "foreground",
  as,
  children,
  className = "",
  ...props
}: TypographyProps) {
  const Text = as ?? defaultTag[variant];

  return (
    <Text
      className={[Variant[variant], Color[color], className].join(" ")}
      {...props}
    >
      {children}
    </Text>
  );
}
