interface MenuEmptyProps {
  message?: string;
}

export default function MenuEmpty({ message = "No results found" }: MenuEmptyProps) {
  return (
    <li className="px-3 py-4 text-sm text-muted text-center" role="presentation">
      {message}
    </li>
  );
}
