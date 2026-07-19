import { HTMLAttributes } from "react";
import Typography from "../Typography";

interface InfoRowProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string;
}

export default function InfoRow({
  label,
  value,
  className = "",
  ...props
}: InfoRowProps) {
  return (
    <div className={["flex gap-2", className].join(" ")} {...props}>
      <Typography variant="body2" color="muted" as="span" className="font-medium shrink-0">{label}</Typography>
      <Typography variant="body2" as="span">{value}</Typography>
    </div>
  );
}
