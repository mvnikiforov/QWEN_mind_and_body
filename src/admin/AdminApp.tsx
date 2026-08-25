import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useStore } from "../lib/store";
import {
  deleteOrder,
  fmtPrice,
  ORDER_STATUSES,
  setOrderStatus,
  updateContent,
  updateService,
  type Order,
  type OrderStatus,
  type Service,
} from "../lib/db";
import { IconCart, IconLock, IconSend, IconTrash, IconUpload, AsteriskMark } from "../components/icons";
import DocsTab from "./DocsTab";

type Tab = "orders" | "services" | "content" | "docs";

const TABS: { id: Tab; label: string }[] = [
  { id: "orders", label: "Заказы" },
  { id: "services", label: "Витрина" },
  { id: "content", label: "Контент" },
  { id: "docs", label: "Настройки и документация" },
];

const STATUS_STYLE: Record<OrderStatus, string> = {
  new: "bg-sky text-ink",
  paid: "bg-mint text-ink",
  done: "bg-gold text-ink",
  closed: "bg-ink/12 text-ink-soft",
};

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
      setTimeout(() => setErr(false), 600);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream/70 px-5">
      <div className={`w-full max-w-md rounded-[30px] border border-ink/10 bg-paper p-9 shadow-[0_50px_110px_-50px_rgba(51,46,61,0.6)] ${err ? "fadeup" : ""}`} style={err ? { animationName: "fadeup" } : undefined}>
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-peach">
            <IconLock className="h-5.5 w-5.5" style={{ height: 22, width: 22 }} />
          </span>
          <div>
            <h1 className="font-display text-lg font-bold">Админ-панель</h1>
            <p className="text-[12.5px] font-semibold text-ink-soft">Вход только для роли «Администратор»</p>
          </div>
        </div>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-extrabold uppercase tracking-wide text-ink-soft">Логин</span>
            <input value={l} onChange={(e) => setL(e.target.value)} autoComplete="username"
              className="w-full rounded-[14px] border border-ink/15 px-4 py-3 text-[15px] font-semibold outline-none focus:border-peach-deep focus:ring-4 focus:ring-peach/40" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[12px] font-extrabold uppercase tracking-wide text-ink-soft">Пароль</span>
            <input type="password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password"
              className="w-full rounded-[14px] border border-ink/15 px-4 py-3 text-[15px] font-semibold outline-none focus:border-peach-deep focus:ring-4 focus:ring-peach/40" />
          </label>
          {err && <p className="fadeup rounded-[10px] bg-peach/70 border border-peach-deep/40 px-4 py-2.5 text-[13px] font-bold">Неверный логин или пароль</p>}
          <button className="w-full rounded-full bg-ink px-6 py-3.5 text-[14.5px] font-bold text-paper transition-colors hover:bg-peach-deep">
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

function OrdersTab() {
  const { db } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const orders = db.orders.filter((o) => filter === "all" || o.status === filter);
  const count = (s: OrderStatus) => db.orders.filter((o) => o.status === s).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold">Заказы <span className="text-ink-faint text-base font-semibold">({db.orders.length})</span></h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setFilter("all")}
            className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all ${filter === "all" ? "bg-ink text-paper" : "bg-ink/8 text-ink-soft hover:bg-ink/15"}`}>
            Все
          </button>
          {ORDER_STATUSES.map((s) => (
            <button key={s.value} onClick={() => setFilter(s.value)}
              className={`rounded-full px-4 py-2 text-[12.5px] font-bold transition-all ${filter === s.value ? "bg-ink text-paper" : "bg-ink/8 text-ink-soft hover:bg-ink/15"}`}>
              {s.label} · {count(s.value)}
            </button>
          ))}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[26px] border-2 border-dashed border-ink/15 py-20 text-center">
          <IconCart className="h-9 w-9 text-ink/25" />
          <p className="mt-4 font-display text-[15px] font-bold text-ink-soft">
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
        Оплата пока не подключена: согласуйте оплату вручную (карта/СБП/наличные), затем переведите заказ в «Оплачен». После встречи — «Проведена встреча», по завершении цикла — «Закрыт».
      </p>
    </div>
  );
}

function OrderRow({ o, confirm, onAskDelete }: { o: Order; confirm: boolean; onAskDelete: () => void }) {
  const date = new Date(o.createdAt).toLocaleString("ru-RU", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  return (
    <div className="fadeup grid gap-4 rounded-[22px] border border-ink/10 bg-paper p-5 transition-shadow hover:shadow-[0_20px_44px_-28px_rgba(51,46,61,0.4)] lg:grid-cols-[150px_1fr_auto] lg:items-center">
      <div>
        <p className="font-display text-[15px] font-bold">{o.name}</p>
        <p className="mt-0.5 text-[12.5px] font-semibold text-ink-soft">{o.contact}</p>
        <p className="mt-0.5 text-[11.5px] font-medium text-ink-faint">{date} · №{o.id.slice(-5).toUpperCase()}</p>
      </div>
      <div className="text-[13.5px] leading-snug">
        <p className="font-bold">{o.serviceTitle} <span className="ml-1.5 rounded-full bg-cream px-2.5 py-0.5 text-[11.5px] font-bold text-ink-soft">{o.price}</span></p>
        {o.comment && <p className="mt-1 text-ink-soft">«{o.comment}»</p>}
      </div>
      <div className="flex flex-wrap items-center gap-2.5">
        <label className="relative">
          <select
            value={o.status}
            onChange={(e) => setOrderStatus(o.id, e.target.value as OrderStatus)}
            className={`appearance-none rounded-full py-2.5 pl-4 pr-9 text-[12.5px] font-extrabold outline-none cursor-pointer transition-all ${STATUS_STYLE[o.status]}`}
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
            confirm ? "bg-peach-deep text-paper" : "border border-ink/15 text-ink-soft hover:border-peach-deep hover:text-peach-deep"
          }`}
        >
          <IconTrash className="h-3.5 w-3.5" />
          {confirm ? "Точно удалить?" : ""}
        </button>
      </div>
    </div>
  );
}

