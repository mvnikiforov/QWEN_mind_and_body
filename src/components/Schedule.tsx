import { useMemo, useState } from "react";
import { useStore } from "../lib/store";
import { IconCheck, IconSend } from "./icons";
import { prefillService, Reveal, SectionHead } from "./ui";

export default function Schedule() {
  const { db } = useStore();
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const chosen = useMemo(() => db.events.filter((e) => selected.has(e.id)), [db.events, selected]);

  const titleForForm =
    chosen.length > 0
      ? `Афиша: ${chosen.map((e) => e.title).join("; ")}`
      : "";

  const messengerText =
    "Здравствуйте, Валерия! Хочу записаться на мероприятия:\n" +
    chosen.map((e) => `— ${e.title} (${e.when}, ${e.time}, ${e.price})`).join("\n");

  const messengerHref = `${db.content.contacts.telegramHref}?text=${encodeURIComponent(messengerText)}`;

  return (
    <section id="schedule" className="relative bg-stone/45 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHead
                kicker="Расписание"
                title={
                  <>
                    Афиша практик <span className="italic text-gold-deep">и встреч</span>
                  </>
                }
                sub="Отметьте интересующие мероприятия галочками и отправьте заявку — я свяжусь с вами для подтверждения."
              />
              <Reveal delay={240}>
                <div className="mt-8 flex items-center gap-4 rounded-[20px] border border-line bg-card p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-card">
                    <IconCheck className="h-5 w-5" />
                  </span>
                  <p className="text-[13px] font-semibold leading-snug text-ink-soft">
                    Выбрано: <span className="font-extrabold text-ink">{chosen.length}</span>
                    {chosen.length === 0 ? " — отметьте что-нибудь в списке" : " мероприятие(й)"}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-3">
              {db.events.map((e, i) => {
                const on = selected.has(e.id);
                return (
                  <Reveal key={e.id} delay={i * 70}>
                    <label
                      className={`flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-2 rounded-[22px] border bg-card p-5 transition-all duration-300 sm:flex-nowrap sm:px-6 ${
                        on ? "border-ink shadow-[0_22px_44px_-28px_rgba(35,33,29,0.5)]" : "border-line hover:border-ink/40"
                      }`}
                    >
                      <input type="checkbox" className="peer sr-only" checked={on} onChange={() => toggle(e.id)} />
                      <span
                        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                          on ? "border-ink bg-ink text-card" : "border-ink/30 bg-transparent text-transparent"
                        }`}
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                      </span>
                      <span className="min-w-0 grow">
                        <span className="block truncate font-display text-[19px] font-semibold leading-tight">{e.title}</span>
                        <span className="mt-0.5 block text-[12.5px] font-semibold text-ink-faint">
                          {e.when} · {e.time}
                        </span>
                      </span>
                      <span
                        className={`shrink-0 rounded-full px-3.5 py-1.5 text-[10.5px] font-extrabold tracking-[0.12em] uppercase ${
                          e.format === "online" ? "bg-moss/15 text-moss" : "bg-ink/8 text-ink-soft"
                        }`}
                      >
                        {e.format === "online" ? "Онлайн" : "Очно"}
                      </span>
                      <span className="shrink-0 text-right text-[13px] font-extrabold text-gold-deep sm:w-44">{e.price}</span>
                    </label>
                  </Reveal>
                );
              })}
            </div>

            {/* Кнопки записи */}
            <Reveal delay={200}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() =>
                    chosen.length > 0
                      ? prefillService(titleForForm, chosen.map((e) => e.price).join(" · "))
                      : document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[12.5px] font-bold tracking-[0.12em] uppercase text-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-[0_20px_40px_-16px_rgba(138,109,60,0.85)]"
                >
                  Записаться на выбранные
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-card/20 text-[11px]">{chosen.length}</span>
                </button>
                <a
                  href={chosen.length > 0 ? messengerHref : db.content.contacts.telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 rounded-full border border-ink/25 px-6 py-3.5 text-[12.5px] font-bold tracking-[0.12em] uppercase text-ink transition-all duration-300 hover:border-ink hover:bg-stone"
                >
                  <IconSend className="h-4 w-4" />
                  Через мессенджер
                </a>
                <p className="text-[12px] font-medium text-ink-faint">
                  {chosen.length > 0 ? "Текст заявки уже сформирован — останется только отправить" : "В заявке автоматически появится список выбранных встреч"}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
