import IconBase, { IconProps } from "../IconBase";

export default function ArrowUp(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4.5 15.75 7.5-7.5 7.5 7.5"
      />
    </IconBase>
  );
}
