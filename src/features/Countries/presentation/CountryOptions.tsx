import { MenuItem, MenuList } from '@/components';
import React, { ComponentProps } from 'react'
import { Country } from '../domain';

interface CountryOptionsProps extends ComponentProps<typeof MenuList> {
    isLoading: boolean,
    error: Error | null,
    countries: Country[],
    activeIndex: number,
    menuProps: (index: number) => {                                      
        role: "option";                   
        "aria-selected": boolean;         
        onClick: () => void;                                               
        onMouseEnter: () => void;
      }                                                                         
}

export default function CountryOptions({
    open,
    onClose,
    isLoading,
    error,
    countries,
    activeIndex,
    menuProps,
} : CountryOptionsProps ) {

  const hasCountries = countries.length > 0;

  const renderLoading = isLoading && "loding..."
  const renderError = !isLoading && error && "error"
  const renderOptions = !isLoading && !error && hasCountries && countries.map((country, index) => (
    <MenuItem key={country.name} active={index === activeIndex} {...menuProps(index)}>
        {country.name}
    </MenuItem>
  ))
  const renderEmpty = (!isLoading && !error) && !hasCountries && "Wala na"

  return (
    <MenuList open={open} onClose={onClose} >
       <div className="relative">
            {renderLoading}
            {renderError}
            {renderEmpty}
            {renderOptions}
       </div>
    </MenuList>
  )
}
