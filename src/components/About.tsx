import { useStore } from "../lib/store";
import { Enso, IconCare } from "./icons";
import { Reveal, SectionHead } from "./ui";

export default function About() {
  const { db } = useStore();
  const about = db.content.about;

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute right-[-8%] top-24 h-[420px] w-[420px] rounded-full bg-stone blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          {/* Фото в круге */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="relative mx-auto max-w-[400px]">
                <Enso className="spin-slow absolute inset-[-11%] text-gold/50" strokeWidth={1.2} />
                <div className="breathe absolute inset-[-5%] rounded-full bg-stone" />
                <div className="relative aspect-[4/5] overflow-hidden rounded-full border border-ink/15 shadow-[0_44px_80px_-36px_rgba(35,33,29,0.45)]">
                  <img src={about.photo} alt="Валерия — в белом, со спины, волосы собраны в пучок" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <p className="absolute -bottom-3 left-1/2 w-max -translate-x-1/2 rounded-full border border-line bg-card px-5 py-2.5 text-[11px] font-bold tracking-[0.16em] uppercase text-ink-soft shadow-sm">
                  Валерия · Про|Баланс
                </p>
              </div>
            </Reveal>
          </div>

          {/* Текст */}
          <div className="lg:col-span-7">
            <SectionHead
              kicker="Обо мне"
              title={
                <>
                  Познакомимся <span className="italic text-gold-deep">ближе</span>
                </>
              }
            />
            <div className="mt-8 space-y-5">
              {about.paragraphs.map((p, i) => (
                <Reveal key={i} delay={i * 110}>
                  <p className="max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">{p}</p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220}>
              <div className="mt-9 flex flex-wrap gap-2.5">
                {about.chips.map((c) => (
                  <span key={c} className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-[12.5px] font-bold text-ink-soft">
                    <IconCare className="h-3.5 w-3.5 text-gold-deep" />
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={300}>
              <blockquote className="mt-10 max-w-xl border-l-2 border-gold pl-6">
                <p className="font-display text-[22px] sm:text-[24px] font-medium italic leading-snug">
                  «Я не даю готовых ответов, а помогаю вам услышать собственную мудрость»
                </p>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
