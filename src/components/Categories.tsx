import { Reveal } from "./ui";
import { CATS } from "../content/categories";

/* Информационные блоки-категории над витриной.
   Без ссылок и навигации — только ориентир по форматам работы.
   Цветовая гамма: белый, чёрный, золотой — с полупрозрачностью и дороговизной. */


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
