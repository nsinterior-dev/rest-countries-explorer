import { SVGAttributes } from "react";
import { IconSize, IconColor, size as Size, color as Color } from "./variants";

interface IconProps extends Omit<SVGAttributes<SVGElement>, "color"> {
  size?: IconSize;
  color?: IconColor;
}

function IconBase({ size = "md", color = "inherit", className = "", children, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={[Size[size], Color[color], className].join(" ")}
      {...props}
    >
      {children}
    </svg>
  );
}

export default IconBase;
export type { IconProps };