/* ================= ВИТРИНА ================= */

function ServiceEditor({ s }: { s: Service }) {
  const [d, setD] = useState(s);
  const [saved, setSaved] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setD(s); }, [s]);
  const set = (patch: Partial<Service>) => setD((v) => ({ ...v, ...patch }));

  const onImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const dataUrl = await compressImage(f, 720);
      set({ image: dataUrl });
    } catch { /* игнорируем нечитаемый файл */ }
  };

  const save = () => {
    updateService(s.id, { ...d, price: Number(d.price) || 0, subscriberPrice: d.subscriberPrice != null && d.subscriberPrice !== 0 ? Number(d.subscriberPrice) : undefined });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const field = "w-full rounded-[12px] border border-ink/15 bg-paper px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-peach-deep focus:ring-3 focus:ring-peach/40";
  const label = "mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-ink-soft";

  return (
    <div className="rounded-[24px] border border-ink/10 bg-cream/50 p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-[14px] font-bold">
          <span className="mr-2 rounded-full bg-ink px-2.5 py-1 text-[10.5px] uppercase tracking-wider text-peach">{s.kind}</span>
          {s.title}
        </p>
        <button onClick={save}
          className={`rounded-full px-5 py-2.5 text-[13px] font-bold transition-all ${saved ? "bg-mint-deep text-paper" : "bg-ink text-paper hover:bg-peach-deep"}`}>
          {saved ? "Сохранено ✓" : "Сохранить"}
        </button>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="block sm:col-span-2"><span className={label}>Название</span>
          <input className={field} value={d.title} onChange={(e) => set({ title: e.target.value })} /></label>
        <label className="block"><span className={label}>Длительность / формат</span>
          <input className={field} value={d.duration} onChange={(e) => set({ duration: e.target.value })} /></label>
        <label className="block"><span className={label}>Цена, ₽ (0 = бесплатно)</span>
          <input type="number" className={field} value={d.price} onChange={(e) => set({ price: Number(e.target.value) })} /></label>
        <label className="block"><span className={label}>Цена для подписчиков, ₽</span>
          <input type="number" className={field} value={d.subscriberPrice ?? ""} placeholder="—"
            onChange={(e) => set({ subscriberPrice: e.target.value === "" ? undefined : Number(e.target.value) })} /></label>
        <label className="block"><span className={label}>Приписка к цене</span>
          <input className={field} value={d.priceUnit ?? ""} placeholder="например: за встречу"
            onChange={(e) => set({ priceUnit: e.target.value || undefined })} /></label>
        <label className="block"><span className={label}>Бейдж</span>
          <input className={field} value={d.badge ?? ""} placeholder="например: Выгодно −5 000 ₽"
            onChange={(e) => set({ badge: e.target.value || undefined })} /></label>
        <label className="block"><span className={label}>Текст на кнопке</span>
          <input className={field} value={d.cta} onChange={(e) => set({ cta: e.target.value })} /></label>
        <label className="block sm:col-span-2 lg:col-span-3"><span className={label}>Заметка под описанием (для мастер-класса — тема и дата)</span>
          <input className={field} value={d.note ?? ""} onChange={(e) => set({ note: e.target.value || undefined })} /></label>
        <label className="block sm:col-span-2 lg:col-span-3"><span className={label}>Описание</span>
          <textarea rows={3} className={`${field} resize-y`} value={d.description} onChange={(e) => set({ description: e.target.value })} /></label>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <input ref={imgRef} type="file" accept="image/*" onChange={onImage} className="hidden" />
        {d.image ? (
          <img src={d.image} alt="" className="h-20 w-28 rounded-[14px] border border-ink/10 object-cover" />
        ) : (
          <span className="grid h-20 w-28 place-items-center rounded-[14px] border-2 border-dashed border-ink/15 text-[11px] font-bold text-ink-faint">без фото</span>
        )}
        <button onClick={() => imgRef.current?.click()} className="rounded-full border-2 border-ink/15 px-4 py-2.5 text-[12.5px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-paper">
          {d.image ? "Заменить фото" : "Загрузить фото"}
        </button>
        {d.image && (
          <button onClick={() => set({ image: undefined })} className="rounded-full border border-peach-deep/50 px-4 py-2.5 text-[12.5px] font-bold text-peach-deep transition-colors hover:bg-peach/60">
            Убрать фото
          </button>
        )}
        <span className="text-[12px] font-medium text-ink-faint">Необязательно · фото появится сверху карточки · не забудьте «Сохранить»</span>
      </div>
      <p className="mt-3 text-[12px] font-medium text-ink-faint">
        На сайте сейчас: <b>{fmtPrice(s.price)}</b>{s.subscriberPrice ? ` · подписчикам ${fmtPrice(s.subscriberPrice)}` : ""} — изменения появятся сразу после «Сохранить».
      </p>
    </div>
  );
}

