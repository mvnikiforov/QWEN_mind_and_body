/* ============================================================
   База данных сайта «ПРО|БАЛАНС»
   Хранилище: localStorage браузера (таблицы: users, services,
   orders, events, posts, content, session).
   При переносе на серверный стек таблицы переносятся 1-в-1
   (см. README.md и вкладку «Документация» в админ-панели).
   ============================================================ */

export type Role = "admin";

export interface User {
  id: string;
  login: string;
  pass: string; // в production заменить на bcrypt-хэш на сервере
  name: string;
  role: Role;
}

export interface Service {
  id: string;
  group: "individual" | "group";
  title: string;
  duration: string;
  price: number; // 0 = бесплатно
  priceUnit?: string;
  subscription?: string;
  badge?: string;
  description: string;
  image: string;
  cta: string;
  ctaAlt?: string;
}

export type OrderStatus = "new" | "paid" | "done" | "closed";

export interface OrderForm {
  city?: string;
  gender?: string;
  age?: string;
  therapyExp?: string;
  bodyExp?: string;
  mental?: string;
  epilepsy?: string;
  surgery?: string;
  hernia?: string;
  pregnancy?: string;
  request?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  name: string;
  contact: string;
  serviceTitle: string;
  price: string;
  comment?: string;
  status: OrderStatus;
  form?: OrderForm;
}

export interface EventItem {
  id: string;
  title: string;
  when: string;
  time: string;
  format: "online" | "offline";
  price: string;
}

export interface Post {
  id: string;
  date: string;
  title: string;
  text: string;
  image?: string;
}

export interface Content {
  about: { photo: string; paragraphs: string[]; chips: string[] };
  culture: { title: string; text: string };
  contacts: {
    phoneDisplay: string;
    phoneHref: string;
    telegram: string;
    telegramHref: string;
    vk: string;
    vkHref: string;
    max: string;
    maxHref: string;
    note: string;
    signoff: string;
  };
  feedUrl: string; // URL RSS/JSON канала МАХ (если появится публичный API)
}

export interface DB {
  version: number;
  users: User[];
  services: Service[];
  orders: Order[];
  events: EventItem[];
  posts: Post[];
  content: Content;
}

export interface Session {
  login: string;
  role: Role;
}

const KEY = "probalance-db-v2";
const SESSION_KEY = "probalance-session";
const listeners = new Set<() => void>();

