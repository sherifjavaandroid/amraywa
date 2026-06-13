interface KickIconProps {
  size?: number;
  color?: string;
}

export default function KickIcon({ size = 20, color = '#ffffff' }: KickIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.333 0h8v5.333H12V0h8v5.333h-2.667v2.667H24V24h-8v-2.667h-2.667V24h-8V16h2.667v-2.667H1.333V0zm14.667 8h-2.667v5.333h2.667V8zm-8 0H5.333v5.333h2.667V8z"
        fill={color}
      />
    </svg>
  );
}
