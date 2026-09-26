import { useEffect, useRef, type CSSProperties } from "react";
import { IMG } from "../lib/db";
import { IconArrow } from "./icons";

/* Медитативное кольцо вокруг фото: тонкие концентрические линии
   вращаются с разной скоростью. Золотые точки-маркеры на кольце
   расставлены по диагоналям (бывшие основные слова) и в свободных
   точках окружности (верх, право, низ). Слов-надписей на орбите нет. */
const MARKER_ANGLES = [45, 135, 225, 315];
const DOT_ANGLES = [0, 90, 180];

function OrbitRing() {
  return (
    <div
      className="pointer-events-none absolute -inset-[8%]"
      role="img"
      aria-label="ДАО-практики, Кундалини-йога, Мультикультурный подход, Гештальт-терапия, Mindfulness"
    >
      {/* пунктирное кольцо — полный оборот за 28 секунд */}
      <svg className="orbit-spin absolute inset-0 h-full w-full text-ink/40" viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="49.3" stroke="currentColor" strokeWidth="0.28" strokeDasharray="0.1 2.2" strokeLinecap="round" />
        {MARKER_ANGLES.map((a) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={a} cx={50 + 49.3 * Math.sin(rad)} cy={50 - 49.3 * Math.cos(rad)} r="0.5" fill="#a08149" fillOpacity="0.8" />;
        })}
        {DOT_ANGLES.slice(0, 4).map((a) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={`x-${a}`} cx={50 + 49.3 * Math.sin(rad)} cy={50 - 49.3 * Math.cos(rad)} r="0.3" fill="#a08149" fillOpacity="0.45" />;
        })}
      </svg>

      {/* золотая дуга — вращается в противоположную сторону, 46 секунд */}
      <div className="orbit-spin-rev absolute inset-[2.6%]" aria-hidden>
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
          <circle cx="50" cy="50" r="48.6" stroke="#a08149" strokeOpacity="0.5" strokeWidth="0.55" strokeLinecap="round" strokeDasharray="24 281" />
        </svg>
      </div>
    </div>
  );
}

/* Над верхней границей круга — сменяющиеся фразы-подписи («гештальт-терапия»
   и «мультикультурный подход»): появляются и исчезают по очереди, CSS-анимация
   phrase-cycle (см. index.css). Блок центрирован по горизонтали относительно
   круга; нижний край блока отстоит от верха орбитального кольца на ~3.5% ширины
   плюс фиксированные 10px (дополнительный подъём фраз). */
const PHRASES = ["гештальт-терапия", "мультикультурный подход"];

function PhraseCycle() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-full z-10 mb-[calc(3.5%+10px)] flex justify-center" aria-hidden>
      {/* нулевой по высоте контейнер — обе фразы занимают одно место,
          видимость переключает анимация */}
      <div className="relative h-0 w-0">
        <span className="phrase-cycle absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-[clamp(11px,1.4vw,15px)] font-medium uppercase tracking-[0.28em] text-gold-deep">
          {PHRASES[0]}
        </span>
        <span className="phrase-cycle-delayed absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap font-body text-[clamp(11px,1.4vw,15px)] font-medium uppercase tracking-[0.28em] text-gold-deep">
          {PHRASES[1]}
        </span>
      </div>
    </div>
  );
}

/* Визуал — круг целостности: дышащий градиент, фото и вращающиеся кольца.
   Вынесен в отдельный компонент, чтобы его можно было разместить в двух местах:
   на мобильных — сразу после заголовка hero,
   на десктопе — в правой колонке сетки hero.
   scale — дополнительный масштаб (на мобильных уменьшен сильнее, чтобы вместе
   с фразами над кругом весь элемент гарантированно помещался в границы экрана).
   Точная геометрия выступающих частей (в долях ширины круга W):
   - кольцо-орбита: inset -8%, пунктир r=49.3/50 → край кольца ≈ 49.73%·W;
   - «дышащий» фон: inset -7% + scale(1.05) → 2.5% сверху и снизу;
   - фразы над кругом: занимают полосу ≈ от -26% до -14% от верха круга
     (отступ mb-[3.5%] от верхней границы орбиты + высота строки ~12%·W).
   Отступы ниже подобраны так, чтобы весь элемент (кольца + фразы)
   целиком оставался внутри границ сайта, а все круги имели общий центр. */
