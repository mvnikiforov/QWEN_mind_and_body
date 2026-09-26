/* ============================================================
   Публичный API «базы данных» сайта ПРО|БАЛАНС.
   Хранилище: localStorage браузера (таблицы: users, services,
   orders, events, posts, content). При переносе на серверный
   стек таблицы переносятся 1-в-1 (см. README.md и вкладку
   «Документация» в админ-панели).

   Модуль разделён на слои:
     - ./schema  — типы и константы (контракт данных)
     - ./seed    — начальные («заводские») данные
     - ./storage — хранилище: чтение/запись/подписка/auth/бекап
     - ./index   — этот файл: реэкспорт слоёв + доменные операции
   Внешние импорты `from "../lib/db"` остаются без изменений.
   ============================================================ */

export * from "./schema";
export * from "./storage";

import { mutate } from "./storage";
import type { Content, EventItem, Order, Post, Service } from "./schema";
import { uid } from "./schema";

/* ---------- services (витрина) ---------- */

/** Заглушка-картинка для новых карточек (инлайн SVG, не требует файлов) */
const PLACEHOLDER_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'%3E%3Crect fill='%23e8e4dc' width='800' height='600'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='48' fill='%23a89f91'%3EФото%3C/text%3E%3C/svg%3E";

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
          image: PLACEHOLDER_IMG,
          duration: "50 минут",
          price: 5000,
          priceUnit: "разовая сессия",
          description: "Описание индивидуального формата...",
        },
        {
          id: uid(),
          mode: "group",
          image: PLACEHOLDER_IMG,
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
    db.posts.unshift({
      id: uid(),
      date: new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long" }),
      title: "Новая публикация",
      text: "Текст публикации…",
    });
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

/* ---------- orders (заявки с сайта) ---------- */

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

export function setOrderStatus(id: string, status: Order["status"]) {
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
