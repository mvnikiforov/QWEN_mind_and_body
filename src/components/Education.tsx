import { IconCare } from "./icons";
import { Reveal, SectionHead } from "./ui";

const EDUCATION = [
  { place: "МГППУ", title: "Магистрант-этнопсихолог — «Мультикультурное психологическое консультирование»", note: "обучаюсь сейчас" },
  { place: "МИГИП", title: "Гештальт-практик", note: "текущее обучение" },
  { place: "20+ лет", title: "Личная практика трансперсональных методов", note: "телесные, дыхательные, медитативные техники" },
  { place: "Сертификат", title: "Инструктор интегративной кундалини-йоги", note: "" },
  { place: "Сертификат", title: "Тренер ДАО-практик", note: "" },
  { place: "Постоянно", title: "Супервизия и личная терапия", note: "гарантия этичности" },
];

export default function Education() {
  return (
    <section id="education" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-stone blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          kicker="Образование и квалификация"
          title={
            <>
              Учиться — тоже <span className="italic text-gold-deep">практика</span>
            </>
          }
          sub="Я честно говорю о своём статусе: часть программ ещё в процессе — и при этом за плечами более 20 лет глубокой личной практики."
        />
        <div className="relative mt-12 max-w-3xl">
          <div className="absolute bottom-2 left-[13px] top-2 border-l border-dashed border-ink/25" aria-hidden />
          <div className="space-y-6">
            {EDUCATION.map((e, i) => (
              <Reveal key={e.title} delay={i * 80}>
                <div className="relative flex gap-6">
                  <span className="relative z-10 mt-1.5 grid h-[27px] w-[27px] shrink-0 place-items-center rounded-full border border-gold bg-paper">
                    <span className="h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <div className="grow rounded-[20px] border border-line bg-card px-6 py-5 transition-all duration-300 hover:translate-x-1.5 hover:border-gold/60">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="text-[11.5px] font-extrabold tracking-[0.16em] uppercase text-gold-deep">{e.place}</span>
                      {e.note && <span className="rounded-full bg-stone px-3 py-1 text-[10.5px] font-bold text-ink-soft">{e.note}</span>}
                    </div>
                    <p className="mt-1.5 text-[15px] font-bold leading-snug">{e.title}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
