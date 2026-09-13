import { useState } from "react";
import { Reveal, SectionHead } from "./ui";

const REVIEW_GROUPS = [
  {
    id: "session",
    label: "Терапевтическая сессия",
    note: "индивидуальная",
    reviews: [
      { name: "Марина", text: "Я пришла с полной кашей в голове и ощущением, что всё валится из рук. Уже после второй встречи стало легче дышать. Валерия не даёт советов, но рядом с ней начинаешь слышать себя. Очень бережно и глубоко." },
      { name: "Евгений", text: "Скептически относился к терапии, но решил попробовать. Оказалось, что разговор может быть не просто словами, а настоящей работой. Через месяц заметил, что меньше срываюсь на близких. Спасибо за атмосферу доверия." },
      { name: "Лада", text: "Терапия с Валерией — это про то, чтобы снова почувствовать себя живой. Она удивительно точно чувствует, когда нужно помолчать, а когда задать тот самый вопрос. Я стала лучше понимать свои желания и границы." },
    ],
  },
  {
    id: "group",
    label: "Терапевтическая группа",
    note: "мини-группа",
    reviews: [
      { name: "Людмила", text: "Группа — это особенное пространство. Сначала было страшно открываться, но поддержка участников и бережность Валерии сделали своё дело. Я впервые за долгое время почувствовала, что не одна. Каждая встреча — как глоток свежего воздуха." },
      { name: "Настя", text: "Для меня группа стала местом, где можно быть собой без оценки. Валерия создаёт невероятно тёплую атмосферу, и даже сложные темы обсуждаются безопасно. Я стала спокойнее и увереннее." },
    ],
  },
  {
    id: "probalance",
    label: "ПРО|БАЛАНС",
    note: "индивидуальная практика",
    reviews: [
      { name: "Карина", text: "После индивидуальной практики ПРО|БАЛАНС я впервые за долгое время почувствовала, как напряжение уходит из плеч и спины. Это не просто физическая разгрузка — внутри стало тихо и ясно. Очень рекомендую тем, кто устал от суеты." },
      { name: "Женя", text: "Я не ожидала, что работа с телом может так глубоко затрагивать эмоции. Валерия ведёт очень мягко, но при этом эффективно. После сессии появилось ощущение, будто внутри включили свет. Ушла тревога, вернулась энергия." },
    ],
  },
  {
    id: "dao",
    label: "ДАО-практика",
    note: "индивидуальная",
    reviews: [
      { name: "Елена", text: "ДАО-комплекс «Чун-Лэй» — это нечто удивительное. Я не очень понимала, чего ожидать, но во время практики почувствовала волны энергии, которые раньше не замечала. Тело стало более живым, а мысли — ясными. Валерия — чуткий проводник." },
      { name: "Марина", text: "После индивидуальной ДАО-практики у меня будто открылось второе дыхание. Ушло чувство хронической усталости, появилась лёгкость в движениях. Это очень глубокий и бережный метод, и Валерия им владеет мастерски." },
    ],
  },
  {
    id: "dao-evening",
    label: "ДАО-вечер",
    note: "групповой",
    reviews: [
      { name: "Евгения", text: "Групповой ДАО-вечер прошёл волшебно. Было ощущение, что мы все настроились на одну волну. Валерия создала пространство, где легко расслабиться и довериться. После практики — умиротворение и прилив сил." },
      { name: "Людмила", text: "Очень понравился формат групповой работы. Чувствовалась поддержка, но при этом каждый мог идти в своём ритме. Валерия объясняла всё понятно и бережно. Ушла с чувством лёгкости и благодарности." },
    ],
  },
];

const TOTAL = REVIEW_GROUPS.reduce((n, g) => n + g.reviews.length, 0);

