import { useStore } from "../lib/store";
import { Reveal, SectionHead } from "./ui";
import { IconBody, IconCare, IconFeel, IconGestalt, IconMind, IconSpirit, IconStill, IconWave } from "./icons";

const LEVELS = [
  { word: "ТЕЛО", Icon: IconBody, tint: "bg-peach/60", accent: "text-peach-deep", text: "Напряжение, зажимы, энергия и опора — то, что можно почувствовать напрямую." },
  { word: "ЧУВСТВА", Icon: IconFeel, tint: "bg-mint/70", accent: "text-mint-deep", text: "Право чувствовать, проживать и выражать — без оценок и запретов." },
  { word: "РАЗУМ", Icon: IconMind, tint: "bg-sky/70", accent: "text-sky-deep", text: "Ясность мыслей, понимание своих сценариев и способность выбирать." },
  { word: "ДУХ", Icon: IconSpirit, tint: "bg-lav/70", accent: "text-lav-deep", text: "Смыслы, ценности и связь с чем-то большим, чем повседневность." },
];

const METHODS = [
  {
    Icon: IconGestalt,
    title: "Гештальт-терапия",
    tint: "bg-peach text-peach-deep",
    text: "Помогает осознать и завершить незавершённые ситуации, восстановить контакт с собой и миром. Бережный метод, возвращающий чувствам право на существование и строящий здоровые отношения.",
  },
  {
    Icon: IconWave,
    title: "Телесно-ориентированные практики",
    tint: "bg-mint text-mint-deep",
    text: "Освобождают психоэмоциональные зажимы, накопленные в теле. Через движение, дыхание и внимание снимаем хроническое напряжение и открываем доступ к жизненной энергии.",
  },
  {
    Icon: IconStill,
    title: "Mindfulness и медитация",
    tint: "bg-sky text-sky-deep",
    text: "Развивают навык присутствия и безоценочного наблюдения. Снижают тревогу, улучшают концентрацию, позволяют видеть ситуации яснее.",
  },
];

export default function Approach() {
  const { db } = useStore();

  return (
    <section id="approach" className="relative overflow-hidden bg-cream/60 py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-lav/60 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          kicker="Подход"
          title={<>Четыре уровня <span className="font-serif italic font-semibold text-peach-deep">целостности</span></>}
          sub="Человек — многомерное существо. Мы работаем на уровнях тела, чувств, разума и духа. Дисбаланс в одном отражается на остальных."
        />

        {/* Уровни */}
        <div className="relative mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden border-t-2 border-dashed border-ink/15 lg:block" aria-hidden />
          {LEVELS.map((l, i) => (
            <Reveal key={l.word} delay={i * 110}>
              <div
                className={`group relative h-full rounded-[26px] border border-ink/10 ${l.tint} p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-28px_rgba(51,46,61,0.35)]`}
              >
                <div className="flex items-center justify-between">
                  <span className={`grid h-12 w-12 place-items-center rounded-full bg-paper/80 ${l.accent} shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                    <l.Icon className="h-6 w-6" />
                  </span>
                  <span className="font-display text-[13px] font-bold text-ink/35">0{i + 1}</span>
                </div>
                <p className={`mt-5 font-display text-[19px] font-black tracking-wide ${l.accent}`}>{l.word}</p>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft">{l.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Три метода */}
        <div className="mt-20 flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <h3 className="font-display text-2xl sm:text-3xl font-bold">
              Три метода — <span className="font-serif italic font-semibold text-peach-deep">одна цель</span>
            </h3>
          </Reveal>
          <Reveal delay={120}>
            <p className="max-w-md text-[14.5px] font-medium text-ink-soft">
              Методы дополняют друг друга: разговор и осознание, тело и дыхание, тишина и присутствие. Пропорции подбираются под ваш запрос.
            </p>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {METHODS.map((m, i) => (
            <Reveal key={m.title} delay={i * 120} className={i === 1 ? "md:translate-y-6" : ""}>
              <article className="group relative h-full rounded-[26px] border border-ink/10 bg-paper p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-ink/25 hover:shadow-[0_30px_60px_-30px_rgba(51,46,61,0.35)]">
                <span className={`inline-grid h-14 w-14 place-items-center rounded-[18px] ${m.tint} transition-transform duration-500 group-hover:rotate-6 group-hover:scale-105`}>
                  <m.Icon className="h-7 w-7" />
                </span>
                <h4 className="mt-5 font-display text-[16.5px] font-bold leading-snug">{m.title}</h4>
                <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">{m.text}</p>
                <span className="mt-5 block h-[3px] w-10 rounded-full bg-ink/15 transition-all duration-500 group-hover:w-16 group-hover:bg-peach-deep" />
              </article>
            </Reveal>
          ))}
        </div>

        {/* Культурный код */}
        <Reveal delay={100}>
          <aside className="relative mt-20 overflow-hidden rounded-[32px] bg-lav/80 border border-lav-deep/25 p-8 sm:p-12">
            <svg className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 text-lav-deep/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
              <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
            </svg>
            <div className="relative grid gap-8 lg:grid-cols-[auto_1fr] lg:items-start">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-paper text-lav-deep shadow-sm">
                <IconCare className="h-8 w-8" />
              </span>
              <div>
                <h3 className="font-display text-[22px] sm:text-[26px] font-bold leading-tight">
                  {db.content.culture.title}
                </h3>
                <p className="mt-4 max-w-3xl text-[15px] sm:text-base leading-relaxed text-ink-soft">
                  {db.content.culture.text}
                </p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  {["Жизнь на стыке культур", "Межкультурные отношения", "Конфликт ценностей", "Религиозный контекст"].map((t) => (
                    <span key={t} className="rounded-full border border-ink/15 bg-paper/70 px-3.5 py-1.5 text-[12.5px] font-bold text-ink-soft">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}
