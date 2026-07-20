'use client'

import Typography from "../Typography";

interface BannerProps {
  title: string
  description: string
}

export default function Banner({ title, description }: BannerProps) {
  return (
    <div>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2" color="muted" >{description}</Typography>
    </div>
  )
}