function HeroVisual({
  className,
  scale = 1,
  wrapperStyle,
}: {
  className?: string;
  scale?: number;
  wrapperStyle?: CSSProperties;
}) {
  return (
    <div
      className="relative mx-auto w-full"
      style={{ ...wrapperStyle } as CSSProperties}
    >
      {/* вертикальный резерв: только для мобильной копии (scale < 1);
          сверху — с запасом под фразы над кругом;
          на десктопе отступы не нужны — там достаточно места в колонке */}
      {scale !== 1 && <div aria-hidden className="pt-[28%]" />}
      <div
        className={`aspect-square transition-transform duration-500 ease-out ${className ?? ""}`}
        style={{ transform: `scale(${scale}) translate(calc(var(--px, 0) * 16px), calc(var(--py, 0) * 16px))` }}
      >
        <div className="breathe absolute inset-[-7%] rounded-full bg-[radial-gradient(circle_at_38%_30%,#e9e4d9_0%,#ddd7ca_60%,#d3ccbd_100%)]" />
        <div className="absolute inset-0 overflow-hidden rounded-full border border-ink/15 shadow-[0_50px_90px_-40px_rgba(35,33,29,0.45)]">
          <img
            src={IMG.hero}
            alt="Инструктор в белом, видна со спины, волосы собраны в пучок — в светлой студии"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>

        {/* вращающееся пунктирное кольцо с золотыми точками и дугой */}
        <OrbitRing />

        {/* сменяющиеся фразы над верхней границей элемента */}
        <PhraseCycle />
      </div>
      {scale !== 1 && <div aria-hidden className="pb-[12%]" />}
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  /* лёгкий параллакс от мыши (только десктоп: на сенсорных экранах — статично) */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse), (hover: none)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
      el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    /* overflow-hidden убран: на мобильных он обрезал круговые эффекты
       визуала, которые выступают за границы блока (см. отступы ниже) */
    <section id="top" ref={ref} className="relative pt-32 sm:pt-36">
      {/* фоновые тона — с изоляцией, чтобы блюр не лез в другие секции;
          снизу смещаем их вверх, чтобы они не выходили за блок hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 bottom-24 isolate -z-10 overflow-hidden">
        <div className="absolute -top-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-stone blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-[420px] w-[420px] rounded-full bg-[#e7e3d8] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 pt-10 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Текст */}
          <div className="lg:col-span-7">
            {/* Плашка-статус: статичная, без анимации */}
            <div className="flex flex-wrap items-baseline gap-y-2 text-[12.5px] font-bold uppercase leading-relaxed tracking-[0.12em] text-ink-soft md:text-[14.5px] md:tracking-[0.14em] [text-shadow:0_1px_10px_rgba(244,241,234,0.9)]">
              <span>Онлайн и очно</span>
              <span aria-hidden="true" className="mx-3 text-gold">·</span>
              <span>Пространство баланса</span>
            </div>

            <h1
              className="fadeup mt-8 font-display font-medium text-[clamp(34px,5vw,64px)] leading-[1.05] tracking-[-0.015em] lg:mt-0"
              style={{ animationDelay: "100ms" }}
            >
              Провожу сквозь лабиринты ума&nbsp;и&nbsp;тела&nbsp;—{" "}
              <span className="italic text-gold-deep">к тишине, опоре</span> и&nbsp;созидательной силе
            </h1>

            {/* Мобильная версия: круговые эффекты сразу после заголовка
                «Провожу сквозь лабиринты ума и тела — к тишине, опоре и созидательной силе».
                Полностью идентичны десктопной версии: общий центр всех колец,
                вращение (пунктирное кольцо с точками, золотая дуга), фразы над кругом.
                Горизонталь: width = 100% − 2·gutter; при scale 0.8 выступ
                колец с запасом помещается в боковые поля px-5, поэтому весь
                элемент целиком остаётся внутри границ сайта слева и справа.
                На десктопе скрыт (визуал — в правой колонке сетки ниже) */}
            <div className="fadeup lg:hidden" style={{ animationDelay: "160ms" }}>
              <HeroVisual
                scale={0.8}
                wrapperStyle={{ width: "min(calc(100% - 2.5rem), calc(100vw - 4.5rem))" }}
              />
            </div>

            <p className="fadeup mt-7 max-w-xl text-[16px] sm:text-[17px] font-medium leading-relaxed text-ink" style={{ animationDelay: "200ms" }}>
              Распаковка психо-эмоциональных зажимов. Раскрытие внутренних ресурсов — для полноты и яркости жизни.
            </p>

            {/* ТЕЛО • ЧУВСТВА • РАЗУМ • ДУХ — единый графитовый тон */}
            <div className="fadeup mt-9 border-y border-line py-4" style={{ animationDelay: "280ms" }}>
              <p className="flex flex-wrap items-baseline gap-y-1 font-display text-[clamp(17px,2.2vw,24px)] font-semibold uppercase tracking-[0.22em] text-ink/90">
                {["Тело", "Чувства", "Разум", "Дух"].map((w, i) => (
                  <span key={w} className="flex items-baseline">
                    {i > 0 && <span className="mx-4 text-[0.55em] leading-none text-ink/35">•</span>}
                    {w}
                  </span>
                ))}
              </p>
            </div>

            <p className="fadeup mt-7 max-w-xl text-[14px] leading-relaxed text-ink-soft" style={{ animationDelay: "340ms" }}>
              Интегративный подход: гештальт-терапия, телесно-ориентированные практики, mindfulness,
              кундалини-йога, ДАО-практики. Более <b className="font-semibold text-ink">20 лет личной практики</b>.
              Бережность к вашему культурному коду.
            </p>

            <div className="fadeup mt-10 flex flex-wrap items-center gap-5" style={{ animationDelay: "420ms" }}>
              <a
                href="#services"
                className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-8 py-4 text-[13px] font-bold tracking-[0.14em] uppercase text-card transition-all duration-300 hover:-translate-y-1 hover:bg-gold-deep hover:shadow-[0_22px_44px_-16px_rgba(138,109,60,0.85)] sm:w-auto"
              >
                Выбрать формат
                <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
            </div>

            {/* Статы */}
            <dl className="fadeup mt-14 grid max-w-xl grid-cols-3 gap-6" style={{ animationDelay: "500ms" }}>
              {[
                { n: "20+", t: "лет личной практики трансперсональных методов" },
                { n: "≈5", t: "лет бережной работы с клиентами" },
                { n: "4", t: "уровня работы: тело, чувства, разум, дух" },
              ].map((s) => (
                <div key={s.n} className="border-l border-line pl-4">
                  <dt className="font-display text-[34px] font-medium leading-none">{s.n}</dt>
                  <dd className="mt-2 text-[11.5px] leading-snug font-medium text-ink-soft">{s.t}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Визуал — круг целостности (десктоп). На мобильных скрыт:
              тот же элемент показан выше, после заголовка */}
          <div className="hidden lg:col-span-5 lg:block">
            <HeroVisual />
          </div>
        </div>
      </div>

    </section>
  );
}
