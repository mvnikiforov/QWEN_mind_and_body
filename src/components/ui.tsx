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

/* ---------- примитивы форм (общие для публичной формы и админ-панели) ---------- */

export const CHEVRON_DOWN = "m6 9.5 6 6 6-6";

/* Поле ввода с подписью; className позволяет подстроить размеры под контекст */
export function Field({
  label,
  smallLabel,
  className = "",
  labelClassName = "",
  children,
}: {
  label?: ReactNode;
  smallLabel?: boolean;
  className?: string;
  labelClassName?: string;
  children: ReactNode;
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      {label && (
        <span
          className={`${smallLabel ? "mb-1 block text-[11px] font-extrabold uppercase tracking-wide" : "mb-2 block text-[10.5px] sm:text-[11.5px] font-extrabold uppercase tracking-[0.12em] leading-snug"} text-ink-soft ${labelClassName}`}
        >
          {label}
        </span>
      )}
      {children}
    </label>
  );
}

/* Нативный select со стилизованной стрелкой и плейсхолдером */
export function Select({
  value,
  onChange,
  options,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}) {
  return (
    <span className="relative block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full cursor-pointer appearance-none pr-12 text-left ${value ? "text-ink" : "text-ink-faint"} ${className}`}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-card text-ink">
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      >
        <path d={CHEVRON_DOWN} />
      </svg>
    </span>
  );
}
