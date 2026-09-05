import { useState } from "react";
import { useStore } from "../lib/store";
import { fmtPrice, type Service } from "../lib/db";
import { IconArrow } from "./icons";
import { prefillService, Reveal, SectionHead } from "./ui";

const MODE_LABEL = { individual: "Индивидуальная", group: "Групповая" } as const;

function ServiceCard({ s, delay, className = "" }: { s: Service; delay: number; className?: string }) {
  const [mode, setMode] = useState<"individual" | "group">("individual");
  const v = s.variants.find((x) => x.mode === mode) ?? s.variants[0];
  const idx = Math.max(0, s.variants.findIndex((x) => x.mode === v.mode));

  const book = () =>
    prefillService(`${s.id}:${v.id}`, fmtPrice(v.price) + (v.priceUnit ? ` ${v.priceUnit}` : ""));

  const buyPack = () =>
    prefillService(
      `${s.id}:${v.id}`,
      (v.packLabel ?? "") + (v.packBenefit ? ` · ${v.packBenefit}` : "")
    );

  const packCta = s.id === "balance" ? "Купить пакет" : "Купить абонемент";

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <article
        id={`card-${s.id}`}
        className="group/card flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[28px] border border-line bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_44px_88px_-44px_rgba(35,33,29,0.55)]"
      >
        {/* Фото с кроссфейдом форматов */}
        <div className="relative h-52 overflow-hidden sm:h-60">
          {s.variants.map((vv) => (
            <img
              key={vv.id}
              src={vv.image}
              alt={`${s.title} — ${MODE_LABEL[vv.mode]}`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full max-w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                vv.mode === v.mode ? "opacity-100 scale-100" : "opacity-0 scale-[1.06]"
              }`}
            />
          ))}
          <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink backdrop-blur">
            {MODE_LABEL[v.mode]}
          </span>
          {v.badge && (
            <span className="absolute right-4 top-4 rounded-full bg-gold px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-card shadow-md">
              {v.badge}
            </span>
          )}
        </div>

        <div className="flex grow flex-col p-6 sm:p-7">
          <h3 className="font-display text-[24px] sm:text-[27px] font-semibold leading-tight">{s.title}</h3>

          {/* Переключатель формата — крупный, заметный */}
          <div className="relative mt-4 grid grid-cols-2 rounded-full border-2 border-ink bg-card p-1 shadow-[0_12px_26px_-18px_rgba(35,33,29,0.7)]" role="tablist" aria-label={`Формат: ${s.title}`}>
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: idx === 1 ? "translateX(100%)" : "translateX(0)" }}
            />
            {s.variants.map((vv, i) => (
              <button
                key={vv.id}
                type="button"
                role="tab"
                aria-selected={i === idx}
                onClick={() => setMode(vv.mode)}
                className={`relative z-10 min-h-[44px] rounded-full px-2 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.1em] transition-colors duration-300 sm:text-[12.5px] sm:tracking-[0.14em] ${
                  i === idx ? "text-card" : "text-ink/50 hover:text-ink"
                }`}
              >
                {MODE_LABEL[vv.mode]}
              </button>
            ))}
          </div>

          <p className="mt-3.5 text-[12.5px] font-semibold text-ink-faint">{s.subtitle}</p>

          {/* Контент активного формата */}
          <div key={v.id} className="fadeup">
            <div className="mt-4 flex flex-wrap items-end justify-between gap-x-5 gap-y-2">
              <p className="max-w-[56%] text-[13px] font-bold leading-snug text-ink-soft">{v.duration}</p>
              <div className="text-right">
                <p className="font-display text-[36px] sm:text-[42px] font-medium leading-none tracking-tight">{fmtPrice(v.price)}</p>
                {v.priceUnit && (
                  <p className="mt-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">{v.priceUnit}</p>
                )}
              </div>
            </div>

            {v.packLabel && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[16px] border border-gold/35 bg-gold/10 px-4 py-3 sm:px-5 sm:py-3.5">
                <p className="text-[12.5px] sm:text-[13px] font-bold leading-snug">{v.packLabel}</p>
                {v.packBenefit && (
                  <span className="shrink-0 rounded-full bg-gold px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-card">
                    {v.packBenefit}
                  </span>
                )}
              </div>
            )}

            <p className="mt-4 text-[13.5px] sm:text-[14px] leading-relaxed text-ink-soft">{v.description}</p>
          </div>

          {/* Оба варианта видны сразу */}
          <div className="mt-5">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-ink-faint">Оба варианта</p>
            <div className="mt-2.5 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line">
              {s.variants.map((vv) => {
                const on = vv.mode === v.mode;
                return (
                  <button
                    key={vv.id}
                    type="button"
                    onClick={() => setMode(vv.mode)}
                    aria-pressed={on}
                    className={`min-h-[64px] px-4 py-3 text-left transition-colors duration-300 ${on ? "bg-ink text-card" : "bg-card hover:bg-stone"}`}
                  >
                    <span className={`block text-[10px] font-extrabold uppercase tracking-[0.12em] ${on ? "text-card/65" : "text-ink-faint"}`}>
                      {MODE_LABEL[vv.mode]}
                    </span>
                    <span className="mt-1 block font-display text-[20px] font-semibold leading-none">{fmtPrice(vv.price)}</span>
                    <span className={`mt-1 block text-[11px] font-bold ${on ? "text-gold" : "text-gold-deep"}`}>
                      {vv.packBenefit ?? vv.priceUnit ?? " "}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-2.5 pt-6">
            <button
              onClick={book}
              className="group/btn flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-ink py-4 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-card transition-all duration-300 hover:bg-gold-deep hover:shadow-[0_20px_40px_-18px_rgba(138,109,60,0.95)]"
            >
              Записаться
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </button>
            {v.packLabel && (
              <button
                onClick={buyPack}
                className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-full border-2 border-gold/60 bg-transparent py-3.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-gold-deep transition-all duration-300 hover:border-gold-deep hover:bg-gold/10"
              >
                {packCta}
                {v.packBenefit && <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] text-card">{v.packBenefit}</span>}
              </button>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function Showcase() {
  const { db } = useStore();

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-28 top-24 h-96 w-96 rounded-full bg-stone blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-80 w-80 rounded-full bg-stone/80 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Витрина"
            title={
              <>
                Форматы работы <span className="italic text-gold-deep">и цены</span>
              </>
            }
            sub="Три предложения. Внутри каждой карточки переключите «Индивидуальная» или «Групповая» — фото, длительность, цена и описание сменятся. Оба варианта и экономия пакетов видны сразу."
          />
          {/* Указатель прокрутки (мобильные) */}
          <Reveal delay={200} className="md:hidden">
            <p className="flex items-center gap-3 text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink">
              Листайте карточки
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-gold-deep" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M4 12h15" />
                <path d="m13 6 6 6-6 6" />
              </svg>
            </p>
          </Reveal>
        </div>

        {/* Мобильные: горизонтальный скролл (~83% экрана), планшет: 2, десктоп: 3 в ряд */}
        <div className="scroll-ribbon -mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mt-14 sm:gap-5 md:mx-0 md:grid md:grid-cols-2 md:gap-7 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3">
          {db.services.map((s, i) => (
            <ServiceCard
              key={s.id}
              s={s}
              delay={i * 120}
              className="w-[83vw] max-w-[380px] shrink-0 snap-center md:w-auto md:max-w-none"
            />
          ))}
        </div>

        <Reveal delay={220}>
          <p className="mt-8 text-center text-[12.5px] font-medium text-ink-faint">
            Цены фиксированные · оплата согласуется лично · {db.content.contacts.note.toLowerCase()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
