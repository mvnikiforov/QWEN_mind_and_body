import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useStore } from "../lib/store";
import {
  addEvent,
  addPost,
  deleteEvent,
  deleteOrder,
  deletePost,
  fmtPrice,
  ORDER_STATUSES,
  setOrderStatus,
  updateContent,
  updateEvent,
  updatePost,
  updateService,
  type EventItem,
  type Order,
  type OrderForm,
  type OrderStatus,
  type Post,
  type Service,
  type Variant,
} from "../lib/db";
import { IconCart, IconLock, IconSend, IconTrash, IconUpload, YinYang } from "../components/icons";
import DocsTab from "./DocsTab";

type Tab = "orders" | "services" | "events" | "content" | "channel" | "docs";

const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "Заказы" },
  { id: "services", label: "Витрина" },
  { id: "events", label: "Афиша" },
  { id: "content", label: "Контент" },
  { id: "channel", label: "Канал" },
  { id: "docs", label: "Настройки и документация" },
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-[#dde8f1] text-ink",
  paid: "bg-[#dcebe1] text-ink",
  done: "bg-[#e6dcc3] text-ink",
  closed: "bg-ink/12 text-ink-soft",
};

const FIELD = "w-full rounded-[12px] border border-ink/15 bg-card px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-gold-deep focus:ring-4 focus:ring-gold/25";
const LABEL = "mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-ink-soft";

/* ================= ЛОГИН ================= */

function LoginScreen() {
  const { login } = useStore();
  const [l, setL] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!login(l, p)) {
      setErr(true);
      setTimeout(() => setErr(false), 700);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone/60 px-5">
      <div className={`w-full max-w-md rounded-[30px] border border-line bg-card p-9 shadow-[0_50px_110px_-50px_rgba(35,33,29,0.6)] ${err ? "fadeup" : ""}`}>
        <div className="flex items-center gap-4">
          <YinYang className="h-12 w-12 shrink-0" />
          <div>
            <h1 className="font-display text-[22px] font-semibold leading-tight">Админ-панель</h1>
            <p className="text-[12px] font-semibold text-ink-soft">Вход только для роли «Администратор»</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className={LABEL}>Логин</span>
            <input value={l} onChange={(e) => setL(e.target.value)} autoComplete="username" className={FIELD} />
          </label>
          <label className="block">
            <span className={LABEL}>Пароль</span>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" className={FIELD} />
          </label>
          {err && <p className="fadeup rounded-[12px] border border-[#c06b4a]/40 bg-[#f3e0d6] px-4 py-2.5 text-[13px] font-bold text-[#8a4326]">Неверный логин или пароль</p>}
          <button className="w-full rounded-full bg-ink px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-card transition-colors hover:bg-gold-deep">
            Войти
          </button>
        </form>
        <p className="mt-5 text-center text-[12px] font-medium text-ink-faint">
          Первый вход: <b>admin</b> / <b>valeria</b> — затем смените пароль в «Настройках»
        </p>
        <a href="#/" className="mt-2 block text-center text-[13px] font-bold text-ink-soft transition-colors hover:text-ink">
          ← Вернуться на сайт
        </a>
      </div>
    </div>
  );
}

/* ================= ЗАКАЗЫ ================= */

const FORM_LABELS: Record<keyof OrderForm, string> = {
  city: "Город",
  gender: "Пол",
  age: "Возраст",
  therapyExp: "Опыт терапии",
  bodyExp: "Опыт телесных практик",
  mental: "Психические заболевания",
  epilepsy: "Эпилепсия / судороги",
  surgery: "Операции (полгода)",
  hernia: "Грыжи / ОДА",
  pregnancy: "Беременность",
  request: "Основной запрос",
};

