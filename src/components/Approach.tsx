import { useStore } from "../lib/store";
import { Enso, YinYang } from "./icons";
import { Reveal, SectionHead } from "./ui";

const LEVELS = [
  { n: "I", w: "Тело", d: "Зажимы, напряжение, усталость. Возвращаем телу лёгкость и текучесть." },
  { n: "II", w: "Чувства", d: "Право чувствовать. Бережный контакт с тем, что долго откладывалось." },
  { n: "III", w: "Разум", d: "Ясность вместо лабиринта. Наблюдение без осуждения и спешки." },
  { n: "IV", w: "Дух", d: "Опора и смысл. Связь с собственной природной мудростью." },
];

const METHODS = [
  {
    n: "01",
    t: "Гештальт-терапия",
    d: "Помогает осознать и завершить незавершённые ситуации, восстановить контакт с собой и миром. Бережный метод, возвращающий чувствам право на существование и строящий здоровые отношения.",
  },
  {
    n: "02",
    t: "Телесно-ориентированные практики",
    d: "Освобождают психоэмоциональные зажимы, накопленные в теле. Через движение, дыхание и внимание снимаем хроническое напряжение и открываем доступ к жизненной энергии.",
  },
  {
    n: "03",
    t: "Mindfulness и медитация",
    d: "Развивают навык присутствия и безоценочного наблюдения. Снижают тревогу, улучшают концентрацию, позволяют видеть ситуации яснее.",
  },
];

export default function Approach() {
  const { db } = useStore();

  return (
    <section id="approach" className="relative bg-stone/45 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          kicker="Подход"
          title={
            <>
              Четыре уровня <span className="italic text-gold-deep">целостности</span>
            </>
          }
          sub="Человек многомерен. Работа ведётся на всех уровнях: тело, чувства, разум, дух. Дисбаланс в одном отражается на остальных."
        />

        {/* Четыре уровня */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {LEVELS.map((l, i) => (
            <Reveal key={l.n} delay={i * 100} className="h-full">
              <div className="group h-full bg-card p-7 transition-colors duration-500 hover:bg-ink">
                <p className="font-display text-[46px] font-light leading-none text-gold/60 transition-colors duration-500 group-hover:text-gold">
                  {l.n}
                </p>
                <h3 className="mt-5 font-display text-[24px] font-semibold">{l.w}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-ink-soft transition-colors duration-500 group-hover:text-card/70">
                  {l.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Три метода: sticky-левая колонка */}
        <div className="mt-24 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Reveal>
                <p className="flex items-center gap-3 text-[11px] font-bold tracking-[0.32em] uppercase text-gold-deep">
                  <span className="h-px w-10 bg-current opacity-60" />
                  Методы
                </p>
                <h3 className="mt-5 font-display text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.08]">
                  Три пути — <span className="italic text-gold-deep">одна цель</span>
                </h3>
                <p className="mt-5 text-[14.5px] leading-relaxed text-ink-soft">
                  Методы дополняют друг друга: разговор с чувствами, работа с телом и тренировка
                  присутствия. Пропорции подбираются под вас.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <YinYang className="h-12 w-12" />
                  <p className="text-[12.5px] font-semibold leading-snug text-ink-faint">
                    Равновесие сердца и разума —<br />внутренняя ось всей работы
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="space-y-5">
              {METHODS.map((m, i) => (
                <Reveal key={m.n} delay={i * 110}>
                  <div className="group flex gap-7 rounded-[24px] border border-line bg-card p-7 transition-all duration-500 hover:-translate-x-0 hover:border-gold/60 hover:shadow-[0_28px_56px_-34px_rgba(35,33,29,0.4)] sm:gap-10 sm:p-9">
                    <span className="font-display text-[40px] font-light leading-none text-ink/20 transition-colors duration-500 group-hover:text-gold sm:text-[52px]">
                      {m.n}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-[20px] font-extrabold uppercase leading-[1.14] tracking-[0.045em] text-ink transition-colors duration-500 group-hover:text-gold-deep sm:text-[26px]">
                        {m.t}
                      </h4>
                      <span
                        aria-hidden
                        className="mt-3 block h-[3px] w-12 rounded-full bg-gold transition-all duration-500 ease-out group-hover:w-28 group-hover:bg-gold-deep"
                      />
                      <p className="mt-3.5 text-[14.5px] leading-relaxed text-ink-soft">{m.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>

        {/* Культурный код — преобразован в баннер "Мультикультурный подход" */}
        <Reveal delay={120}>
          <div className="relative mt-16 overflow-hidden rounded-[32px] bg-gold-deep px-7 py-12 text-card sm:px-14 sm:py-14">
            <Enso className="absolute -right-14 -top-14 h-64 w-64 text-card/12" strokeWidth={2} />
            <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <p className="font-display text-[11px] font-bold italic tracking-[0.32em] uppercase text-ink">Важно</p>
                <h3 className="mt-4 font-display text-[clamp(28px,3.2vw,42px)] font-medium leading-tight text-white">
                  Мультикультурный подход
                </h3>
                <p className="mt-3 font-display text-[16px] font-semibold italic leading-relaxed text-ink">
                  Бережность к вашему культурному коду и ценностям
                </p>
              </div>
              <div className="lg:col-span-7">
                <p className="text-[15px] leading-relaxed text-card/85">{db.content.culture.text}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {["любая культура", "любая вера", "без оценок", "ваш темп"].map((c) => (
                    <span key={c} className="rounded-full border border-card/25 px-4 py-2 text-[12px] font-bold text-card/80">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
