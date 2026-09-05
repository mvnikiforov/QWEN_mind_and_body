import { useStore } from "../lib/store";
import { MaxChannelButton } from "./ChannelFeed";
import { IconLock, IconMax, IconPhone, IconSend, IconVk, YinYang } from "./icons";

export default function Footer() {
  const { db } = useStore();
  const c = db.content.contacts;

  return (
    <footer className="relative overflow-hidden bg-ink text-card">
      <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16">
        <p   className="word-outline font-display font-medium uppercase leading-tight tracking-[0.12em] text-white/80 text-[clamp(24px,5vw,58px)]" style={{ textShadow: '0 0 20px rgba(0,0,0,0.2)' }}>Тело • Чувства • Разум • Дух</p>
        <p className="mt-3 font-display text-[clamp(17px,2.4vw,26px)] italic text-card/60">— к балансу и ясности</p>

        <div className="mt-10 flex justify-center sm:mt-11">
          <MaxChannelButton href={c.maxHref} tone="gold" />
        </div>

        <div className="mt-12 grid gap-10 border-t border-card/12 pt-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3.5">
              <YinYang className="h-11 w-11" />
              <div className="leading-tight">
                <p className="font-display text-[20px] font-semibold">Валерия</p>
                <p className="text-[10.5px] font-extrabold tracking-[0.2em] uppercase text-gold">Про|Баланс</p>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-card/60">
              Психолог-консультант, гештальт-практик (МИГИП), магистрант-этнопсихолог (МГППУ),
              инструктор интегративной кундалини-йоги, тренер ДАО-практик.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-extrabold tracking-[0.24em] uppercase text-card/45">Навигация</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ["#services", "Услуги и цены"],
                ["#approach", "Подход"],
                ["#about", "Обо мне"],
                ["#schedule", "Расписание"],
                ["#faq", "Частые вопросы"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="link-grow text-[13.5px] font-semibold text-card/70 transition-colors hover:text-gold">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-extrabold tracking-[0.24em] uppercase text-card/45">Контакты</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a href={c.phoneHref} className="group flex min-h-[44px] items-center gap-3 text-[14px] font-bold text-card/80 transition-colors hover:text-gold">
                  <IconPhone className="h-[17px] w-[17px] text-card/40 transition-colors group-hover:text-gold" />
                  {c.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={c.telegramHref} target="_blank" rel="noopener noreferrer" className="group flex min-h-[44px] items-center gap-3 text-[14px] font-bold text-card/80 transition-colors hover:text-gold">
                  <IconSend className="h-[17px] w-[17px] text-card/40 transition-colors group-hover:text-gold" />
                  Telegram {c.telegram}
                </a>
              </li>
              <li>
                <a href={c.vkHref} target="_blank" rel="noopener noreferrer" className="group flex min-h-[44px] items-center gap-3 text-[14px] font-bold text-card/80 transition-colors hover:text-gold">
                  <IconVk className="h-[17px] w-[17px] text-card/40 transition-colors group-hover:text-gold" />
                  ВКонтакте · {c.vk}
                </a>
              </li>
              <li>
                <a href={c.maxHref} target="_blank" rel="noopener noreferrer" className="group flex min-h-[44px] items-center gap-3 text-[14px] font-bold text-card/80 transition-colors hover:text-gold">
                  <IconMax className="h-[17px] w-[17px] text-card/40 transition-colors group-hover:text-gold" />
                  МАХ · {c.max}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-card/12 pt-7">
          <p className="text-[12px] font-medium text-card/40">
            © {new Date().getFullYear()} Валерия · ПРО|БАЛАНС · Консультации не являются медицинской помощью
          </p>
          <a
            href="#/admin"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-card/20 px-4 py-2 text-[11.5px] font-bold text-card/55 transition-all hover:border-gold hover:text-gold"
          >
            <IconLock className="h-3.5 w-3.5" />
            Для администратора
          </a>
        </div>
      </div>
    </footer>
  );
}
