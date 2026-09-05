import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useStore } from "../lib/store";
import { createOrder, fmtPrice, type OrderForm } from "../lib/db";
import { IconMax, IconPhone, IconSend, IconVk, YinYang } from "./icons";
import { Reveal, SectionHead } from "./ui";

const FIELD =
  "w-full min-h-[52px] rounded-[14px] border border-line bg-paper px-5 py-4 text-[16px] md:text-[15px] font-medium leading-snug text-ink outline-none transition-all placeholder:text-ink-faint focus:border-gold-deep focus:ring-4 focus:ring-gold/25";
const AREA = `${FIELD} resize-y`;
const LABEL = "mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-soft leading-snug";

function Select({ value, onChange, options, label, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
  placeholder: string;
}) {
  return (
    <label className="block min-w-0">
      <span className={LABEL}>{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${FIELD} w-full cursor-pointer appearance-none pr-12 ${value ? "text-ink" : "text-ink-faint"}`}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-card text-ink">
              {o}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
      </span>
    </label>
  );
}

export function ContactSection() {
  const { db } = useStore();
  const c = db.content.contacts;

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [form, setForm] = useState<OrderForm>({});
  const [comment, setComment] = useState("");
  const [skip, setSkip] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<{ title: string; price: string }>).detail;
      const opts = db.services.flatMap((s) => s.variants.map((v) => `${s.id}:${v.id}`));
      if (opts.includes(d.title)) {
        const [sid, vid] = d.title.split(":");
        const va = db.services.find((s) => s.id === sid)?.variants.find((x) => x.id === vid);
        setService(d.title);
        setPrice(va ? fmtPrice(va.price) + (va.priceUnit ? " " + va.priceUnit : "") : "");
      } else {
        setService(d.title);
        setPrice(d.price);
      }
      setSent(false);
      setFlash((f) => f + 1);
    };
    window.addEventListener("prefill-service", on);
    return () => window.removeEventListener("prefill-service", on);
  }, [db.services]);

  const set = (patch: Partial<OrderForm>) => setForm((f) => ({ ...f, ...patch }));

  const serviceOptions = db.services.flatMap((s) =>
    s.variants.map((v) => ({
      key: `${s.id}:${v.id}`,
      label: `${s.title} — ${v.mode === "individual" ? "индивидуальная" : "групповая"}`,
    }))
  );
  if (service && !serviceOptions.some((o) => o.key === service)) {
    serviceOptions.unshift({ key: service, label: service });
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, boolean> = {};
    if (!name.trim()) errs.name = true;
    if (!contact.trim()) errs.contact = true;
    if (!service) errs.service = true;
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const [sid, vid] = service.split(":");
    const sv = db.services.find((x) => x.id === sid);
    const va = sv?.variants.find((x) => x.id === vid);
    createOrder({
      name: name.trim(),
      contact: contact.trim(),
      serviceTitle: sv && va ? `${sv.title} — ${va.mode === "individual" ? "индивидуальная" : "групповая"}` : service,
      price: price || "—",
      comment: comment.trim() || undefined,
      form: skip ? undefined : form,
    });
    setSent(true);
  };

  const errCls = (k: string) => (errors[k] ? "border-[#b3552f] ring-4 ring-[#b3552f]/20" : "");

  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-stone blur-3xl" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Инфо */}
          <div className="lg:col-span-5">
            <SectionHead
              kicker="Контакты и запись"
              title={
                <>
                  Сделайте первый шаг <span className="italic text-gold-deep">к балансу</span>
                </>
              }
              sub="Напишите — и мы вместе подберём формат. Заявка ни к чему не обязывает."
            />

            <div className="mt-8 space-y-3">
              {[
                { icon: <IconPhone className="h-5 w-5" />, label: c.phoneDisplay, href: c.phoneHref, ext: false },
                { icon: <IconSend className="h-5 w-5" />, label: `Telegram ${c.telegram}`, href: c.telegramHref, ext: true },
                { icon: <IconVk className="h-5 w-5" />, label: `ВКонтакте · ${c.vk}`, href: c.vkHref, ext: true },
                { icon: <IconMax className="h-5 w-5" />, label: `МАХ · ${c.max}`, href: c.maxHref, ext: true },
              ].map((l) => (
                <Reveal key={l.label}>
                  <a
                    href={l.href}
                    {...(l.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex min-h-[52px] items-center gap-4 rounded-[18px] border border-line bg-card px-5 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_20px_40px_-26px_rgba(35,33,29,0.5)]"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-gold transition-colors duration-300 group-hover:bg-gold-deep group-hover:text-card">
                      {l.icon}
                    </span>
                    <span className="text-[14.5px] font-extrabold">{l.label}</span>
                    <span className="ml-auto text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">→</span>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal delay={220}>
              <p className="mt-6 text-[13px] font-semibold text-ink-faint">{c.note}</p>
              <p className="mt-8 flex items-center gap-3 font-display text-[20px] sm:text-[22px] italic text-ink">
                <YinYang className="h-9 w-9" />
                {c.signoff}
              </p>
            </Reveal>
          </div>

          {/* Форма */}
          <div className="lg:col-span-7">
            <Reveal delay={140}>
              {sent ? (
                <div className="fadeup flex h-full flex-col items-center justify-center rounded-[28px] border border-moss/50 bg-moss/10 p-8 text-center sm:p-12">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-moss text-card">
                    <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  </span>
                  <h3 className="mt-6 font-display text-[26px] sm:text-[30px] font-semibold">Заявка отправлена</h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-ink-soft">
                    Спасибо за доверие. Я отвечу в течение 24 часов — в мессенджере или по указанному контакту.
                  </p>
                  <button
                    onClick={() => { setSent(false); setName(""); setContact(""); setService(""); setPrice(""); setForm({}); setComment(""); }}
                    className="mt-7 min-h-[48px] rounded-full border-2 border-ink px-7 py-3 text-[12.5px] font-extrabold uppercase tracking-[0.12em] transition-colors hover:bg-ink hover:text-card"
                  >
                    Отправить ещё одну
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className={`rounded-[28px] border border-line bg-card p-5 sm:p-9 ${flash > 0 ? "flash-ring" : ""}`} noValidate>
                  <h3 className="font-display text-[24px] sm:text-[28px] font-semibold">Форма записи</h3>
                  <p className="mt-2 text-[13px] sm:text-[13.5px] leading-relaxed text-ink-soft">
                    Для качественной подготовки к встрече прошу ответить на несколько вопросов.
                    Все данные конфиденциальны и используются только для подбора формата работы.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
                    <label className="block">
                      <span className={LABEL}>Имя *</span>
                      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться" className={`${FIELD} ${errCls("name")}`} />
                      {errors.name && <span className="mt-1 block text-[12px] font-bold text-[#b3552f]">Пожалуйста, укажите имя</span>}
                    </label>
                    <label className="block">
                      <span className={LABEL}>Контакт *</span>
                      <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Телефон, email или ник в мессенджере" className={`${FIELD} ${errCls("contact")}`} />
                      {errors.contact && <span className="mt-1 block text-[12px] font-bold text-[#b3552f]">Нужен контакт для ответа</span>}
                    </label>
                  </div>

                  <label className="mt-4 block">
                    <span className={LABEL}>Услуга / мероприятие *</span>
                    <span className="relative block">
                      <select
                        value={service}
                        onChange={(e) => {
                          const key = e.target.value;
                          setService(key);
                          const [sid, vid] = key.split(":");
                          const va = db.services.find((s) => s.id === sid)?.variants.find((x) => x.id === vid);
                          setPrice(va ? fmtPrice(va.price) + (va.priceUnit ? " " + va.priceUnit : "") : "");
                        }}
                        className={`${FIELD} w-full cursor-pointer appearance-none pr-12 ${service ? "text-ink" : "text-ink-faint"} ${errCls("service")}`}
                      >
                        <option value="">Выберите формат</option>
                        {serviceOptions.map((o) => (
                          <option key={o.key} value={o.key} className="bg-card text-ink">{o.label}</option>
                        ))}
                      </select>
                      <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
                    </span>
                    {errors.service && <span className="mt-1 block text-[12px] font-bold text-[#b3552f]">Выберите услугу</span>}
                  </label>

                  {price && (
                    <p className="fadeup mt-3 inline-flex items-center gap-2.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-[13px] font-bold">
                      Стоимость: <span className="text-gold-deep">{price}</span>
                    </p>
                  )}

                  {/* Мини-анкета */}
                  <div className="mt-7 border-t border-dashed border-line pt-6">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-gold-deep">Мини-анкета · необязательно</p>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
                      <label className="block"><span className={LABEL}>Город проживания</span>
                        <input value={form.city ?? ""} onChange={(e) => set({ city: e.target.value })} placeholder="Для выбора формата и часового пояса" className={FIELD} /></label>
                      <div className="grid grid-cols-2 gap-4">
                        <Select label="Пол" value={form.gender ?? ""} onChange={(v) => set({ gender: v })} options={["Женский", "Мужской"]} placeholder="—" />
                        <label className="block"><span className={LABEL}>Возраст</span>
                          <input type="number" inputMode="numeric" value={form.age ?? ""} onChange={(e) => set({ age: e.target.value })} placeholder="—" className={FIELD} /></label>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
                      <label className="block"><span className={LABEL}>Опыт терапевтической работы</span>
                        <textarea rows={2} value={form.therapyExp ?? ""} onChange={(e) => set({ therapyExp: e.target.value })} placeholder="Проходили ли личную терапию? В каком подходе, как долго?" className={AREA} /></label>
                      <label className="block"><span className={LABEL}>Опыт телесных практик</span>
                        <textarea rows={2} value={form.bodyExp ?? ""} onChange={(e) => set({ bodyExp: e.target.value })} placeholder="Йога, дыхание, медитация — как давно и регулярно?" className={AREA} /></label>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2 sm:gap-5">
                      <Select label="Диагностированные психические заболевания" value={form.mental ?? ""} onChange={(v) => set({ mental: v })} options={["Нет", "Да (укажите в комментарии)", "Не готов(а) отвечать"]} placeholder="Выберите ответ" />
                      <Select label="Эпилепсия / судорожные состояния" value={form.epilepsy ?? ""} onChange={(v) => set({ epilepsy: v })} options={["Нет", "Да (укажите в комментарии)", "Не знаю"]} placeholder="Выберите ответ" />
                      <Select label="Операции за последние полгода" value={form.surgery ?? ""} onChange={(v) => set({ surgery: v })} options={["Нет", "Да (укажите в комментарии)"]} placeholder="Выберите ответ" />
                      <Select label="Грыжи позвоночника, проблемы с ОДА" value={form.hernia ?? ""} onChange={(v) => set({ hernia: v })} options={["Нет", "Да (укажите в комментарии)", "Не знаю"]} placeholder="Выберите ответ" />
                    </div>

                    {(form.gender ?? "") !== "Мужской" && (
                      <div className="mt-4 sm:max-w-[calc(50%-10px)]">
                        <Select label="Беременность (для женщин)" value={form.pregnancy ?? ""} onChange={(v) => set({ pregnancy: v })} options={["Нет", "Да"]} placeholder="Выберите ответ" />
                      </div>
                    )}

                    <label className="mt-4 block"><span className={LABEL}>Что привело вас? Основной запрос</span>
                      <textarea rows={4} value={form.request ?? ""} onChange={(e) => set({ request: e.target.value })} placeholder="Пара слов о том, что сейчас важно" className={AREA} /></label>
                    <label className="mt-4 block"><span className={LABEL}>Комментарий</span>
                      <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Дополнительная информация, которую считаете важной" className={AREA} /></label>

                    <p className="mt-4 rounded-[14px] bg-stone/70 px-4 py-3 text-[12px] sm:text-[12.5px] leading-relaxed text-ink-soft">
                      Эти вопросы помогают мне лучше понять вашу ситуацию, исключить противопоказания
                      и подобрать наиболее безопасные и эффективные практики. Если какой-то вопрос
                      вызывает дискомфорт, его можно пропустить — мы обсудим детали на встрече.
                    </p>

                    <label className="mt-4 flex min-h-[44px] cursor-pointer items-center gap-3">
                      <span className="relative inline-flex">
                        <input type="checkbox" checked={skip} onChange={(e) => setSkip(e.target.checked)} className="peer sr-only" />
                        <span className={`grid h-6 w-6 place-items-center rounded-full border transition-all duration-300 peer-focus-visible:ring-4 peer-focus-visible:ring-gold/30 ${skip ? "border-ink bg-ink text-card" : "border-ink/30 text-transparent"}`}>
                          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                        </span>
                      </span>
                      <span className="text-[13px] font-semibold text-ink-soft">Пропустить анкету — заполню позже</span>
                    </label>
                    {skip && (
                      <p className="fadeup mt-2 rounded-[12px] border border-gold/40 bg-gold/10 px-4 py-2.5 text-[12px] font-semibold text-ink-soft">
                        Хорошо! Но анкета помогает сделать практику безопаснее — особенно вопросы о здоровье.
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="group mt-7 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-full bg-ink py-4 text-[13px] font-extrabold uppercase tracking-[0.14em] text-card transition-all duration-300 hover:bg-gold-deep hover:shadow-[0_22px_44px_-16px_rgba(138,109,60,0.9)]"
                  >
                    Отправить заявку
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </button>
                  <p className="mt-3.5 text-center text-[12.5px] font-semibold text-ink-faint">{c.note}</p>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

const FAQ: { q: string; a: ReactNode }[] = [
  {
    q: "Как проходит первая терапевтическая сессия?",
    a: "В классической гештальт-терапии первая встреча — это прежде всего знакомство. Мы не гонимся за «решением всех проблем» за один час. Я внимательно слушаю вас, помогаю сформулировать, что сейчас для вас важно, что привело ко мне. Мы исследуем, как вы чувствуете себя в моменте, что происходит между нами, какие чувства и телесные ощущения возникают. Это бережный, неторопливый процесс, в котором вы постепенно начинаете лучше понимать себя. Уже к концу первой сессии часто появляется больше ясности и ощущение, что вас услышали по-настоящему.",
  },
  {
    q: "Конфиденциально ли?",
    a: "Да, абсолютно. Всё, чем вы делитесь на сессиях, остаётся строго между нами. Я работаю в соответствии с этическими принципами психологического консультирования и дорожу вашим доверием. Исключения возможны только в крайних, предусмотренных законом случаях, когда есть реальная угроза жизни или безопасности — но даже тогда я буду действовать максимально бережно и открыто.",
  },
  {
    q: "Какова разница работы в онлайне?",
    a: "По сути, разница только в формате: мы встречаемся по видеосвязи. Глубина и качество работы не снижаются. Более того, многим клиентам онлайн-формат даже помогает: находясь дома, в привычной и безопасной обстановке, проще расслабиться и открыться. Не нужно тратить время на дорогу, можно выбрать удобное место, надеть уютную одежду и быть максимально собой. Из любой точки мира вы можете получить поддержку.",
  },
  {
    q: "Сколько длится терапия?",
    a: "Терапия — это мягкий и бережный процесс, и у каждого он идёт в своём темпе. Кому-то достаточно нескольких встреч, чтобы прояснить конкретную ситуацию и сбросить напряжение. А кто-то выбирает длительную работу, чтобы сформировать новые привычки, обрести устойчивость. В гештальт-подходе мы не гонимся за быстрыми результатами, а уважаем естественный ритм человека. Постепенно, шаг за шагом, вы начинаете лучше понимать себя, свои чувства и потребности. Завершение терапии — тоже важный этап, и мы обсуждаем его вместе.",
  },
  {
    q: "Как часто нужны терапевтические сессии?",
    a: "В гештальт-терапии оптимальный ритм — одна сессия в неделю. Это позволяет сохранять глубину и непрерывность процесса, не перегружая психику. Иногда, в периоды острого кризиса, возможны две встречи в неделю, но это обсуждается индивидуально. Сессии раз в две недели — поддерживающий формат встреч. Главное — регулярность: именно она создаёт безопасное пространство, в котором происходят устойчивые изменения.",
  },
  {
    q: "Чем выгоден абонемент?",
    a: "Абонемент — это не только экономия, хотя и она важна. Главное — регулярность. Психике нужна определённость и ритм: когда вы знаете, что каждую неделю (или по выбранному графику) у вас есть пространство для себя, это само по себе даёт опору. Регулярные встречи позволяют глубже продвигаться в работе, закреплять изменения и не «выпадать» из процесса. Финансово же абонемент на 10 терапевтических сессий стоит 25 000 ₽ вместо 30 000 ₽ — одна встреча выходит 2 500 ₽. На групповые практики ПРО|БАЛАНС — абонемент на 4 встречи: 1 700 ₽/практика вместо 2 000 ₽ разового посещения. На терапевтическую мини-группу — 4 встречи за 8 000 ₽ (2 000 ₽ вместо 2 500 ₽).",
  },
  {
    q: "Что входит в пакет 10 сессий?",
    a: (
      <>
        Это 10 индивидуальных терапевтических встреч, которые мы выстраиваем под ваш запрос и состояние. Работа всегда индивидуальна: где-то мы можем идти классическим путём гештальт-терапии — через разговор, осознавание чувств и контакт; где-то, если это уместно и бережно, добавляю более глубокую работу на уровне тела. Я использую интегративный подход, который учитывает все уровни: <b>тело, чувства, разум и дух</b>. Это помогает не просто «поговорить», а прожить и отпустить то, что застряло внутри.
      </>
    ),
  },
  {
    q: "Нужна ли подготовка для групповых практик ПРО|БАЛАНС?",
    a: "Особой физической подготовки не требуется — приходите с тем, что есть. Одежда нужна удобная, как для йоги: чтобы ничего не сковывало движения. И обязательно возьмите с собой тёплую кофточку и носочки — во время медитаций и расслабления тело может остывать, а вам должно быть тепло и уютно. Всё остальное я подскажу на месте. Главное — ваше желание побыть в заботе о себе.",
  },
  {
    q: "Учитываете ли вы мои религиозные или культурные особенности?",
    a: "Да, обязательно. Я работаю в модальности мультикультурного психологического консультирования — для меня важно, чтобы вы чувствовали, что ваши ценности, традиции и убеждения уважаются. Я никогда не навязываю чуждые взгляды. Наоборот, помогаю вам найти опору внутри вашей собственной картины мира, бережно сопровождая в том, что для вас по-настоящему важно. Если вы живёте на стыке культур, состоите в межкультурных отношениях или переживаете конфликт ценностей, — вы получите поддержку, уважающую вашу идентичность.",
  },
  {
    q: "Зачем нужна анкета?",
    a: "Анкета позволяет мне заранее узнать о вашем опыте и состоянии здоровья, чтобы сделать практику безопасной и эффективной. Например, при эпилепсии, недавних операциях или грыжах некоторые техники могут быть противопоказаны, поэтому я подберу альтернативу. Это забота о вас: чем лучше я понимаю вашу ситуацию до встречи, тем бережнее и точнее смогу выстроить нашу работу.",
  },
  {
    q: "Чем ваш подход отличается от других?",
    a: "Мой подход — интегративный. Я смотрю на человека не как на «проблему», которую нужно починить, а как на целостную, многомерную систему. Мы постепенно, бережно раскрываем уровни тела, чувств, разума и духа. Это не быстрые техники «как избавиться от тревоги за один раз», а мягкий, глубокий процесс роста, в котором каждый шаг опирается на предыдущий. Цель — не просто убрать симптом, а помочь вам стать более осознанным, живым и целостным. Мой личный опыт трансперсональных практик и знание гештальта соединяются, чтобы создать пространство, где изменения происходят естественно и уважительно к вашему темпу.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-stone/45 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <SectionHead
          kicker="FAQ"
          title={
            <>
              Частые <span className="italic text-gold-deep">вопросы</span>
            </>
          }
          sub="Нажмите на вопрос, чтобы раскрыть ответ."
        />
        <div className="mt-10 space-y-3">
          {FAQ.map((item, i) => {
            const on = open === i;
            return (
              <Reveal key={item.q} delay={Math.min(i * 60, 300)}>
                <div className={`overflow-hidden rounded-[20px] border transition-colors duration-300 ${on ? "border-gold/60 bg-card" : "border-line bg-card/60 hover:border-ink/30"}`}>
                  <button
                    type="button"
                    onClick={() => setOpen(on ? null : i)}
                    aria-expanded={on}
                    className="flex min-h-[56px] w-full items-center justify-between gap-5 px-5 py-4 text-left sm:px-7 sm:py-5"
                  >
                    <span className="text-[14.5px] sm:text-[16px] font-extrabold leading-snug">{item.q}</span>
                    <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-all duration-500 ${on ? "rotate-45 border-gold bg-gold text-card" : "border-ink/20 text-ink"}`}>
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </button>
                  <div className={`acc-body ${on ? "open" : ""}`}>
                    <div className="acc-inner">
                      <div className="mx-3 mb-3 rounded-[14px] bg-stone/70 px-4 py-4 text-[13.5px] sm:text-[14.5px] leading-relaxed text-ink sm:mx-5 sm:px-6 sm:py-5">
                        {item.a}
                      </div>
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
