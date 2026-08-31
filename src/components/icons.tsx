import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

export function IconArrow(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.5 12h16M14 5.5l6 6.5-6 6.5" />
    </svg>
  );
}

export function IconCheck(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconTrash(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 7h16M9.5 7V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3V7M6.2 7l.8 12a2 2 0 0 0 2 1.9h6a2 2 0 0 0 2-1.9l.8-12M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconCart(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 6h2l2.2 10.2a1.6 1.6 0 0 0 1.6 1.3h7.6a1.6 1.6 0 0 0 1.6-1.2L21 9H7M10 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4ZM17.5 21a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" />
    </svg>
  );
}

export function IconDownload(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 3.5v11M7.5 10.5l4.5 4.5 4.5-4.5M4.5 19.5h15" />
    </svg>
  );
}

export function IconUpload(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 15V4M7.5 8 12 3.5 16.5 8M4.5 19.5h15" />
    </svg>
  );
}

export function IconLock(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function IconSend(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20.5 3.5 3.5 10l6.5 2.5L12.5 19l8-15.5ZM10 12.5l4.5-4.5" />
    </svg>
  );
}

export function IconPhone(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M6.8 3.5h2.4l1.4 3.8-2 1.6a12.5 12.5 0 0 0 6.5 6.5l1.6-2 3.8 1.4v2.4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.8 5.7a2 2 0 0 1 2-2.2Z" />
    </svg>
  );
}

export function IconDoc(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M7 3.5h7L18.5 8v12.5h-11.5V3.5ZM14 3.5V8h4.5M9.5 12h5M9.5 15.5h5" />
    </svg>
  );
}

/* ---------- восточные мотивы ---------- */

/* Энсо — открытый круг, символ целостности */
export function Enso({ strokeWidth = 1.6, ...props }: P & { strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" {...props}>
      <circle
        cx="50"
        cy="50"
        r="46"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray="258 31"
        transform="rotate(-100 50 50)"
      />
    </svg>
  );
}

/* Инь-ян */
export function YinYang(props: P) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <circle cx="50" cy="50" r="48" fill="#fcfbf8" />
      <path d="M50 2a48 48 0 0 1 0 96 24 24 0 0 1 0-48 24 24 0 0 0 0-48z" fill="#23211d" />
      <circle cx="50" cy="26" r="6.5" fill="#fcfbf8" />
      <circle cx="50" cy="74" r="6.5" fill="#23211d" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#23211d" strokeWidth="2" />
    </svg>
  );
}

export function IconVk(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
      <text x="12" y="15.6" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor" fontFamily="Inter, sans-serif">
        VK
      </text>
    </svg>
  );
}

export function IconMax(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M7.5 15.5v-7l4.5 4 4.5-4v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconCare(props: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 20.5c-5.2-3.2-8.5-6.3-8.5-10A4.6 4.6 0 0 1 12 7.6a4.6 4.6 0 0 1 8.5 2.9c0 3.7-3.3 6.8-8.5 10Z" />
    </svg>
  );
}
