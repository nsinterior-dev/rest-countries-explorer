'use client'

interface BannerProps {
  title: string
  description: string
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div>
        <h1>{title}</h1>
        <p>{description}</p>
    </div>
  )
}