/* Сгенерированные фотографии (восточная эстетика: без лиц, со спины, полуразмыто) */
export const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/ae4fa278-6772-4b16-bbd9-08e387d8687e/_result.png",
  chairs: "https://image.qwenlm.ai/generated-images/4a80e071-e20e-4eac-9c48-a9d47eb17684/_result.png",
  road: "https://image.qwenlm.ai/generated-images/a86075d8-7139-4d89-ab1e-3d72231ff7de/_result.png",
  dao: "https://image.qwenlm.ai/generated-images/f0c4a1c6-05f0-47ba-8549-c9f4ad62a1a1/_result.png",
  studio: "https://image.qwenlm.ai/generated-images/2035597f-4536-497a-ae3c-117c9ad9a0d1/_result.png",
  circle: "https://image.qwenlm.ai/generated-images/8e79ee7d-eaab-4b0c-a25f-6d6978f04473/_result.png",
  meditation: "https://image.qwenlm.ai/generated-images/36e33009-cea0-4093-955d-637de3274740/_result.png",
  chairsCircle: "https://image.qwenlm.ai/generated-images/572b5fec-02f7-4ed1-9e4e-d57234de69bb/_result.png",
};

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function seed(): DB {
  return {
    version: 2,
    users: [{ id: "u-admin", login: "admin", pass: "valeria", name: "Валерия", role: "admin" }],
    services: [
      {
        id: "session",
        group: "individual",
        title: "Терапевтическая сессия",
        duration: "50 минут",
        price: 3000,
        priceUnit: "разовая",
        subscription: "Абонемент: 10 встреч — 25 000 ₽ (2 500 ₽/встреча, выгода 5 000 ₽)",
        description:
          "Глубокая работа с чувствами, телом и мыслями. Снятие зажимов, прояснение ситуации, возвращение опоры. Учитываю культурный и религиозный контекст. Офлайн или онлайн.",
        image: IMG.chairs,
        cta: "Записаться",
      },
      {
        id: "package10",
        group: "individual",
        title: "Пакет «10 терапевтических сессий»",
        duration: "10 сессий по 50 минут",
        price: 25000,
        badge: "Выгодно −5 000 ₽",
        description: "Системная терапия для устойчивых изменений. Одна встреча 2 500 ₽ вместо 3 000 ₽.",
        image: IMG.road,
        cta: "Купить пакет",
      },
      {
        id: "probalance-1",
        group: "individual",
        title: "Индивидуальная практика ПРО|БАЛАНС",
        duration: "2 часа",
        price: 5000,
        description:
          "Персональная интегративная практика для психоэмоциональной разгрузки, управления вниманием, мягкой распаковки телесных блоков.",
        image: IMG.hero,
        cta: "Записаться",
      },
      {
        id: "dao-1",
        group: "individual",
        title: "Индивидуальный ДАО-комплекс «Чун-Лэй»",
        duration: "2 часа",
        price: 10000,
        description:
          "Безопасный запуск внутренних ресурсов через энерговолну (контактно или бесконтактно). Возвращение текучести и лёгкости.",
        image: IMG.dao,
        cta: "Записаться",
      },
      {
        id: "probalance-group",
        group: "group",
        title: "Групповая практика ПРО|БАЛАНС",
        duration: "1,5–2 часа",
        price: 2000,
        priceUnit: "разовое",
        subscription: "Абонемент на 4 занятия — 6 800 ₽ (1 700 ₽/занятие, выгода 1 200 ₽)",
        description:
          "Интегративные практики для разгрузки и восстановления энергии. Развитие навыка управления вниманием, снятие стресса.",
        image: IMG.studio,
        cta: "Записаться",
        ctaAlt: "Купить абонемент",
      },
      {
        id: "dao-mk",
        group: "group",
        title: "Групповой мастер-класс «Чун-Лэй»",
        duration: "4 часа",
        price: 6000,
        description:
          "Пробуждающий ДАО-комплекс. Работа с энерговолной, телесная осознанность. Подходит для знакомства.",
        image: IMG.circle,
        cta: "Записаться на мастер-класс",
      },
      {
        id: "mindfulness",
        group: "group",
        title: "Mindfulness-практика (групповая онлайн)",
        duration: "1 час",
        price: 600,
        description: "Практика присутствия и безоценочного наблюдения. Снижение тревоги, ясность ума.",
        image: IMG.meditation,
        cta: "Записаться на практику",
      },
      {
        id: "procrastination",
        group: "group",
        title: "Мастер-класс «Прокрастинация или важный сигнал?»",
        duration: "3 часа",
        price: 2000,
        description: "Тематическая встреча в гештальт-подходе. Исследуем, что стоит за откладыванием дел.",
        image: IMG.chairsCircle,
        cta: "Записаться на мастер-класс",
      },
      {
        id: "mini-group",
        group: "group",
        title: "Терапевтическая мини-группа",
        duration: "Раз в 2 недели · 4 часа (с перерывом на чай)",
        price: 2500,
        priceUnit: "разовое",
        subscription: "Абонемент на 4 встречи — 8 000 ₽ (2 000 ₽/встреча)",
        description: "Длительная групповая работа для глубоких изменений. Пространство поддержки.",
        image: IMG.circle,
        cta: "Узнать подробнее",
        ctaAlt: "Записаться в группу",
      },
    ],
    orders: [],
    events: [
      { id: "ev-1", title: "Практика ПРО|БАЛАНС (групповая)", when: "Еженедельно · четверг", time: "11:30", format: "offline", price: "2 000 ₽ · абонемент 1 700 ₽" },
      { id: "ev-2", title: "Чайная встреча", when: "Последнее воскресенье месяца", time: "по договорённости", format: "offline", price: "Бесплатно · чай/кофе для себя" },
      { id: "ev-3", title: "Mindfulness-практика", when: "Еженедельно · суббота", time: "10:00", format: "online", price: "600 ₽" },
      { id: "ev-4", title: "Групповой мастер-класс «Чун-Лэй»", when: "По анонсам", time: "4 часа", format: "offline", price: "6 000 ₽" },
      { id: "ev-5", title: "Мастер-класс «Прокрастинация или важный сигнал?»", when: "По анонсам", time: "3 часа", format: "offline", price: "2 000 ₽" },
      { id: "ev-6", title: "Терапевтическая мини-группа", when: "По набору · раз в 2 недели", time: "4 часа", format: "offline", price: "2 500 ₽ разовое · 8 000 ₽ абонемент" },
    ],
    posts: [
      {
        id: "p-1",
        date: "12 февраля",
        title: "Утро начинается с дыхания",
        text: "Пять минут тишины до завтрака меняют весь день. Делюсь короткой дыхательной практикой, с которой начинаю утро сама.",
        image: IMG.meditation,
      },
      {
        id: "p-2",
        date: "28 января",
        title: "После групповой практики",
        text: "Сегодня в студии было особенно тепло. Заметила, как после шавасаны меняются лица — уходят зажимы, и человек словно возвращается к себе.",
        image: IMG.studio,
      },
      {
        id: "p-3",
        date: "15 января",
        title: "Чайная встреча: о границах",
        text: "Говорили о том, как говорить «нет» без чувства вины. Записала для вас три бережных формулировки — сохраняйте.",
        image: IMG.road,
      },
    ],
    content: {
      about: {
        photo: IMG.dao,
        paragraphs: [
          "Меня зовут Валерия. Более 20 лет я практикую трансперсональные методы: телесные, дыхательные и медитативные техники. Это мой личный опыт, который я бережно интегрирую в работу с клиентами около 5 лет.",
          "Я — магистрант-этнопсихолог (мультикультурное психологическое консультирование, МГППУ) и гештальт-практик (МИГИП). Также я инструктор интегративной кундалини-йоги и тренер ДАО-практик.",
          "Я верю, что каждый человек по своей природе целостен, но часто забывает об этом из-за травм, стрессов и культурных установок. Моя задача — создать безопасное пространство, где вы встречаетесь со своей природной мудростью.",
        ],
        chips: ["Личная терапия", "Регулярная супервизия", "Этичность"],
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
        vk: "Валерия PRO|БАЛАНС",
        vkHref: "https://vk.com/pro_balance",
        max: "Канал PRO|БАЛАНС",
        maxHref: "https://max.ru/pro_balance",
        note: "Отвечаю в течение 24 часов",
        signoff: "Обнимаю словом и делом. Валерия",
      },
      feedUrl: "",
    },
  };
}

