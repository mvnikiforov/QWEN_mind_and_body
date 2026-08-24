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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
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

/* Заголовок секции: кикер с астериском + крупный display-заголовок */
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
  const kickerColor = tone === "ink" ? "text-peach-deep" : "text-peach";
  const titleColor = tone === "ink" ? "text-ink" : "text-paper";
  const subColor = tone === "ink" ? "text-ink-soft" : "text-paper/70";
  return (
    <div className="max-w-3xl">
      <Reveal>
        <p className={`flex items-center gap-2 text-[11px] sm:text-xs font-bold tracking-[0.22em] uppercase ${kickerColor}`}>
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
          </svg>
          {kicker}
        </p>
      </Reveal>
      <Reveal delay={90}>
        <h2 className={`mt-4 font-display text-[26px] leading-[1.15] sm:text-4xl lg:text-[44px] font-bold ${titleColor}`}>
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={180}>
          <p className={`mt-5 text-base sm:text-lg leading-relaxed ${subColor}`}>{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-paper/70 px-3.5 py-1.5 text-[13px] font-semibold text-ink-soft ${className}`}
    >
      {children}
    </span>
  );
}
