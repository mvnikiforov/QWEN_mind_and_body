import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/* Плавное появление блока при попадании в вьюпорт */
export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${inView ? "is-in" : ""} ${className}`}
      style={{ "--rv-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

/* Заголовок секции: кикер с тонкой линией + изящный serif-заголовок */
export function SectionHead({
  kicker,
  title,
  sub,
  tone = "ink",
}: {
  kicker: string;
  title: ReactNode;
  sub?: ReactNode;
  tone?: "ink" | "paper";
}) {
  const k = tone === "ink" ? "text-gold-deep" : "text-gold";
  const t = tone === "ink" ? "text-ink" : "text-card";
  const s = tone === "ink" ? "text-ink-soft" : "text-card/70";
  return (
    <div className="max-w-3xl">
      <Reveal>
        <p className={`flex items-center gap-3 text-[11px] font-bold tracking-[0.32em] uppercase ${k}`}>
          <span className="h-px w-10 bg-current opacity-60" />
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={100}>
        <h2 className={`mt-5 font-display font-medium text-[clamp(30px,4.4vw,52px)] leading-[1.06] tracking-[-0.01em] ${t}`}>
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={190}>
          <p className={`mt-5 max-w-2xl text-[15.5px] sm:text-base leading-relaxed ${s}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* Предзаполнение формы записи из любой точки сайта */
export function prefillService(title: string, price: string) {
  window.dispatchEvent(new CustomEvent("prefill-service", { detail: { title, price } }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}
