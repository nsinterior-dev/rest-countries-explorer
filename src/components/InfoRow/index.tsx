import Typography from "../Typography";

interface InfoRowProps {
  label: string;
  value: string;
  className?: string;
}

export default function InfoRow({
  label,
  value,
  className = "",
}: InfoRowProps) {
  return (
    <>
      <Typography variant="body2" color="muted" as="span" className={["font-medium whitespace-nowrap", className].join(" ")}>{label}</Typography>
      <Typography variant="body2" as="span" className="truncate capitalize" title={value}>{value}</Typography>
    </>
  );
}
