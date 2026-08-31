import { useEffect, useState } from "react";
import { IconArrow } from "./icons";

const LINKS = [
  { href: "#services", label: "Услуги и цены" },
  { href: "#approach", label: "Подход" },
  { href: "#about", label: "Обо мне" },
  { href: "#schedule", label: "Расписание" },
  { href: "#contact", label: "Контакты" },
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
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "bg-paper/85 shadow-[0_1px_0_0_var(--color-line)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}>
        {/* Логотип */}
        <a href="#top" className="group leading-none">
          <span className="flex items-baseline gap-2">
            <span className="font-display text-[26px] font-semibold tracking-tight">Валерия</span>
            <span className="text-[11px] font-extrabold tracking-[0.18em] text-gold-deep uppercase">Про|Баланс</span>
          </span>
          <span className="mt-0.5 block text-[9.5px] font-semibold tracking-[0.34em] text-ink-faint uppercase opacity-80 transition-opacity group-hover:opacity-100">
            тело • чувства • разум • дух
          </span>
        </a>

        {/* Меню */}
        <nav className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="link-grow text-[12.5px] font-bold tracking-[0.14em] uppercase text-ink-soft transition-colors hover:text-ink">
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold tracking-[0.1em] uppercase text-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-[0_16px_34px_-14px_rgba(138,109,60,0.8)]"
          >
            Записаться
            <IconArrow className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </nav>

        {/* Мобильная кнопка */}
        <button
          aria-label="Меню"
          onClick={() => setOpen(!open)}
          className="relative z-50 grid h-11 w-11 place-items-center rounded-full border border-ink/15 lg:hidden"
        >
          <span className={`absolute h-px w-5 bg-ink transition-all duration-300 ${open ? "rotate-45" : "-translate-y-[5px]"}`} />
          <span className={`absolute h-px w-5 bg-ink transition-all duration-300 ${open ? "-rotate-45" : "translate-y-[5px]"}`} />
        </button>
      </div>

      {/* Мобильное меню */}
      <div className={`acc-body lg:hidden ${open ? "open" : ""}`}>
        <div className="acc-inner">
          <nav className="mx-5 mb-4 flex flex-col gap-1 rounded-[22px] border border-line bg-card p-5 shadow-[0_30px_60px_-30px_rgba(35,33,29,0.35)]">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-[12px] px-4 py-3 font-display text-[19px] font-medium transition-colors hover:bg-stone/70"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-[12.5px] font-bold tracking-[0.12em] uppercase text-card"
            >
              Записаться
              <IconArrow className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
