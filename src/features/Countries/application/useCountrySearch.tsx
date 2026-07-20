import React, { useState } from 'react'
import { Country } from '../domain';
import useDebounce from '@/hooks/useDebounce';
import useListCountries from './useListCountries';

export default function useCountrySearch() {
    const [query, setQuery] = useState('')
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)

    const debouncedQuery = useDebounce(query, 300)
    const {
        data: countries,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useListCountries({q: debouncedQuery})

    return {
        query,
        setQuery,
        countries: countries?.pages.flatMap((page) => page.countries) ?? [],
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        selectedCountry,
        setSelectedCountry,
    }
}
