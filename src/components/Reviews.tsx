import { useEffect, useRef, useState } from "react";
import { Reveal, SectionHead } from "./ui";

const GROUPS: { title: string; chip: string; reviews: { name: string; text: string }[] }[] = [
  {
    title: "Терапевтическая сессия",
    chip: "индивидуально",
    reviews: [
      { name: "Марина", text: "Я пришла с полной кашей в голове и ощущением, что всё валится из рук. Уже после второй встречи стало легче дышать. Валерия не даёт советов, но рядом с ней начинаешь слышать себя. Очень бережно и глубоко." },
      { name: "Евгений", text: "Скептически относился к терапии, но решил попробовать. Оказалось, что разговор может быть не просто словами, а настоящей работой. Через месяц заметил, что меньше срываюсь на близких. Спасибо за атмосферу доверия." },
      { name: "Лада", text: "Терапия с Валерией — это про то, чтобы снова почувствовать себя живой. Она удивительно точно чувствует, когда нужно помолчать, а когда задать тот самый вопрос. Я стала лучше понимать свои желания и границы." },
    ],
  },
  {
    title: "Терапевтическая группа",
    chip: "мини-группа",
    reviews: [
      { name: "Людмила", text: "Группа — это особенное пространство. Сначала было страшно открываться, но поддержка участников и бережность Валерии сделали своё дело. Я впервые за долгое время почувствовала, что не одна. Каждая встреча — как глоток свежего воздуха." },
      { name: "Настя", text: "Для меня группа стала местом, где можно быть собой без оценки. Валерия создаёт невероятно тёплую атмосферу, и даже сложные темы обсуждаются безопасно. Я стала спокойнее и увереннее." },
    ],
  },
  {
    title: "ПРО|БАЛАНС",
    chip: "индивидуальная практика",
    reviews: [
      { name: "Карина", text: "После индивидуальной практики ПРО|БАЛАНС я впервые за долгое время почувствовала, как напряжение уходит из плеч и спины. Это не просто физическая разгрузка — внутри стало тихо и ясно. Очень рекомендую тем, кто устал от суеты." },
      { name: "Женя", text: "Я не ожидала, что работа с телом может так глубоко затрагивать эмоции. Валерия ведёт очень мягко, но при этом эффективно. После сессии появилось ощущение, будто внутри включили свет. Ушла тревога, вернулась энергия." },
    ],
  },
  {
    title: "ДАО-практика",
    chip: "индивидуально",
    reviews: [
      { name: "Елена", text: "ДАО-комплекс «Чун-Лэй» — это нечто удивительное. Я не очень понимала, чего ожидать, но во время практики почувствовала волны энергии, которые раньше не замечала. Тело стало более живым, а мысли — ясными. Валерия — чуткий проводник." },
      { name: "Марина", text: "После индивидуальной ДАО-практики у меня будто открылось второе дыхание. Ушло чувство хронической усталости, появилась лёгкость в движениях. Это очень глубокий и бережный метод, и Валерия им владеет мастерски." },
    ],
  },
  {
    title: "ДАО-вечер",
    chip: "групповой",
    reviews: [
      { name: "Евгения", text: "Групповой ДАО-вечер прошёл волшебно. Было ощущение, что мы все настроились на одну волну. Валерия создала пространство, где легко расслабиться и довериться. После практики — умиротворение и прилив сил." },
      { name: "Людмила", text: "Очень понравился формат групповой работы. Чувствовалась поддержка, но при этом каждый мог идти в своём ритме. Валерия объясняла всё понятно и бережно. Ушла с чувством лёгкости и благодарности." },
    ],
  },
];

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const g = GROUPS[active];
  const total = GROUPS.reduce((n, x) => n + x.reviews.length, 0);
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* На мобильных активное направление всегда видно: плавно центрируем его в ленте */
  useEffect(() => {
    const btn = btnRefs.current[active];
    const list = listRef.current;
    if (!btn || !list || typeof window === "undefined" || window.innerWidth >= 1024) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = btn.offsetLeft - (list.clientWidth - btn.clientWidth) / 2;
    list.scrollTo({ left: Math.max(0, target), behavior: reduced ? "auto" : "smooth" });
  }, [active]);

  return (
    <div className="mt-16 sm:mt-24">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <SectionHead
              kicker="Отзывы"
              title={
                <>
                  Слова тех, кто обрёл <span className="italic text-gold-deep">свой баланс</span>
                </>
              }
            />
            <Reveal delay={180}>
              <p className="mt-5 text-[12.5px] font-bold uppercase tracking-[0.18em] text-ink-faint">
                {total} отзывов · {GROUPS.length} направлений
              </p>
            </Reveal>
            {/* Переключатель направлений: на мобильных — горизонтальная прокрутка со снапом */}
            <Reveal delay={240}>
              <div className="relative -mx-5 mt-6 w-screen max-w-[100vw] lg:mx-0 lg:w-auto lg:max-w-none">
                <div
                  ref={listRef}
                  className="scroll-ribbon flex w-full max-w-full snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-2 lg:flex-col lg:snap-none lg:gap-2.5 lg:overflow-visible lg:px-0 lg:pb-0"
                >
                  {GROUPS.map((gr, i) => (
                    <button
                      key={gr.title}
                      type="button"
                      ref={(el) => {
                        btnRefs.current[i] = el;
                      }}
                      onClick={() => setActive(i)}
                      aria-pressed={i === active}
                      className={`flex min-h-[52px] w-max shrink-0 cursor-pointer snap-center items-center gap-3 rounded-[16px] border px-4 py-3 text-left text-[13px] font-bold transition-colors duration-300 sm:px-5 lg:w-full lg:justify-between lg:gap-4 lg:transition-all ${
                        i === active
                          ? "border-ink bg-ink text-card shadow-[0_16px_32px_-20px_rgba(35,33,29,0.7)]"
                          : "border-line bg-card text-ink-soft hover:border-ink/40 hover:text-ink lg:hover:translate-x-1"
                      }`}
                    >
                      <span className="pointer-events-none whitespace-nowrap">{gr.title}</span>
                      <span
                        className={`pointer-events-none grid h-6 w-6 shrink-0 place-items-center rounded-full font-display text-[13px] italic leading-none ${
                          i === active ? "bg-gold/25 text-gold" : "bg-stone text-ink-faint"
                        }`}
                      >
                        {gr.reviews.length}
                      </span>
                    </button>
                  ))}
                </div>
                {/* градиентные подсказки, что лента прокручивается */}
                <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-stone/80 to-transparent lg:hidden" />
                <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-stone/80 to-transparent lg:hidden" />
              </div>
              <p className="mt-2 text-[11px] font-semibold text-ink-faint lg:hidden">листайте, чтобы увидеть все направления →</p>
            </Reveal>
          </div>
        </div>

        {/* Карточки активного направления */}
        <div className="relative min-w-0 lg:col-span-8">
          <span aria-hidden className="pointer-events-none absolute -top-8 right-0 hidden select-none font-display text-[150px] italic leading-none text-ink/6 sm:block lg:-top-10 lg:text-[200px]">
            „
          </span>
          <div className="relative w-full max-w-full space-y-3.5 sm:space-y-5">
            {g.reviews.map((r, i) => (
              <div
                key={active + "-" + r.name + i}
                className="fadeup group w-full max-w-full min-w-0 overflow-hidden rounded-[22px] border border-line bg-card/85 p-5 transition-all duration-500 hover:border-gold/60 hover:shadow-[0_30px_60px_-36px_rgba(35,33,29,0.5)] sm:rounded-[24px] sm:p-8 lg:hover:-translate-y-1"
                style={{ animationDelay: `${i * 130}ms` }}
              >
                <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-1.5 sm:gap-x-4 sm:gap-y-2">
                  <h3 className="font-display text-[18px] font-semibold text-gold-deep sm:text-[21px]">{g.title}</h3>
                  <span className="rounded-full border border-ink/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-faint sm:text-[10.5px]">
                    {g.chip}
                  </span>
                </div>
                <p className="mt-3 w-full text-[14px] leading-relaxed text-ink [overflow-wrap:anywhere] sm:mt-3.5 sm:text-[14.5px]">{r.text}</p>
                <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-display text-[15px] italic text-gold">
                    {r.name[0]}
                  </span>
                  <span className="text-[13.5px] font-extrabold">{r.name}</span>
                  <span className="text-[12px] font-medium text-ink-faint">· клиент(ка) Валерии</span>
                </p>
              </div>
            ))}
          </div>
          <Reveal delay={260}>
            <p className="mt-6 text-[12px] font-medium text-ink-faint">
              Все имена изменены, отзывы публикуются с разрешения клиентов.
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
