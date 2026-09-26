/* Статический контент: информационные блоки-категории над витриной. */
import type { ReactNode } from "react";

export const CATS: { n: string; title: string; note: string; dark: boolean; icon: ReactNode }[] = [
  {
    n: "01",
    title: "Индивидуальные сессии",
    note: "гештальт · 50 минут",
    dark: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-[28px] w-[28px] sm:h-[34px] sm:w-[34px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 4v7.5h5V19" />
        <path d="M4.5 11.5h5" />
        <path d="M19.5 4v7.5h-5V19" />
        <path d="M19.5 11.5h-5" />
        <circle cx="12" cy="8" r="1.15" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12.4" r="1.15" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Пакет «Баланс»",
    note: "цикл встреч · выгода от 20%",
    dark: false,
    icon: (
      <svg viewBox="0 0 24 24" className="h-[28px] w-[28px] sm:h-[34px] sm:w-[34px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2 20 7l-8 3.8L4 7z" />
        <path d="m4 11.6 8 3.8 8-3.8" />
        <path d="m4 16 8 3.8L20 16" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Групповые программы",
    note: "круги до 10 человек",
    dark: false,
    icon: (
      <svg viewBox="0 0 24 24" className="h-[28px] w-[28px] sm:h-[34px] sm:w-[34px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle cx="12" cy="12" r="8.6" strokeDasharray="0.2 3.4" />
        <circle cx="12" cy="6.4" r="1.9" />
        <circle cx="6.8" cy="15.4" r="1.9" />
        <circle cx="17.2" cy="15.4" r="1.9" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Онлайн-курс",
    note: "для команд · 10 встреч",
    dark: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-[28px] w-[28px] sm:h-[34px] sm:w-[34px]" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.2" y="4.6" width="17.6" height="12" rx="1.6" />
        <path d="M10.4 8.4v4.4l3.9-2.2z" fill="currentColor" stroke="none" />
        <path d="M8.6 20.4h6.8" />
      </svg>
    ),
  },
];
