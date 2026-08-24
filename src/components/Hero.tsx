import { useEffect, useRef } from "react";
import { ABSTRACT_URL } from "../lib/db";
import { IconArrow } from "./icons";

const WORDS: { w: string; c: string }[] = [
  { w: "ТЕЛО", c: "text-peach-deep" },
  { w: "ЧУВСТВА", c: "text-mint-deep" },
  { w: "РАЗУМ", c: "text-sky-deep" },
  { w: "ДУХ", c: "text-gold" },
];

function MarqueeRow({ reverse, outline }: { reverse?: boolean; outline?: boolean }) {
  const items = [...WORDS, ...WORDS, ...WORDS, ...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="relative flex overflow-hidden py-1 select-none" aria-hidden>
      <div
        className={`flex shrink-0 items-center gap-[4vw] pr-[4vw] whitespace-nowrap ${
          reverse ? "marquee-track-r" : "marquee-track-l"
        }`}
      >
        {items.map((it, i) => (
          <span key={i} className="flex items-center gap-[4vw]">
            <span
              className={`font-display font-black text-[clamp(44px,8.5vw,110px)] leading-none tracking-tight ${
                outline ? `word-outline ${it.c}` : it.c
              }`}
            >
              {it.w}
            </span>
            <span className="text-peach-deep text-[clamp(28px,4.5vw,58px)] leading-none">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  /* лёгкий параллакс от мыши (отключается при reduced motion) */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty("--px", String(x));
      el.style.setProperty("--py", String(y));
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="top" ref={ref} className="relative overflow-hidden pt-28 sm:pt-32">
      {/* фоновые пятна */}
      <div className="pointer-events-none absolute -top-24 -left-32 h-[480px] w-[480px] rounded-full bg-sky/60 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-40 h-[520px] w-[520px] rounded-full bg-peach/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/3 h-[380px] w-[380px] rounded-full bg-lav/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-12">
          {/* Текст */}
          <div className="lg:col-span-7">
            <div className="fadeup flex flex-wrap gap-2.5">
              {["Онлайн и очно", "Доступные цены", "Безопасное пространство"].map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper/80 px-3.5 py-1.5 text-[12.5px] font-bold text-ink-soft shadow-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-peach-deep" />
                  {b}
                </span>
              ))}
            </div>

            <h1 className="fadeup mt-7 font-display text-[clamp(30px,4.6vw,58px)] font-bold leading-[1.08] tracking-tight" style={{ animationDelay: "80ms" }}>
              Распаковка
              <br />
              психо-эмоциональных{" "}
              <span className="relative inline-block text-peach-deep">
                зажимов
                <svg viewBox="0 0 120 12" className="absolute -bottom-2 left-0 w-full text-gold" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
                  <path d="M3 9c30-6 60-6 114-3" />
                </svg>
              </span>
            </h1>

            <p className="fadeup mt-6 font-serif italic text-[clamp(22px,2.6vw,32px)] leading-snug text-ink-soft" style={{ animationDelay: "160ms" }}>
              Раскрытие внутренних ресурсов —{" "}
              <span className="text-ink">для полноты и яркости жизни</span>
            </p>

            <p className="fadeup mt-6 max-w-xl text-[15.5px] sm:text-base leading-relaxed text-ink-soft" style={{ animationDelay: "240ms" }}>
              Интегративный подход: гештальт-терапия, телесно-ориентированные практики,
              mindfulness. Более <b className="text-ink">20 лет личной практики</b> трансперсональных
              методов, около <b className="text-ink">5 лет работы с клиентами</b>. Бережность к вашему
              культурному коду.
            </p>

            <div className="fadeup mt-9 flex flex-wrap items-center gap-4" style={{ animationDelay: "320ms" }}>
              <a
                href="#services"
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[15px] font-bold text-paper transition-all duration-300 hover:-translate-y-1 hover:bg-peach-deep hover:shadow-[0_20px_45px_-14px_rgba(224,138,92,0.9)]"
              >
                Выбрать формат поддержки
                <IconArrow className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <a
                href="#approach"
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-6 py-3.5 text-[15px] font-bold text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-paper"
              >
                Как я работаю
              </a>
            </div>

            {/* Статы */}
            <dl className="fadeup mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-ink/10 pt-7" style={{ animationDelay: "400ms" }}>
              {[
                { n: "20+", t: "лет личной практики трансперсональных методов" },
                { n: "~5", t: "лет бережной работы с клиентами" },
                { n: "2", t: "образования: МИГИП и МГППУ (обучаюсь)" },
              ].map((s) => (
                <div key={s.n}>
                  <dt className="font-display text-2xl sm:text-3xl font-bold text-ink">{s.n}</dt>
                  <dd className="mt-1.5 text-[12px] leading-snug font-medium text-ink-soft">{s.t}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Визуал */}
          <div className="relative lg:col-span-5">
            <div
              className="relative mx-auto aspect-[10/11] max-w-[440px] transition-transform duration-300 ease-out"
              style={{
                transform:
                  "translate(calc(var(--px, 0) * 14px), calc(var(--py, 0) * 14px))",
              }}
            >
              {/* дышащий круг */}
              <div className="breathe absolute inset-[-9%] rounded-full bg-[radial-gradient(circle_at_35%_30%,#f7d9c3_0%,#e7e1f2_48%,#dde8f1_100%)] opacity-80" />
              {/* вращающееся пунктирное кольцо */}
              <svg className="spin-slow absolute inset-[-15%] text-ink/25" viewBox="0 0 100 100" fill="none" aria-hidden>
                <circle cx="50" cy="50" r="48.5" stroke="currentColor" strokeWidth="0.5" strokeDasharray="1.5 4" />
              </svg>
              {/* блоб с абстракцией */}
              <div className="blob absolute inset-0 overflow-hidden border border-ink/10 shadow-[0_40px_80px_-30px_rgba(51,46,61,0.35)]">
                <img
                  src={ABSTRACT_URL}
                  alt="Мягкая абстракция: плавные линии пастельных тонов — метафора внутреннего движения"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>

              {/* плавающие чипы */}
              <div className="floaty absolute -left-6 top-[16%] rounded-full bg-paper px-4 py-2 text-[12.5px] font-bold text-ink shadow-[0_14px_34px_-14px_rgba(51,46,61,0.4)] border border-ink/8">
                <span className="text-mint-deep">✳</span> телесные практики
              </div>
              <div className="floaty-slow absolute -right-4 top-[38%] rounded-full bg-ink px-4 py-2 text-[12.5px] font-bold text-paper shadow-lg">
                гештальт-терапия <span className="text-peach">✳</span>
              </div>
              <div className="floaty absolute -left-2 bottom-[14%] rounded-full bg-paper px-4 py-2 text-[12.5px] font-bold text-ink shadow-[0_14px_34px_-14px_rgba(51,46,61,0.4)] border border-ink/8" style={{ animationDelay: "1.2s" }}>
                <span className="text-sky-deep">✳</span> mindfulness
              </div>

              {/* мини-карточка оффера */}
              <a
                href="#services"
                className="floaty-slow group absolute -bottom-7 right-0 flex items-center gap-3 rounded-2xl border border-ink/10 bg-paper/95 px-4.5 py-3.5 shadow-[0_24px_50px_-20px_rgba(51,46,61,0.45)] backdrop-blur transition-colors hover:border-peach-deep/50"
                style={{ animationDelay: "0.6s" }}
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-mint text-mint-deep">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <circle cx="12" cy="12" r="8.2" />
                    <path d="M12 7.5V12l3.2 2.4" />
                  </svg>
                </span>
                <span className="leading-tight">
                  <span className="block text-[13px] font-extrabold">Первая встреча — бесплатно</span>
                  <span className="block text-[11.5px] font-medium text-ink-soft">20 минут · знакомство и запрос</span>
                </span>
                <IconArrow className="h-4 w-4 text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-peach-deep" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Огромные слова */}
      <div className="relative mt-16 sm:mt-20 border-y border-ink/8 bg-paper/60 py-4 backdrop-blur-sm">
        <MarqueeRow />
        <MarqueeRow reverse outline />
      </div>
    </section>
  );
}
