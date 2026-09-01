import { IconArrow, IconCare, IconCheck, YinYang } from "./icons";
import { Reveal, SectionHead } from "./ui";
import ReviewsSection from "./Reviews";

const STEPS = [
  { n: "01", t: "Заявка", d: "Оставляете заявку через форму или пишете в мессенджер — как вам удобнее." },
  { n: "02", t: "Согласование", d: "Мы согласовываем время и формат: онлайн или очно, в удобные для вас часы." },
  { n: "03", t: "Знакомство", d: "Первая встреча: проясняем запрос и понимаем, подходим ли мы друг другу." },
  { n: "04", t: "Работа", d: "Начинаем регулярную индивидуальную работу — или вы присоединяетесь к группе." },
];

const AUDIENCE = [
  "Если чувствуете усталость, потерянность, запутанность.",
  "Если в теле напряжение и зажимы, которые не отпускают.",
  "Если хотите глубокого общения на языке чувств.",
  "Если ищете опору, ясность и доступ к внутренним ресурсам.",
];

const EDUCATION = [
  { place: "МГППУ", title: "Магистрант-этнопсихолог — «Мультикультурное психологическое консультирование»", note: "обучаюсь сейчас" },
  { place: "МИГИП", title: "Гештальт-практик", note: "текущее обучение" },
  { place: "20+ лет", title: "Личная практика трансперсональных методов", note: "телесные, дыхательные, медитативные техники" },
  { place: "Сертификат", title: "Инструктор интегративной кундалини-йоги", note: "" },
  { place: "Сертификат", title: "Тренер ДАО-практик", note: "" },
  { place: "Постоянно", title: "Супервизия и личная терапия", note: "гарантия этичности" },
];

export default function Journey() {
  return (
    <section id="process" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-stone blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          kicker="Как проходит"
          title={
            <>
              Четыре <span className="italic text-gold-deep">спокойных</span> шага
            </>
          }
          sub="Никакой спешки и давления. Вы всегда знаете, что будет дальше, и всегда можете остановиться."
        />

        {/* Шаги */}
        <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-[26px] hidden border-t border-dashed border-ink/20 lg:block" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="group relative h-full pt-0">
                <span className="relative z-10 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full border border-ink bg-ink font-display text-[16px] font-semibold text-card transition-all duration-500 group-hover:bg-gold-deep group-hover:border-gold-deep">
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-[21px] font-semibold">{s.t}</h3>
                <p className="mt-2 max-w-[260px] text-[13.5px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Для кого */}
        <div className="mt-24 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead
              kicker="Для кого"
              title={
                <>
                  Приходите, если готовы <span className="italic text-gold-deep">встретиться с собой</span>
                </>
              }
            />
            <ul className="mt-9 space-y-3.5">
              {AUDIENCE.map((a, i) => (
                <Reveal key={a} delay={i * 90}>
                  <li className="flex items-start gap-4 rounded-[18px] border border-line bg-card px-5 py-4 transition-all duration-300 hover:translate-x-1.5 hover:border-gold/50">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-moss/15 text-moss">
                      <IconCheck className="h-4 w-4" />
                    </span>
                    <span className="text-[14.5px] font-semibold leading-relaxed">{a}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="space-y-5 lg:col-span-5">
            <Reveal delay={200}>
              <aside className="relative overflow-hidden rounded-[28px] bg-ink p-8 text-card sm:p-10">
                <YinYang className="absolute -bottom-8 -right-8 h-40 w-40 opacity-[0.14]" />
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/20 text-gold">
                  <IconCare className="h-6 w-6" />
                </span>
                <h3 className="mt-6 font-display text-[22px] font-semibold leading-snug">
                  Важно, чтобы специалист уважал вашу идентичность?
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-card/75">
                  Если для вас значимы культурная и религиозная идентичность — вы можете чувствовать
                  себя в безопасности. Ваши ценности — не препятствие для работы, а её опора.
                </p>
              </aside>
            </Reveal>
            <Reveal delay={300}>
              <aside className="rounded-[28px] border border-line bg-card p-8 sm:p-10">
                <p className="text-[11px] font-bold tracking-[0.28em] uppercase text-gold-deep">Организациям</p>
                <h3 className="mt-3 font-display text-[22px] font-semibold leading-snug">
                  Работа с коллективами
                </h3>
                <p className="mt-3.5 text-[14px] leading-relaxed text-ink-soft">
                  Групповые терапевтические сессии и практики для коллективов: снятие напряжения,
                  профилактика выгорания, бережная коммуникация. Физические и юридические лица.
                </p>
                <a href="#contact" className="link-grow mt-5 inline-flex items-center gap-2 text-[12.5px] font-bold tracking-[0.1em] uppercase">
                  Обсудить формат
                  <IconArrow className="h-3.5 w-3.5" />
                </a>
              </aside>
            </Reveal>
          </div>
        </div>

        {/* Отзывы */}
        <ReviewsSection />

        {/* Образование */}
        <div id="education" className="mt-24">
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
      </div>
    </section>
  );
}