function OrderRow({ o, confirm, onAskDelete }: { o: Order; confirm: boolean; onAskDelete: () => void }) {
  const [details, setDetails] = useState(false);
  const date = new Date(o.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const formEntries = o.form ? (Object.entries(o.form) as [keyof OrderForm, string][]) : [];

  return (
    <div className="fadeup rounded-[22px] border border-line bg-card p-5 transition-shadow hover:shadow-[0_20px_44px_-30px_rgba(35,33,29,0.45)]">
      <div className="grid gap-4 lg:grid-cols-[150px_1fr_auto] lg:items-center">
        <div>
          <p className="font-display text-[17px] font-semibold">{o.name}</p>
          <p className="mt-0.5 text-[12.5px] font-semibold text-ink-soft">{o.contact}</p>
          <p className="mt-0.5 text-[11.5px] font-medium text-ink-faint">{date} · №{o.id.slice(-5).toUpperCase()}</p>
        </div>
        <div className="text-[13.5px] leading-snug">
          <p className="font-bold">
            {o.serviceTitle} <span className="ml-1.5 rounded-full bg-stone px-2.5 py-0.5 text-[11.5px] font-bold text-ink-soft">{o.price}</span>
          </p>
          {o.comment && <p className="mt-1 text-ink-soft">Комментарий: «{o.comment}»</p>}
          {formEntries.length > 0 && (
            <button onClick={() => setDetails(!details)} className="link-grow mt-1.5 text-[12px] font-extrabold uppercase tracking-wide text-gold-deep">
              {details ? "Свернуть анкету" : `Анкета · ${formEntries.length} отв.`}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="relative">
            <select
              value={o.status}
              onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
              className={`appearance-none cursor-pointer rounded-full py-2.5 pl-4 pr-9 text-[12.5px] font-extrabold outline-none transition-all ${STATUS_STYLE[o.status]}`}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
          </label>
          <button
            onClick={() => (confirm ? deleteOrder(o.id) : onAskDelete())}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2.5 text-[12px] font-bold transition-all ${
              confirm ? "bg-[#c06b4a] text-card" : "border border-ink/15 text-ink-soft hover:border-[#c06b4a] hover:text-[#a8522f]"
            }`}
          >
            <IconTrash className="h-3.5 w-3.5" />
            {confirm ? "Точно удалить?" : ""}
          </button>
        </div>
      </div>
      {formEntries.length > 0 && (
        <div className={`acc-body ${details ? "open" : ""}`}>
          <div className="acc-inner">
            <dl className="mt-4 grid gap-2.5 rounded-[16px] bg-stone/70 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {formEntries.map(([k, v]) => (
                <div key={k} className="rounded-[12px] bg-card px-3.5 py-2.5">
                  <dt className="text-[10.5px] font-extrabold uppercase tracking-wide text-ink-faint">{FORM_LABELS[k] ?? k}</dt>
                  <dd className={`mt-0.5 text-[13px] font-bold ${k === "mental" || k === "epilepsy" || k === "surgery" || k === "hernia" || k === "pregnancy" ? (v.startsWith("Да") ? "text-[#a8522f]" : "text-moss") : ""}`}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const { db } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const orders = db.orders.filter((o) => filter === "all" || o.status === filter);
  const count = (s: OrderStatus) => db.orders.filter((o) => o.status === s).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-[24px] font-semibold">
          Заказы <span className="text-base font-medium text-ink-faint">({db.orders.length})</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all ${filter === "all" ? "bg-ink text-card" : "bg-ink/8 text-ink-soft hover:bg-ink/15"}`}>
            Все
          </button>
          {ORDER_STATUSES.map((s) => (
            <button key={s.value} onClick={() => setFilter(s.value)} className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all ${filter === s.value ? "bg-ink text-card" : "bg-ink/8 text-ink-soft hover:bg-ink/15"}`}>
              {s.label} · {count(s.value)}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-ink/15 py-20 text-center">
          <IconCart className="h-9 w-9 text-ink/25" />
          <p className="mt-4 font-display text-[17px] font-semibold text-ink-soft">
            {db.orders.length === 0 ? "Заказов пока нет — заявки с сайта появятся здесь" : "В этом статусе заказов нет"}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => (
            <OrderRow key={o.id} o={o} confirm={confirmId === o.id} onAskDelete={() => setConfirmId(confirmId === o.id ? null : o.id)} />
          ))}
        </div>
      )}
      <p className="mt-6 text-[12.5px] font-medium text-ink-faint">
        Оплата пока не подключена: согласуйте оплату вручную (карта / СБП / наличные), затем переведите заказ в «Оплачен». После встречи — «Проведена встреча», по завершении цикла — «Закрыт».
      </p>
    </div>
  );
}

/* ================= ВИТРИНА ================= */

function compressImage(file: File, maxSide = 1000): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * k);
        canvas.height = Math.round(img.height * k);
        canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ServiceEditor({ s }: { s: Service }) {
  const [d, setD] = useState(s);
  const [saved, setSaved] = useState(false);
  const [pendingImg, setPendingImg] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (patch: Partial<Service>) => setD((v) => ({ ...v, ...patch }));
  const setV = (i: number, patch: Partial<Variant>) =>
    setD((v) => ({ ...v, variants: v.variants.map((vv, j) => (j === i ? { ...vv, ...patch } : vv)) }));

  const save = () => {
    updateService(s.id, { ...d, variants: d.variants.map((v) => ({ ...v, price: Number(v.price) || 0 })) });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const onImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || pendingImg == null) return;
    try {
      setV(pendingImg, { image: await compressImage(f) });
    } catch {
      /* не удалось прочитать файл */
    }
  };

  return (
    <div className="rounded-[24px] border border-line bg-stone/50 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[18px] font-semibold">{s.title}</p>
        <button onClick={save} className={`rounded-full px-5 py-2.5 text-[12.5px] font-bold transition-all ${saved ? "bg-moss text-card" : "bg-ink text-card hover:bg-gold-deep"}`}>
          {saved ? "Сохранено ✓" : "Сохранить"}
        </button>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block"><span className={LABEL}>Название карточки</span>
          <input className={FIELD} value={d.title} onChange={(e) => set({ title: e.target.value })} /></label>
        <label className="block"><span className={LABEL}>Подзаголовок</span>
          <input className={FIELD} value={d.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></label>
      </div>

      <input ref={fileRef} type="file" accept="image/*" onChange={onImage} className="hidden" />
      {d.variants.map((vv, i) => (
        <fieldset key={vv.id} className="mt-5 rounded-[18px] border border-line bg-card px-5 py-4">
          <legend className="px-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-deep">
            Формат: {vv.mode === "individual" ? "Индивидуальная" : "Групповая"}
          </legend>
          <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block"><span className={LABEL}>Длительность</span>
              <input className={FIELD} value={vv.duration} onChange={(e) => setV(i, { duration: e.target.value })} /></label>
            <label className="block"><span className={LABEL}>Цена, ₽</span>
              <input type="number" className={FIELD} value={vv.price} onChange={(e) => setV(i, { price: Number(e.target.value) })} /></label>
            <label className="block"><span className={LABEL}>Приписка к цене</span>
              <input className={FIELD} value={vv.priceUnit ?? ""} placeholder="разовая сессия" onChange={(e) => setV(i, { priceUnit: e.target.value || undefined })} /></label>
            <label className="block lg:col-span-2"><span className={LABEL}>Пакет / абонемент</span>
              <input className={FIELD} value={vv.packLabel ?? ""} placeholder="Пакет: 10 сессий — 25 000 ₽ (2 500 ₽/встреча)" onChange={(e) => setV(i, { packLabel: e.target.value || undefined })} /></label>
            <label className="block"><span className={LABEL}>Выгода (бейдж)</span>
              <input className={FIELD} value={vv.packBenefit ?? ""} placeholder="выгода 5 000 ₽" onChange={(e) => setV(i, { packBenefit: e.target.value || undefined })} /></label>
            <label className="block sm:col-span-2 lg:col-span-3"><span className={LABEL}>Описание</span>
              <textarea rows={3} className={`${FIELD} resize-y`} value={vv.description} onChange={(e) => setV(i, { description: e.target.value })} /></label>
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-4">
            <img src={vv.image} alt="" className="h-16 w-24 rounded-[12px] border border-ink/10 object-cover" />
            <button onClick={() => { setPendingImg(i); fileRef.current?.click(); }} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2 text-[12px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-card">
              <IconUpload className="h-3.5 w-3.5" /> Заменить фото
            </button>
            <span className="text-[11.5px] font-medium text-ink-faint">На сайте: <b>{fmtPrice(vv.price)}</b>{vv.packBenefit ? ` · ${vv.packBenefit}` : ""} · изменения появятся после «Сохранить»</span>
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function ServicesTab() {
  const { db } = useStore();
  return (
    <div>
      <h2 className="font-display text-[24px] font-semibold">Карточки витрины</h2>
      <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">Каждая карточка содержит два формата — «Индивидуальная» и «Групповая». Цена, фото, описание и выгода редактируются для каждого формата отдельно.</p>
      <div className="mt-6 space-y-5">
        {db.services.map((s) => <ServiceEditor key={s.id} s={s} />)}
      </div>
    </div>
  );
}

/* ================= АФИША ================= */

function EventsTab() {
  const { db } = useStore();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[24px] font-semibold">Афиша практик и встреч</h2>
        <button onClick={addEvent} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
          + Добавить мероприятие
        </button>
      </div>
      <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">Изменения сохраняются сразу и мгновенно отображаются на сайте.</p>
      <div className="mt-6 space-y-3">
        {db.events.map((e: EventItem) => (
          <div key={e.id} className="fadeup grid gap-3 rounded-[20px] border border-line bg-card px-5 py-4 lg:grid-cols-[1fr_170px_140px_120px_1fr_auto] lg:items-center">
            <input className={FIELD} value={e.title} onChange={(ev) => updateEvent(e.id, { title: ev.target.value })} aria-label="Название" />
            <input className={FIELD} value={e.when} onChange={(ev) => updateEvent(e.id, { when: ev.target.value })} aria-label="Когда" />
            <input className={FIELD} value={e.time} onChange={(ev) => updateEvent(e.id, { time: ev.target.value })} aria-label="Время" />
            <span className="relative">
              <select className={`${FIELD} appearance-none pr-8`} value={e.format} onChange={(ev) => updateEvent(e.id, { format: ev.target.value as EventItem["format"] })} aria-label="Формат">
                <option value="offline">Очно</option>
                <option value="online">Онлайн</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
            </span>
            <input className={FIELD} value={e.price} onChange={(ev) => updateEvent(e.id, { price: ev.target.value })} aria-label="Стоимость" />
            <button onClick={() => deleteEvent(e.id)} className="grid h-10 w-10 place-items-center justify-self-end rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-[#c06b4a] hover:text-[#a8522f]" aria-label="Удалить">
              <IconTrash className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= КОНТЕНТ ================= */

function ContentTab() {
  const { db } = useStore();
  const c = db.content;
  const [paragraphs, setParagraphs] = useState(c.about.paragraphs.join("\n\n"));
  const [chips, setChips] = useState(c.about.chips.join(", "));
  const [culture, setCulture] = useState(c.culture);
  const [contacts, setContacts] = useState(c.contacts);
  const [feedUrl, setFeedUrl] = useState(c.feedUrl);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 2200); };

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      updateContent({ about: { ...c.about, photo: await compressImage(f) } });
      flash("Фото обновлено ✓");
    } catch {
      flash("Не удалось прочитать файл — попробуйте другой");
    }
  };

  const saveAbout = () => {
    updateContent({
      about: {
        ...c.about,
        paragraphs: paragraphs.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        chips: chips.split(",").map((x) => x.trim()).filter(Boolean),
      },
    });
    flash("Раздел «Обо мне» сохранён ✓");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[24px] font-semibold">Контент сайта</h2>
        {msg && <span className="fadeup rounded-full bg-moss px-4 py-2 text-[12.5px] font-bold text-card">{msg}</span>}
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-6">
        <p className="font-display text-[16px] font-semibold">Фото для раздела «Обо мне»</p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <img src={c.about.photo} alt="Текущее фото" className="h-28 w-24 rounded-[18px] border border-ink/10 object-cover" />
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
              <IconUpload className="h-4 w-4" /> Загрузить новое фото
            </button>
            <p className="text-[12px] font-medium text-ink-faint">JPG/PNG · автоматически сжимается и сохраняется в базе сайта</p>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-6">
        <p className="font-display text-[16px] font-semibold">Текст «Обо мне»</p>
        <label className="mt-4 block"><span className={LABEL}>Абзацы (пустая строка разделяет абзацы)</span>
          <textarea rows={9} className={`${FIELD} resize-y leading-relaxed`} value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /></label>
        <label className="mt-4 block"><span className={LABEL}>Плашки через запятую</span>
          <input className={FIELD} value={chips} onChange={(e) => setChips(e.target.value)} /></label>
        <button onClick={saveAbout} className="mt-4 rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">Сохранить «Обо мне»</button>
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-6">
        <p className="font-display text-[16px] font-semibold">Блок «Бережность к культурному коду»</p>
        <label className="mt-4 block"><span className={LABEL}>Заголовок</span>
          <input className={FIELD} value={culture.title} onChange={(e) => setCulture({ ...culture, title: e.target.value })} /></label>
        <label className="mt-4 block"><span className={LABEL}>Текст</span>
          <textarea rows={5} className={`${FIELD} resize-y leading-relaxed`} value={culture.text} onChange={(e) => setCulture({ ...culture, text: e.target.value })} /></label>
        <button onClick={() => { updateContent({ culture }); flash("Блок сохранён ✓"); }} className="mt-4 rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">Сохранить блок</button>
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-6">
        <p className="font-display text-[16px] font-semibold">Контактные данные</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={LABEL}>Телефон (отображение)</span>
            <input className={FIELD} value={contacts.phoneDisplay} onChange={(e) => setContacts({ ...contacts, phoneDisplay: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка tel:</span>
            <input className={FIELD} value={contacts.phoneHref} onChange={(e) => setContacts({ ...contacts, phoneHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Telegram (отображение)</span>
            <input className={FIELD} value={contacts.telegram} onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка на Telegram</span>
            <input className={FIELD} value={contacts.telegramHref} onChange={(e) => setContacts({ ...contacts, telegramHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>ВКонтакте (отображение)</span>
            <input className={FIELD} value={contacts.vk} onChange={(e) => setContacts({ ...contacts, vk: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка на ВКонтакте</span>
            <input className={FIELD} value={contacts.vkHref} onChange={(e) => setContacts({ ...contacts, vkHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>МАХ (отображение)</span>
            <input className={FIELD} value={contacts.max} onChange={(e) => setContacts({ ...contacts, max: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка на канал МАХ</span>
            <input className={FIELD} value={contacts.maxHref} onChange={(e) => setContacts({ ...contacts, maxHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Примечание</span>
            <input className={FIELD} value={contacts.note} onChange={(e) => setContacts({ ...contacts, note: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Финальная фраза</span>
            <input className={FIELD} value={contacts.signoff} onChange={(e) => setContacts({ ...contacts, signoff: e.target.value })} /></label>
        </div>
        <label className="mt-4 block"><span className={LABEL}>URL автоподгрузки канала МАХ (RSS/JSON, когда появится API; пусто = ручные публикации)</span>
          <input className={FIELD} value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="https://…" /></label>
        <button onClick={() => { updateContent({ contacts, feedUrl }); flash("Контакты сохранены ✓"); }} className="mt-4 rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">Сохранить контакты</button>
      </div>
    </div>
  );
}

/* ================= КАНАЛ (публикации) ================= */

function ChannelTab() {
  const { db } = useStore();
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[24px] font-semibold">Публикации «Живой поток»</h2>
        <button onClick={addPost} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
          + Добавить публикацию
        </button>
      </div>
      <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">
        Пока канал МАХ не открыл публичный API, блок «Актуальное из канала» показывает эти публикации. Когда API появится — укажите URL в «Контенте», и подгрузка станет автоматической.
      </p>
      <div className="mt-6 space-y-4">
        {db.posts.map((p: Post) => <PostEditor key={p.id} p={p} />)}
      </div>
    </div>
  );
}

function PostEditor({ p }: { p: Post }) {
  const [d, setD] = useState(p);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<Post>) => setD((v) => ({ ...v, ...patch }));

  const save = () => {
    updatePost(p.id, d);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const onImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      set({ image: await compressImage(f, 800) });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-[22px] border border-line bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input className={`${FIELD} max-w-[220px]`} value={d.date} onChange={(e) => set({ date: e.target.value })} aria-label="Дата" />
        <div className="flex gap-2.5">
          <button onClick={save} className={`rounded-full px-5 py-2.5 text-[12.5px] font-bold transition-all ${saved ? "bg-moss text-card" : "bg-ink text-card hover:bg-gold-deep"}`}>
            {saved ? "Сохранено ✓" : "Сохранить"}
          </button>
          <button onClick={() => deletePost(p.id)} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 text-ink-soft transition-colors hover:border-[#c06b4a] hover:text-[#a8522f]" aria-label="Удалить публикацию">
            <IconTrash className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-4 lg:grid-cols-[150px_1fr]">
        <div className="flex items-start gap-3 lg:flex-col">
          {d.image ? (
            <img src={d.image} alt="" className="h-24 w-full max-w-[150px] rounded-[14px] border border-ink/10 object-cover" />
          ) : (
            <span className="grid h-24 w-full max-w-[150px] place-items-center rounded-[14px] border-2 border-dashed border-ink/15 text-[11px] font-bold text-ink-faint">без фото</span>
          )}
          <div className="flex flex-col gap-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onImage} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="rounded-full border border-ink/20 px-3 py-2 text-[11.5px] font-bold transition-colors hover:bg-stone">
              {d.image ? "Заменить" : "Загрузить фото"}
            </button>
            {d.image && <button onClick={() => set({ image: undefined })} className="rounded-full border border-ink/20 px-3 py-2 text-[11.5px] font-bold text-ink-soft transition-colors hover:bg-stone">Убрать</button>}
          </div>
        </div>
        <div className="space-y-3">
          <input className={FIELD} value={d.title} onChange={(e) => set({ title: e.target.value })} aria-label="Заголовок" placeholder="Заголовок" />
          <textarea rows={3} className={`${FIELD} resize-y`} value={d.text} onChange={(e) => set({ text: e.target.value })} aria-label="Текст" placeholder="Текст публикации" />
        </div>
      </div>
    </div>
  );
}

/* ================= КАРКАС ================= */

export default function AdminApp() {
  const { session, logout, db } = useStore();
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  if (!session) return <LoginScreen />;

  const newCount = db.orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <YinYang className="h-10 w-10 shrink-0" />
            <div className="leading-tight">
              <p className="font-display text-[17px] font-semibold">Админ-панель · ПРО|БАЛАНС</p>
              <p className="text-[11.5px] font-semibold text-ink-soft">
                {session.login} · роль: <span className="text-gold-deep">{session.role === "admin" ? "администратор" : session.role}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="#/" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[12px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
              <IconSend className="h-3.5 w-3.5 -rotate-45" /> На сайт
            </a>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-card transition-colors hover:bg-gold-deep">
              <IconLock className="h-3.5 w-3.5" /> Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="sticky top-[62px] z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-5 py-2.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all ${
                tab === t.id ? "bg-ink text-card shadow-md" : "text-ink-soft hover:bg-ink/8 hover:text-ink"
              }`}
            >
              {t.label}
              {t.id === "orders" && newCount > 0 && (
                <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-[10.5px] font-extrabold text-card">{newCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 pb-24 pt-8">
        {tab === "orders" && <OrdersTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "events" && <EventsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "channel" && <ChannelTab />}
        {tab === "docs" && <DocsTab />}
      </main>

      <footer className="border-t border-line py-6 text-center text-[12px] font-medium text-ink-faint">
        Админ-панель · доступ только для роли «администратор» · данные хранятся в базе сайта
      </footer>
    </div>
  );
}
