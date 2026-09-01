import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useStore } from "../lib/store";
import { createOrder, fmtPrice, type OrderForm } from "../lib/db";
import { IconCheck, IconMax, IconPhone, IconSend, IconVk, YinYang } from "./icons";
import { Reveal, SectionHead } from "./ui";

/* ================= ФОРМА ЗАПИСИ ================= */

const initialForm = {
  city: "",
  gender: "",
  age: "",
  therapyExp: "",
  bodyExp: "",
  mental: "",
  epilepsy: "",
  surgery: "",
  hernia: "",
  pregnancy: "",
  request: "",
};

const FIELD =
  "w-full min-h-[58px] rounded-[14px] border border-line bg-card px-5 py-4 text-[16px] sm:text-[15px] font-medium leading-snug outline-none transition-all placeholder:text-ink-faint placeholder:leading-snug focus:border-gold focus:ring-4 focus:ring-gold/20";
const LABEL = "mb-2 block text-[11.5px] font-extrabold uppercase tracking-[0.12em] leading-snug text-ink-soft";
const AREA = `${FIELD} resize-y`;

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
          className={`${FIELD} w-full cursor-pointer appearance-none pr-12 text-left ${value ? "text-ink" : "text-ink-faint"}`}
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

function ContactForm() {
  const { db } = useStore();
  const c = db.content.contacts;
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [service, setService] = useState("");
  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState<{ name?: boolean; contact?: boolean; service?: boolean }>({});
  const [remind, setRemind] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [flash, setFlash] = useState(0);

  /* предзаполнение из карточек витрины и афиши */
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<{ title: string; price: string }>).detail;
      setService(d.title);
      setPrice(d.price);
      setSent(false);
      setFlash((f) => f + 1);
    };
    window.addEventListener("prefill-service", onPrefill);
    return () => window.removeEventListener("prefill-service", onPrefill);
  }, []);

  const set = (patch: Partial<typeof form>) => setForm((f) => ({ ...f, ...patch }));

  const questionnaireEmpty = Object.values(form).every((v) => v.trim() === "");

  const doSubmit = () => {
    setSending(true);
    /* AJAX-отправка: в текущей редакции данные уходят в базу сайта,
       на серверном стеке здесь будет fetch на API (см. Документация) */
    setTimeout(() => {
      const cleanForm: OrderForm = {};
      (Object.keys(form) as (keyof typeof form)[]).forEach((k) => {
        if (form[k].trim()) cleanForm[k] = form[k].trim();
      });
      const [sid, vid] = service.split(":");
      const sv = db.services.find((x) => x.id === sid);
      const va = sv?.variants.find((x) => x.id === vid);
      createOrder({
        name: name.trim(),
        contact: contact.trim(),
        serviceTitle: sv && va ? `${sv.title} — ${va.mode === "individual" ? "индивидуальная" : "групповая"}` : service,
        price: price || "уточняется",
        comment: comment.trim() || undefined,
        form: Object.keys(cleanForm).length ? cleanForm : undefined,
      });
      setSending(false);
      setSent(true);
    }, 700);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const errs = { name: !name.trim(), contact: !contact.trim(), service: !service };
    setErrors(errs);
    if (errs.name || errs.contact || errs.service) return;
    if (questionnaireEmpty && !remind) {
      setRemind(true);
      return;
    }
    doSubmit();
  };

  const reset = () => {
    setName(""); setContact(""); setService(""); setPrice(""); setComment("");
    setForm({ ...initialForm }); setErrors({}); setRemind(false); setSent(false);
  };

  const serviceOptions = db.services.flatMap((s) =>
    s.variants.map((v) => ({
      key: `${s.id}:${v.id}`,
      label: `${s.title} — ${v.mode === "individual" ? "индивидуальная" : "групповая"}`,
    }))
  );
  if (service && !serviceOptions.some((o) => o.key === service)) serviceOptions.unshift({ key: service, label: service });

  if (sent) {
    return (
      <div className="fadeup flex h-full flex-col items-center justify-center rounded-[30px] border border-line bg-card px-8 py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-moss/15 text-moss">
          <IconCheck className="h-8 w-8" />
        </span>
        <h3 className="mt-6 font-display text-[28px] font-semibold">Заявка отправлена</h3>
        <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink-soft">
          Спасибо за доверие. {c.note.toLowerCase()} — расскажу, как мы можем начать, и отвечу на вопросы.
        </p>
        <p className="mt-6 font-display text-[19px] italic text-gold-deep">{c.signoff}</p>
        <button onClick={reset} className="link-grow mt-8 text-[12.5px] font-bold tracking-[0.12em] uppercase text-ink-soft">
          Отправить ещё одну заявку
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`rounded-[30px] border border-line bg-card p-6 sm:p-9 ${flash > 0 ? "flash-ring" : ""}`} noValidate>
      <p className="text-[13.5px] leading-relaxed text-ink-soft">
        Для качественной подготовки к встрече и обеспечения безопасности прошу ответить на несколько
        вопросов. Все данные конфиденциальны и используются только для подбора формата работы.
      </p>

      {/* Основные поля */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>Имя *</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться"
            className={`${FIELD} ${errors.name ? "!border-[#c06b4a] ring-4 ring-[#c06b4a]/15" : ""}`} />
        </label>
        <label className="block">
          <span className={LABEL}>Контакт (телефон / email / мессенджер) *</span>
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+7 …, @…"
            className={`${FIELD} ${errors.contact ? "!border-[#c06b4a] ring-4 ring-[#c06b4a]/15" : ""}`} />
        </label>
        <label className="block sm:col-span-2">
          <span className={LABEL}>Услуга / мероприятие *</span>
          <span className="relative block">
            <select value={service} onChange={(e) => { const key = e.target.value; setService(key); const [sid, vid] = key.split(":"); const va = db.services.find((s) => s.id === sid)?.variants.find((x) => x.id === vid); setPrice(va ? fmtPrice(va.price) + (va.priceUnit ? " " + va.priceUnit : "") : ""); }}
              className={`${FIELD} w-full cursor-pointer appearance-none pr-12 ${service ? "text-ink" : "text-ink-faint"} ${errors.service ? "!border-[#c06b4a] ring-4 ring-[#c06b4a]/15" : ""}`}>
              <option value="">Выберите услугу или мероприятие</option>
              {serviceOptions.map((o) => (
                <option key={o.key} value={o.key} className="bg-card text-ink">{o.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
          </span>
          {price && <span className="mt-1.5 inline-block rounded-full bg-gold/12 px-3 py-1 text-[11.5px] font-extrabold text-gold-deep">{price}</span>}
        </label>
      </div>
      {(errors.name || errors.contact || errors.service) && (
        <p className="fadeup mt-3 text-[12.5px] font-bold text-[#a8522f]">Пожалуйста, заполните поля, отмеченные *</p>
      )}

      {/* Мини-анкета */}
      <div className="mt-8 border-t border-dashed border-line pt-7">
        <p className="text-[11px] font-extrabold tracking-[0.24em] uppercase text-gold-deep">Мини-анкета · необязательно</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <label className="block"><span className={LABEL}>Город проживания</span>
            <input value={form.city} onChange={(e) => set({ city: e.target.value })} placeholder="Город" className={FIELD} /></label>
          <Select label="Пол" value={form.gender} onChange={(v) => set({ gender: v })} options={["Женский", "Мужской"]} placeholder="—" />
          <label className="block"><span className={LABEL}>Возраст</span>
            <input type="number" min={14} max={100} value={form.age} onChange={(e) => set({ age: e.target.value })} placeholder="—" className={FIELD} /></label>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block"><span className={LABEL}>Опыт терапевтической работы</span>
            <textarea rows={2} value={form.therapyExp} onChange={(e) => set({ therapyExp: e.target.value })} placeholder="Проходили ли личную терапию? В каком подходе, как долго?" className={AREA} /></label>
          <label className="block"><span className={LABEL}>Опыт телесных практик</span>
            <textarea rows={2} value={form.bodyExp} onChange={(e) => set({ bodyExp: e.target.value })} placeholder="Йога, дыхание, медитация — как давно и регулярно?" className={AREA} /></label>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Select label="Психические заболевания" value={form.mental} onChange={(v) => set({ mental: v })} options={["Нет", "Да (укажите в комментарии)", "Не готов(а) отвечать"]} placeholder="Выберите ответ" />
          <Select label="Эпилепсия / судорожные состояния" value={form.epilepsy} onChange={(v) => set({ epilepsy: v })} options={["Нет", "Да (укажите в комментарии)", "Не знаю"]} placeholder="Выберите ответ" />
          <Select label="Операции за последние полгода" value={form.surgery} onChange={(v) => set({ surgery: v })} options={["Нет", "Да (укажите в комментарии)"]} placeholder="Выберите ответ" />
          <Select label="Грыжи позвоночника, проблемы с ОДА" value={form.hernia} onChange={(v) => set({ hernia: v })} options={["Нет", "Да (укажите в комментарии)", "Не знаю"]} placeholder="Выберите ответ" />
        </div>
        {form.gender !== "Мужской" && (
          <div className="mt-5 sm:max-w-[calc(50%-10px)]">
            <Select label="Беременность (для женщин)" value={form.pregnancy} onChange={(v) => set({ pregnancy: v })} options={["Нет", "Да"]} placeholder="Выберите ответ" />
          </div>
        )}
        <label className="mt-5 block"><span className={LABEL}>Что привело вас? Основной запрос</span>
          <textarea rows={4} value={form.request} onChange={(e) => set({ request: e.target.value })} placeholder="Пара слов о том, что сейчас важно" className={AREA} /></label>
        <label className="mt-5 block"><span className={LABEL}>Комментарий</span>
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Дополнительная информация, которую считаете важной" className={AREA} /></label>
        <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
          Эти вопросы помогают мне лучше понять вашу ситуацию, исключить противопоказания и подобрать
          наиболее безопасные и эффективные практики. Если какой-то вопрос вызывает дискомфорт, его
          можно пропустить — мы обсудим детали на встрече.
        </p>
      </div>

      {/* Мягкое напоминание, если анкета пуста */}
      {remind && (
        <div className="fadeup mt-6 flex flex-wrap items-center gap-4 rounded-[18px] border border-gold/40 bg-gold/8 px-5 py-4">
          <YinYang className="h-9 w-9 shrink-0" />
          <p className="min-w-[200px] grow text-[13px] font-semibold leading-snug text-ink">
            Вы оставили анкету пустой. Это нормально — но заполненная анкета помогает сделать первую
            встречу безопаснее и точнее.
          </p>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setRemind(false)} className="rounded-full border border-ink/25 px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wide transition-colors hover:bg-stone">
              Вернуться к анкете
            </button>
            <button type="button" onClick={doSubmit} className="rounded-full bg-ink px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wide text-card transition-colors hover:bg-gold-deep">
              Отправить так
            </button>
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={sending}
          className="inline-flex items-center gap-3 rounded-full bg-ink px-9 py-4 text-[13px] font-bold tracking-[0.12em] uppercase text-card transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-deep hover:shadow-[0_20px_40px_-16px_rgba(138,109,60,0.85)] disabled:opacity-60"
        >
          {sending ? "Отправляю…" : "Отправить заявку"}
        </button>
        <p className="text-[12.5px] font-semibold text-ink-faint">{c.note}</p>
      </div>
    </form>
  );
}

export function ContactSection() {
  const { db } = useStore();
  const c = db.content.contacts;

  const items: { icon: ReactNode; label: string; value: string; href: string; ext?: boolean }[] = [
    { icon: <IconPhone className="h-5 w-5" />, label: "Телефон", value: c.phoneDisplay, href: c.phoneHref },
    { icon: <IconSend className="h-5 w-5" />, label: "Telegram", value: c.telegram, href: c.telegramHref, ext: true },
    { icon: <IconVk className="h-5 w-5" />, label: "ВКонтакте", value: c.vk, href: c.vkHref, ext: true },
    { icon: <IconMax className="h-5 w-5" />, label: "МАХ", value: c.max, href: c.maxHref, ext: true },
  ];

  return (
    <section id="contact" className="relative bg-stone/45 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHead
          kicker="Контакты и запись"
          title={
            <>
              Сделайте первый шаг <span className="italic text-gold-deep">к балансу</span>
            </>
          }
          sub="Напишите любым удобным способом — или оставьте заявку, и я сама свяжусь с вами."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-12">
          {/* Контакты */}
          <div className="space-y-4 lg:col-span-4">
            {items.map((it, i) => (
              <Reveal key={it.label} delay={i * 90}>
                <a
                  href={it.href}
                  {...(it.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 rounded-[22px] border border-line bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_22px_44px_-28px_rgba(35,33,29,0.45)]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-ink text-card transition-colors duration-300 group-hover:bg-gold-deep">
                    {it.icon}
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink-faint">{it.label}</span>
                    <span className="mt-1 block text-[15.5px] font-extrabold">{it.value}</span>
                  </span>
                </a>
              </Reveal>
            ))}
            <Reveal delay={360}>
              <p className="px-2 pt-2 font-display text-[22px] italic leading-snug text-ink-soft">
                {db.content.contacts.signoff}
              </p>
            </Reveal>
          </div>

          {/* Форма */}
          <Reveal delay={160} className="lg:col-span-8">
            <ContactForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ================= FAQ ================= */

const FAQS: { q: string; a: string }[] = [
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
    a: "Абонемент — это не только экономия, хотя и она важна. Главное — регулярность. Психике нужна определённость и ритм: когда вы знаете, что каждую неделю (или по выбранному графику) у вас есть пространство для себя, это само по себе даёт опору. Регулярные встречи позволяют глубже продвигаться в работе, закреплять изменения и не «выпадать» из процесса. Финансово же абонемент на 10 терапевтических сессий стоит 25 000 ₽ вместо 30 000 ₽ — одна встреча выходит 2 500 ₽. На групповые практики ПРО|БАЛАНС абонемент на 4 занятия — 6 800 ₽ (1 700 ₽ вместо 2 000 ₽ за занятие). На терапевтическую мини-группу — 4 встречи за 8 000 ₽ (2 000 ₽ вместо 2 500 ₽).",
  },
  {
    q: "Что входит в пакет 10 сессий?",
    a: "Это 10 индивидуальных терапевтических встреч, которые мы выстраиваем под ваш запрос и состояние. Работа всегда индивидуальна: где-то мы можем идти классическим путём гештальт-терапии — через разговор, осознавание чувств и контакт; где-то, если это уместно и бережно, добавляю более глубокую работу на уровне тела. Я использую интегративный подход, который учитывает все уровни: тело, чувства, разум и дух. Это помогает не просто «поговорить», а прожить и отпустить то, что застряло внутри.",
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
