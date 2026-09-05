import type { ReactNode } from "react";
import { Reveal } from "./ui";

/* Информационные блоки-категории над витриной.
   Без ссылок — только ориентир по форматам. Палитра: белое, чёрное, золото.
   Мобильные: горизонтальный скролл (видно ~1.6 блока), свайп прокручивает. */

const CATS: { n: string; title: string; note: string; dark: boolean; icon: ReactNode }[] = [
  {
    n: "01",
    title: "Индивидуальные сессии",
    note: "гештальт · 50 минут",
    dark: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
    note: "терапия + практики",
    dark: false,
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
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
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] sm:h-6 sm:w-6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

        {/* Мобильные: горизонтальный скролл, видно ~1.6 блока · Десктоп: 4 в ряд */}
        <div className="scroll-ribbon -mx-5 flex gap-2.5 overflow-x-auto snap-x snap-mandatory px-5 pb-1 sm:gap-3 lg:mx-0 lg:grid lg:grid-cols-4 lg:gap-px lg:overflow-visible lg:rounded-[26px] lg:border lg:border-line lg:bg-line lg:px-0 lg:pb-0">
          {CATS.map((c, i) => (
            <Reveal key={c.n} delay={i * 90} className="h-full w-[62vw] max-w-[250px] shrink-0 snap-start lg:w-auto lg:max-w-none">
              <div
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[20px] px-4 py-5 transition-colors duration-500 sm:px-5 sm:py-7 lg:rounded-none ${
                  c.dark ? "bg-ink text-card hover:bg-[#2d2b26]" : "border border-line bg-card text-ink hover:bg-stone/70 lg:border-0"
                }`}
              >
                {/* «око» инь-ян */}
                <span
                  aria-hidden
                  className={`absolute right-4 top-4 h-1.5 w-1.5 rounded-full transition-transform duration-500 group-hover:scale-150 ${
                    c.dark ? "bg-card/60" : "bg-ink/50"
                  }`}
                />
                {/* кривая тайцзи в углу */}
                <svg
                  aria-hidden
                  className={`pointer-events-none absolute -bottom-5 -right-5 h-24 w-24 transition-transform duration-700 ease-out group-hover:-translate-y-1.5 ${
                    c.dark ? "text-card/10" : "text-ink/10"
                  }`}
                  viewBox="0 0 100 100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M100 0A50 50 0 0 0 0 100" />
                  <path d="M100 30A35 35 0 0 0 30 100" />
                </svg>

                <span className={`font-display text-[16px] italic leading-none sm:text-[19px] ${c.dark ? "text-gold" : "text-ink-faint"}`}>
                  {c.n}
                </span>

                <div className="mt-7 sm:mt-9">
                  <span className={`block transition-colors duration-500 ${c.dark ? "text-gold" : "text-ink"}`}>{c.icon}</span>
                  <p className="mt-3 whitespace-nowrap text-[14.5px] font-extrabold tracking-tight lg:text-[15px]">{c.title}</p>
                  <p
                    className={`mt-1 whitespace-nowrap text-[9.5px] font-bold uppercase tracking-[0.08em] sm:text-[10.5px] sm:tracking-[0.14em] ${
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
