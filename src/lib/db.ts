/* ============================================================
   СЛОЙ ДАННЫХ (мини-БД)
   ------------------------------------------------------------
   Все таблицы сайта: users, services, orders, content.
   Текущий адаптер хранения — localStorage браузера (ключ valeria_db_v1),
   что позволяет сайту работать без сервера. Интерфейс доступа
   (loadDB / saveDB + точечные мутаторы) спроектирован так, чтобы
   адаптер можно было заменить на REST API или Supabase/PostgreSQL,
   не переписывая компоненты (см. README.md и вкладку «Документация»
   в админ-панели).
   ============================================================ */

export type Role = "admin" | "manager";

export interface User {
  id: string;
  login: string;
  passHash: string;
  name: string;
  role: Role;
}

export type ServiceKind = "free" | "single" | "package" | "masterclass" | "group";

export interface Service {
  id: string;
  kind: ServiceKind;
  title: string;
  duration: string;
  price: number;              // 0 = бесплатно
  priceUnit?: string;         // например «за встречу»
  subscriberPrice?: number;   // цена для подписчиков группы
  badge?: string;
  note?: string;
  description: string;
  cta: string;
  featured?: boolean;
  image?: string; // необязательное фото карточки (base64 из админки)
}

export type OrderStatus = "new" | "paid" | "done" | "closed";

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "paid", label: "Оплачен" },
  { value: "done", label: "Проведена встреча" },
  { value: "closed", label: "Закрыт" },
];

export interface Order {
  id: string;
  name: string;
  contact: string;
  serviceId: string;
  serviceTitle: string;
  price: string;
  comment: string;
  createdAt: number;
  status: OrderStatus;
}

export interface Content {
  about: {
    photo: string;
    paragraphs: string[];
    chips: string[];
  };
  culture: { title: string; text: string };
  contacts: {
    phoneDisplay: string;
    phoneHref: string;
    telegram: string;
    telegramHref: string;
    note: string;
    signoff: string;
  };
}

export interface DB {
  version: number;
  users: User[];
  services: Service[];
  orders: Order[];
  content: Content;
}

export interface Session {
  userId: string;
  login: string;
  role: Role;
  loginAt: number;
}

const DB_KEY = "valeria_db_v1";
const SESSION_KEY = "valeria_session_v1";
export const SEED_VERSION = 1;

export const PORTRAIT_URL =
  "https://image.qwenlm.ai/generated-images/c57cc7c2-c18f-4693-a1f7-c3ccd440149f/_result.png";
export const ABSTRACT_URL =
  "https://image.qwenlm.ai/generated-images/f482d268-ce19-48b2-b45c-192421bd60f1/_result.png";

/* ---------- утилиты ---------- */