function ServicesTab() {
  const { db } = useStore();
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Карточки витрины</h2>
        <p className="text-[12.5px] font-semibold text-ink-soft">Переключатель «Для подписчиков» меняет цену только у индивидуальной консультации</p>
      </div>
      <div className="mt-6 space-y-5">
        {db.services.map((s) => <ServiceEditor key={s.id} s={s} />)}
      </div>
    </div>
  );
}

/* ================= КОНТЕНТ ================= */

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

function ContentTab() {
  const { db } = useStore();
  const c = db.content;
  const [paragraphs, setParagraphs] = useState(c.about.paragraphs.join("\n\n"));
  const [chips, setChips] = useState(c.about.chips.join(", "));
  const [culture, setCulture] = useState(c.culture);
  const [contacts, setContacts] = useState(c.contacts);
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (t: string) => { setMsg(t); setTimeout(() => setMsg(""), 2000); };

  const onPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const dataUrl = await compressImage(f);
      updateContent({ about: { ...c.about, photo: dataUrl } });
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

  const field = "w-full rounded-[12px] border border-ink/15 bg-paper px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-peach-deep focus:ring-3 focus:ring-peach/40";
  const label = "mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-ink-soft";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Контент сайта</h2>
        {msg && <span className="fadeup rounded-full bg-mint-deep px-4 py-2 text-[12.5px] font-bold text-paper">{msg}</span>}
      </div>

      {/* Фото */}
      <div className="rounded-[24px] border border-ink/10 bg-cream/50 p-6">
        <p className="font-display text-[14px] font-bold">Фото для раздела «Обо мне»</p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <img src={c.about.photo} alt="Текущее фото" className="h-28 w-24 rounded-[18px] border border-ink/10 object-cover" />
          <div className="space-y-2">
            <input ref={fileRef} type="file" accept="image/*" onChange={onPhoto} className="hidden" />
            <button onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-peach-deep">
              <IconUpload className="h-4 w-4" /> Загрузить новое фото
            </button>
            <p className="text-[12px] font-medium text-ink-faint">JPG/PNG · автоматически сжимается и сохраняется в базе сайта</p>
          </div>
        </div>
      </div>

      {/* Обо мне */}
      <div className="rounded-[24px] border border-ink/10 bg-cream/50 p-6">
        <p className="font-display text-[14px] font-bold">Текст «Обо мне»</p>
        <label className="mt-4 block"><span className={label}>Абзацы (пустая строка разделяет абзацы)</span>
          <textarea rows={9} className={`${field} resize-y leading-relaxed`} value={paragraphs} onChange={(e) => setParagraphs(e.target.value)} /></label>
        <label className="mt-4 block"><span className={label}>Плашки через запятую</span>
          <input className={field} value={chips} onChange={(e) => setChips(e.target.value)} /></label>
        <button onClick={saveAbout} className="mt-4 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-peach-deep">Сохранить «Обо мне»</button>
      </div>

      {/* Культурный код */}
      <div className="rounded-[24px] border border-ink/10 bg-cream/50 p-6">
        <p className="font-display text-[14px] font-bold">Блок «Бережность к культурному коду»</p>
        <label className="mt-4 block"><span className={label}>Заголовок</span>
          <input className={field} value={culture.title} onChange={(e) => setCulture({ ...culture, title: e.target.value })} /></label>
        <label className="mt-4 block"><span className={label}>Текст</span>
          <textarea rows={5} className={`${field} resize-y leading-relaxed`} value={culture.text} onChange={(e) => setCulture({ ...culture, text: e.target.value })} /></label>
        <button onClick={() => { updateContent({ culture }); flash("Блок сохранён ✓"); }}
          className="mt-4 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-peach-deep">Сохранить блок</button>
      </div>

      {/* Контакты */}
      <div className="rounded-[24px] border border-ink/10 bg-cream/50 p-6">
        <p className="font-display text-[14px] font-bold">Контактные данные</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={label}>Телефон (как показывать)</span>
            <input className={field} value={contacts.phoneDisplay} onChange={(e) => setContacts({ ...contacts, phoneDisplay: e.target.value })} /></label>
          <label className="block"><span className={label}>Ссылка tel:</span>
            <input className={field} value={contacts.phoneHref} onChange={(e) => setContacts({ ...contacts, phoneHref: e.target.value })} /></label>
          <label className="block"><span className={label}>Telegram (как показывать)</span>
            <input className={field} value={contacts.telegram} onChange={(e) => setContacts({ ...contacts, telegram: e.target.value })} /></label>
          <label className="block"><span className={label}>Ссылка на Telegram</span>
            <input className={field} value={contacts.telegramHref} onChange={(e) => setContacts({ ...contacts, telegramHref: e.target.value })} /></label>
          <label className="block"><span className={label}>Примечание</span>
            <input className={field} value={contacts.note} onChange={(e) => setContacts({ ...contacts, note: e.target.value })} /></label>
          <label className="block"><span className={label}>Финальная фраза</span>
            <input className={field} value={contacts.signoff} onChange={(e) => setContacts({ ...contacts, signoff: e.target.value })} /></label>
        </div>
        <button onClick={() => { updateContent({ contacts }); flash("Контакты сохранены ✓"); }}
          className="mt-4 rounded-full bg-ink px-6 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-peach-deep">Сохранить контакты</button>
      </div>
    </div>
  );
}

