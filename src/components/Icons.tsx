/** 精简线性图标集（地产规格用）。统一 currentColor + stroke。 */
type P = { className?: string };
const base = "h-[1.1em] w-[1.1em] shrink-0";

function S({ children, className }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${base} ${className ?? ""}`}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export const BedIcon = (p: P) => (
  <S {...p}>
    <path d="M2 17V7m0 10h20m0 0V11a3 3 0 0 0-3-3H9v6m-7 1v3m20-3v3" />
    <circle cx="6" cy="11" r="1.4" />
  </S>
);
export const BathIcon = (p: P) => (
  <S {...p}>
    <path d="M4 12V6a2 2 0 0 1 2-2 2 2 0 0 1 2 2M3 12h18v2a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-2zM6 22l1-2m10 2l1-2" />
  </S>
);
export const AreaIcon = (p: P) => (
  <S {...p}>
    <path d="M3 3h18v18H3zM9 3v4M3 9h4m8-6v4m6 2h-4M9 21v-4m-6-2h4m8 6v-4m6-2h-4" />
  </S>
);
export const PinIcon = (p: P) => (
  <S {...p}>
    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z" />
    <circle cx="12" cy="10" r="2.4" />
  </S>
);
export const CarIcon = (p: P) => (
  <S {...p}>
    <path d="M5 13l1.5-4.5A2 2 0 0 1 8.4 7h7.2a2 2 0 0 1 1.9 1.5L19 13m-14 0h14m-14 0v4m14-4v4M7 17v1m10-1v1" />
    <circle cx="7.5" cy="14.5" r=".6" />
    <circle cx="16.5" cy="14.5" r=".6" />
  </S>
);
export const CalendarIcon = (p: P) => (
  <S {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 9h18M8 3v4m8-4v4" />
  </S>
);
export const SofaIcon = (p: P) => (
  <S {...p}>
    <path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3m-16 0a2 2 0 0 0-2 2v3h20v-3a2 2 0 0 0-2-2m-16 0c1.1 0 2 .9 2 2v1h12v-1c0-1.1.9-2 2-2M5 18v2m14-2v2" />
  </S>
);
export const ViewIcon = (p: P) => (
  <S {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
    <circle cx="12" cy="12" r="3" />
  </S>
);
export const CheckIcon = (p: P) => (
  <S {...p}>
    <path d="M20 6L9 17l-5-5" />
  </S>
);
export const DeedIcon = (p: P) => (
  <S {...p}>
    <path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
    <path d="M14 3v5h5M9 13h6m-6 3h6" />
  </S>
);
