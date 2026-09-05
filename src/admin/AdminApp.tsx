import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useStore } from "../lib/store";
import {
  addEvent,
  addPost,
  changePassword,
  deleteEvent,
  deleteOrder,
  deletePost,
  exportDB,
  fmtPrice,
  importDB,
  ORDER_STATUSES,
  resetDB,
  setOrderStatus,
  updateContent,
  updateEvent,
  updatePost,
  updateService,
  type EventItem,
  type Order,
  type OrderStatus,
  type Post,
  type Service,
  type Variant,
} from "../lib/db";
import { IconCart, IconLock, IconSend, IconTrash, IconUpload, YinYang } from "../components/icons";

type Tab = "orders" | "services" | "events" | "content" | "posts" | "settings";

const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "Заказы" },
  { id: "services", label: "Витрина" },
  { id: "events", label: "Афиша" },
  { id: "content", label: "Контент" },
  { id: "posts", label: "Канал" },
  { id: "settings", label: "Настройки" },
];

const FIELD =
  "w-full min-h-[44px] rounded-[12px] border border-line bg-paper px-3.5 py-2.5 text-[13.5px] font-semibold outline-none focus:border-gold-deep focus:ring-3 focus:ring-gold/25";
const LABEL = "mb-1 block text-[10.5px] font-extrabold uppercase tracking-[0.12em] text-ink-soft";

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-[#e2ebf2] text-[#46698c]",
  paid: "bg-moss/20 text-moss",
  done: "bg-gold/25 text-gold-deep",
  closed: "bg-ink/10 text-ink-soft",
};

