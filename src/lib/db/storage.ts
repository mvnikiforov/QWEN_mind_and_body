/* ============================================================
   Слой хранилища: чтение/запись localStorage, миграции схемы,
   pub/sub подписка на изменения, сессия администратора.

   Публичные точки расширения: loadDB / mutate / subscribe —
   при переносе на серверный стек их тела заменяются на fetch к API,
   сигнатуры функций сохраняются (см. README.md, п. «Развитие»).
   ============================================================ */

import { seed } from "./seed";
import {
  DB_VERSION,
  KEY,
  SESSION_KEY,
  type DB,
  type Session,
} from "./schema";

const listeners = new Set<() => void>();

/** Уведомить всех подписчиков об изменении базы */
export function notify(): void {
  listeners.forEach((l) => l());
}

function persist(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
  notify();
}

/**
 * Прочитать базу из localStorage; при отсутствии или несовместимой
 * версии — вернуть «заводские» настройки. Содержит аддитивные
 * миграции для существующих установок.
 */
export function loadDB(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DB;
      if (parsed && parsed.version === DB_VERSION) {
        // Миграция: абонемент для индивидуального формата ПРО|БАЛАНС (для существующих пользователей)
        const pb = parsed.services.find((s) => s.id === "probalance");
        const ind = pb?.variants.find((v) => v.id === "ind");
        if (ind && !ind.packLabel) {
          ind.packLabel = "Абонемент: 4 занятия — 17 000 ₽ (4 250 ₽/занятие)";
          ind.packBenefit = "выгода 1 200 ₽";
          persist(parsed);
        }
        return parsed;
      }
    }
  } catch {
    /* повреждённые данные — пересоздаём */
  }
  const db = seed();
  persist(db);
  return db;
}

/** Функция отписки от изменений базы */
export type Unsubscribe = () => void;

/** Подписаться на изменения базы (используется StoreProvider) */
export function subscribe(fn: () => void): Unsubscribe {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Атомарное изменение базы: прочитать → изменить → сохранить → уведомить */
export function mutate(fn: (db: DB) => void) {
  const db = loadDB();
  fn(db);
  persist(db);
}

/* ---------- auth (сессия живёт до закрытия вкладки) ---------- */

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
  notify();
  return s;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  notify();
}

export function changePassword(loginName: string, next: string) {
  mutate((db) => {
    const u = db.users.find((x) => x.login === loginName);
    if (u) u.pass = next;
  });
}

/* ---------- резервное копирование ---------- */

/** База в виде JSON-строки (файл резервной копии) */
export function exportDB(): string {
  return JSON.stringify(loadDB(), null, 2);
}

/** Восстановить базу из JSON-строки; false — если файл не похож на копию */
export function importDB(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as DB;
    if (!parsed || parsed.version !== DB_VERSION || !Array.isArray(parsed.users)) return false;
    localStorage.setItem(KEY, JSON.stringify(parsed));
    notify();
    return true;
  } catch {
    return false;
  }
}

/** Сброс к исходным («заводским») данным */
export function resetDB() {
  localStorage.removeItem(KEY);
  notify();
}
