import { useStore } from "../lib/store";
import type { EventItem } from "../lib/db";
import { IconCheck, IconSend } from "./icons";
import { prefillService, Reveal, SectionHead } from "./ui";

function FormatBadge({ format }: { format: EventItem["format"] }) {
  const online = format === "online";
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] ${
        online ? "bg-[#e2ebf2] text-[#46698c]" : "bg-moss/15 text-moss"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-[#46698c]" : "bg-moss"}`} />
      {online ? "Онлайн" : "Офлайн"}
    </span>
  );
}

export default function Schedule() {
  const { db } = useStore();
  const c = db.content.contacts;

  const onAction = (e: EventItem, a: { label: string; kind: "book" | "link"; target?: string }) => {
    if (a.kind === "link") {
      document.querySelector(a.target ?? "#")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    prefillService(
      a.label !== "Записаться" ? `${e.title} — ${a.label.toLowerCase()}` : e.title,
      a.target ?? (e.priceNote ? `${e.price} · ${e.priceNote}` : e.price)
    );
  };

  return (
    <section id="schedule" className="relative bg-stone/45 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Расписание"
            title={
              <>
                Афиша практик <span className="italic text-gold-deep">и встреч</span>
              </>
            }
            sub="Нажмите «Записаться» у нужного мероприятия — услуга и стоимость автоматически подставятся в форму заявки."
          />
          <Reveal delay={200}>
            <a
              href={c.telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center gap-2.5 rounded-full border border-ink/25 px-6 py-3.5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:border-ink hover:bg-card"
            >
              <IconSend className="h-4 w-4" />
              Написать в мессенджер
            </a>
          </Reveal>
        </div>

        {/* Таблица (десктоп) */}
        <Reveal delay={140}>
          <div className="mt-10 hidden overflow-hidden rounded-[28px] border border-line bg-card/60 lg:block sm:mt-14">
            <div className="grid grid-cols-[1.35fr_0.95fr_0.8fr_1.15fr_1.9fr_1.05fr] gap-x-6 border-b border-line bg-card px-6 py-4 text-[10.5px] font-extrabold uppercase tracking-[0.2em] text-ink-faint">
              <span>Название</span>
              <span>Когда</span>
              <span>Формат</span>
              <span>Стоимость</span>
              <span>Описание</span>
              <span className="text-right">Запись</span>
            </div>
            {db.events.map((e, i) => (
              <div key={e.id} className="group relative grid grid-cols-[1.35fr_0.95fr_0.8fr_1.15fr_1.9fr_1.05fr] items-center gap-x-6 border-b border-line px-6 py-6 transition-all duration-300 last:border-b-0 hover:bg-card">
                <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-gold transition-transform duration-300 group-hover:scale-y-100" />
                <div className="flex items-start gap-4">
                  <span className="font-display text-[26px] font-light italic leading-none text-ink/25 transition-colors duration-300 group-hover:text-gold-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[20px] font-semibold leading-tight">{e.title}</p>
                </div>
                <div className="text-[13px] font-semibold leading-snug text-ink-soft">
                  <p>{e.when}</p>
                  <p className="text-ink-faint">{e.time}</p>
                </div>
                <FormatBadge format={e.format} />
                <div>
                  <p className="text-[14px] font-extrabold">{e.price}</p>
                  {e.priceNote && <p className="mt-1 text-[11.5px] font-semibold leading-snug text-ink-faint">{e.priceNote}</p>}
                </div>
                <p className="text-[12.5px] leading-relaxed text-ink-soft">{e.desc}</p>
                <div className="flex flex-col items-stretch gap-2">
                  {(e.actions ?? []).map((a) =>
                    a.kind === "link" ? (
                      <a
                        key={a.label}
                        href={a.target}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-ink/25 px-4 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:border-ink hover:bg-stone"
                      >
                        {a.label}
                      </a>
                    ) : (
                      <button
                        key={a.label}
                        onClick={() => onAction(e, a)}
                        className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-4 py-2.5 text-center text-[11px] font-extrabold uppercase tracking-[0.08em] text-card transition-colors hover:bg-gold-deep"
                      >
                        {a.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Карточки (мобильные и планшеты) */}
        <div className="mt-10 space-y-4 sm:mt-14 lg:hidden">
          {db.events.map((e, i) => (
            <Reveal key={e.id} delay={i * 90}>
              <div className="group rounded-[24px] border border-line bg-card p-5 transition-all duration-300 hover:border-gold/60 hover:shadow-[0_30px_60px_-36px_rgba(35,33,29,0.5)] sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-display text-[21px] font-semibold leading-tight">{e.title}</p>
                  <FormatBadge format={e.format} />
                </div>
                <p className="mt-2 text-[13px] font-semibold text-ink-soft">
                  {e.when} · {e.time}
                </p>
                <div className="mt-3">
                  <p className="text-[14px] font-extrabold">{e.price}</p>
                  {e.priceNote && <p className="mt-1 text-[11.5px] font-semibold leading-snug text-ink-faint">{e.priceNote}</p>}
                </div>
                <p className="mt-3.5 text-[13px] leading-relaxed text-ink-soft">{e.desc}</p>
                <div className="mt-5 flex flex-col gap-2.5 border-t border-dashed border-line pt-5">
                  {(e.actions ?? []).map((a) =>
                    a.kind === "link" ? (
                      <a
                        key={a.label}
                        href={a.target}
                        className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-ink/25 px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.1em] transition-colors hover:border-ink hover:bg-stone"
                      >
                        {a.label}
                      </a>
                    ) : (
                      <button
                        key={a.label}
                        onClick={() => onAction(e, a)}
                        className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-card transition-colors hover:bg-gold-deep"
                      >
                        <IconCheck className="h-4 w-4" />
                        {a.label}
                      </button>
                    )
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-[12.5px] font-medium text-ink-faint">
            Не нашли удобное время? Напишите — подберём формат и часы под ваш график.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