export function hash(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return "h" + (h >>> 0).toString(36);
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function fmtPrice(n: number): string {
  if (n === 0) return "Бесплатно";
  return n.toLocaleString("ru-RU") + " ₽";
}

/* ---------- сид (содержимое по умолчанию) ---------- */

function seedServices(): Service[] {
  return [
    {
      id: "intro",
      kind: "free",
      title: "Бесплатная встреча-знакомство",
      duration: "20 минут · онлайн",
      price: 0,
      description:
        "Познакомимся, определим ваш запрос и подберём формат работы. Без обязательств — просто спокойный разговор о том, что важно именно вам.",
      cta: "Записаться",
    },
    {
      id: "single",
      kind: "single",
      title: "Индивидуальная консультация",
      duration: "50 минут · онлайн или очно",
      price: 3000,
      subscriberPrice: 2500,
      description:
        "Глубокая работа с чувствами, телом и мыслями. Снятие зажимов, прояснение ситуации, возвращение опоры. Учитываю ваш культурный и религиозный контекст.",
      cta: "Записаться",
      featured: true,
    },
    {
      id: "pack10",
      kind: "package",
      title: "Пакет «10 встреч»",
      duration: "10 сессий по 50 минут · 3 месяца",
      price: 25000,
      badge: "Выгодно −5 000 ₽",
      description:
        "Системная терапия для устойчивых изменений: снижение тревоги, повышение энергии, улучшение качества жизни. Работа строится с уважением к вашим ценностям.",
      cta: "Купить",
    },
    {
      id: "masterclass",
      kind: "masterclass",
      title: "Групповой мастер-класс",
      duration: "3 часа · с перерывом",
      price: 2000,
      note: "Ближайшая тема: «Тело спокойствия» — дата и регистрация в Telegram @pro_balance",
      description:
        "Тематическая встреча в мини-группе до 10 человек. Практики, упражнения, обсуждение. Ближайшая тема и дата — под карточкой.",
      cta: "Записаться",
    },
    {
      id: "group",
      kind: "group",
      title: "Терапевтическая группа",
      duration: "1 раз в неделю · 2 часа",
      price: 1500,
      priceUnit: "за встречу",
      description:
        "Длительная групповая работа для глубоких изменений. Пространство поддержки и обратной связи. Группа формируется с учётом культурного разнообразия.",
      cta: "Записаться",
    },
  ];
}

function seedContent(): Content {
  return {
    about: {
      photo: PORTRAIT_URL,
      paragraphs: [
        "Меня зовут Валерия. Более 20 лет я практикую трансперсональные методы: телесные, дыхательные и медитативные техники. Это мой личный опыт, который я бережно интегрирую в работу с клиентами около 5 лет. Обучаюсь гештальт-терапии в МИГИП и получаю магистерскую степень по мультикультурному психологическому консультированию в МГППУ.",
        "Я верю, что каждый человек по своей природе целостен, но часто забывает об этом из-за травм, стрессов и культурных установок. Моя задача — создать безопасное пространство, где вы сможете встретиться с собой, исцелить раны и вспомнить свою истинную природу.",
        "Я не даю готовых ответов, а помогаю вам услышать собственную мудрость.",
      ],
      chips: ["Личная терапия", "Регулярная супервизия", "Этика и конфиденциальность"],
    },
    culture: {
      title: "Бережность к культурному коду",
      text: "В своей работе я учитываю культурный и религиозный контекст клиента. Бережно отношусь к вашим ценностям, традициям и убеждениям. Помогаю найти опору внутри вашей собственной картины мира, не навязывая чуждые взгляды. Если вы живёте на стыке культур, состоите в межкультурных отношениях или переживаете конфликт ценностей — вы получите поддержку, уважающую вашу идентичность.",
    },
    contacts: {
      phoneDisplay: "8 962 321 21 73",
      phoneHref: "tel:+79623212173",
      telegram: "@pro_balance",
      telegramHref: "https://t.me/pro_balance",
      note: "Отвечаю в течение 24 часов",
      signoff: "Обнимаю словом и делом. Валерия",
    },
  };
}

export function seed(): DB {
  return {
    version: SEED_VERSION,
    users: [
      {
        id: "u_admin",
        login: "admin",
        passHash: hash("valeria"),
        name: "Администратор",
        role: "admin",
      },
    ],
    services: seedServices(),
    orders: [],
    content: seedContent(),
  };
}

/* ---------- чтение / запись ---------- */

let cache: DB | null = null;

export function loadDB(): DB {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as DB;
    if (!parsed || parsed.version !== SEED_VERSION || !Array.isArray(parsed.services)) {
      throw new Error("outdated");
    }
    cache = parsed;
  } catch {
    cache = seed();
    persist();
  }
  return cache;
}

function persist() {
  if (!cache) return;
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(cache));
  } catch (e) {
    console.warn("Не удалось сохранить данные (возможно, переполнено хранилище):", e);
  }
}

/* ---------- подписка на изменения ---------- */

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit() {
  persist();
  listeners.forEach((fn) => fn());
}

/* ---------- мутаторы ---------- */

export function addOrder(
  data: Omit<Order, "id" | "createdAt" | "status">
): Order {
  const db = loadDB();
  const order: Order = {
    ...data,
    id: uid(),
    createdAt: Date.now(),
    status: "new",
  };
  db.orders = [order, ...db.orders];
  emit();
  return order;
}

export function setOrderStatus(id: string, status: OrderStatus) {
  const db = loadDB();
  db.orders = db.orders.map((o) => (o.id === id ? { ...o, status } : o));
  emit();
}

export function deleteOrder(id: string) {
  const db = loadDB();
  db.orders = db.orders.filter((o) => o.id !== id);
  emit();
}

export function updateService(id: string, patch: Partial<Service>) {
  const db = loadDB();
  db.services = db.services.map((s) => (s.id === id ? { ...s, ...patch } : s));
  emit();
}

export function updateContent(patch: Partial<Content>) {
  const db = loadDB();
  db.content = {
    about: { ...db.content.about, ...(patch.about ?? {}) },
    culture: { ...db.content.culture, ...(patch.culture ?? {}) },
    contacts: { ...db.content.contacts, ...(patch.contacts ?? {}) },
  };
  emit();
}

export function changePassword(userId: string, newPassword: string) {
  const db = loadDB();
  db.users = db.users.map((u) =>
    u.id === userId ? { ...u, passHash: hash(newPassword) } : u
  );
  emit();
}

export function importDB(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as DB;
    if (!parsed || !Array.isArray(parsed.services) || !Array.isArray(parsed.orders)) {
      return false;
    }
    cache = { ...parsed, version: SEED_VERSION };
    emit();
    return true;
  } catch {
    return false;
  }
}

export function resetContentToDefault(keepOrders: boolean) {
  const db = loadDB();
  db.services = seedServices();
  db.content = seedContent();
  if (!keepOrders) db.orders = [];
  emit();
}

/* ---------- сессия / роли ---------- */

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function login(loginName: string, password: string): Session | null {
  const db = loadDB();
  const user = db.users.find(
    (u) => u.login === loginName.trim().toLowerCase() && u.passHash === hash(password)
  );
  if (!user || user.role !== "admin") return null; // доступ к админке только у роли admin
  const session: Session = {
    userId: user.id,
    login: user.login,
    role: user.role,
    loginAt: Date.now(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}
