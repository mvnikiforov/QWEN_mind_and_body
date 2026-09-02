import { useEffect, useRef, useState, type ReactNode } from "react";
import { IMG } from "../lib/db";
import { Enso, IconArrow, YinYang } from "./icons";

const STRIP = "тело • чувства • разум • дух • тишина • опора • ясность • ";

/* Медитативное кольцо вокруг фото: тонкие концентрические линии
   вращаются с разной скоростью. Основные слова (тело, чувства,
   разум, дух) поочерёдно всплывают по диагоналям примерно каждые
   2 секунды; дополнительные — реже, в свободных точках окружности
   (верх, право, низ, лево), не перекрывая основные. */
const MAIN_WORDS = ["тело", "чувства", "разум", "дух"];
const MAIN_ANGLES = [45, 135, 225, 315];
const EXTRA_WORDS = ["ДАО-практики", "кундалини", "терапия", "мультикультурный подход", "mindfulness"];
const EXTRA_ANGLES = [0, 90, 180, 270, 0];

function OrbitWord({
  angle,
  on,
  big,
  children,
}: {
  angle: number;
  on: boolean;
  big?: boolean;
  children: ReactNode;
}) {
  /* боковые точки скрываем на мобильных — длинные слова не вылезают за экран */
  const side = angle === 90 || angle === 270;
  return (
    <div className={`absolute inset-0 ${side ? "hidden md:block" : ""}`} style={{ transform: `rotate(${angle}deg)` }} aria-hidden>
      <span
        className={`absolute left-1/2 top-0 flex items-center gap-2 whitespace-nowrap transition-all ease-[cubic-bezier(0.22,1,0.36,1)] ${
          big
            ? "duration-700 font-display text-[13.5px] italic tracking-[0.08em] text-ink/90 sm:text-[16.5px]"
            : "duration-[1200ms] text-[9.5px] font-bold uppercase tracking-[0.22em] text-ink-soft/90 sm:text-[11px]"
        } ${on ? "opacity-100 [text-shadow:0_1px_14px_rgba(244,241,234,0.95)]" : "opacity-0"}`}
        style={{ transform: `translate(-50%, calc(-50% + ${on ? "-7px" : "9px"})) rotate(${-angle}deg)` }}
      >
        <i
          className={`rounded-full bg-gold transition-transform duration-700 ${
            big ? "h-1.5 w-1.5" : "h-1 w-1 opacity-70"
          } ${on ? "scale-100" : "scale-0"}`}
        />
        {children}
      </span>
    </div>
  );
}

