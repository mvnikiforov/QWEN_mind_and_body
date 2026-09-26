/* Общие стили и примитивы форм админ-панели. */
import type { ReactNode } from "react";
import { Field, Select as UiSelect } from "../components/ui";

export const ADMIN_FIELD =
  "w-full rounded-[12px] border border-ink/15 bg-card px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-gold-deep focus:ring-4 focus:ring-gold/25";

/* Поле «метка + элемент» в компактном стиле админки */
export function A({ label, className = "", children }: { label?: ReactNode; className?: string; children: ReactNode }) {
  return (
    <Field smallLabel label={label} className={className}>
      {children}
    </Field>
  );
}

/* Выбор из списка в стиле админки (строка или сетка) */
export function AdminSelect({ label, value, onChange, options, className = "" }: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  if (!label) {
    return <UiSelect value={value} onChange={onChange} options={options} className={`${ADMIN_FIELD} ${className}`} />;
  }
  return (
    <A label={label} className={className}>
      <UiSelect value={value} onChange={onChange} options={options} className={ADMIN_FIELD} />
    </A>
  );
}
