import React, { useState } from "react";

interface UseComboboxProps {
  count: number;
  onSelect: (index: number) => void;
  onClose?: () => void;
}

export default function useCombobox({
  count,
  onSelect,
  onClose,
}: UseComboboxProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
    setActiveIndex(-1);
    onClose?.();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) handleOpen();
        setActiveIndex((prev) => (prev + 1) % count);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) handleOpen();
        setActiveIndex((prev) => (prev - 1 + count) % count);
        break;
      case "Enter":
        if (open && activeIndex >= 0) {
          onSelect(activeIndex);
          handleClose();
        }
        break;
      case "Escape":
        handleClose();
        break;
      default:
        break;
    }
  }

  return {
    isOpen: open,
    activeIndex,
    handleOpen,
    handleClose,
    getInputProps: () => ({
      onKeyDown: handleKeyDown,
      "aria-expanded": open,
      "aria-autocomplete": "list" as const,
    }),
    getMenuProps: () => ({
      role: "listbox" as const,
    }),
    getItemProps: (index: number) => ({
      role: "option" as const,
      "aria-selected": index === activeIndex,
      onClick: () => {
        onSelect(index);
        handleClose();
      },
      onMouseEnter: () => setActiveIndex(index),
    }),
  };
}
