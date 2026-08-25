import { useEffect, useRef, useState, type FormEvent } from "react";
import { useStore } from "../lib/store";
import { addOrder, fmtPrice, type Order } from "../lib/db";
import { Reveal, SectionHead } from "./ui";
import { IconCheck, IconPhone, IconPlus, IconSend } from "./icons";

/* ================= ФОРМА + КОНТАКТЫ ================= */

export function ContactSection() {
  const { db } = useStore();
  const c = db.content.contacts;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [serviceId, setServiceId] = useState("intro");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState<Order | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  /* выбор услуги из карточки витрины */
  useEffect(() => {
    const onChoose = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      setServiceId(id);
      setSent(null);
      requestAnimationFrame(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        formRef.current?.classList.remove("flash-ring");
        void formRef.current?.offsetWidth;
        formRef.current?.classList.add("flash-ring");
      });
    };
    window.addEventListener("valeria:choose-service", onChoose);
    return () => window.removeEventListener("valeria:choose-service", onChoose);
  }, []);

  const selected = db.services.find((s) => s.id === serviceId);
  const priceLabel = selected
    ? selected.kind === "single"
      ? `${fmtPrice(selected.price)} · подписчикам ${fmtPrice(selected.subscriberPrice ?? selected.price)}`
      : fmtPrice(selected.price) + (selected.priceUnit ? ` ${selected.priceUnit}` : "")
    : "";

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError("Пожалуйста, напишите, как к вам обращаться");
      return;
    }
    if (contact.trim().length < 5) {
      setError("Оставьте телефон или Telegram — иначе я не смогу ответить");
      return;
    }
    setError("");
    const order = addOrder({
      name: name.trim(),
      contact: contact.trim(),
      serviceId,
      serviceTitle: selected?.title ?? "—",
      price: selected ? (selected.price === 0 ? "Бесплатно" : priceLabel) : "—",
      comment: comment.trim(),
    });
    setSent(order);
    setComment("");
  };

  return (
    <section id="contacts" className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-24 top-16 h-96 w-96 rounded-full bg-sky/50 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-80 w-80 rounded-full bg-peach/40 blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-12">
          {/* Левая колонка */}
          <div className="lg:col-span-6">
            <SectionHead
              kicker="Контакты и запись"
              title={<>Сделайте первый шаг <span className="font-serif italic font-semibold text-peach-deep">к целостности</span></>}
              sub="Напишите мне — я отвечу лично. Можно сразу выбрать формат в форме, можно просто поздороваться."
            />

            <div className="mt-10 space-y-4">
              <Reveal>
                <a
                  href={c.phoneHref}
                  className="group flex items-center gap-5 rounded-[24px] border border-ink/10 bg-paper p-5.5 px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-peach-deep/50 hover:shadow-[0_26px_54px_-26px_rgba(224,138,92,0.55)]"
                >
                  <span className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-peach text-peach-deep transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" style={{ height: 52, width: 52 }}>
                    <IconPhone className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-[12px] font-bold tracking-widest uppercase text-ink-faint">Телефон · звонок или WhatsApp</span>
                    <span className="mt-0.5 block font-display text-[20px] sm:text-2xl font-bold text-ink">{c.phoneDisplay}</span>
                  </span>
                </a>
              </Reveal>
              <Reveal delay={110}>
                <a
                  href={c.telegramHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-[24px] border border-ink/10 bg-paper px-6 py-5 transition-all duration-300 hover:-translate-y-1 hover:border-sky-deep/60 hover:shadow-[0_26px_54px_-26px_rgba(143,175,204,0.6)]"
                >
                  <span className="grid h-13 w-13 shrink-0 place-items-center rounded-full bg-sky text-sky-deep transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110" style={{ height: 52, width: 52 }}>
                    <IconSend className="h-6 w-6" />
                  </span>
                  <span>
                    <span className="block text-[12px] font-bold tracking-widest uppercase text-ink-faint">Telegram · самый быстрый способ</span>
                    <span className="mt-0.5 block font-display text-[20px] sm:text-2xl font-bold text-ink">{c.telegram}</span>
                  </span>
                </a>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <p className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-mint/80 border border-mint-deep/30 px-5 py-2.5 text-[13.5px] font-bold text-ink">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-deep opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-mint-deep" />
                </span>
                {c.note}
              </p>
              <p className="mt-9 font-serif italic text-[26px] sm:text-3xl leading-snug text-ink">
                «{c.signoff}»
              </p>
            </Reveal>
          </div>

          {/* Форма */}
          <div className="lg:col-span-6">
            <Reveal delay={140}>
              <div ref={formRef} className="relative rounded-[32px] border border-ink/10 bg-paper p-7 sm:p-10 shadow-[0_50px_110px_-50px_rgba(51,46,61,0.5)]">
                <div className="pointer-events-none absolute -top-5 right-8 rounded-full bg-gold px-4 py-2 text-[11.5px] font-extrabold text-ink shadow-md rotate-2">
                  заявка → мне лично
                </div>

                {sent ? (
                  <div className="fadeup flex min-h-[420px] flex-col items-center justify-center text-center">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-mint text-mint-deep">
                      <IconCheck className="h-10 w-10" strokeWidth={2} />
                    </span>
                    <h3 className="mt-6 font-display text-2xl font-bold">Спасибо, {sent.name}!</h3>
                    <p className="mt-3 max-w-sm text-[15px] leading-relaxed text-ink-soft">
                      Заявка на «{sent.serviceTitle}» принята. Я свяжусь с вами по контакту{" "}
                      <b className="text-ink">{sent.contact}</b> в течение 24 часов.
                    </p>
                    <p className="mt-2 text-[13px] font-semibold text-ink-faint">Если удобнее — напишите сразу в Telegram {c.telegram}</p>
                    <button
                      onClick={() => setSent(null)}
                      className="mt-8 rounded-full border-2 border-ink/15 px-6 py-3 text-[14px] font-bold transition-all hover:border-ink hover:bg-ink hover:text-paper"
                    >
                      Отправить ещё одну заявку
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate>
                    <h3 className="font-display text-[20px] font-bold">Форма записи</h3>
                    <p className="mt-1.5 text-[13.5px] text-ink-soft">Цена подставится автоматически — ничего считать не нужно.</p>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-1.5 block text-[12px] font-extrabold tracking-wide uppercase text-ink-soft">Ваше имя</span>
                        <input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Как к вам обращаться"
                          className="w-full rounded-[16px] border border-ink/15 bg-paper px-4.5 px-4 py-3.5 text-[15px] font-semibold outline-none transition-all placeholder:font-medium placeholder:text-ink-faint focus:border-peach-deep focus:ring-4 focus:ring-peach/40"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1.5 block text-[12px] font-extrabold tracking-wide uppercase text-ink-soft">Телефон или Telegram</span>
                        <input
                          value={contact}
                          onChange={(e) => setContact(e.target.value)}
                          placeholder="+7 … / @nickname"
                          className="w-full rounded-[16px] border border-ink/15 bg-paper px-4 py-3.5 text-[15px] font-semibold outline-none transition-all placeholder:font-medium placeholder:text-ink-faint focus:border-peach-deep focus:ring-4 focus:ring-peach/40"
                        />
                      </label>
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-1.5 block text-[12px] font-extrabold tracking-wide uppercase text-ink-soft">Услуга</span>
                      <div className="relative">
                        <select
                          value={serviceId}
                          onChange={(e) => setServiceId(e.target.value)}
                          className="w-full appearance-none rounded-[16px] border border-ink/15 bg-paper px-4 py-3.5 pr-10 text-[15px] font-semibold outline-none transition-all focus:border-peach-deep focus:ring-4 focus:ring-peach/40"
                        >
                          {db.services.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.title} — {fmtPrice(s.price)}
                              {s.priceUnit ? ` ${s.priceUnit}` : ""}
                            </option>
                          ))}
                        </select>
                        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
                      </div>
                    </label>

                    {/* Автоподстановка цены */}
                    <div key={serviceId} className="price-flip mt-4 flex items-center justify-between rounded-[16px] bg-cream px-5 py-3.5">
                      <span className="text-[13px] font-bold text-ink-soft">Стоимость:</span>
                      <span className="font-display text-[17px] font-bold text-ink">{priceLabel || "—"}</span>
                    </div>

                    <label className="mt-4 block">
                      <span className="mb-1.5 block text-[12px] font-extrabold tracking-wide uppercase text-ink-soft">Комментарий <span className="normal-case font-semibold text-ink-faint">(необязательно)</span></span>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Пара слов о запросе, удобные дни и часы…"
                        className="w-full resize-none rounded-[16px] border border-ink/15 bg-paper px-4 py-3.5 text-[15px] font-semibold outline-none transition-all placeholder:font-medium placeholder:text-ink-faint focus:border-peach-deep focus:ring-4 focus:ring-peach/40"
                      />
                    </label>

                    {error && (
                      <p className="fadeup mt-3 rounded-[12px] bg-peach/60 border border-peach-deep/40 px-4 py-2.5 text-[13px] font-bold text-ink">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-7 py-4 text-[15px] font-bold text-paper transition-all duration-300 hover:bg-peach-deep hover:shadow-[0_20px_44px_-14px_rgba(224,138,92,0.9)]"
                    >
                      Отправить заявку
                      <IconSend className="h-4.5 w-4.5 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" style={{ height: 18, width: 18 }} />
                    </button>
                    <p className="mt-3.5 text-center text-[12px] font-medium text-ink-faint">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Конфиденциально.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

const FAQ_ITEMS = [
  {
    q: "Как проходит первая встреча?",
    a: "Это бесплатные 20 минут онлайн. Мы знакомимся, вы рассказываете, что привело, я задаю уточняющие вопросы. Вместе формулируем запрос и выбираем формат. Никаких обязательств — решение всегда за вами.",
  },
  {
    q: "Конфиденциально ли?",
    a: "Да. Всё, что происходит на сессии, остаётся между нами. Исключения — случаи, прямо предусмотренные законом (угроза жизни). Я регулярно прохожу супервизию, где обсуждаю работу без имён и личных данных.",
  },
  {
    q: "Работаете ли онлайн?",
    a: "Да, большая часть встреч проходит онлайн — по видеосвязи из любого места мира. Очные встречи возможны по договорённости. Формат выбираете вы.",
  },
  {
    q: "Как получить скидку для подписчиков?",
    a: "Скидка для подписчиков группы действует на индивидуальные консультации: 2 500 ₽ вместо 3 000 ₽. На пакет и мастер-классы скидка не распространяется. Подписаться на группу можно в Telegram @pro_balance.",
  },
  {
    q: "Что входит в пакет 10 встреч?",
    a: "Десять сессий по 50 минут в течение 3 месяцев по фиксированному расписанию, приоритет при выборе времени и экономия 5 000 ₽ относительно разовых встреч. Это оптимальный срок, чтобы тревога снизилась, а изменения закрепились.",
  },
  {
    q: "Как проходят мастер-классы и группы?",
    a: "Мастер-класс — тематическая встреча на 3 часа в мини-группе до 10 человек: практики, упражнения, обсуждение. Терапевтическая группа — регулярные встречи раз в неделю по 2 часа, состав постоянный, набор предварительный.",
  },
  {
    q: "Нужна ли подготовка к сессии?",
    a: "Нет. Достаточно прийти в тихое место, где вас не побеспокоят, и разрешить себе быть любым. Если хочется — запишите заранее, что болит. Но можно прийти и «с пустой головой» — это тоже материал для работы.",
  },
  {
    q: "Учитываете ли вы мои религиозные или культурные особенности?",
    a: "Да, для меня важно уважать ваш культурный код. Я не навязываю свои взгляды и работаю в рамках ваших ценностей. Мультикультурное консультирование — моя магистерская специализация в МГППУ.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-cream/60 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <div className="text-center">
          <SectionHead
            kicker="Частые вопросы"
            title={<>Спокойные ответы <span className="font-serif italic font-semibold text-peach-deep">на важные вопросы</span></>}
          />
        </div>

        <div className="mt-12 space-y-3.5">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={Math.min(i * 60, 300)}>
                <div
                  className={`rounded-[22px] border transition-all duration-400 ${
                    isOpen ? "border-peach-deep/50 bg-paper shadow-[0_24px_50px_-30px_rgba(224,138,92,0.5)]" : "border-ink/10 bg-paper/70 hover:border-ink/25"
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="flex items-center gap-4">
                      <span className={`font-display text-[13px] font-bold ${isOpen ? "text-peach-deep" : "text-ink-faint"}`}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15.5px] font-bold leading-snug">{item.q}</span>
                    </span>
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-400 ${
                        isOpen ? "rotate-45 border-peach-deep bg-peach-deep text-paper" : "border-ink/15 text-ink-soft"
                      }`}
                    >
                      <IconPlus className="h-4 w-4" strokeWidth={2.2} />
                    </span>
                  </button>
                  <div className={`acc-body ${isOpen ? "open" : ""}`}>
                    <div className="acc-inner">
                      <p className="px-6 pb-6 pl-[60px] text-[14.5px] leading-relaxed text-ink-soft">{item.a}</p>
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
