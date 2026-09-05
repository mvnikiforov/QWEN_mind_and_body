import { useStore } from "../lib/store";
import { Enso } from "./icons";
import { Reveal, SectionHead } from "./ui";

export default function About() {
  const { db } = useStore();
  const a = db.content.about;

  return (
    <section id="about" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Фото */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto max-w-[420px]">
                <Enso className="spin-slow absolute -inset-2.5 text-ink/20 sm:-inset-8" strokeWidth={1} />
                <div className="relative overflow-hidden rounded-[32px] border border-line shadow-[0_44px_90px_-46px_rgba(35,33,29,0.55)]">
                  <img
                    src={a.photo}
                    alt="Валерия — инструктор в белом кимоно, снята со спины"
                    className="h-full w-full max-w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-5 left-1/2 w-[86%] -translate-x-1/2 rounded-full border border-line bg-card/95 px-6 py-3.5 text-center shadow-[0_24px_48px_-24px_rgba(35,33,29,0.5)] backdrop-blur">
                  <p className="font-display text-[17px] font-semibold leading-none">Валерия</p>
                  <p className="mt-1 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-ink-faint">
                    более 20 лет практики · около 5 лет с клиентами
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Текст */}
          <div className="lg:col-span-7">
            <SectionHead
              kicker="Обо мне"
              title={
                <>
                  Встретиться со своей <span className="italic text-gold-deep">природной мудростью</span>
                </>
              }
            />
            <div className="mt-7 space-y-4">
              {a.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 100}>
                  <p className="text-[14.5px] sm:text-[15.5px] leading-relaxed text-ink-soft">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={200}>
              <blockquote className="mt-7 border-l-2 border-gold pl-5 sm:pl-6">
                <p className="font-display text-[19px] sm:text-[22px] italic leading-snug text-ink">
                  «Я не даю готовых ответов, а помогаю вам услышать собственную мудрость».
                </p>
              </blockquote>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {a.chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2 text-[12px] font-bold text-ink-soft">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
