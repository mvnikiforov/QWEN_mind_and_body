import { useEffect, useRef } from "react";
import { IMG } from "../lib/db";
import { Enso, IconArrow, YinYang } from "./icons";

const STRIP = "тело • чувства • разум • дух • тишина • опора • ясность • ";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  /* лёгкий параллакс от мыши */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
            <div className="fadeup flex flex-wrap items-center gap-x-3 gap-y-2 text-[11.5px] font-bold tracking-[0.2em] uppercase text-ink-soft">
              {["Онлайн и очно", "Доступные цены", "Пространство баланса"].map((b, i) => (
                <span key={b} className="flex items-center gap-3">
                  {i > 0 && <span className="h-1 w-1 rounded-full bg-gold" />}
                  {b}
                </span>
              ))}
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

            {/* ТЕЛО • ЧУВСТВА — чёрное / РАЗУМ • ДУХ — белое (контур) */}
            <div className="fadeup mt-9 border-y border-line py-4" style={{ animationDelay: "280ms" }}>
              <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-[clamp(17px,2.2vw,24px)] font-semibold uppercase tracking-[0.22em]">
                <span>Тело</span>
                <span className="text-[0.55em] text-gold">•</span>
                <span>Чувства</span>
                <span className="mx-1 inline-block h-[0.9em] w-px translate-y-[0.12em] bg-line" />
                <span className="word-outline text-ink/70">Разум</span>
                <span className="text-[0.55em] text-gold">•</span>
                <span className="word-outline text-ink/70">Дух</span>
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

              {/* инь-ян на границе круга */}
              <div className="floaty absolute -left-4 top-[10%]">
                <YinYang className="h-14 w-14 drop-shadow-[0_12px_24px_rgba(35,33,29,0.25)]" />
              </div>

              {/* подписи */}
              <div className="floaty absolute -right-2 top-[30%] rounded-full border border-line bg-card/90 px-4 py-2 text-[11.5px] font-bold tracking-[0.08em] uppercase text-ink-soft shadow-sm backdrop-blur" style={{ animationDelay: "1.4s" }}>
                кундалини-йога
              </div>
              <div className="floaty absolute -left-6 bottom-[22%] rounded-full border border-line bg-card/90 px-4 py-2 text-[11.5px] font-bold tracking-[0.08em] uppercase text-ink-soft shadow-sm backdrop-blur" style={{ animationDelay: "0.7s" }}>
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
