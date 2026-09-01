import { useStore } from "../lib/store";
import type { EventItem } from "../lib/db";
import { IconArrow, IconSend } from "./icons";
import { prefillService, Reveal, SectionHead } from "./ui";

/* Наклейка формата: синий — онлайн, зелёный — офлайн */
function FormatTag({ format }: { format: EventItem["format"] }) {
  const online = format === "online";
  return (
    <span
      className={`inline-flex w-max items-center gap-1.5 rounded-full px-3 py-1.5 text-[10.5px] font-extrabold uppercase tracking-[0.14em] ${
        online ? "bg-[#3f6c96]/12 text-[#3f6c96]" : "bg-moss/15 text-moss"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-[#3f6c96]" : "bg-moss"}`} />
      {online ? "Онлайн" : "Офлайн"}
    </span>
  );
}

function EventActions({ e }: { e: EventItem }) {
  const book = (a: EventItem["actions"][number]) =>
    prefillService(
      a.target ? `${e.title} — ${a.label.toLowerCase()}` : e.title,
      a.target ?? (e.priceNote ? `${e.price} · ${e.priceNote}` : e.price)
    );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {e.actions.map((a, i) =>
        a.kind === "link" ? (
          <a
            key={a.label}
            href={a.target}
            className={`link-grow inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em] ${
              i === 0 ? "text-ink" : "text-gold-deep"
            }`}
          >
            {a.label}
            <IconArrow className="h-3.5 w-3.5" />
          </a>
        ) : (
          <button
            key={a.label}
            onClick={() => book(a)}
            className={
              i === 0
                ? "inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-[0_14px_28px_-12px_rgba(138,109,60,0.8)]"
                : "link-grow inline-flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-gold-deep"
            }
          >
            {a.label}
            {i > 0 && <IconArrow className="h-3.5 w-3.5" />}
          </button>
        )
      )}
    </div>
  );
}

export default function Schedule() {
  const { db } = useStore();
  const c = db.content.contacts;

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
            sub="Регулярные встречи, на которые можно записаться прямо сейчас. Выберите мероприятие — и я свяжусь с вами для подтверждения."
          />
          <Reveal delay={220}>
            <a
              href={c.telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-ink/25 px-5 py-3 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink transition-all duration-300 hover:border-ink hover:bg-card"
            >
              <IconSend className="h-4 w-4" />
              Написать в мессенджер
            </a>
          </Reveal>
        </div>

        {/* ======= Десктоп: таблица ======= */}
        <div className="mt-12 hidden lg:block">
          {/* Шапка таблицы */}
          <Reveal>
            <div className="grid grid-cols-[1.35fr_0.95fr_0.8fr_1.15fr_1.9fr_1.05fr] items-center gap-x-6 border-b-2 border-ink/70 pb-3.5 px-6 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-ink-faint">
              <span>Название</span>
              <span>Когда</span>
              <span>Формат</span>
              <span>Стоимость</span>
              <span>Описание</span>
              <span className="text-right">Запись</span>
            </div>
          </Reveal>

          {/* Строки */}
          {db.events.map((e, i) => (
            <Reveal key={e.id} delay={i * 110}>
              <div className="group relative grid grid-cols-[1.35fr_0.95fr_0.8fr_1.15fr_1.9fr_1.05fr] items-center gap-x-6 border-b border-line px-6 py-7 transition-all duration-400 hover:bg-card">
                <span className="absolute inset-y-0 left-0 w-[3px] origin-top scale-y-0 bg-gold transition-transform duration-400 group-hover:scale-y-100" />

                <div className="flex items-start gap-4">
                  <span className="font-display text-[26px] font-light italic leading-none text-ink/25 transition-colors duration-400 group-hover:text-gold-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[22px] font-semibold leading-snug">{e.title}</h3>
                </div>

                <div>
                  <p className="text-[13.5px] font-bold leading-snug">{e.when}</p>
                  <p className="mt-1 text-[13px] font-semibold text-gold-deep">{e.time}</p>
                </div>

                <FormatTag format={e.format} />

                <div>
                  <p className="text-[15px] font-extrabold">{e.price}</p>
                  {e.priceNote && <p className="mt-1 text-[11.5px] font-semibold leading-snug text-ink-faint">{e.priceNote}</p>}
                </div>

                <p className="text-[13px] leading-relaxed text-ink-soft">{e.desc}</p>

                <div className="justify-self-end">
                  <EventActions e={e} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ======= Мобильные и планшет: карточки ======= */}
        <div className="mt-10 space-y-4 lg:hidden">
          {db.events.map((e, i) => (
            <Reveal key={e.id} delay={i * 100}>
              <div className="group rounded-[26px] border border-line bg-card p-6 transition-all duration-400 hover:border-gold/60 hover:shadow-[0_30px_60px_-36px_rgba(35,33,29,0.5)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <span className="font-display text-[22px] font-light italic leading-none text-ink/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-[20px] font-semibold leading-snug">{e.title}</h3>
                  </div>
                  <FormatTag format={e.format} />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                  <p className="text-[13px] font-bold">
                    {e.when} · <span className="text-gold-deep">{e.time}</span>
                  </p>
                  <p className="text-[14px] font-extrabold">{e.price}</p>
                </div>
                {e.priceNote && <p className="mt-1.5 text-[11.5px] font-semibold text-ink-faint">{e.priceNote}</p>}

                <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">{e.desc}</p>

                <div className="mt-5 border-t border-dashed border-line pt-4">
                  <EventActions e={e} />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <p className="mt-8 text-center text-[12.5px] font-medium text-ink-faint">
            Не нашли подходящее время? Напишите — подберём формат и расписание под вас.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
