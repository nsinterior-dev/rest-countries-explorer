import IconBase, { IconProps } from "../IconBase";

export default function ArrowDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m19.5 8.25-7.5 7.5-7.5-7.5"
      />
    </IconBase>
  );
}
