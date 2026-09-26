import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useStore } from "../lib/store";
import { createOrder, fmtPrice, type OrderForm } from "../lib/db";
import { IconCheck, IconMax, IconPhone, IconSend, IconVk, YinYang } from "./icons";
import { Field, Reveal, Select as UiSelect, SectionHead } from "./ui";

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
  "w-full min-h-[52px] sm:min-h-[58px] rounded-[14px] border border-line bg-card px-4 sm:px-5 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-medium leading-snug outline-none transition-all placeholder:text-ink-faint placeholder:leading-snug focus:border-gold focus:ring-4 focus:ring-gold/20";
const AREA = `${FIELD} resize-y`;

/* Строка «метка + поле» для публичной формы */
function Q({ label, className = "", children }: { label: string; className?: string; children: ReactNode }) {
  return (
    <Field label={label} className={className}>
      {children}
    </Field>
  );
}

/* Выбор из списка для анкеты (общий Ui.Select + метка) */
function QuestionSelect({ label, value, onChange, options, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <Q label={label}>
      <UiSelect value={value} onChange={onChange} options={options.map((o) => ({ value: o, label: o }))} placeholder={placeholder} className={FIELD} />
    </Q>
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
        <Q label="Имя *">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к вам обращаться"
            className={`${FIELD} ${errors.name ? "!border-[#c06b4a] ring-4 ring-[#c06b4a]/15" : ""}`} />
        </Q>
        <Q label="Контакт (телефон / email / мессенджер) *">
          <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+7 …, @…"
            className={`${FIELD} ${errors.contact ? "!border-[#c06b4a] ring-4 ring-[#c06b4a]/15" : ""}`} />
        </Q>
        <Q label="Услуга / мероприятие *" className="sm:col-span-2">
          <UiSelect
            value={service}
            onChange={(key) => {
              setService(key);
              const [sid, vid] = key.split(":");
              const va = db.services.find((s) => s.id === sid)?.variants.find((x) => x.id === vid);
              setPrice(va ? fmtPrice(va.price) + (va.priceUnit ? " " + va.priceUnit : "") : "");
            }}
            options={serviceOptions.map((o) => ({ value: o.key, label: o.label }))}
            placeholder="Выберите услугу или мероприятие"
            className={`${FIELD} ${errors.service ? "!border-[#c06b4a] ring-4 ring-[#c06b4a]/15" : ""}`}
          />
          {price && <span className="mt-1.5 inline-block rounded-full bg-gold/12 px-3 py-1 text-[11.5px] font-extrabold text-gold-deep">{price}</span>}
        </Q>
      </div>
      {(errors.name || errors.contact || errors.service) && (
        <p className="fadeup mt-3 text-[12.5px] font-bold text-[#a8522f]">Пожалуйста, заполните поля, отмеченные *</p>
      )}

      {/* Мини-анкета */}
      <div className="mt-8 border-t border-dashed border-line pt-7">
        <p className="text-[11px] font-extrabold tracking-[0.24em] uppercase text-gold-deep">Мини-анкета · необязательно</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Q label="Город проживания">
            <input value={form.city} onChange={(e) => set({ city: e.target.value })} placeholder="Город" className={FIELD} />
          </Q>
          <QuestionSelect label="Пол" value={form.gender} onChange={(v) => set({ gender: v })} options={["Женский", "Мужской"]} placeholder="—" />
          <Q label="Возраст">
            <input type="number" min={14} max={100} value={form.age} onChange={(e) => set({ age: e.target.value })} placeholder="—" className={FIELD} />
          </Q>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Q label="Опыт терапевтической работы">
            <textarea rows={2} value={form.therapyExp} onChange={(e) => set({ therapyExp: e.target.value })} placeholder="Проходили ли личную терапию? В каком подходе, как долго?" className={AREA} />
          </Q>
          <Q label="Опыт телесных практик">
            <textarea rows={2} value={form.bodyExp} onChange={(e) => set({ bodyExp: e.target.value })} placeholder="Йога, дыхание, медитация — как давно и регулярно?" className={AREA} />
          </Q>
        </div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <QuestionSelect label="Психические заболевания" value={form.mental} onChange={(v) => set({ mental: v })} options={["Нет", "Да (укажите в комментарии)", "Не готов(а) отвечать"]} placeholder="Выберите ответ" />
          <QuestionSelect label="Эпилепсия / судорожные состояния" value={form.epilepsy} onChange={(v) => set({ epilepsy: v })} options={["Нет", "Да (укажите в комментарии)", "Не знаю"]} placeholder="Выберите ответ" />
          <QuestionSelect label="Операции за последние полгода" value={form.surgery} onChange={(v) => set({ surgery: v })} options={["Нет", "Да (укажите в комментарии)"]} placeholder="Выберите ответ" />
          <QuestionSelect label="Грыжи позвоночника, проблемы с ОДА" value={form.hernia} onChange={(v) => set({ hernia: v })} options={["Нет", "Да (укажите в комментарии)", "Не знаю"]} placeholder="Выберите ответ" />
        </div>
        {form.gender !== "Мужской" && (
          <div className="mt-5 sm:max-w-[calc(50%-10px)]">
            <QuestionSelect label="Беременность (для женщин)" value={form.pregnancy} onChange={(v) => set({ pregnancy: v })} options={["Нет", "Да"]} placeholder="Выберите ответ" />
          </div>
        )}
        <Q label="Что привело вас? Основной запрос" className="mt-5">
          <textarea rows={4} value={form.request} onChange={(e) => set({ request: e.target.value })} placeholder="Пара слов о том, что сейчас важно" className={AREA} />
        </Q>
        <Q label="Комментарий" className="mt-5">
          <textarea rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Дополнительная информация, которую считаете важной" className={AREA} />
        </Q>
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
