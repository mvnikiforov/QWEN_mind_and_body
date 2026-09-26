import { useState } from "react";
import { FAQS } from "../content/faq";
import { Reveal, SectionHead } from "./ui";

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHead
          kicker="FAQ"
          title={
            <>
              Частые <span className="italic text-gold-deep">вопросы</span>
            </>
          }
          sub="Нажмите на вопрос — ответ раскроется. Если не нашли своего, просто спросите в мессенджере."
        />

        <div className="mt-12 space-y-3">
          {FAQS.map((f, i) => {
            const on = open === i;
            return (
              <Reveal key={f.q} delay={Math.min(i * 60, 300)}>
                <div className={`overflow-hidden rounded-[22px] border transition-colors duration-500 ${on ? "border-ink/40" : "border-line"}`}>
                  <button
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="flex w-full items-center gap-5 bg-card px-6 py-5 text-left transition-colors hover:bg-stone/50 sm:px-8"
                  >
                    <span className={`font-display text-[17px] font-medium transition-colors sm:text-[19px] ${on ? "text-gold-deep" : ""}`}>
                      {f.q}
                    </span>
                    <span className={`ml-auto grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-ink bg-ink text-card" : "border-ink/20 text-ink"}`}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <div className={`acc-body ${on ? "open" : ""}`}>
                    <div className="acc-inner">
                      <p className="mx-3 mb-3 rounded-[16px] bg-stone/80 px-6 py-5 text-[14.5px] leading-relaxed text-ink backdrop-blur-sm">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
