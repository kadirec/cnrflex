type Props = { className?: string };

export function RollIcon({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="6.2" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3 L12 5.8" />
      <path d="M18.4 8.4 L15.9 9.7" />
      <path d="M20.5 15.5 L17.7 14.7" />
      <path d="M14.5 20.4 L13.7 17.7" />
      <path d="M5.8 18.4 L7.7 16.4" />
      <path d="M3.4 12 L6.2 12" />
    </svg>
  );
}
