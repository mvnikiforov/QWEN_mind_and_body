import { useEffect, useState } from "react";
import { AsteriskMark } from "./icons";

const NAV = [
  { href: "#services", label: "Услуги и цены" },
  { href: "#approach", label: "Подход" },
  { href: "#about", label: "Обо мне" },
  { href: "#process", label: "Как проходит" },
  { href: "#contacts", label: "Контакты" },
];

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
        scrolled
          ? "bg-paper/85 backdrop-blur-md shadow-[0_10px_40px_-18px_rgba(51,46,61,0.25)] border-b border-ink/8"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 py-3.5">
        {/* Логотип */}
        <a href="#top" className="group flex items-center gap-3 min-w-0">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-peach transition-transform duration-500 group-hover:rotate-90">
            <AsteriskMark className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block font-display text-[17px] font-bold tracking-tight">Валерия</span>
            <span className="block truncate text-[11px] font-medium text-ink-soft">
              Гештальт-практик · Магистрант-этнопсихолог · Инструктор интегративной кундалини-йоги
            </span>
          </span>
        </a>

        {/* Навигация */}
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="relative text-[14.5px] font-semibold text-ink-soft transition-colors hover:text-ink after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-0 after:bg-peach-deep after:transition-all after:duration-300 hover:after:w-full"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contacts"
            className="hidden sm:inline-flex items-center gap-2 rounded-full bg-peach-deep px-5 py-2.5 text-sm font-bold text-paper shadow-[0_10px_30px_-10px_rgba(224,138,92,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-ink hover:shadow-[0_14px_34px_-12px_rgba(51,46,61,0.7)]"
          >
            Записаться
          </a>
          {/* Бургер */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-paper/70 text-ink"
            aria-label="Меню"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7.5h16M4 12h16M4 16.5h10" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 border-b border-ink/8 bg-paper/95 backdrop-blur-md" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col px-6 py-4 gap-1">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-[15px] font-semibold text-ink-soft transition-colors hover:bg-cream hover:text-ink"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#contacts"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-peach-deep px-5 py-2.5 text-center text-sm font-bold text-paper"
          >
            Записаться
          </a>
        </nav>
      </div>
    </header>
  );
}
