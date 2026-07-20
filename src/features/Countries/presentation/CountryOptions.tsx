import { MenuItem, MenuList } from "@/components";
import React, { ComponentProps } from "react";
import { Country } from "../domain";

interface CountryOptionsProps extends ComponentProps<typeof MenuList> {
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  error: Error | null;
  countries: Country[];
  activeIndex: number;
  menuProps: (index: number) => {
    role: "option";
    "aria-selected": boolean;
    onClick: () => void;
    onMouseEnter: () => void;
  };
}

export default function CountryOptions({
  open,
  onClose,
  isLoading,
  error,
  countries,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  activeIndex,
  menuProps,
}: CountryOptionsProps) {
  const hasCountries = countries.length > 0;

  const renderLoading = isLoading && <MenuItem>Loading countries...</MenuItem>
  const renderError = !isLoading && error && <MenuItem>No countries are found</MenuItem>
  const renderOptions =
    !isLoading &&
    !error &&
    hasCountries &&
    countries.map((country, index) => (
      <MenuItem
        key={country.name}
        active={index === activeIndex}
        {...menuProps(index)}
      >
        {country.name}
      </MenuItem>
    ));
  const renderEmpty = !isLoading && !error && !hasCountries && <MenuItem>No countries are found</MenuItem>

  function handleScrollOptions(e: React.UIEvent<HTMLUListElement>) {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop - clientHeight < 50 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }

  return (
    <MenuList open={open} onClose={onClose} onScroll={handleScrollOptions}>
      <div className="relative">
        {renderLoading}
        {renderError}
        {renderEmpty}
        {renderOptions}
      </div>
    </MenuList>
  );
}
