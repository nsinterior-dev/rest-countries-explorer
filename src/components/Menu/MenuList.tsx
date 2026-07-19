import { HTMLAttributes, useEffect, useRef } from "react";

interface MenuListProps extends HTMLAttributes<HTMLUListElement> {
  open: boolean;
  onClose?: () => void;
  maxHeight?: string;
}

export default function MenuList({
  open,
  onClose,
  maxHeight = "16rem",
  children,
  className = "",
  ...props
}: MenuListProps) {
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!open || !onClose) return;

    function handleClickOutside(e: MouseEvent) {
      if (listRef.current && !listRef.current.parentElement?.contains(e.target as Node)) {
        onClose?.();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <ul
      ref={listRef}
      role="listbox"
      className={[
        "absolute z-10 left-0 right-0 mt-1",
        "overflow-y-auto rounded-sm border border-border bg-surface shadow-lg",
        className,
      ].join(" ")}
      style={{ maxHeight }}
      {...props}
    >
      {children}
    </ul>
  );
}
