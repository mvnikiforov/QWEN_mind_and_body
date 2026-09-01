import type { ReactNode } from "react";
import { IconArrow } from "./icons";
import { Reveal } from "./ui";

function dispatchFormat(serviceId: string, mode: "individual" | "group") {
  window.dispatchEvent(new CustomEvent("showcase-format", { detail: { serviceId, mode } }));
}

const CATS: {
  n: string;
  title: string;
  icon: ReactNode;
  href: string;
  tint: string;
  onClick?: () => void;
}[] = [
  {
    n: "01",
    title: "Индивидуальная сессия",
    tint: "bg-card",
    href: "#card-session",
    onClick: () => dispatchFormat("session", "individual"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    tint: "bg-gold/10",
    href: "#card-probalance",
    onClick: () => dispatchFormat("probalance", "group"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3.2 20 7l-8 3.8L4 7z" />
        <path d="m4 11.6 8 3.8 8-3.8" />
        <path d="m4 16 8 3.8L20 16" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Групповая программа",
    tint: "bg-moss/10",
    href: "#card-session",
    onClick: () => dispatchFormat("session", "group"),
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
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
    tint: "bg-stone",
    href: "#corp-course",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3.2" y="4.6" width="17.6" height="12" rx="1.6" />
        <path d="M10.4 8.4v4.4l3.9-2.2z" fill="currentColor" stroke="none" />
        <path d="M8.6 20.4h6.8" />
      </svg>
    ),
  },
];

/* Горизонтальная полоса категорий — сразу под Hero */
export default function Categories() {
  return (
    <section aria-label="Быстрый выбор формата" className="relative py-9 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex gap-3.5 overflow-x-auto pb-2 no-scrollbar md:grid md:grid-cols-4 md:gap-4 md:overflow-visible md:pb-0 lg:gap-5">
          {CATS.map((c, i) => (
            <Reveal key={c.n} delay={i * 90} className="w-[218px] shrink-0 md:w-auto">
              <a
                href={c.href}
                onClick={c.onClick}
                className={`group flex h-full items-center gap-4 rounded-[22px] border border-line ${c.tint} px-5 py-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/70 hover:bg-card hover:shadow-[0_26px_52px_-30px_rgba(35,33,29,0.5)]`}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-ink/20 bg-card text-ink transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-gold">
                  {c.icon}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[12px] italic leading-none text-gold-deep/80">{c.n}</span>
                  <span className="mt-1 block whitespace-nowrap text-[13.5px] font-extrabold tracking-tight md:text-[14.5px]">
                    {c.title}
                  </span>
                </span>
                <IconArrow className="ml-auto h-4 w-4 shrink-0 -translate-x-1 text-ink-faint opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:text-gold-deep group-hover:opacity-100" />
              </a>
            </Reveal>
          ))}
        </div>
        <p className="mt-3 text-center text-[11px] font-semibold tracking-wide text-ink-faint md:hidden">
          листайте, чтобы увидеть все форматы →
        </p>
      </div>
    </section>
  );
}
