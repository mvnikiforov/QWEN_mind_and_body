import { useStore } from "../lib/store";
import { AsteriskMark, IconLock, IconPhone, IconSend } from "./icons";

const WORDS = [
  { w: "ТЕЛО", c: "text-peach" },
  { w: "ЧУВСТВА", c: "text-mint" },
  { w: "РАЗУМ", c: "text-sky" },
  { w: "ДУХ", c: "text-gold" },
];

export default function Footer() {
  const { db } = useStore();
  const c = db.content.contacts;

  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-peach-deep/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-1/5 h-72 w-72 rounded-full bg-lav-deep/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-16 pb-10">
        {/* Слоган */}
        <p className="font-display font-black leading-tight text-[clamp(22px,4.2vw,52px)] tracking-tight" aria-label="Тело, чувства, разум, дух — к целостности и ясности">
          {WORDS.map((wd, i) => (
            <span key={wd.w}>
              <span className={wd.c}>{wd.w}</span>
              {i < WORDS.length - 1 && <span className="text-paper/35"> ✳ </span>}
            </span>
          ))}
          <span className="mt-2 block font-serif italic font-medium text-paper/70 text-[clamp(18px,2.4vw,30px)]">
            — к целостности и ясности
          </span>
        </p>

        <div className="mt-14 grid gap-10 border-t border-paper/12 pt-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-peach text-ink">
                <AsteriskMark className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} strokeWidth={2.4} />
              </span>
              <p className="font-display text-lg font-bold">Валерия Никифорова</p>
            </div>
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-paper/65">
              Магистрант-этнопсихолог (МГППУ), гештальт-практик (МИГИП), 
              инструктор интегративной кундалини-йоги, тренер ДАО-практик.
            </p>
          </div>

          <div>
            <p className="text-[12px] font-extrabold tracking-[0.2em] uppercase text-paper/50">Навигация</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["#services", "Услуги и цены"],
                ["#approach", "Подход"],
                ["#about", "Обо мне"],
                ["#process", "Как проходит"],
                ["#faq", "Частые вопросы"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="text-[14px] font-semibold text-paper/75 transition-colors hover:text-peach">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[12px] font-extrabold tracking-[0.2em] uppercase text-paper/50">Контакты</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={c.phoneHref} className="group flex items-center gap-3 text-[15px] font-bold text-paper/85 transition-colors hover:text-peach">
                  <IconPhone className="h-4.5 w-4.5 text-paper/45 transition-colors group-hover:text-peach" style={{ height: 18, width: 18 }} />
                  {c.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={c.telegramHref} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[15px] font-bold text-paper/85 transition-colors hover:text-peach">
                  <IconSend className="h-4.5 w-4.5 text-paper/45 transition-colors group-hover:text-peach" style={{ height: 18, width: 18 }} />
                  Telegram {c.telegram}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[12.5px] font-medium text-paper/50">{c.note}</p>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper/12 pt-7">
          <p className="text-[12.5px] font-medium text-paper/45">
            © {new Date().getFullYear()} Валерия Никифорова · Консультации не являются медицинской помощью
          </p>
          <a
            href="#/admin"
            className="inline-flex items-center gap-2 rounded-full border border-paper/20 px-4 py-2 text-[12px] font-bold text-paper/60 transition-all hover:border-peach hover:text-peach"
          >
            <IconLock className="h-3.5 w-3.5" />
            Для администратора
          </a>
        </div>
      </div>
    </footer>
  );
}
