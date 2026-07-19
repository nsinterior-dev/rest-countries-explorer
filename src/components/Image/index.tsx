"use client";

import NextImage, { ImageProps as NextImageProps } from "next/image";
import { useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton";

type AspectRatio = "auto" | "1/1" | "3/2" | "4/3" | "16/9";

interface ImageProps extends Omit<NextImageProps, "aspect"> {
  aspect?: AspectRatio;
}

const aspectMap: Record<AspectRatio, string> = {
  auto: "",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "4/3": "aspect-[4/3]",
  "16/9": "aspect-video",
};

export default function Image({
  aspect = "auto",
  alt = "",
  className = "",
  onLoad,
  ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={["relative overflow-hidden", aspectMap[aspect], className].join(" ")}>
      {!loaded && (
        <LoadingSkeleton
          className="absolute inset-0"
          width="100%"
          height="100%"
          rounded="sm"
        />
      )}
      <NextImage
        alt={alt}
        className={[
          "object-cover transition-opacity duration-300",
          aspectMap[aspect],
          loaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onLoad={(e) => {
          setLoaded(true);
          onLoad?.(e);
        }}
        {...props}
      />
    </div>
  );
}
