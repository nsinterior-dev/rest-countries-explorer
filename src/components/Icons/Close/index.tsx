import IconBase, { IconProps } from "../IconBase";

export default function Close(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </IconBase>
  );
}
