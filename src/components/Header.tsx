import { useEffect, useState } from "react";
import { YinYang } from "./icons";

const LINKS = [
  ["#services", "Услуги и цены"],
  ["#approach", "Подход"],
  ["#about", "Обо мне"],
  ["#schedule", "Расписание"],
  ["#contact", "Контакты"],
] as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "border-b border-line bg-paper/85 backdrop-blur-[10px]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[70px] sm:h-[80px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        {/* Логотип */}
        <a href="#top" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <YinYang className="h-10 w-10 sm:h-11 sm:w-11 shrink-0" />
          <span className="min-w-0 leading-tight">
            <span className="flex items-baseline gap-2">
              <span className="font-display text-[20px] sm:text-[22px] font-semibold">Валерия</span>
              <span className="rounded-full bg-ink px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.16em] text-gold">
                Про|Баланс
              </span>
            </span>
            <span className="mt-0.5 hidden sm:block text-[9.5px] font-bold uppercase tracking-[0.22em] text-ink-faint">
              тело • чувства • разум • дух
            </span>
          </span>
        </a>

        {/* Десктоп-меню */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Основное меню">
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} className="link-grow text-[13.5px] font-bold text-ink-soft transition-colors hover:text-ink">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="hidden items-center rounded-full bg-ink px-7 py-3.5 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-card transition-all duration-300 hover:bg-gold-deep min-h-[44px] lg:inline-flex"
          >
            Записаться
          </a>
          {/* Компактная кнопка рядом с бургером (до lg, скрывается на очень узких экранах) */}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="hidden min-h-[44px] items-center rounded-full bg-ink px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-[0.1em] text-card transition-colors hover:bg-gold-deep min-[400px]:inline-flex lg:hidden"
          >
            Запись
          </a>
          {/* Бургер */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            className="grid h-11 w-11 place-items-center rounded-full border border-line bg-card text-ink transition-colors lg:hidden"
          >
            <span className="relative block h-3.5 w-5">
              <span className={`absolute left-0 top-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? "top-1/2 -translate-y-1/2 rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-current transition-opacity duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-[2px] w-full bg-current transition-all duration-300 ${open ? "bottom-1/2 translate-y-1/2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`acc-body lg:hidden ${open ? "open" : ""}`}>
        <div className="acc-inner">
          <nav className="border-t border-line bg-paper/95 px-5 pb-6 pt-3 backdrop-blur-[10px]" aria-label="Мобильное меню">
            {LINKS.map(([href, label]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex min-h-[48px] items-center justify-between border-b border-line/70 py-3 text-[15.5px] font-bold text-ink transition-colors hover:text-gold-deep"
              >
                {label}
                <span className="text-gold">→</span>
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-5 flex min-h-[52px] items-center justify-center rounded-full bg-ink px-7 py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-card"
            >
              Записаться
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
