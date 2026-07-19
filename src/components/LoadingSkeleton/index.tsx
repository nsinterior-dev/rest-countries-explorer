import { HTMLAttributes } from "react";

interface LoadingSkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "full";
}

const roundedMap = {
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
};

export default function LoadingSkeleton({
  width,
  height = "1rem",
  rounded = "md",
  className = "",
  ...props
}: LoadingSkeletonProps) {
  return (
    <div
      className={[
        "animate-pulse bg-surface-muted",
        roundedMap[rounded],
        className,
      ].join(" ")}
      style={{ width, height }}
      {...props}
    />
  );
}
