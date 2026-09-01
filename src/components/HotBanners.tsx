import { Enso, IconArrow, YinYang } from "./icons";
import { prefillService, Reveal } from "./ui";

export default function HotBanners() {
  return (
    <section aria-label="Горячие предложения" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-5 px-5 sm:px-8">
        {/* Баннер 1 — глубокий графит, лид-предложение */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-[34px] bg-ink px-8 py-10 text-card sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-gold/12 blur-2xl transition-transform duration-700 group-hover:scale-110" />
            <Enso className="pointer-events-none absolute -right-16 top-1/2 h-72 w-72 -translate-y-1/2 text-card/12 transition-transform duration-[1.6s] ease-out group-hover:rotate-45 sm:h-96 sm:w-96" strokeWidth={1.4} />

            <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="inline-flex items-center gap-2.5 rounded-full border border-gold/55 px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-70" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  Идёт набор
                </p>
                <h3 className="mt-5 font-display text-[clamp(28px,4.2vw,50px)] font-medium leading-[1.04]">
                  Мини-группа <span className="italic text-gold">ПРО|БАЛАНС</span>
                </h3>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-card/75">
                  Пространство для регулярной практики и восстановления баланса. Интегративные
                  практики, дыхание, телесная работа — в мягком ритме и поддерживающей атмосфере.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-card/25 px-4 py-2 text-[12px] font-bold text-card/85">
                    <span className="animate-ping inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                    Количество мест ограничено
                  </span>
                  <span className="rounded-full border border-card/25 px-4 py-2 text-[12px] font-bold text-card/85">1 раз в неделю · 1,5–2 часа</span>
                  <span className="rounded-full border border-card/25 px-4 py-2 text-[12px] font-bold text-card/85">2 000 ₽ · абонемент 1 700 ₽</span>
                </div>
              </div>
              <button
                onClick={() => prefillService("Набор: мини-группа ПРО|БАЛАНС", "2 000 ₽ разовое · абонемент 6 800 ₽")}
                className="group/btn inline-flex w-max items-center gap-3 rounded-full bg-gold px-8 py-5 text-[13px] font-extrabold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-[0_24px_48px_-18px_rgba(160,129,73,0.9)] lg:self-center"
              >
                Записаться в группу
                <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Баннеры 2 и 3 — песок и бронза */}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Баннер 2 — тёплый песок */}
          <Reveal delay={120}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-[34px] border border-ink/12 bg-[#ddd1b8] px-8 py-9 text-ink transition-transform duration-500 hover:-translate-y-1 sm:px-10 sm:py-10">
              <YinYang className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 opacity-[0.16] transition-transform duration-[1.4s] ease-out group-hover:rotate-90" />
              <p className="inline-flex w-max items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-gold">
                Открыт набор
              </p>
              <h3 className="mt-4 font-display text-[clamp(24px,2.6vw,34px)] font-medium leading-tight">
                Терапевтическая <span className="italic">мини-группа</span>
              </h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-ink/70">
                Глубинная работа в поддерживающем круге. 1 раз в 2 недели, 4 часа — с перерывом на чай.
              </p>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="font-display text-[clamp(34px,3.4vw,44px)] font-semibold leading-none">8 000 ₽</span>
                <span className="text-[12.5px] font-bold text-ink/60">абонемент · 4 встречи<br />(2 000 ₽/встреча вместо 2 500 ₽)</span>
              </div>
              <div className="mt-auto pt-7">
                <button
                  onClick={() => prefillService("Терапевтическая мини-группа", "абонемент 8 000 ₽ за 4 встречи")}
                  className="group/btn inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-card transition-all duration-300 hover:gap-4 hover:bg-gold-deep hover:shadow-[0_22px_44px_-18px_rgba(138,109,60,0.9)]"
                >
                  Занять место
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Баннер 3 — глубокая бронза */}
          <Reveal delay={220}>
            <div id="corp-course" className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[34px] bg-gold-deep px-8 py-9 text-card transition-transform duration-500 hover:-translate-y-1 sm:px-10 sm:py-10">
              <span className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[200px] font-light italic leading-none text-card/10 transition-transform duration-[1.4s] ease-out group-hover:-rotate-6">
                10
              </span>
              <p className="inline-flex w-max items-center gap-2 rounded-full border border-card/40 px-3.5 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-card/90">
                Для компаний
              </p>
              <h3 className="mt-4 font-display text-[clamp(24px,2.6vw,34px)] font-medium leading-tight">
                Mindfulness <span className="italic">для команд</span>
              </h3>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-card/80">
                Курс из 10 встреч для бизнеса: снижение стресса, улучшение концентрации, здоровая
                атмосфера в коллективе. Онлайн или в вашем офисе.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-card/35 px-3.5 py-1.5 text-[11.5px] font-bold text-card/85">10 встреч</span>
                <span className="rounded-full border border-card/35 px-3.5 py-1.5 text-[11.5px] font-bold text-card/85">под ключ для коллектива</span>
                <span className="rounded-full border border-card/35 px-3.5 py-1.5 text-[11.5px] font-bold text-card/85">стоимость — по запросу</span>
              </div>
              <div className="mt-auto pt-7">
                <button
                  onClick={() => prefillService("Mindfulness-курс для компаний (10 встреч)", "стоимость по запросу")}
                  className="group/btn inline-flex items-center gap-3 rounded-full bg-card px-7 py-4 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:gap-4 hover:bg-ink hover:text-card"
                >
                  Узнать подробнее для компании
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
