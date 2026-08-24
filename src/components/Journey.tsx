import { Reveal, SectionHead, Chip } from "./ui";
import { IconArrow, IconCare, IconCheck, AsteriskMark } from "./icons";

const STEPS = [
  { n: "01", t: "Заявка", d: "Оставляете заявку через форму на сайте или пишете в мессенджер — как вам удобнее." },
  { n: "02", t: "Согласование", d: "Мы согласовываем время и формат: онлайн или очно, в удобные для вас часы." },
  { n: "03", t: "Первая встреча", d: "Бесплатная встреча-знакомство: проясняем запрос и понимаем, подходим ли мы друг другу." },
  { n: "04", t: "Работа", d: "Начинаем регулярную индивидуальную работу — или вы присоединяетесь к группе." },
];

const MC_FLOW = ["Регистрация", "Оплата", "Напоминание", "Участие"];

const AUDIENCE = [
  "Если вы чувствуете усталость, потерянность, запутанность.",
  "Если в теле есть напряжение и зажимы, которые не отпускают.",
  "Если хотите глубокого общения на языке чувств.",
  "Если ищете опору, ясность и доступ к внутренним ресурсам.",
];

const EDUCATION = [
  { place: "МИГИП", title: "Гештальт-терапия", note: "программа подготовки гештальт-терапевтов · обучаюсь сейчас" },
  { place: "МГППУ", title: "Магистратура «Мультикультурное психологическое консультирование»", note: "этнопсихология, межкультурная компетентность · обучаюсь сейчас" },
  { place: "20+ лет", title: "Личная практика трансперсональных методов", note: "телесные, дыхательные и медитативные техники; интегративная кундалини-йога — инструктор" },
  { place: "Постоянно", title: "Супервизия и личная терапия", note: "регулярная работа с супервизором — гарантия этичности и качества" },
];

export default function Journey() {
  return (
    <section id="process" className="relative bg-cream/60 py-20 sm:py-28 overflow-hidden">
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-peach/40 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          kicker="Как проходит"
          title={<>Четыре <span className="font-serif italic font-semibold text-peach-deep">спокойных</span> шага</>}
          sub="Никакой спешки и давления. Вы всегда знаете, что будет дальше, и всегда можете остановиться."
        />

        {/* Шаги */}
        <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-ink/15 lg:block" aria-hidden />
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 110}>
              <div className="group relative h-full rounded-[26px] border border-ink/10 bg-paper p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_56px_-28px_rgba(51,46,61,0.35)]">
                <span className="relative z-10 inline-grid h-[68px] w-[68px] place-items-center rounded-full bg-ink font-display text-[17px] font-bold text-peach transition-transform duration-500 group-hover:rotate-6 group-hover:bg-peach-deep group-hover:text-paper">
                  {s.n}
                </span>
                <h3 className="mt-5 font-display text-[16px] font-bold">{s.t}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Мастер-классы: мини-флоу */}
        <Reveal delay={150}>
          <div className="mt-12 flex flex-wrap items-center gap-4 rounded-[26px] border border-ink/10 bg-paper p-6 sm:p-7">
            <p className="font-display text-[15px] font-bold">
              Для мастер-классов всё ещё проще:
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {MC_FLOW.map((f, i) => (
                <span key={f} className="flex items-center gap-2.5">
                  <span className="rounded-full bg-sky/80 border border-sky-deep/30 px-4 py-2 text-[13px] font-bold text-ink transition-transform duration-300 hover:scale-105">
                    {f}
                  </span>
                  {i < MC_FLOW.length - 1 && <IconArrow className="h-4 w-4 text-ink-faint" />}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Для кого */}
        <div className="mt-24 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead
              kicker="Для кого"
              title={<>Приходите, если вы готовы <span className="font-serif italic font-semibold text-peach-deep">встретиться с собой</span></>}
            />
            <ul className="mt-9 space-y-4">
              {AUDIENCE.map((a, i) => (
                <Reveal key={a} delay={i * 90}>
                  <li className="flex items-start gap-4 rounded-[20px] border border-ink/10 bg-paper p-4.5 px-5 py-4 transition-all duration-300 hover:border-mint-deep/50 hover:translate-x-1.5" style={{ padding: "16px 20px" }}>
                    <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mint text-mint-deep">
                      <IconCheck className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} strokeWidth={2.2} />
                    </span>
                    <span className="text-[15px] font-semibold leading-relaxed text-ink">{a}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={200}>
              <aside className="relative h-full overflow-hidden rounded-[30px] bg-ink p-8 sm:p-10 text-paper">
                <AsteriskMark className="absolute -bottom-8 -right-8 h-44 w-44 text-paper/8" strokeWidth={1.2} />
                <span className="grid h-14 w-14 place-items-center rounded-full bg-peach/20 text-peach">
                  <IconCare className="h-7 w-7" />
                </span>
                <h3 className="mt-6 font-display text-[19px] leading-snug font-bold">
                  Особый акцент — уважение к вашей идентичности
                </h3>
                <p className="mt-4 text-[14.5px] leading-relaxed text-paper/80">
                  Если для вас важно, чтобы специалист уважал вашу культурную и религиозную
                  идентичность — вы можете чувствовать себя в безопасности. Ваши ценности —
                  не препятствие для терапии, а её опора.
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["любая культура", "любая вера", "без оценок"].map((c) => (
                    <span key={c} className="rounded-full border border-paper/25 px-3.5 py-1.5 text-[12px] font-bold text-paper/85">
                      {c}
                    </span>
                  ))}
                </div>
              </aside>
            </Reveal>
          </div>
        </div>

        {/* Отзывы */}
        <div className="mt-24">
          <SectionHead
            kicker="Отзывы"
            title={<>Слова тех, кто уже <span className="font-serif italic font-semibold text-peach-deep">прошёл этот путь</span></>}
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Reveal key={i} delay={i * 110}>
                <div className="flex h-44 flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-ink/15 text-center transition-colors duration-500 hover:border-peach-deep/50">
                  <AsteriskMark className="h-7 w-7 text-ink/25" strokeWidth={2} />
                  <p className="mt-3 max-w-[220px] text-[13.5px] font-semibold text-ink-faint">
                    Здесь появятся отзывы моих клиентов
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Образование */}
        <div id="education" className="mt-24">
          <SectionHead
            kicker="Образование и квалификация"
            title={<>Учиться — тоже <span className="font-serif italic font-semibold text-peach-deep">практика</span></>}
            sub="Я честно говорю о своём статусе: часть программ ещё в процессе — и при этом за плечами более 20 лет глубокой личной практики."
          />
          <div className="relative mt-12 max-w-3xl">
            <div className="absolute left-[15px] top-2 bottom-2 border-l-2 border-dashed border-ink/20" aria-hidden />
            <div className="space-y-7">
              {EDUCATION.map((e, i) => (
                <Reveal key={e.title} delay={i * 100}>
                  <div className="relative flex gap-6 pl-0">
                    <span className="relative z-10 mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-paper bg-gold text-[11px] font-black text-ink shadow-sm">
                      ✳
                    </span>
                    <div className="rounded-[22px] border border-ink/10 bg-paper p-5.5 px-6 py-5 transition-all duration-300 hover:translate-x-1.5 hover:border-gold/60 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display text-[14px] font-bold text-peach-deep">{e.place}</span>
                        <Chip className="text-[11px]">{e.note}</Chip>
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