function compressImage(file: File, maxSide = 900): Promise<string> {
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
      <div className={`w-full max-w-md rounded-[28px] border border-line bg-card p-8 shadow-[0_50px_110px_-50px_rgba(35,33,29,0.6)] sm:p-9 ${err ? "fadeup" : ""}`}>
        <div className="flex items-center gap-3.5">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-gold">
            <IconLock className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-[20px] font-semibold">Админ-панель</h1>
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
          {err && <p className="fadeup rounded-[10px] border border-[#b3552f]/40 bg-[#f4d9cc] px-4 py-2.5 text-[13px] font-bold">Неверный логин или пароль</p>}
          <button className="min-h-[48px] w-full rounded-full bg-ink px-6 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.12em] text-card transition-colors hover:bg-gold-deep">
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

function OrderRow({ o }: { o: Order }) {
  const [showForm, setShowForm] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const date = new Date(o.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  const f = o.form;
  const rows: [string, string | undefined][] = f
    ? [
        ["Город", f.city], ["Пол", f.gender], ["Возраст", f.age],
        ["Опыт терапии", f.therapyExp], ["Опыт практик", f.bodyExp],
        ["Психические заболевания", f.mental], ["Эпилепсия", f.epilepsy],
        ["Операции (полгода)", f.surgery], ["Грыжи / ОДА", f.hernia],
        ["Беременность", f.pregnancy], ["Основной запрос", f.request],
      ]
    : [];

  return (
    <div className="fadeup rounded-[20px] border border-line bg-card">
      <div className="grid gap-3 px-5 py-4 lg:grid-cols-[170px_1fr_auto] lg:items-center">
        <div>
          <p className="font-display text-[16px] font-semibold">{o.name}</p>
          <p className="mt-0.5 text-[12.5px] font-semibold text-ink-soft">{o.contact}</p>
          <p className="mt-0.5 text-[11px] font-medium text-ink-faint">{date} · №{o.id.slice(-5).toUpperCase()}</p>
        </div>
        <div className="text-[13px] leading-snug">
          <p className="font-bold">{o.serviceTitle} <span className="ml-1.5 rounded-full bg-stone px-2.5 py-0.5 text-[11px] font-bold text-ink-soft">{o.price}</span></p>
          {o.comment && <p className="mt-1 text-ink-soft">«{o.comment}»</p>}
          {f && (
            <button onClick={() => setShowForm((v) => !v)} className="mt-1.5 text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-gold-deep hover:underline">
              {showForm ? "Свернуть анкету ▲" : "Анкета клиента ▼"}
            </button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="relative">
            <select
              value={o.status}
              onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
              className={`min-h-[44px] cursor-pointer appearance-none rounded-full py-2.5 pl-4 pr-9 text-[12px] font-extrabold outline-none transition-all ${STATUS_STYLE[o.status]}`}
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m6 9.5 6 6 6-6" /></svg>
          </span>
          <button
            onClick={() => (confirm ? deleteOrder(o.id) : setConfirm(true))}
            className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] font-bold transition-all ${
              confirm ? "bg-[#b3552f] text-card" : "border border-line text-ink-soft hover:border-[#b3552f] hover:text-[#b3552f]"
            }`}
          >
            <IconTrash className="h-3.5 w-3.5" />
            {confirm ? "Точно удалить?" : ""}
          </button>
        </div>
      </div>
      {f && showForm && (
        <div className="fadeup grid gap-x-6 gap-y-2.5 border-t border-dashed border-line px-5 py-4 sm:grid-cols-2">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <p key={k} className="text-[12.5px] leading-relaxed"><span className="font-extrabold text-ink-faint">{k}:</span> <span className="font-semibold">{v}</span></p>
          ))}
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const { db } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const orders = db.orders.filter((o) => filter === "all" || o.status === filter);
  const count = (s: OrderStatus) => db.orders.filter((o) => o.status === s).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-[24px] font-semibold">Заказы <span className="text-[16px] text-ink-faint">({db.orders.length})</span></h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")} className={`min-h-[44px] rounded-full px-4 py-2 text-[12px] font-bold transition-all ${filter === "all" ? "bg-ink text-card" : "bg-ink/8 text-ink-soft hover:bg-ink/15"}`}>Все</button>
          {ORDER_STATUSES.map((s) => (
            <button key={s.value} onClick={() => setFilter(s.value)} className={`min-h-[44px] rounded-full px-4 py-2 text-[12px] font-bold transition-all ${filter === s.value ? "bg-ink text-card" : "bg-ink/8 text-ink-soft hover:bg-ink/15"}`}>
              {s.label} · {count(s.value)}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-ink/15 py-16 text-center">
          <IconCart className="h-9 w-9 text-ink/25" />
          <p className="mt-4 font-display text-[16px] font-semibold text-ink-soft">
            {db.orders.length === 0 ? "Заказов пока нет — заявки с сайта появятся здесь" : "В этом статусе заказов нет"}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {orders.map((o) => <OrderRow key={o.id} o={o} />)}
        </div>
      )}
      <p className="mt-6 text-[12px] font-medium leading-relaxed text-ink-faint">
        Оплата пока не подключена: согласуйте оплату вручную (карта/СБП/наличные), затем переведите заказ в «Оплачен». После встречи — «Проведена встреча», по завершении цикла — «Закрыт».
      </p>
    </div>
  );
}

/* ================= ВИТРИНА ================= */

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
    } catch { /* не удалось прочитать */ }
  };

  return (
    <div className="rounded-[24px] border border-line bg-stone/50 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-[18px] font-semibold">{s.title}</p>
        <button onClick={save} className={`min-h-[44px] rounded-full px-5 py-2.5 text-[12.5px] font-bold transition-all ${saved ? "bg-moss text-card" : "bg-ink text-card hover:bg-gold-deep"}`}>
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
        <fieldset key={vv.id} className="mt-5 rounded-[18px] border border-line bg-card px-4 py-4 sm:px-5">
          <legend className="px-2 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-gold-deep">
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
              <input className={FIELD} value={vv.packLabel ?? ""} onChange={(e) => setV(i, { packLabel: e.target.value || undefined })} /></label>
            <label className="block"><span className={LABEL}>Экономия (бейдж)</span>
              <input className={FIELD} value={vv.packBenefit ?? ""} placeholder="−2 000 ₽" onChange={(e) => setV(i, { packBenefit: e.target.value || undefined })} /></label>
            <label className="block"><span className={LABEL}>Бейдж на фото</span>
              <input className={FIELD} value={vv.badge ?? ""} placeholder="Выгода от 20%" onChange={(e) => setV(i, { badge: e.target.value || undefined })} /></label>
            <label className="block sm:col-span-2"><span className={LABEL}>Описание</span>
              <textarea rows={3} className={`${FIELD} resize-y`} value={vv.description} onChange={(e) => setV(i, { description: e.target.value })} /></label>
          </div>
          <div className="mt-3.5 flex flex-wrap items-center gap-4">
            <img src={vv.image} alt="" className="h-16 w-24 rounded-[12px] border border-line object-cover" />
            <button onClick={() => { setPendingImg(i); fileRef.current?.click(); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2 text-[12px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-card">
              <IconUpload className="h-3.5 w-3.5" /> Заменить фото
            </button>
            <span className="text-[11.5px] font-medium text-ink-faint">На сайте: <b>{fmtPrice(vv.price)}</b> · изменения появятся после «Сохранить»</span>
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
      <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">Каждая карточка содержит два формата — «Индивидуальная» и «Групповая». Цена, фото, описание и экономия редактируются для каждого формата отдельно.</p>
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
        <button onClick={addEvent} className="min-h-[44px] rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
          + Добавить мероприятие
        </button>
      </div>
      <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">Изменения сохраняются сразу и мгновенно отображаются на сайте.</p>
      <div className="mt-6 space-y-3">
        {db.events.map((e: EventItem) => (
          <div key={e.id} className="fadeup rounded-[20px] border border-line bg-card px-4 py-4 sm:px-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_170px_120px_120px_1fr_auto] lg:items-center">
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
              <button onClick={() => deleteEvent(e.id)} className="grid h-11 w-11 place-items-center justify-self-start rounded-full border border-line text-ink-soft transition-colors hover:border-[#b3552f] hover:text-[#b3552f] lg:justify-self-end" aria-label="Удалить">
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              <input className={FIELD} value={e.priceNote ?? ""} placeholder="Примечание к цене (абонемент)" onChange={(ev) => updateEvent(e.id, { priceNote: ev.target.value || undefined })} aria-label="Примечание к цене" />
              <textarea rows={2} className={`${FIELD} resize-y`} value={e.desc ?? ""} placeholder="Описание мероприятия" onChange={(ev) => updateEvent(e.id, { desc: ev.target.value || undefined })} aria-label="Описание" />
            </div>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-[24px] font-semibold">Контент сайта</h2>
        {msg && <span className="fadeup rounded-full bg-moss px-4 py-2 text-[12px] font-bold text-card">{msg}</span>}
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-5 sm:p-6">
        <p className="font-display text-[16px] font-semibold">Фото для раздела «Обо мне»</p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <img src={c.about.photo} alt="Текущее фото" className="h-28 w-24 rounded-[16px] border border-line object-cover" />
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-5 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
              <IconUpload className="h-4 w-4" /> Загрузить новое фото
            </button>
            <p className="text-[11.5px] font-medium text-ink-faint">JPG/PNG · автоматически сжимается и сохраняется в базе сайта</p>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-5 sm:p-6">
        <p className="font-display text-[16px] font-semibold">Текст «Обо мне»</p>
        <label className="mt-4 block"><span className={LABEL}>Абзацы (пустая строка разделяет абзацы)</span>
          <textarea rows={9} className={`${FIELD} resize-y leading-relaxed`} value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /></label>
        <label className="mt-4 block"><span className={LABEL}>Плашки через запятую</span>
          <input className={FIELD} value={chips} onChange={(e) => setChips(e.target.value)} /></label>
        <button
          onClick={() => {
            updateContent({ about: { ...c.about, paragraphs: paragraphs.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean), chips: chips.split(",").map((x) => x.trim()).filter(Boolean) } });
            flash("Раздел «Обо мне» сохранён ✓");
          }}
          className="mt-4 min-h-[44px] rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep"
        >
          Сохранить «Обо мне»
        </button>
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-5 sm:p-6">
        <p className="font-display text-[16px] font-semibold">Баннер «Мультикультурный подход»</p>
        <label className="mt-4 block"><span className={LABEL}>Заголовок</span>
          <input className={FIELD} value={culture.title} onChange={(e) => setCulture({ ...culture, title: e.target.value })} /></label>
        <label className="mt-4 block"><span className={LABEL}>Текст</span>
          <textarea rows={5} className={`${FIELD} resize-y leading-relaxed`} value={culture.text} onChange={(e) => setCulture({ ...culture, text: e.target.value })} /></label>
        <button onClick={() => { updateContent({ culture }); flash("Баннер сохранён ✓"); }} className="mt-4 min-h-[44px] rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
          Сохранить баннер
        </button>
      </div>

      <div className="rounded-[24px] border border-line bg-stone/50 p-5 sm:p-6">
        <p className="font-display text-[16px] font-semibold">Контактные данные</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={LABEL}>Телефон (как показывать)</span><input className={FIELD} value={contacts.phoneDisplay} onChange={(e) => setContacts({ ...contacts, phoneDisplay: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка tel:</span><input className={FIELD} value={contacts.phoneHref} onChange={(e) => setContacts({ ...contacts, phoneHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Telegram (как показывать)</span><input className={FIELD} value={contacts.telegram} onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка на Telegram</span><input className={FIELD} value={contacts.telegramHref} onChange={(e) => setContacts({ ...contacts, telegramHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>ВКонтакте (как показывать)</span><input className={FIELD} value={contacts.vk} onChange={(e) => setContacts({ ...contacts, vk: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка на ВКонтакте</span><input className={FIELD} value={contacts.vkHref} onChange={(e) => setContacts({ ...contacts, vkHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Канал МАХ (как показывать)</span><input className={FIELD} value={contacts.max} onChange={(e) => setContacts({ ...contacts, max: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Ссылка на канал МАХ</span><input className={FIELD} value={contacts.maxHref} onChange={(e) => setContacts({ ...contacts, maxHref: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Примечание</span><input className={FIELD} value={contacts.note} onChange={(e) => setContacts({ ...contacts, note: e.target.value })} /></label>
          <label className="block"><span className={LABEL}>Финальная фраза</span><input className={FIELD} value={contacts.signoff} onChange={(e) => setContacts({ ...contacts, signoff: e.target.value })} /></label>
        </div>
        <label className="mt-4 block"><span className={LABEL}>URL автоподгрузки публикаций МАХ (RSS/JSON, если появится API)</span>
          <input className={FIELD} value={feedUrl} onChange={(e) => setFeedUrl(e.target.value)} placeholder="https://…" /></label>
        <button onClick={() => { updateContent({ contacts, feedUrl }); flash("Контакты сохранены ✓"); }} className="mt-4 min-h-[44px] rounded-full bg-ink px-6 py-3 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
          Сохранить контакты
        </button>
      </div>
    </div>
  );
}

/* ================= КАНАЛ ================= */

function PostsTab() {
  const { db } = useStore();
  const [pendingImg, setPendingImg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !pendingImg) return;
    try {
      updatePost(pendingImg, { image: await compressImage(f) });
    } catch { /* ignore */ }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-[24px] font-semibold">Публикации канала</h2>
        <button onClick={addPost} className="min-h-[44px] rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
          + Добавить публикацию
        </button>
      </div>
      <p className="mt-1 text-[12.5px] font-semibold text-ink-soft">Показываются в блоке «Актуальное из моего канала», пока у МАХ нет публичного API.</p>
      <input ref={fileRef} type="file" accept="image/*" onChange={onImage} className="hidden" />
      <div className="mt-6 space-y-3">
        {db.posts.map((p: Post) => (
          <div key={p.id} className="fadeup rounded-[20px] border border-line bg-card px-4 py-4 sm:px-5">
            <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-center">
              <input className={FIELD} value={p.date} onChange={(e) => updatePost(p.id, { date: e.target.value })} aria-label="Дата" />
              <input className={FIELD} value={p.title} onChange={(e) => updatePost(p.id, { title: e.target.value })} aria-label="Заголовок" />
              <button onClick={() => deletePost(p.id)} className="grid h-11 w-11 place-items-center justify-self-start rounded-full border border-line text-ink-soft transition-colors hover:border-[#b3552f] hover:text-[#b3552f]" aria-label="Удалить">
                <IconTrash className="h-4 w-4" />
              </button>
            </div>
            <textarea rows={2} className={`${FIELD} mt-3 resize-y`} value={p.text} onChange={(e) => updatePost(p.id, { text: e.target.value })} aria-label="Текст" />
            <div className="mt-3 flex flex-wrap items-center gap-4">
              {p.image ? (
                <img src={p.image} alt="" className="h-14 w-20 rounded-[10px] border border-line object-cover" />
              ) : (
                <span className="grid h-14 w-20 place-items-center rounded-[10px] border-2 border-dashed border-ink/15 text-[10px] font-bold text-ink-faint">без фото</span>
              )}
              <button onClick={() => { setPendingImg(p.id); fileRef.current?.click(); }} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-ink/15 px-4 py-2 text-[12px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-card">
                <IconUpload className="h-3.5 w-3.5" /> {p.image ? "Заменить фото" : "Загрузить фото"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= НАСТРОЙКИ + ДОКУМЕНТАЦИЯ ================= */

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-[24px] border border-line bg-stone/50 p-5 sm:p-6">
      <p className="font-display text-[16px] font-semibold">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const CODE = "mt-1 block overflow-x-auto whitespace-pre rounded-[12px] bg-ink px-4 py-3.5 text-[12px] leading-relaxed text-[#e8e2d5]";

function SettingsTab() {
  const { session, logout } = useStore();
  const [pass, setPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const importRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState("");

  const doExport = () => {
    const blob = new Blob([exportDB()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `probalance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const doImport = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setImportMsg(importDB(String(r.result)) ? "База импортирована ✓" : "Ошибка: файл не похож на резервную копию сайта");
    r.readAsText(f);
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-[24px] font-semibold">Настройки и документация</h2>

      <Block title="Пароль администратора">
        <div className="flex flex-wrap items-center gap-3">
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Новый пароль (мин. 6 символов)" className={`${FIELD} max-w-sm`} />
          <button
            onClick={() => {
              if (pass.trim().length < 6) { setPassMsg("Пароль должен быть не короче 6 символов"); return; }
              changePassword(session!.login, pass.trim());
              setPass("");
              setPassMsg("Пароль обновлён ✓");
              setTimeout(() => setPassMsg(""), 2500);
            }}
            className="min-h-[44px] rounded-full bg-ink px-6 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep"
          >
            Сменить
          </button>
          {passMsg && <span className="text-[12.5px] font-bold text-gold-deep">{passMsg}</span>}
        </div>
      </Block>

      <Block title="Резервное копирование базы">
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={doExport} className="min-h-[44px] rounded-full bg-ink px-6 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
            Экспорт базы (JSON)
          </button>
          <input ref={importRef} type="file" accept="application/json" onChange={doImport} className="hidden" />
          <button onClick={() => importRef.current?.click()} className="min-h-[44px] rounded-full border-2 border-ink/15 px-6 py-2.5 text-[12.5px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-card">
            Импорт базы
          </button>
          <button onClick={() => { if (window.confirm("Точно сбросить все данные к исходным?")) resetDB(); }} className="min-h-[44px] rounded-full border border-[#b3552f]/50 px-6 py-2.5 text-[12.5px] font-bold text-[#b3552f] transition-colors hover:bg-[#f4d9cc]">
            Сбросить к исходным
          </button>
          {importMsg && <span className="text-[12.5px] font-bold text-gold-deep">{importMsg}</span>}
        </div>
        <p className="mt-3 text-[12px] font-medium leading-relaxed text-ink-faint">
          База хранится в localStorage браузера. Экспортируйте её перед переносом сайта на другое устройство или чисткой браузера.
        </p>
      </Block>

      <Block title="Инструкция администратора: низкоуровневые компоненты">
        <ul className="list-disc space-y-2 pl-5 text-[13px] leading-relaxed text-ink-soft">
          <li>«База данных» сайта — таблицы <b>users, services, orders, events, posts, content</b> в localStorage (ключ <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">probalance-db-v4</code>). Сессия входа — в sessionStorage.</li>
          <li><b>Статусы заказов:</b> Новый → Оплачен → Проведена встреча → Закрыт. Оплата пока согласуется вручную.</li>
          <li><b>Витрина:</b> изменения цен, текстов и фото применяются мгновенно после «Сохранить».</li>
          <li><b>Отладка:</b> в консоли браузера база доступна как <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">JSON.parse(localStorage.getItem('probalance-db-v4'))</code>.</li>
          <li><b>Роли:</b> доступ к админ-панели имеет только роль «администратор» (сейчас — единственный пользователь).</li>
        </ul>
      </Block>

      <Block title="Перенос и запуск сайта на хостинге / VDS">
        <ol className="list-decimal space-y-2.5 pl-5 text-[13px] leading-relaxed text-ink-soft">
          <li>Соберите проект: <code className={CODE}>npm install{"\n"}npm run build</code></li>
          <li><b>Shared-хостинг (reg.ru и т.п.):</b> загрузите <b>содержимое</b> папки <b>dist/</b> (index.html + assets/) в корень сайта — <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">public_html/</code>. Исходники (src/, node_modules/) загружать не нужно.</li>
          <li>Туда же положите файл <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">.htaccess</code> (в проекте — deploy/htaccess) — он задаёт MIME-типы и SPA-перезапись.</li>
          <li><b>VDS + nginx:</b><code className={CODE}>{`server {
  listen 80;
  server_name vash-domen.ru;
  root /var/www/probalance;
  index index.html;
  location / { try_files $uri /index.html; }
}`}</code></li>
          <li>HTTPS: <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">sudo certbot --nginx -d vash-domen.ru</code></li>
          <li><b>Docker:</b> <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">docker compose -f deploy/docker-compose.yml up -d --build</code></li>
          <li><b>Перенос данных:</b> «Экспорт базы» на старом устройстве → «Импорт базы» на новом.</li>
        </ol>
      </Block>

      <Block title="Интеграция с каналом МАХ">
        <p className="text-[13px] leading-relaxed text-ink-soft">
          Блок «Актуальное из канала» пробует автоматически подгрузить публикации по URL из «Контент → URL автоподгрузки»
          (RSS/JSON, таймаут 4 с, формат: <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[11.5px]">[{'{"date","title","text","image"}'}]</code>).
          Пока публичного API у МАХ нет — поле пустое, блок показывает публикации из вкладки «Канал». Как только API появится — достаточно вставить URL.
        </p>
      </Block>

      <button onClick={logout} className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-6 py-3 text-[12.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
        <IconSend className="h-4 w-4 -rotate-45" /> Выйти из админ-панели
      </button>
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
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-gold">
              <YinYang className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[16px] font-semibold">Админ-панель</p>
              <p className="text-[11px] font-semibold text-ink-soft">
                {session.login} · роль: <span className="text-gold-deep">администратор</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="#/" className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-line px-4 py-2 text-[12px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
              На сайт
            </a>
            <button onClick={logout} className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12px] font-bold text-card transition-colors hover:bg-gold-deep">
              <IconLock className="h-3.5 w-3.5" /> Выйти
            </button>
          </div>
        </div>
      </header>

      <div className="sticky top-[62px] z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto no-scrollbar px-5 py-2.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all min-h-[44px] ${
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

      <main className="mx-auto max-w-6xl px-5 py-8 pb-24">
        {tab === "orders" && <OrdersTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "events" && <EventsTab />}
        {tab === "content" && <ContentTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "settings" && <SettingsTab />}
      </main>

      <footer className="border-t border-line py-6 text-center text-[12px] font-medium text-ink-faint">
        Админ-панель · доступ только для роли «администратор» · данные хранятся в базе сайта
      </footer>
    </div>
  );
}
