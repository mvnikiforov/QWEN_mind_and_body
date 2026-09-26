/* ============================================================
   Общие классы оформления форм (Tailwind) — единый источник,
   чтобы поля ввода выглядели одинаково на сайте и в админке.
   ============================================================ */

/** Поле ввода / select / textarea на сайте (форма записи) */
export const FIELD =
  "w-full min-h-[52px] sm:min-h-[58px] rounded-[14px] border border-line bg-card px-4 sm:px-5 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-medium leading-snug outline-none transition-all placeholder:text-ink-faint placeholder:leading-snug focus:border-gold focus:ring-4 focus:ring-gold/20";

/** Многострочное поле на сайте */
export const AREA = `${FIELD} resize-y`;

/** Подпись поля на сайте */
export const LABEL =
  "mb-2 block text-[10.5px] sm:text-[11.5px] font-extrabold uppercase tracking-[0.12em] leading-snug text-ink-soft";

/** Поле ввода в админ-панели */
export const ADMIN_FIELD =
  "w-full rounded-[12px] border border-ink/15 bg-card px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-gold-deep focus:ring-4 focus:ring-gold/25";

/** Подпись поля в админ-панели */
export const ADMIN_LABEL =
  "mb-1 block text-[11px] font-extrabold uppercase tracking-wide text-ink-soft";
