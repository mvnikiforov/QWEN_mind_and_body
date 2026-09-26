import type { ReactNode } from "react";
import { IconArrow } from "./icons";
import { prefillService } from "./ui";

/* ============================================================
   Кнопка «Запись» — общий низкоуровневый компонент для витрины,
   горящих баннеров и афиши. Инкапсулирует единый паттерн:
   предзаполнение формы заявки (CustomEvent `prefill-service`)
   + плавный переход к секции #contact.
   ============================================================ */

type Variant = "dark" | "gold" | "light" | "outlineGold" | "outlineInk";

const BASE =
  "group/btn inline-flex items-center justify-center gap-3 rounded-full text-[11.5px] sm:text-[12.5px] font-extrabold uppercase tracking-[0.14em] transition-all duration-300";

const VARIANTS: Record<Variant, string> = {
  /* графитовая — основной CTA на светлом фоне */
  dark: "bg-ink py-3.5 px-7 text-card hover:bg-gold-deep hover:shadow-[0_20px_40px_-18px_rgba(138,109,60,0.95)]",
  /* золотая — CTA на тёмном фоне */
  gold: "bg-gold px-8 py-5 text-ink text-[13px] hover:-translate-y-1 hover:bg-card hover:shadow-[0_24px_48px_-18px_rgba(160,129,73,0.9)]",
  /* светлая — CTA на цветном (золото/бронза) фоне */
  light: "bg-card px-7 py-4 text-ink hover:gap-4 hover:bg-ink hover:text-card",
  /* золотой контур — вторичное действие («Купить абонемент») */
  outlineGold:
    "flex-col sm:flex-row gap-1 sm:gap-2 border-2 border-gold-deep/70 bg-gold/10 py-3 px-5 text-gold-deep hover:border-gold-deep hover:bg-gold-deep hover:text-card hover:shadow-[0_18px_36px_-16px_rgba(138,109,60,0.9)]",
  /* тёмный контур — вторичное действие на светлом фоне */
  outlineInk:
    "border-2 border-ink/20 bg-transparent px-7 py-4 text-ink hover:border-ink hover:bg-ink hover:text-card",
};

export default function BookingButton({
  title,
  price,
  variant = "dark",
  className = "",
  note,
  children,
}: {
  /** название услуги/мероприятия для формы заявки */
  title: string;
  /** цена/примечание к цене для формы заявки */
  price: string;
  variant?: Variant;
  className?: string;
  /** дополнительная строка под подписью (выгода абонемента) */
  note?: ReactNode;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => prefillService(title, price)}
      className={`${BASE} ${VARIANTS[variant]} ${className}`}
    >
      <span>{children}</span>
      {note && (
        <span className="block text-[9.5px] font-extrabold normal-case tracking-normal sm:text-[10.5px]">
          {note}
        </span>
      )}
      <IconArrow className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
    </button>
  );
}
