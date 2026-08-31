import { useState } from "react";
import { useStore } from "../lib/store";
import { fmtPrice, type Service } from "../lib/db";
import { IconArrow, IconCheck } from "./icons";
import { prefillService, Reveal, SectionHead } from "./ui";

function ServiceCard({ s, delay }: { s: Service; delay: number }) {
  const [open, setOpen] = useState(false);
  const priceStr = fmtPrice(s.price);
  const altTitle = s.ctaAlt?.toLowerCase().includes("абонемент") && s.subscription
    ? `${s.title} — абонемент`
    : s.title;

  return (
    <Reveal delay={delay} className="h-full">
      <article
        className={`group flex h-full flex-col overflow-hidden rounded-[26px] border bg-card transition-all duration-500 ${
          open ? "border-gold shadow-[0_36px_70px_-34px_rgba(35,33,29,0.45)]" : "border-line hover:-translate-y-1.5 hover:border-ink/30 hover:shadow-[0_30px_60px_-34px_rgba(35,33,29,0.4)]"
        }`}
      >
        {/* Фото */}
        <button
          className="relative block h-44 w-full overflow-hidden text-left md:h-48"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={`${s.title} — подробности`}
        >
          <img
            src={s.image}
            alt={s.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          {s.badge && (
            <span className="absolute left-4 top-4 -rotate-2 rounded-full bg-gold px-3.5 py-1.5 text-[10.5px] font-extrabold tracking-[0.1em] uppercase text-card shadow-md">
              {s.badge}
            </span>
          )}
          <span className="absolute bottom-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-card/90 text-ink backdrop-blur transition-all duration-300 md:hidden">
            <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="m6 9.5 6 6 6-6" />
            </svg>
          </span>
        </button>

        <div className="flex grow flex-col p-6">
          <h3 className="font-display text-[22px] font-semibold leading-tight">{s.title}</h3>
          <p className="mt-1.5 text-[12px] font-bold tracking-[0.06em] uppercase text-ink-faint">{s.duration}</p>

          {/* Цена */}
          <p className="mt-4 font-display text-[30px] font-medium leading-none">
            {priceStr}
            {s.priceUnit && <span className="ml-2 text-[13px] font-body font-semibold text-ink-soft">{s.priceUnit}</span>}
          </p>

          {/* Подробности: на десктопе всегда, на мобильном — по тапу */}
          <div className={`acc-body md:!grid-rows-[1fr] ${open ? "open" : ""}`}>
            <div className="acc-inner">
              <div className="rounded-[16px] bg-card/85 backdrop-blur-sm md:bg-transparent md:p-0">
                {s.subscription && (
                  <p className="mt-4 flex items-start gap-2 rounded-[14px] border border-gold/35 bg-gold/8 px-3.5 py-2.5 text-[12.5px] font-semibold leading-snug text-gold-deep">
                    <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {s.subscription}
                  </p>
                )}
                <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{s.description}</p>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
            <button
              onClick={() =>
                s.cta.toLowerCase().includes("подробнее")
                  ? document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })
                  : prefillService(s.title, priceStr + (s.priceUnit ? ` ${s.priceUnit}` : ""))
              }
              className="inline-flex grow items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[12px] font-bold tracking-[0.08em] uppercase text-card transition-all duration-300 hover:bg-gold-deep"
            >
              {s.cta}
              <IconArrow className="h-3.5 w-3.5" />
            </button>
            {s.ctaAlt && (
              <button
                onClick={() => prefillService(altTitle, s.subscription ?? priceStr)}
                className="inline-flex items-center justify-center rounded-full border border-ink/25 px-5 py-3 text-[12px] font-bold tracking-[0.08em] uppercase text-ink transition-all duration-300 hover:border-ink hover:bg-stone"
              >
                {s.ctaAlt}
              </button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function GroupBlock({
  roman,
  title,
  note,
  items,
}: {
  roman: string;
  title: string;
  note: string;
  items: Service[];
}) {
  return (
    <div className="mt-16 first:mt-12">
      <Reveal>
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 border-b border-line pb-5">
          <span className="font-display text-[44px] font-light leading-none text-gold/70">{roman}</span>
          <h3 className="font-display text-[26px] sm:text-[30px] font-semibold">{title}</h3>
          <p className="ml-auto text-[12.5px] font-semibold text-ink-faint">{note}</p>
        </div>
      </Reveal>

      {/* Мобайл: горизонтальный скролл · планшет: 2 · десктоп: 3 */}
      <div className="no-scrollbar -mx-5 mt-7 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-3 sm:-mx-8 sm:px-8 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-3">
        {items.map((s, i) => (
          <div key={s.id} className="w-[82vw] shrink-0 snap-center sm:w-[58vw] md:w-auto">
            <ServiceCard s={s} delay={i * 90} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Showcase() {
  const { db } = useStore();
  const individual = db.services.filter((s) => s.group === "individual");
  const group = db.services.filter((s) => s.group === "group");

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Витрина"
            title={
              <>
                Форматы работы <span className="italic text-gold-deep">и цены</span>
              </>
            }
            sub="Все цены фиксированные и честные. Выберите свой формат — от разовой практики до длительной терапевтической работы."
          />
          <Reveal delay={220}>
            <p className="hidden max-w-[220px] text-right text-[12px] font-semibold leading-relaxed text-ink-faint lg:block">
              На мобильном листайте карточки вправо, тап по фото — подробности
            </p>
          </Reveal>
        </div>

        <GroupBlock roman="I" title="Индивидуальные форматы" note="лично для вас · онлайн и очно" items={individual} />
        <GroupBlock roman="II" title="Групповые форматы" note="в кругу бережных людей" items={group} />
      </div>
    </section>
  );
}