function persist(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
  listeners.forEach((l) => l());
}

export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed && parsed.version === 2) return parsed;
    }
  } catch {
    /* повреждённые данные — пересоздаём */
  }
  const db = seed();
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* приватный режим и т.п. */
  }
  return db;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

function mutate(fn: (db: DB) => void) {
  const db = loadDB();
  fn(db);
  persist(db);
}

/* ---------- auth ---------- */

export function getSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function login(loginName: string, password: string): Session | null {
  const db = loadDB();
  const user = db.users.find((u) => u.login === loginName.trim() && u.pass === password);
  if (!user) return null;
  const s: Session = { login: user.login, role: user.role };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  listeners.forEach((l) => l());
  return s;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  listeners.forEach((l) => l());
}

export function changePassword(loginName: string, next: string) {
  mutate((db) => {
    const u = db.users.find((x) => x.login === loginName);
    if (u) u.pass = next;
  });
}

/* ---------- services ---------- */

export function updateService(id: string, patch: Partial<Service>) {
  mutate((db) => {
    const s = db.services.find((x) => x.id === id);
    if (s) Object.assign(s, patch);
  });
}

/* ---------- events (афиша) ---------- */

export function updateEvent(id: string, patch: Partial<EventItem>) {
  mutate((db) => {
    const e = db.events.find((x) => x.id === id);
    if (e) Object.assign(e, patch);
  });
}

export function addEvent() {
  mutate((db) => {
    db.events.push({ id: uid(), title: "Новое мероприятие", when: "По анонсам", time: "—", format: "offline", price: "—" });
  });
}

export function deleteEvent(id: string) {
  mutate((db) => {
    db.events = db.events.filter((e) => e.id !== id);
  });
}

/* ---------- posts (живой поток) ---------- */

export function updatePost(id: string, patch: Partial<Post>) {
  mutate((db) => {
    const p = db.posts.find((x) => x.id === id);
    if (p) Object.assign(p, patch);
  });
}

export function addPost() {
  mutate((db) => {
    db.posts.unshift({ id: uid(), date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }), title: "Новая публикация", text: "Текст публикации…" });
  });
}

export function deletePost(id: string) {
  mutate((db) => {
    db.posts = db.posts.filter((p) => p.id !== id);
  });
}

/* ---------- content ---------- */

export function updateContent(patch: Partial<Content>) {
  mutate((db) => {
    db.content = { ...db.content, ...patch };
  });
}

/* ---------- orders ---------- */

export function createOrder(data: Omit<Order, "id" | "createdAt" | "status">) {
  const order: Order = {
    ...data,
    id: uid(),
    createdAt: new Date().toISOString(),
    status: "new",
  };
  mutate((db) => {
    db.orders.unshift(order);
  });
}

export function setOrderStatus(id: string, status: OrderStatus) {
  mutate((db) => {
    const o = db.orders.find((x) => x.id === id);
    if (o) o.status = status;
  });
}

export function deleteOrder(id: string) {
  mutate((db) => {
    db.orders = db.orders.filter((o) => o.id !== id);
  });
}

/* ---------- служебное ---------- */

export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "paid", label: "Оплачен" },
  { value: "done", label: "Проведена встреча" },
  { value: "closed", label: "Закрыт" },
];

export function fmtPrice(n: number): string {
  if (!n) return "Бесплатно";
  return n.toLocaleString("ru-RU") + " ₽";
}

export function exportDB(): string {
  return JSON.stringify(loadDB(), null, 2);
}

export function importDB(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as DB;
    if (!parsed || parsed.version !== 2 || !Array.isArray(parsed.users)) return false;
    localStorage.setItem(KEY, JSON.stringify(parsed));
    listeners.forEach((l) => l());
    return true;
  } catch {
    return false;
  }
}

export function resetDB() {
  localStorage.removeItem(KEY);
  listeners.forEach((l) => l());
}
