/* ============================================================
   Контракт данных сайта «ПРО|БАЛАНС»: типы таблиц и константы.
   Слои: schema (типы) → seed (начальные данные) → storage (хранилище)
         → index (публичный API). См. src/lib/db/index.ts
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

/** Поля мини-анкеты заявки (все необязательные) */
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

/** Версия схемы localStorage; меняется при несовместимых правках */
export const DB_VERSION = 4;

/** Ключ базы в localStorage */
export const KEY = `probalance-db-v${DB_VERSION}`;

/** Ключ сессии администратора в sessionStorage */
export const SESSION_KEY = "probalance-session";

/** Статусы заказа и их человеческие названия (порядок = воронка) */
export const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "new", label: "Новый" },
  { value: "paid", label: "Оплачен" },
  { value: "done", label: "Проведена встреча" },
  { value: "closed", label: "Закрыт" },
];

/** Генератор идентификаторов записей */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** Цена: «3 000 ₽» / «Бесплатно» (русская локаль разрядов) */
export function fmtPrice(n: number): string {
  if (!n) return "Бесплатно";
  return n.toLocaleString("ru-RU") + " ₽";
}

/* Фотографии (восточная эстетика: без лиц, со спины, полуразмыто).
   Хранятся локально в public/img — не зависят от внешних CDN и всегда
   доступны на мобильных сетях. */
export const IMG = {
  hero: "/img/hero.jpg",
  chairs: "/img/chairs.jpg",
  road: "/img/road.jpg",
  dao: "/img/dao.jpg",
  studio: "/img/studio.jpg",
  circle: "/img/circle.jpg",
  meditation: "/img/meditation.jpg",
  chairsCircle: "/img/chairsCircle.jpg",
};
