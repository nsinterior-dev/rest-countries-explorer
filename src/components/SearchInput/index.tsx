import { InputHTMLAttributes, forwardRef } from "react";
import Input from "../Input";
import { InputSize } from "../Input/variants";
import { Search, Close } from "../Icons";
import IconButton from "../IconButton";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
  onClear?: () => void;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ inputSize = "md", value, onClear, className = "", ...props }, ref) => {
    const hasValue = value !== undefined && value !== "";

    return (
      <div className="relative">
        <Search size="sm" color="muted" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <Input
          ref={ref}
          inputSize={inputSize}
          value={value}
          className={`pl-9 ${hasValue ? "pr-9" : ""} ${className}`}
          {...props}
        />
        {hasValue && onClear && (
          <IconButton
            size="sm"
            onClick={onClear}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            aria-label="Clear search"
          >
            <Close size="sm" />
          </IconButton>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export default SearchInput;
