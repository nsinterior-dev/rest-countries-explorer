"use client";
import React from "react";
import { Banner, Container, SearchInput } from "@/components";
import CountryOptions from "./CountryOptions";
import CountryCard from "./CountryCard";
import useCountrySearch from "../application/useCountrySearch";
import useCombobox from "@/hooks/useCombobox";

export default function Countries() {
  const {
    countries,
    query,
    setQuery,
    setSelectedCountry,
    selectedCountry,
    isLoading,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useCountrySearch();
  const {
    isOpen,
    activeIndex,
    handleClose,
    handleOpen,
    getInputProps,
    getItemProps,
  } = useCombobox({
    count: countries.length,
    onSelect: (index) => {
      setSelectedCountry(countries[index]);
      setQuery(countries[index].name);
    },
  });

  function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setQuery(value);
    handleOpen();
  }

  function handleClearChange() {
    setQuery("");
    setSelectedCountry(null);
  }

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Banner title="Explore a country" description="Search and select a country to see details" />
        <div className="relative">
            <SearchInput
                placeholder="Search country"
                value={query}
                onChange={handleSearchChange}
                onClear={handleClearChange}
                {...getInputProps()}
            />
            <CountryOptions
                open={isOpen}
                onClose={handleClose}
                countries={countries}
                isLoading={isLoading}
                error={error}
                isFetchingNextPage={isFetchingNextPage}
                hasNextPage={hasNextPage}
                fetchNextPage={fetchNextPage}
                activeIndex={activeIndex}
                menuProps={getItemProps}
            />
        </div>
        <CountryCard country={selectedCountry} />
      </div>
    </Container>
  );
}