export default function ReviewsSection() {
  const [activeId, setActiveId] = useState(REVIEW_GROUPS[0].id);
  const group = REVIEW_GROUPS.find((g) => g.id === activeId) ?? REVIEW_GROUPS[0];

  return (
    <div className="mt-16 sm:mt-24 w-full">
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-12">
        {/* Заголовок + выбор направления */}
        <div className="lg:col-span-4 w-full min-w-0">
          <div className="lg:sticky lg:top-28">
            <SectionHead
              kicker="Отзывы"
              title={
                <>
                  Слова тех, кто обрёл <span className="italic text-gold-deep">свой баланс</span>
                </>
              }
              sub="Отзывы сгруппированы по направлениям — выберите то, что ближе вашему опыту."
            />
            <Reveal delay={220}>
              <p className="mt-4 sm:mt-6 text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.2em] text-ink-faint">
                {TOTAL} отзывов · 5 направлений
              </p>
            </Reveal>

            {/* Мобильные пилюли — горизонтальный скролл без выхода за границы */}
            <Reveal delay={260} className="lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-2 pt-1" style={{ scrollPadding: '0 16px' }}>
                {REVIEW_GROUPS.map((g) => {
                  const on = g.id === activeId;
                  return (
                    <button
                      key={g.id}
                      onClick={() => setActiveId(g.id)}
                      className={`shrink-0 whitespace-nowrap rounded-full border py-3 px-5 text-[13px] font-bold transition-all duration-300 min-h-[44px] ${
                        on ? "border-ink bg-ink text-card" : "border-line bg-card/70 text-ink-soft hover:border-ink/40"
                      }`}
                    >
                      {g.label} <span className={on ? "text-gold" : "text-ink-faint"}>· {g.reviews.length}</span>
                    </button>
                  );
                })}
              </div>
            </Reveal>

            {/* Десктопный вертикальный список */}
            <div className="mt-6 hidden space-y-2.5 lg:block">
              {REVIEW_GROUPS.map((g, i) => {
                const on = g.id === activeId;
                return (
                  <Reveal key={g.id} delay={240 + i * 70}>
                    <button
                      onClick={() => setActiveId(g.id)}
                      className={`group/dir flex w-full items-center gap-4 rounded-[18px] border px-5 py-3.5 text-left transition-all duration-500 ${
                        on
                          ? "border-ink bg-ink text-card shadow-[0_22px_44px_-26px_rgba(35,33,29,0.55)]"
                          : "border-line bg-card/70 hover:translate-x-1 hover:border-ink/40 hover:bg-card"
                      }`}
                    >
                      <span className="min-w-0 grow">
                        <span className="block truncate text-[14px] font-extrabold leading-tight">{g.label}</span>
                        <span className={`block text-[11px] font-bold uppercase tracking-[0.14em] ${on ? "text-gold" : "text-ink-faint"}`}>
                          {g.note}
                        </span>
                      </span>
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[12px] font-extrabold transition-colors duration-300 ${
                          on ? "bg-gold text-ink" : "bg-ink/8 text-ink-soft group-hover/dir:bg-ink group-hover/dir:text-gold"
                        }`}
                      >
                        {g.reviews.length}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* Карточки отзывов — на мобильных в одну колонку */}
        <div className="lg:col-span-8 w-full min-w-0">
          <div key={group.id} className="relative w-full">
            <span aria-hidden className="pointer-events-none absolute -top-6 right-0 select-none font-display text-[60px] italic leading-none text-ink/6 sm:-top-10 sm:text-[100px] md:text-[150px] max-w-[30%]">
              „
            </span>
            <div className="relative grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2">
              {group.reviews.map((r, i) => (
                <div
                  key={group.id + r.name + i}
                  className="fadeup flex flex-col rounded-[22px] sm:rounded-[26px] border border-line bg-card/75 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/60 hover:bg-card hover:shadow-[0_32px_64px_-36px_rgba(35,33,29,0.5)] sm:p-7 w-full"
                  style={{ animationDelay: `${i * 110}ms` }}
                >
                  <div className="flex items-baseline justify-between gap-2 sm:gap-3">
                    <p className="font-display text-[16px] sm:text-[19px] font-semibold leading-tight text-gold-deep max-w-[70%]">{group.label}</p>
                    <span className="shrink-0 rounded-full bg-ink/6 px-2.5 py-1 sm:px-3 sm:py-1.5 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-soft whitespace-nowrap">
                      {group.note}
                    </span>
                  </div>
                  <p className="mt-3 sm:mt-4 grow text-[13.5px] sm:text-[14px] leading-[1.7] sm:leading-[1.75] text-ink break-words">«{r.text}»</p>
                  <div className="mt-4 sm:mt-6 flex items-center gap-3 border-t border-dashed border-line pt-4 sm:pt-5">
                    <span className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-full bg-ink font-display text-[17px] sm:text-[19px] font-semibold text-gold">
                      {r.name[0]}
                    </span>
                    <span className="leading-tight min-w-0">
                      <span className="block text-[13px] sm:text-[14px] font-extrabold truncate">{r.name}</span>
                      <span className="block text-[10.5px] sm:text-[11.5px] font-semibold text-ink-faint">клиент Валерии</span>
                    </span>
                    <svg className="ml-auto h-4 w-4 sm:h-5 sm:w-5 text-gold/70 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M10.5 6.5c-3.2 1.4-5 4-5 7.4 0 2.3 1.4 3.8 3.3 3.8 1.7 0 3-1.3 3-3 0-1.6-1.2-2.8-2.8-2.8-.3 0-.6 0-.8.1.3-1.8 1.6-3.4 3.3-4.3l-1-1.2Zm8 0c-3.2 1.4-5 4-5 7.4 0 2.3 1.4 3.8 3.3 3.8 1.7 0 3-1.3 3-3 0-1.6-1.2-2.8-2.8-2.8-.3 0-.6 0-.8.1.3-1.8 1.6-3.4 3.3-4.3l-1-1.2Z" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 sm:mt-6 text-[10.5px] sm:text-[11.5px] font-medium text-ink-faint break-words">
              Все имена изменены, отзывы публикуются с разрешения клиентов.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
