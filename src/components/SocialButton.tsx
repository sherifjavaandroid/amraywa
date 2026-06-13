import { type ReactNode } from 'react';

interface SocialButtonProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export default function SocialButton({ href, icon, label }: SocialButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="social-button"
    >
      <span className="accent-bar" />
      <span className="icon-wrapper">{icon}</span>
      <span className="label">{label}</span>
    </a>
  );
}
