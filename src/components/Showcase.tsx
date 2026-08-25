import { useState } from "react";
import { useStore } from "../lib/store";
import { fmtPrice, type Service } from "../lib/db";
import { Reveal, SectionHead } from "./ui";
import { IconArrow, IconCart, IconClock, IconSeed, IconSpirit, IconStill, IconUsers, IconWave } from "./icons";

export function chooseService(id: string) {
  window.dispatchEvent(new CustomEvent("valeria:choose-service", { detail: id }));
}

const KIND_ICON: Record<Service["kind"], typeof IconSeed> = {
  free: IconSeed,
  single: IconSpirit,
  package: IconCart,
  masterclass: IconStill,
  group: IconUsers,
};

const TINTS = ["bg-sky/55", "bg-mint/55", "bg-lav/60", "bg-peach/45", "bg-cream"];
const ICON_TINTS = ["bg-sky text-sky-deep", "bg-mint text-mint-deep", "bg-lav text-lav-deep", "bg-peach text-peach-deep", "bg-cream text-gold"];

function ServiceCard({ s, subscriber, index }: { s: Service; subscriber: boolean; index: number }) {
  const Icon = KIND_ICON[s.kind];
  const isSingle = s.kind === "single";
  const price = isSingle && subscriber && s.subscriberPrice != null ? s.subscriberPrice : s.price;
  const tint = TINTS[index % TINTS.length];
  const iconTint = ICON_TINTS[index % ICON_TINTS.length];

  return (
    <Reveal delay={(index % 3) * 110} className="h-full">
      <article
        className={`group relative flex h-full flex-col rounded-[26px] border p-7 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_34px_70px_-28px_rgba(51,46,61,0.4)] ${tint} ${
          s.featured ? "border-peach-deep/45 shadow-[0_24px_60px_-30px_rgba(224,138,92,0.55)]" : "border-ink/10 hover:border-ink/25"
        }`}
      >
        {s.badge && (
          <span className="absolute -top-3.5 right-6 rotate-2 rounded-full bg-gold px-3.5 py-1.5 text-[11.5px] font-extrabold tracking-wide text-ink shadow-md">
            {s.badge}
          </span>
        )}
        {isSingle && subscriber && (
          <span className="absolute -top-3.5 left-6 -rotate-2 rounded-full bg-mint-deep px-3.5 py-1.5 text-[11.5px] font-extrabold tracking-wide text-paper shadow-md">
            цена подписчика
          </span>
        )}

        {s.image && (
          <img
            src={s.image}
            alt={s.title}
            className="mb-5 h-36 w-full rounded-[18px] border border-ink/10 object-cover"
            loading="lazy"
          />
        )}

        <div className="flex items-start justify-between gap-3">
          <span className={`grid h-13 w-13 shrink-0 place-items-center rounded-2xl ${iconTint} transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105`} style={{ height: 52, width: 52 }}>
            <Icon className="h-6.5 w-6.5" style={{ height: 26, width: 26 }} />
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-paper/75 px-3 py-1.5 text-[12px] font-bold text-ink-soft">
            <IconClock className="h-3.5 w-3.5" />
            {s.duration}
          </span>
        </div>

        <h3 className="mt-5 font-display text-[17px] leading-snug font-bold">{s.title}</h3>

        <div className="mt-4 flex items-baseline gap-2.5" aria-live="polite">
          {price === 0 ? (
            <span key={String(price)} className="price-flip font-display text-[26px] font-bold text-mint-deep">
              Бесплатно
            </span>
          ) : (
            <>
              <span key={`${price}-${subscriber}`} className="price-flip font-display text-[26px] font-bold text-ink">
                {fmtPrice(price)}
              </span>
              {isSingle && subscriber && s.subscriberPrice != null && (
                <span className="price-flip text-[15px] font-semibold text-ink-faint line-through">
                  {fmtPrice(s.price)}
                </span>
              )}
              {s.priceUnit && <span className="text-[13px] font-semibold text-ink-soft">{s.priceUnit}</span>}
            </>
          )}
        </div>

        <p className="mt-3.5 text-[14px] leading-relaxed text-ink-soft">{s.description}</p>

        {s.note && (
          <p className="mt-4 border-l-[3px] border-gold/70 pl-3 text-[12.5px] font-semibold leading-snug text-ink-soft">
            {s.note}
          </p>
        )}

        <button
          onClick={() => chooseService(s.id)}
          className={`mt-auto pt-6 text-left`}
        >
          <span
            className={`inline-flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-3.5 text-[14.5px] font-bold transition-all duration-300 ${
              s.featured
                ? "bg-ink text-paper group-hover:bg-peach-deep"
                : "border-2 border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-paper"
            }`}
          >
            {s.cta}
            <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      </article>
    </Reveal>
  );
}

export default function Showcase() {
  const { db } = useStore();
  const [subscriber, setSubscriber] = useState(false);

  return (
    <section id="services" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute top-24 right-0 h-80 w-80 rounded-full bg-mint/50 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHead
            kicker="Витрина услуг"
            title={<>Форматы работы <span className="font-serif italic font-semibold text-peach-deep">и цены</span></>}
            sub="Выберите формат, который откликается. Цены переключаются — для подписчиков моей группы действует особая цена на индивидуальные консультации."
          />

          {/* Переключатель цен */}
          <Reveal delay={200}>
            <div className="flex items-center gap-3">
              <div className="relative flex rounded-full border border-ink/12 bg-cream p-1.5 shadow-inner">
                <span
                  className={`absolute top-1.5 bottom-1.5 rounded-full bg-ink transition-all duration-400 ease-out ${
                    subscriber ? "left-[50%] right-1.5" : "left-1.5 right-[50%]"
                  }`}
                  style={{ transitionDuration: "400ms" }}
                />
                {["Обычная цена", "Для подписчиков"].map((label, i) => {
                  const active = subscriber === (i === 1);
                  return (
                    <button
                      key={label}
                      onClick={() => setSubscriber(i === 1)}
                      className={`relative z-10 rounded-full px-4 sm:px-5 py-2.5 text-[13px] font-bold transition-colors duration-300 ${
                        active ? "text-paper" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
            <p className="mt-3 max-w-[300px] text-[12px] font-medium leading-snug text-ink-faint">
              Особая цена действует на индивидуальную консультацию:{" "}
              <b className="text-ink-soft">2 500 ₽ вместо 3 000 ₽</b>
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {db.services.map((s, i) => (
            <ServiceCard key={s.id} s={s} subscriber={subscriber} index={i} />
          ))}

          {/* Шестая ячейка — мягкий призыв */}
          <Reveal delay={220} className="h-full">
            <div className="flex h-full min-h-[280px] flex-col items-start justify-center rounded-[26px] border-2 border-dashed border-ink/15 p-7 transition-colors duration-500 hover:border-peach-deep/50">
              <IconWave className="h-9 w-9 text-peach-deep" />
              <p className="mt-4 font-display text-[16px] font-bold leading-snug">
                Не знаете, с чего начать?
              </p>
              <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                Приходите на бесплатную встречу-знакомство — за 20 минут спокойно определим запрос и формат.
              </p>
              <button
                onClick={() => chooseService("intro")}
                className="mt-5 inline-flex items-center gap-2 text-[14px] font-extrabold text-peach-deep transition-colors hover:text-ink"
              >
                Выбрать бесплатную встречу
                <IconArrow className="h-4 w-4" />
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
