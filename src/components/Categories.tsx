import type { ReactNode } from "react";
import { Reveal } from "./ui";

/* Информационные блоки-категории над витриной.
   Без ссылок и навигации — только ориентир по форматам работы.
   Цветовая гамма: белый, чёрный, золотой — с полупрозрачностью и дороговизной. */

const CATS: { n: string; title: string; note: string; dark: boolean; icon: ReactNode }[] = [
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

export default function Categories() {
  return (
    <section aria-label="Направления работы" className="relative py-9 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.3em] uppercase text-gold-deep">
              <span className="h-px w-10 bg-current opacity-60" />
              Направления работы
            </p>
            <p className="hidden text-[11px] font-bold uppercase tracking-[0.22em] text-ink-faint sm:block">
              баланс форматов
            </p>
          </div>
        </Reveal>

        {/* Горизонтальный скролл на мобильных: видно 1.5-2 блока */}
        <div className="no-scrollbar mt-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto pb-2 md:grid md:grid-cols-4 md:snap-none md:overflow-visible md:gap-px md:rounded-[26px] md:border md:border-line md:bg-line md:pb-0">
          {CATS.map((c, i) => (
            <Reveal key={c.n} delay={i * 90} className="h-full shrink-0 snap-start md:h-auto md:basis-auto">
              <div
                className={`group relative flex h-full min-w-[calc(100%-10px)] flex-col justify-between overflow-hidden rounded-[20px] border border-line px-4 py-5 transition-colors duration-500 md:min-w-0 md:rounded-none md:px-3.5 md:py-7 ${
                  c.dark ? "bg-ink text-card hover:bg-[#2d2b26]" : "bg-card text-ink hover:bg-stone/70"
                }`}
              >
                {/* «око» инь-ян — убрано */}

                {/* кривая тайцзи в углу — убрана */}

                <div className="flex items-center justify-between pr-5">
                  <span className={`font-display text-[18px] italic leading-none sm:text-[22px] ${c.dark ? "text-gold" : "text-ink-faint"}`}>
                    {c.n}
                  </span>
                  {/* YinYang иконка удалена */}
                </div>

                <div className="mt-6 sm:mt-8">
                  <span className={`block text-gold transition-colors duration-500`}>{c.icon}</span>
                  <p className="mt-3 whitespace-nowrap text-[14px] font-extrabold tracking-tight sm:text-[17px] md:text-[15.5px]">{c.title}</p>
                  <p
                    className={`mt-1 whitespace-nowrap text-[10.5px] font-bold uppercase tracking-[0.08em] sm:text-[11.5px] sm:tracking-[0.14em] ${
                      c.dark ? "text-card/55" : "text-ink-faint"
                    }`}
                  >
                    {c.note}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
