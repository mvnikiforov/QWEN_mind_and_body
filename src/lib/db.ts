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

export interface Variant {
  id: string;
  mode: "individual" | "group";
  image: string;
  duration: string;
  price: number;
  priceUnit?: string;
  packLabel?: string;
  packBenefit?: string;
  description: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  variants: Variant[];
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
  priceNote?: string;
  desc: string;
  actions: { label: string; kind: "book" | "link"; target?: string }[];
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

const KEY = "probalance-db-v4";
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
    version: 4,
    users: [{ id: "u-admin", login: "admin", pass: "valeria", name: "Валерия", role: "admin" }],
    services: [
      {
        id: "sessions",
        title: "Терапевтические сессии",
        subtitle: "Гештальт-подход · бережно, в вашем темпе",
        variants: [
          {
            id: "ind",
            mode: "individual",
            image: IMG.chairs,
            duration: "50 минут",
            price: 3000,
            priceUnit: "разовая сессия",
            packLabel: "Пакет: 10 сессий — 25 000 ₽ (2 500 ₽/встреча)",
            packBenefit: "выгода 5 000 ₽",
            description:
              "Глубокая работа с чувствами, телом и мыслями. Снятие зажимов, прояснение ситуации, возвращение опоры. Учитываю культурный и религиозный контекст. Офлайн или онлайн.",
          },
          {
            id: "grp",
            mode: "group",
            image: IMG.circle,
            duration: "4 часа · раз в 2 недели (с перерывом на чай)",
            price: 2500,
            priceUnit: "разовое посещение",
            packLabel: "Абонемент: 4 встречи — 8 000 ₽ (2 000 ₽/встреча)",
            packBenefit: "выгода 2 000 ₽",
            description:
              "Терапевтическая мини-группа: длительная групповая работа для глубоких изменений. Пространство поддержки, живой обратной связи и бережного контакта.",
          },
        ],
      },
      {
        id: "probalance",
        title: "ПРО|БАЛАНС",
        subtitle: "Интегративные практики · тело, дыхание, внимание",
        variants: [
          {
            id: "ind",
            mode: "individual",
            image: IMG.hero,
            duration: "2 часа",
            price: 5000,
            priceUnit: "разовая практика",
            packLabel: "Абонемент: 4 занятия — 17 000 ₽ (4 250 ₽/занятие)",
            packBenefit: "выгода 3 000 ₽",
            description:
              "Персональная интегративная практика для психоэмоциональной разгрузки, управления вниманием, мягкой распаковки телесных блоков.",
          },
          {
            id: "grp",
            mode: "group",
            image: IMG.studio,
            duration: "1,5–2 часа",
            price: 2000,
            priceUnit: "разовое занятие",
            packLabel: "Абонемент · 4 встречи (1 700 ₽/практика вместо 2 000 ₽)",
            packBenefit: "выгода 1 200 ₽",
            description:
              "Интегративные практики для разгрузки и восстановления энергии. Развитие навыка управления вниманием, снятие стресса.",
          },
        ],
      },
    ],
    orders: [],
    events: [
      {
        id: "ev-tea",
        title: "Чайная встреча",
        when: "Последнее воскресенье месяца",
        time: "13:00",
        format: "offline",
        price: "Бесплатно",
        priceNote: "заказ напитков для себя",
        desc: "Тёплая встреча, где можно познакомиться со мной и с пространством ПРО|БАЛАНС. Это возможность поговорить по душам, поддержать контакт от сердца к сердцу, задать вопросы и почувствовать атмосферу. Никакой программы — только живое общение за чашкой чая или кофе.",
        actions: [{ label: "Записаться", kind: "book" }],
      },
      {
        id: "ev-mini",
        title: "Практики в мини-группе ПРО|БАЛАНС",
        when: "Еженедельно по четвергам",
        time: "11:30",
        format: "offline",
        price: "2 000 ₽ разовое",
        priceNote: "Абонемент · 4 встречи (1 700 ₽/практика вместо 2 000 ₽)",
        desc: "Интегративные телесно-ориентированные практики для психоэмоциональной разгрузки и восстановления энергии. Мягкая работа с телом, вниманием и дыханием в поддерживающей мини-группе.",
        actions: [
          { label: "Записаться", kind: "book" },
          { label: "Купить абонемент", kind: "book", target: "абонемент 6 800 ₽ за 4 занятия" },
        ],
      },
      {
        id: "ev-mind",
        title: "Mindfulness-практика",
        when: "Онлайн по субботам",
        time: "10:00",
        format: "online",
        price: "600 ₽ разовое",
        priceNote: "курсом из 10 встреч — выгоднее и полезнее",
        desc: "Практика осознанности и безоценочного присутствия. Помогает снизить тревогу, улучшить концентрацию и ясность ума. Подходит для любого уровня подготовки. Регулярное участие даёт более глубокий и устойчивый эффект.",
        actions: [
          { label: "Записаться", kind: "book" },
          { label: "Узнать о курсе", kind: "link", target: "#corp-course" },
        ],
      },
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
      if (parsed && parsed.version === 4) {
        // Миграция: абонемент для индивидуального формата ПРО|БАЛАНС (для существующих пользователей)
        const pb = parsed.services.find((s) => s.id === "probalance");
        const ind = pb?.variants.find((v) => v.id === "ind");
        if (ind && !ind.packLabel) {
          ind.packLabel = "Абонемент: 4 занятия — 17 000 ₽ (4 250 ₽/занятие)";
          ind.packBenefit = "экономия 3 000 ₽";
        }
        // Миграция: новая формулировка абонемента мини-группы ПРО|БАЛАНС
        const grp = pb?.variants.find((v) => v.id === "grp");
        if (grp && grp.packLabel && grp.packLabel.includes("4 занятия — 6 800")) {
          grp.packLabel = "Абонемент · 4 встречи (1 700 ₽/практика вместо 2 000 ₽)";
        }
        parsed.events.forEach((ev) => {
          if (ev.priceNote && ev.priceNote.includes("абонемент на 4 занятия — 6 800")) {
            ev.priceNote = "Абонемент · 4 встречи (1 700 ₽/практика вместо 2 000 ₽)";
          }
          if (ev.price === "2 000 ₽ · абонемент 1 700 ₽") {
            ev.price = "Разовое 2 000 ₽ · Абонемент · 4 встречи (1 700 ₽/практика вместо 2 000 ₽)";
          }
        });
        return parsed;
      }
    }
  } catch {
    /* повреждённые данные — пересоздаём */
  }
  const db = seed();
  // Добавляем карточку "Пакет Баланс" после ПРО|БАЛАНС
  const probalanceIndex = db.services.findIndex(s => s.id === "probalance");
  if (probalanceIndex !== -1) {
    const balancePack: Service = {
      id: "balance-pack",
      title: "Пакет «Баланс»",
      subtitle: "Комплексная программа · глубокая трансформация",
      variants: [
        {
          id: "ind",
          mode: "individual",
          image: IMG.hero,
          duration: "4 встречи по 2 часа + 4 сессии по 50 мин",
          price: 25600,
          priceUnit: "полный пакет",
          packLabel: "Пакет «Баланс»: 4 терапевтические сессии + 4 индивидуальные практики",
          packBenefit: "выгода 6 400 ₽",
          description:
            "Уникальное сочетание терапевтических сессий (гештальт-подход) и интегративных практик ПРО|БАЛАНС. Глубокая работа с запросом на уровне тела, чувств и сознания. Персональная программа трансформации.",
        },
        {
          id: "grp",
          mode: "group",
          image: IMG.circle,
          duration: "4 встречи группы по 4 часа + 4 практики по 1,5–2 часа",
          price: 14000,
          priceUnit: "полный пакет",
          packLabel: "Пакет «Баланс»: 4 групповые встречи + 4 групповые практики",
          packBenefit: "выгода 4 000 ₽",
          description:
            "Групповой формат пакета «Баланс». Сочетание терапевтической мини-группы и интегративных практик в поддерживающем окружении. Идеально для тех, кто ценит силу сообщества и регулярность.",
        },
      ],
    };
    db.services.splice(probalanceIndex + 1, 0, balancePack);
  }
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

export function addService() {
  mutate((db) => {
    db.services.push({
      id: uid(),
      title: "Новая услуга",
      subtitle: "Краткое описание услуги",
      variants: [
        {
          id: uid(),
          mode: "individual",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23e8e4dc' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%23a89f91'%3EФото%3C/text%3E%3C/svg%3E",
          duration: "50 минут",
          price: 5000,
          priceUnit: "разовая сессия",
          description: "Описание индивидуального формата...",
        },
        {
          id: uid(),
          mode: "group",
          image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23e8e4dc' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%23a89f91'%3EФото%3C/text%3E%3C/svg%3E",
          duration: "90 минут",
          price: 2500,
          priceUnit: "групповая встреча",
          description: "Описание группового формата...",
        },
      ],
    });
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
    db.events.push({
      id: uid(),
      title: "Новое мероприятие",
      when: "По анонсам",
      time: "—",
      format: "offline",
      price: "—",
      desc: "Короткое описание мероприятия.",
      actions: [{ label: "Записаться", kind: "book" }],
    });
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
    if (!parsed || parsed.version !== 4 || !Array.isArray(parsed.users)) return false;
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