function OrbitWords() {
  const [main, setMain] = useState(0);
  const [extra, setExtra] = useState(-1);
  const [staticAll, setStaticAll] = useState(false);

  useEffect(() => {
    /* Сенсорные устройства и reduced motion — полностью статичное кольцо */
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse), (hover: none)").matches) {
      setStaticAll(true);
      return;
    }
    const t1 = window.setInterval(() => setMain((m) => (m + 1) % MAIN_WORDS.length), 2000);
    const t2 = window.setInterval(() => setExtra((x) => (x + 1) % EXTRA_WORDS.length), 4000);
    return () => {
      window.clearInterval(t1);
      window.clearInterval(t2);
    };
  }, []);

  return (
    <div
      className="pointer-events-none absolute -inset-[5%] sm:-inset-[7%]"
      role="img"
      aria-label="Тело, чувства, разум, дух. ДАО-практики, кундалини, терапия, мультикультурный подход, mindfulness"
    >
      {/* пунктирное кольцо — полный оборот за 28 секунд */}
      <svg className="orbit-spin absolute inset-0 h-full w-full text-ink/40" viewBox="0 0 100 100" fill="none" aria-hidden>
        <circle cx="50" cy="50" r="49.3" stroke="currentColor" strokeWidth="0.28" strokeDasharray="0.1 2.2" strokeLinecap="round" />
        {MAIN_ANGLES.map((a) => {
          const rad = (a * Math.PI) / 180;
          return <circle key={a} cx={50 + 49.3 * Math.sin(rad)} cy={50 - 49.3 * Math.cos(rad)} r="0.5" fill="#a08149" fillOpacity="0.8" />;
        })}
        {EXTRA_ANGLES.slice(0, 4).map((a) => {
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

      {/* основные слова — по диагоналям, каждые 2 секунды */}
      {MAIN_WORDS.map((w, i) => (
        <OrbitWord key={w} angle={MAIN_ANGLES[i]} on={staticAll || main === i} big>
          {w}
        </OrbitWord>
      ))}

      {/* дополнительные — реже, в свободных точках, вторичным стилем */}
      {EXTRA_WORDS.map((w, i) => (
        <OrbitWord key={w} angle={EXTRA_ANGLES[i]} on={staticAll ? i < 4 : extra === i}>
          {w}
        </OrbitWord>
      ))}
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
    <section id="top" ref={ref} className="relative overflow-hidden pt-32 sm:pt-36">
      {/* фоновые тона */}
      <div className="pointer-events-none absolute -top-32 right-[-10%] h-[560px] w-[560px] rounded-full bg-stone blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -left-40 h-[420px] w-[420px] rounded-full bg-[#e7e3d8] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-12">
          {/* Текст */}
          <div className="lg:col-span-7">
            {/* Плашка-статус: статичная, без анимации */}
            <div className="flex flex-wrap items-baseline gap-y-2 text-[12.5px] font-bold uppercase leading-relaxed tracking-[0.12em] text-ink-soft md:text-[14.5px] md:tracking-[0.14em]">
              <span>Онлайн и очно</span>
              <span aria-hidden="true" className="mx-3 text-gold">·</span>
              <span>Доступно</span>
              <span aria-hidden="true" className="mx-3 text-gold">·</span>
              <span>Пространство баланса</span>
            </div>

            <h1
              className="fadeup mt-8 font-display font-medium text-[clamp(34px,5vw,64px)] leading-[1.05] tracking-[-0.015em]"
              style={{ animationDelay: "100ms" }}
            >
              Провожу сквозь лабиринты ума&nbsp;и&nbsp;тела&nbsp;—{" "}
              <span className="italic text-gold-deep">к тишине, опоре</span> и&nbsp;созидательной силе
            </h1>

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
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-[13px] font-bold tracking-[0.14em] uppercase text-card transition-all duration-300 hover:-translate-y-1 hover:bg-gold-deep hover:shadow-[0_22px_44px_-16px_rgba(138,109,60,0.85)]"
              >
                Выбрать формат
                <IconArrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <a href="#schedule" className="link-grow text-[13px] font-bold tracking-[0.14em] uppercase text-ink-soft transition-colors hover:text-ink">
                Афиша встреч ↓
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

          {/* Визуал — круг целостности */}
          <div className="lg:col-span-5">
            <div
              className="relative mx-auto aspect-square max-w-[460px] transition-transform duration-500 ease-out"
              style={{ transform: "translate(calc(var(--px, 0) * 16px), calc(var(--py, 0) * 16px))" }}
            >
              <div className="breathe absolute inset-[-7%] rounded-full bg-[radial-gradient(circle_at_38%_30%,#e9e4d9_0%,#ddd7ca_60%,#d3ccbd_100%)]" />
              <Enso className="spin-slow absolute inset-[-13%] text-ink/30" strokeWidth={1} />
              <div className="absolute inset-0 overflow-hidden rounded-full border border-ink/15 shadow-[0_50px_90px_-40px_rgba(35,33,29,0.45)]">
                <img
                  src={IMG.hero}
                  alt="Инструктор в белом, видна со спины, волосы собраны в пучок — в светлой студии"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>

              {/* вращающееся кольцо со словами */}
              <OrbitWords />

              {/* инь-ян на границе круга */}
              <div className="floaty absolute -top-5 left-[6%]">
                <YinYang className="h-12 w-12 drop-shadow-[0_12px_24px_rgba(35,33,29,0.25)]" />
              </div>

              {/* подписи */}
              <div className="floaty absolute -right-2 top-[30%] rounded-full border border-line bg-card/90 px-4 py-2 text-[11.5px] font-bold tracking-[0.08em] uppercase text-ink-soft shadow-sm backdrop-blur" style={{ animationDelay: "1.4s" }}>
                кундалини-йога
              </div>
              <div className="floaty absolute -left-6 top-[58%] rounded-full border border-line bg-card/90 px-4 py-2 text-[11.5px] font-bold tracking-[0.08em] uppercase text-ink-soft shadow-sm backdrop-blur" style={{ animationDelay: "0.7s" }}>
                ДАО-практики
              </div>

              {/* мини-оффер */}
              <a
                href="#contact"
                className="group absolute -bottom-5 left-1/2 flex w-[86%] -translate-x-1/2 items-center gap-3.5 rounded-full border border-line bg-card/95 py-3 pl-4 pr-5 shadow-[0_28px_56px_-24px_rgba(35,33,29,0.5)] backdrop-blur transition-all duration-300 hover:border-gold"
              >
                <span className="ink-pulse h-2 w-2 shrink-0 rounded-full bg-moss" />
                <span className="leading-tight">
                  <span className="block text-[12.5px] font-extrabold">Первая встреча — знакомство</span>
                  <span className="block text-[11px] font-medium text-ink-soft">провожу сквозь лабиринты — бережно и без спешки</span>
                </span>
                <IconArrow className="ml-auto h-4 w-4 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-gold-deep" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* медленная строка-мантра */}
      <div className="relative mt-20 border-t border-line py-5 sm:mt-24" aria-hidden>
        <div className="flex overflow-hidden">
          <div className="marquee-track-l flex shrink-0 whitespace-nowrap">
            {[0, 1].map((k) => (
              <span key={k} className="word-outline pr-8 font-display text-[clamp(30px,5vw,60px)] font-medium uppercase tracking-[0.14em] text-ink/25">
                {STRIP.repeat(3)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
