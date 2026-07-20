import { SearchCountriesParams } from '../data/params';
import { useQuery } from '@tanstack/react-query';
import { searchCountries } from '../data/repository';

export default function useListCountries(params: SearchCountriesParams) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['countries', params],
    queryFn: () => searchCountries(params.q),
    enabled: params.q.length > 0,
    staleTime: 5000 * 60 
  })

  return {
    data, 
    isLoading, 
    error
  }
}
