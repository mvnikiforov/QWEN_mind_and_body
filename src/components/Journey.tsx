import { IconArrow, IconCare, IconCheck } from "./icons";
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
  { place: "МИГИП", title: "Гештальт-практик — программа подготовки гештальт-терапевтов", note: "обучаюсь сейчас" },
  { place: "20+ лет", title: "Личная практика трансперсональных методов: телесные, дыхательные, медитативные техники", note: "личный опыт" },
  { place: "Сертификат", title: "Инструктор интегративной кундалини-йоги", note: "" },
  { place: "Сертификат", title: "Тренер ДАО-практик", note: "" },
  { place: "Постоянно", title: "Супервизия и личная терапия", note: "этичность" },
];

export default function Journey() {
  return (
    <section id="process" className="relative bg-cream/0 bg-stone/30 py-20 sm:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-stone blur-3xl" />
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

        <div className="relative mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-ink/15 lg:block" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="group relative h-full rounded-[24px] border border-line bg-card p-5 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(35,33,29,0.35)] sm:p-6">
                <span className="relative z-10 inline-grid h-16 w-16 place-items-center rounded-full bg-ink font-display text-[16px] italic font-semibold text-gold transition-transform duration-500 group-hover:rotate-6 group-hover:bg-gold-deep group-hover:text-card">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-[18px] font-bold">{s.t}</h3>
                <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Для кого */}
        <div className="mt-16 grid gap-10 sm:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <SectionHead
              kicker="Для кого"
              title={
                <>
                  Приходите, если готовы <span className="italic text-gold-deep">встретиться с собой</span>
                </>
              }
            />
            <ul className="mt-7 space-y-3 sm:space-y-4">
              {AUDIENCE.map((a, i) => (
                <Reveal key={a} delay={i * 90}>
                  <li className="flex items-start gap-4 rounded-[18px] border border-line bg-card px-5 py-4 transition-all duration-300 hover:translate-x-1.5 hover:border-moss/60">
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-moss/15 text-moss">
                      <IconCheck className="h-[18px] w-[18px]" />
                    </span>
                    <span className="text-[14px] sm:text-[15px] font-semibold leading-relaxed text-ink">{a}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="space-y-4 sm:space-y-5 lg:col-span-5">
            <Reveal delay={200}>
              <aside className="relative h-full overflow-hidden rounded-[26px] bg-ink p-7 text-card sm:p-9">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gold/20 text-gold">
                  <IconCare className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-[19px] sm:text-[21px] leading-snug font-bold">
                  Уважение к вашей культурной и религиозной идентичности
                </h3>
                <p className="mt-3 text-[13.5px] sm:text-[14px] leading-relaxed text-card/80">
                  Если для вас важно, чтобы специалист уважал вашу культурную и религиозную
                  идентичность — вы можете чувствовать себя в безопасности. Ваши ценности —
                  не препятствие для терапии, а её опора.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["любая культура", "любая вера", "без оценок"].map((c) => (
                    <span key={c} className="rounded-full border border-card/25 px-3.5 py-1.5 text-[11.5px] font-bold text-card/85">
                      {c}
                    </span>
                  ))}
                </div>
              </aside>
            </Reveal>
            <Reveal delay={280}>
              <aside className="rounded-[26px] border border-line bg-card p-7 sm:p-9">
                <h3 className="font-display text-[19px] sm:text-[21px] leading-snug font-bold">
                  Работа с организациями
                </h3>
                <p className="mt-3 text-[13.5px] sm:text-[14px] leading-relaxed text-ink-soft">
                  Групповые терапевтические сессии и практики для коллективов: снижение стресса,
                  профилактика выгорания, здоровая атмосфера в команде.
                </p>
                <a href="#corp-course" className="link-grow mt-4 inline-flex items-center gap-2 text-[12px] font-extrabold uppercase tracking-[0.14em] text-gold-deep">
                  Курс для компаний
                  <IconArrow className="h-4 w-4" />
                </a>
              </aside>
            </Reveal>
          </div>
        </div>

        {/* Отзывы */}
        <ReviewsSection />

        {/* Образование */}
        <div id="education" className="mt-16 sm:mt-24">
          <SectionHead
            kicker="Образование и квалификация"
            title={
              <>
                Учиться — тоже <span className="italic text-gold-deep">практика</span>
              </>
            }
            sub="Я честно говорю о своём статусе: часть программ ещё в процессе — и при этом за плечами более 20 лет глубокой личной практики."
          />
          <div className="relative mt-10 max-w-3xl">
            <div className="absolute left-[15px] top-2 bottom-2 border-l-2 border-dashed border-ink/20" aria-hidden />
            <div className="space-y-5 sm:space-y-6">
              {EDUCATION.map((e, i) => (
                <Reveal key={e.title} delay={i * 90}>
                  <div className="relative flex gap-4 sm:gap-6">
                    <span className="relative z-10 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-paper bg-gold text-[11px] font-black text-ink shadow-sm">
                      ✳
                    </span>
                    <div className="flex-1 rounded-[20px] border border-line bg-card px-5 py-4 transition-all duration-300 hover:translate-x-1.5 hover:border-gold/60 sm:px-6 sm:py-5">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <span className="font-display text-[15px] italic font-bold text-gold-deep">{e.place}</span>
                        {e.note && (
                          <span className="rounded-full border border-ink/12 px-2.5 py-0.5 text-[10.5px] font-bold text-ink-faint">{e.note}</span>
                        )}
                      </div>
                      <p className="mt-1 text-[14px] sm:text-[15px] font-bold leading-snug">{e.title}</p>
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
