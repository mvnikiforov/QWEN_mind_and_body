import { useEffect, useState } from "react";
import { useStore } from "../lib/store";
import { fmtPrice, type Service } from "../lib/db";
import { IconArrow } from "./icons";
import { prefillService, Reveal, SectionHead } from "./ui";

const MODE_LABEL = { individual: "Индивидуальная", group: "Групповая" } as const;

function ServiceCard({ s, delay, className = "" }: { s: Service; delay: number; className?: string }) {
  const [mode, setMode] = useState<"individual" | "group">("individual");
  const v = s.variants.find((x) => x.mode === mode) ?? s.variants[0];
  const idx = Math.max(0, s.variants.findIndex((x) => x.mode === v.mode));

  /* категории под Hero могут переключить формат карточки при переходе */
  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ serviceId: string; mode: "individual" | "group" }>).detail;
      if (d.serviceId === s.id) setMode(d.mode);
    };
    window.addEventListener("showcase-format", on);
    return () => window.removeEventListener("showcase-format", on);
  }, [s.id]);

  const book = () =>
    prefillService(
      `${s.id}:${v.id}`,
      fmtPrice(v.price) + (v.priceUnit ? ` ${v.priceUnit}` : "")
    );

  const bookPack = () =>
    prefillService(
      `${s.id}:${v.id}`,
      (v.packLabel ?? "") + (v.packBenefit ? ` · ${v.packBenefit}` : "")
    );

  return (
    <Reveal delay={delay} className={`h-full ${className}`}>
      <article id={`card-${s.id}`} className="group/card flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[32px] border border-line bg-card transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:shadow-[0_44px_88px_-44px_rgba(35,33,29,0.55)]">
        {/* Фото с кроссфейдом между форматами */}
        <div className="relative h-60 overflow-hidden sm:h-64">
          {s.variants.map((vv) => (
            <img
              key={vv.id}
              src={vv.image}
              alt={`${s.title} — ${MODE_LABEL[vv.mode]}`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out ${
                vv.mode === v.mode ? "scale-100 opacity-100" : "scale-[1.07] opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink/55 to-transparent" />
          <span
            key={`chip-${v.id}`}
            className="fadeup absolute left-5 top-5 rounded-full bg-card/90 px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.16em] text-ink backdrop-blur"
          >
            {MODE_LABEL[v.mode]}
          </span>
          <h3 className="absolute bottom-4 left-6 right-6 font-display text-[28px] font-semibold leading-tight text-card drop-shadow-md">
            {s.title}
          </h3>
        </div>

        <div className="flex grow flex-col p-6 sm:p-8">
          {/* Крупный сегментный переключатель формата */}
          <div
            className="relative grid grid-cols-2 rounded-full border-2 border-ink bg-card p-1 shadow-[0_12px_26px_-18px_rgba(35,33,29,0.7)]"
            role="tablist"
            aria-label={`Формат: ${s.title}`}
          >
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
                className={`relative z-10 rounded-full py-3 text-[12.5px] font-extrabold uppercase tracking-[0.14em] transition-colors duration-300 ${
                  i === idx ? "text-card" : "text-ink/50 hover:text-ink"
                }`}
              >
                {MODE_LABEL[vv.mode]}
              </button>
            ))}
          </div>

          <p className="mt-4 text-[12.5px] font-semibold text-ink-faint">{s.subtitle}</p>

          {/* Контент активного формата (анимируется при переключении) */}
          <div key={v.id} className="fadeup">
            <div className="mt-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
              <p className="max-w-[58%] text-[13.5px] font-bold leading-snug text-ink-soft">{v.duration}</p>
              <div className="text-right">
                <p className="font-display text-[42px] font-medium leading-none tracking-tight">{fmtPrice(v.price)}</p>
                {v.priceUnit && (
                  <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-faint">{v.priceUnit}</p>
                )}
              </div>
            </div>

            {v.packLabel && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-[18px] border border-gold/35 bg-gold/10 px-5 py-3.5">
                <p className="text-[13px] font-bold leading-snug">{v.packLabel}</p>
                {v.packBenefit && (
                  <span className="shrink-0 rounded-full bg-gold px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-wide text-card">
                    {v.packBenefit}
                  </span>
                )}
              </div>
            )}

            <p className="mt-5 text-[14px] leading-relaxed text-ink-soft">{v.description}</p>
          </div>

          {/* Оба варианта видны сразу — кликабельны */}
          <div className="mt-6">
            <p className="text-[10.5px] font-extrabold uppercase tracking-[0.22em] text-ink-faint">Оба варианта</p>
            <div className="mt-2.5 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-line bg-line">
              {s.variants.map((vv) => {
                const on = vv.mode === v.mode;
                return (
                  <button
                    key={vv.id}
                    type="button"
                    onClick={() => setMode(vv.mode)}
                    className={`px-4 py-3.5 text-left transition-colors duration-300 ${
                      on ? "bg-ink text-card" : "bg-card hover:bg-stone"
                    }`}
                  >
                    <span className={`block text-[10.5px] font-extrabold uppercase tracking-[0.12em] ${on ? "text-card/65" : "text-ink-faint"}`}>
                      {MODE_LABEL[vv.mode]}
                    </span>
                    <span className="mt-1 block font-display text-[21px] font-semibold leading-none">{fmtPrice(vv.price)}</span>
                    <span className={`mt-1 block text-[11px] font-bold ${on ? "text-gold" : "text-gold-deep"}`}>
                      {vv.packBenefit ?? vv.priceUnit ?? " "}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto space-y-3 pt-7">
            <button
              onClick={book}
              className="group/btn flex w-full items-center justify-center gap-3 rounded-full bg-ink py-4 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-card transition-all duration-300 hover:bg-gold-deep hover:shadow-[0_20px_40px_-18px_rgba(138,109,60,0.95)]"
            >
              Записаться
              <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
            </button>
            {v.packLabel && (
              <button
                onClick={bookPack}
                className="group/pack flex w-full items-center justify-center gap-3 rounded-full border-2 border-gold-deep/70 bg-gold/10 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.14em] text-gold-deep transition-all duration-300 hover:border-gold-deep hover:bg-gold-deep hover:text-card hover:shadow-[0_18px_36px_-16px_rgba(138,109,60,0.9)]"
              >
                Купить абонемент
                <span className="rounded-full bg-gold-deep/15 px-2.5 py-1 text-[10.5px] font-extrabold normal-case tracking-normal transition-colors duration-300 group-hover/pack:bg-card/20">
                  {v.packBenefit ?? "выгодно"}
                </span>
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

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHead
          kicker="Витрина"
          title={
            <>
              Форматы работы <span className="italic text-gold-deep">и цены</span>
            </>
          }
          sub="Два направления работы — обе карточки стоят в ряд. Внутри каждой переключите «Индивидуальная» или «Групповая»: фото, длительность, цена и описание сменятся, а оба варианта и выгода пакетов видны сразу. На телефоне карточки листаются горизонтально."
        />

        {/* Горизонтальный ряд: на ноутбуке обе карточки в ряд,
            на мобильных — горизонтальный скролл с «подглядыванием» следующей */}
        <div className="no-scrollbar mt-14 flex snap-x snap-mandatory items-stretch gap-5 overflow-x-auto pb-4 sm:gap-7 md:snap-none md:overflow-visible md:pb-0">
          {db.services.map((s, i) => (
            <ServiceCard
              key={s.id}
              s={s}
              delay={i * 140}
              className="w-[300px] shrink-0 snap-start sm:w-[340px] md:w-auto md:basis-0 md:flex-1"
            />
          ))}
        </div>
        <p className="mt-2 text-center text-[11px] font-semibold tracking-wide text-ink-faint md:hidden">
          листайте, чтобы увидеть обе карточки →
        </p>

        <Reveal delay={240}>
          <p className="mt-10 text-center text-[13px] font-semibold text-ink-faint">
            Все цены фиксированные · оплата согласуется лично · {db.content.contacts.note.toLowerCase()}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
