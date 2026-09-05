import type { CSSProperties } from "react";

type P = { className?: string; strokeWidth?: number; style?: CSSProperties };

/* Кистевой круг энсо (дзен) */
export function Enso({ className = "", strokeWidth = 3 }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" aria-hidden>
      <path
        d="M76 16a44 44 0 1 0 8 22"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export function YinYang({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 100 100" className={className} style={style} aria-hidden>
      <circle cx="50" cy="50" r="48" fill="#fcfbf8" stroke="#23211d" strokeWidth="2.5" />
      <path d="M50 2a48 48 0 0 1 0 96 24 24 0 0 1 0-48 24 24 0 0 0 0-48z" fill="#23211d" />
      <circle cx="50" cy="26" r="7" fill="#fcfbf8" />
      <circle cx="50" cy="74" r="7" fill="#23211d" />
    </svg>
  );
}

export function IconArrow({ className = "", strokeWidth = 2, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function IconCheck({ className = "", strokeWidth = 2.4, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
  );
}

export function IconCare({ className = "", strokeWidth = 1.7, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 20s-7.2-4.4-9-9c-1.1-2.9.6-6 3.6-6 2 0 3.4 1.2 5.4 3.4C14 6.2 15.4 5 17.4 5c3 0 4.7 3.1 3.6 6-1.8 4.6-9 9-9 9z" />
    </svg>
  );
}

export function IconPhone({ className = "", strokeWidth = 1.8, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
    </svg>
  );
}

export function IconSend({ className = "", strokeWidth = 1.8, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m21 3-9.5 9.5" />
      <path d="M21 3 14 21l-2.5-8.5L3 10z" />
    </svg>
  );
}

export function IconVk({ className = "", style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="currentColor" aria-hidden>
      <path d="M12.7 17.4c-5.6 0-8.8-3.9-9-10.2h2.9c.1 4.7 2.2 6.7 3.8 7.1V7.2h2.7v4.1c1.6-.2 3.3-2 3.9-4.1h2.7a8 8 0 0 1-3.6 5.1 8.3 8.3 0 0 1 4.2 5.1h-3a4.9 4.9 0 0 0-4.2-3.7v3.7z" />
    </svg>
  );
}

export function IconMax({ className = "", strokeWidth = 2.4, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 19V6l8 9 8-9v13" />
    </svg>
  );
}

export function IconLock({ className = "", strokeWidth = 1.8, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    </svg>
  );
}

export function IconTrash({ className = "", strokeWidth = 1.8, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 7h16" />
      <path d="M9 7V5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5v2" />
      <path d="m6.5 7 .8 12a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12" />
    </svg>
  );
}

export function IconUpload({ className = "", strokeWidth = 1.8, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 15V4" />
      <path d="m7 8.5 5-5 5 5" />
      <path d="M4.5 15.5V18a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-2.5" />
    </svg>
  );
}

export function IconCart({ className = "", strokeWidth = 1.7, style }: P) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.5 4h2.2l2.4 11h10.2l2.2-8H7" />
      <circle cx="9.4" cy="19.2" r="1.4" />
      <circle cx="16.8" cy="19.2" r="1.4" />
    </svg>
  );
}
