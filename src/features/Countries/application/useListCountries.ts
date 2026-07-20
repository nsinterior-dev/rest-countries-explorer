import { useInfiniteQuery } from '@tanstack/react-query';
import { SearchCountriesParams } from '../data/params';
import { searchCountries } from '../data/repository';

export default function useListCountries(params: SearchCountriesParams & { enabled?: boolean }) {
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['countries', params],
    queryFn: ({ pageParam = 0}) => searchCountries({
        q: params.q,
        limit: 50,
        offset: pageParam,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
        if(lastPage.meta.more) {
            return lastPage.meta.offset + lastPage.meta.limit
        }
        return undefined;
    },
    enabled: params.enabled ?? true,
  })

  return {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  }
}