/* ================= КАРКАС АДМИНКИ ================= */

export default function AdminApp() {
  const { session, logout } = useStore();
  const { db } = useStore();
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => { window.scrollTo(0, 0); }, [tab]);

  if (!session) return <LoginScreen />;

  const newCount = db.orders.filter((o) => o.status === "new").length;

  return (
    <div className="min-h-screen bg-paper">
      {/* Топбар */}
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-peach">
              <AsteriskMark className="h-4.5 w-4.5" style={{ height: 18, width: 18 }} strokeWidth={2.4} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-bold">Админ-панель</p>
              <p className="text-[11.5px] font-semibold text-ink-soft">
                {session.login} · роль: <span className="text-peach-deep">{session.role === "admin" ? "администратор" : session.role}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a href="#/" className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-[12.5px] font-bold text-ink-soft transition-colors hover:border-ink hover:text-ink">
              <IconSend className="h-3.5 w-3.5 -rotate-45" /> На сайт
            </a>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[12.5px] font-bold text-paper transition-colors hover:bg-peach-deep">
              <IconLock className="h-3.5 w-3.5" /> Выйти
            </button>
          </div>
        </div>
      </header>

      {/* Вкладки */}
      <div className="sticky top-[62px] z-30 border-b border-ink/8 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl gap-1.5 overflow-x-auto px-5 py-2.5">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`relative shrink-0 rounded-full px-4.5 px-5 py-2.5 text-[13px] font-bold transition-all ${
                tab === t.id ? "bg-ink text-paper shadow-md" : "text-ink-soft hover:bg-ink/8 hover:text-ink"
              }`} style={{ padding: "10px 20px" }}>
              {t.label}
              {t.id === "orders" && newCount > 0 && (
                <span className="ml-2 rounded-full bg-peach-deep px-2 py-0.5 text-[10.5px] font-extrabold text-paper">{newCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-5 py-8 pb-24">
        {tab === "orders" && <OrdersTab />}
        {tab === "services" && <ServicesTab />}
        {tab === "content" && <ContentTab />}
        {tab === "docs" && <DocsTab />}
      </main>

      <footer className="border-t border-ink/10 py-6 text-center text-[12px] font-medium text-ink-faint">
        Админ-панель · доступ только для роли «администратор» · данные хранятся в базе сайта
      </footer>
    </div>
  );
}
