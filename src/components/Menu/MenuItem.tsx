import { LiHTMLAttributes } from "react";

interface MenuItemProps extends LiHTMLAttributes<HTMLLIElement> {
  active?: boolean;
  selected?: boolean;
}

export default function MenuItem({
  active = false,
  selected = false,
  children,
  className = "",
  ...props
}: MenuItemProps) {
  return (
    <li
      role="option"
      aria-selected={selected}
      className={[
        "px-3 py-2 cursor-pointer text-sm transition-colors",
        active ? "bg-accent-soft text-accent" : "text-foreground",
        selected ? "font-medium" : "",
        !active ? "hover:bg-surface-muted" : "",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </li>
  );
}
