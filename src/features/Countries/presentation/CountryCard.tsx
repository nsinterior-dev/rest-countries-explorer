import { Image, InfoRow, LoadingSkeleton, Typography } from '@/components'
import { Country } from '../domain/types'
import { formatCurrency, formatDriveDirection } from '../domain/format'

interface CountryCardProps {
  country: Country | null
  isLoading?: boolean
}

function CountryCardSkeleton() {
  return (
    <div className="flex gap-4 items-start">
      <LoadingSkeleton width="10rem" height="6.7rem" rounded="sm" />
      <div className="flex flex-col gap-2 flex-1 py-1">
        <LoadingSkeleton width="70%" height="0.75rem" />
        <LoadingSkeleton width="50%" height="0.75rem" />
        <LoadingSkeleton width="40%" height="0.75rem" />
      </div>
    </div>
  )
}

function CountryCardEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Image src="/search.svg" alt="" width={192} height={174} className="w-32 md:w-48 opacity-50" />
    </div>
  )
}

export default function CountryCard({ country, isLoading }: CountryCardProps) {
  if (isLoading) return <CountryCardSkeleton />
  if (!country) return <CountryCardEmpty />

  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
      <Image
        src={country.flag.url}
        alt={country.flag.description || `Flag of ${country.name}`}
        width={160}
        height={107}
        className="rounded-sm sm:max-w-40 shrink-0"
      />
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 min-w-0 items-baseline content-start">
        <InfoRow label="Official Name" value={country.officialName} />
        <InfoRow label="Currency" value={formatCurrency(country.currencies)} />
        <InfoRow label="Drives on" value={formatDriveDirection(country.drivesOn)} />
      </div>
    </div>
  )
}
