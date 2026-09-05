import { Enso, IconArrow, YinYang } from "./icons";
import { prefillService, Reveal } from "./ui";

/* Мерцающий тег «горячего» предложения */
function HotTag({ children, tone }: { children: React.ReactNode; tone: "gold" | "ink" | "line" }) {
  const cls =
    tone === "gold"
      ? "border-gold/60 text-gold"
      : tone === "ink"
        ? "bg-ink text-gold border-transparent"
        : "border-card/40 text-card/90";
  return (
    <span className={`relative inline-flex w-max items-center gap-2.5 overflow-hidden rounded-full border px-4 py-2 text-[10.5px] font-extrabold uppercase tracking-[0.22em] ${cls}`}>
      <span aria-hidden className="tag-shine pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-card/30 to-transparent" />
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
      </span>
      {children}
    </span>
  );
}

export default function HotBanners() {
  return (
    <section aria-label="Горячие предложения" className="relative py-12 sm:py-20">
      <div className="mx-auto max-w-7xl space-y-4 sm:space-y-5 px-5 sm:px-8">
        {/* Баннер 1 — мини-группа ПРО|БАЛАНС (графит) */}
        <Reveal>
          <div className="group relative overflow-hidden rounded-[28px] sm:rounded-[34px] bg-ink px-6 py-8 text-card sm:px-12 sm:py-12">
            <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] rounded-full bg-gold/12 blur-2xl" />
            <Enso className="pointer-events-none absolute -right-14 top-1/2 hidden h-72 w-72 -translate-y-1/2 text-card/12 transition-transform duration-[1.6s] ease-out group-hover:rotate-45 sm:block sm:h-96 sm:w-96" strokeWidth={1.4} />

            <div className="relative">
              <HotTag tone="gold">Идёт набор</HotTag>
              <h3 className="mt-4 font-display text-[clamp(22px,4.2vw,50px)] font-medium leading-[1.05]">
                Мини-группа <span className="italic text-gold">ПРО|БАЛАНС</span>
              </h3>
              <p className="mt-3 max-w-xl text-[13.5px] sm:text-[15px] leading-relaxed text-card/75">
                Пространство для регулярной практики и восстановления баланса. Интегративные
                практики, дыхание, телесная работа — в мягком ритме и поддерживающей атмосфере.
              </p>

              {/* Стоимость крупно: разовая + абонемент */}
              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <div>
                  <p className="font-display text-[clamp(32px,4.5vw,46px)] font-semibold leading-none">2 000 ₽</p>
                  <p className="mt-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-card/55">разовое посещение</p>
                </div>
                <div className="rounded-[18px] border border-gold/45 bg-gold/10 px-5 py-3.5">
                  <p className="text-[14px] sm:text-[15px] font-extrabold leading-snug">
                    Абонемент · 4 занятия — 6 800 ₽
                  </p>
                  <p className="mt-1 text-[11.5px] font-semibold text-card/65">
                    1 700 ₽/занятие · вместо 8 000 ₽ при разовой оплате
                  </p>
                </div>
                <span className="rounded-full border border-card/25 px-4 py-2 text-[11.5px] font-bold text-card/85">1 раз в неделю · 1,5–2 часа</span>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button
                  onClick={() => prefillService("Набор: мини-группа ПРО|БАЛАНС", "Разовое 2 000 ₽ · Абонемент · 4 занятия — 6 800 ₽ (вместо 8 000 ₽)")}
                  className="group/btn inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-[12.5px] font-extrabold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:-translate-y-1 hover:bg-card hover:shadow-[0_24px_48px_-18px_rgba(160,129,73,0.9)] sm:w-auto"
                >
                  Записаться в группу
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </button>
                <span className="inline-flex items-center gap-2 text-[12px] font-bold text-card/60">
                  <span className="animate-ping inline-block h-1.5 w-1.5 rounded-full bg-gold" />
                  Количество мест ограничено
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Баннеры 2 и 3 */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Reveal delay={120}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] sm:rounded-[34px] border border-ink/12 bg-[#ddd1b8] px-6 py-8 text-ink transition-transform duration-500 hover:-translate-y-1 sm:px-10 sm:py-10">
              <YinYang className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 opacity-[0.16] transition-transform duration-[1.4s] ease-out group-hover:rotate-90" />
              <HotTag tone="ink">Открыт набор</HotTag>
              <h3 className="mt-4 font-display text-[clamp(22px,2.6vw,34px)] font-medium leading-tight">
                Терапевтическая <span className="italic">мини-группа</span>
              </h3>
              <p className="mt-3 max-w-md text-[13.5px] sm:text-[14px] leading-relaxed text-ink/70">
                Глубинная работа в поддерживающем круге. 1 раз в 2 недели, 4 часа — с перерывом на чай.
              </p>
              <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="font-display text-[clamp(32px,3.4vw,44px)] font-semibold leading-none">8 000 ₽</span>
                <span className="text-[12px] font-bold text-ink/60">
                  абонемент · 4 встречи<br className="hidden sm:block" /> (2 000 ₽/встреча вместо 2 500 ₽)
                </span>
              </div>
              <div className="mt-auto pt-6">
                <button
                  onClick={() => prefillService("Терапевтическая мини-группа", "абонемент 8 000 ₽ за 4 встречи")}
                  className="group/btn inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-card transition-all duration-300 hover:gap-4 hover:bg-gold-deep hover:shadow-[0_22px_44px_-18px_rgba(138,109,60,0.9)] sm:w-auto"
                >
                  Занять место
                  <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <div id="corp-course" className="group relative flex h-full scroll-mt-28 flex-col overflow-hidden rounded-[28px] sm:rounded-[34px] bg-gold-deep px-6 py-8 text-card transition-transform duration-500 hover:-translate-y-1 sm:px-10 sm:py-10">
              <span className="pointer-events-none absolute -right-6 -top-10 select-none font-display text-[160px] sm:text-[200px] font-light italic leading-none text-card/10 transition-transform duration-[1.4s] ease-out group-hover:-rotate-6">
                10
              </span>
              <HotTag tone="line">Для компаний</HotTag>
              <h3 className="mt-4 font-display text-[clamp(22px,2.6vw,34px)] font-medium leading-tight">
                Mindfulness <span className="italic">для команд</span>
              </h3>
              <p className="mt-3 max-w-md text-[13.5px] sm:text-[14px] leading-relaxed text-card/80">
                Курс из 10 встреч для бизнеса: снижение стресса, улучшение концентрации, здоровая
                атмосфера в коллективе. Онлайн или в вашем офисе.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-card/35 px-3.5 py-1.5 text-[11px] font-bold text-card/85">10 встреч</span>
                <span className="rounded-full border border-card/35 px-3.5 py-1.5 text-[11px] font-bold text-card/85">под ключ для коллектива</span>
                <span className="rounded-full border border-card/35 px-3.5 py-1.5 text-[11px] font-bold text-card/85">стоимость — по запросу</span>
              </div>
              <div className="mt-auto pt-6">
                <button
                  onClick={() => prefillService("Mindfulness-курс для компаний (10 встреч)", "стоимость по запросу")}
                  className="group/btn inline-flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-card px-7 py-4 text-[12px] font-extrabold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:gap-4 hover:bg-ink hover:text-card sm:w-auto"
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
