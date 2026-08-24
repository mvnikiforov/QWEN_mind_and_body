import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (props: P): P => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});

/* Фирменный знак — цветок-астериск */
export function AsteriskMark(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Тело — фигурка с распахнутыми руками */
export function IconBody(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="4.6" r="2.1" />
      <path d="M12 7v7.5M12 9.2c-2.2-.4-4.2-1.6-5.6-3.4M12 9.2c2.2-.4 4.2-1.6 5.6-3.4M12 14.5l-3.4 6M12 14.5l3.4 6" />
    </svg>
  );
}

/* Чувства — сердце с пульсом */
export function IconFeel(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 20s-7.2-4.4-8.8-9.2C2.2 7.6 4.2 4.9 7 4.9c2 0 3.6 1.2 5 3 1.4-1.8 3-3 5-3 2.8 0 4.8 2.7 3.8 5.9C19.2 15.6 12 20 12 20Z" />
      <path d="M6.5 11.5h3l1.2-2.2 1.6 4 1.2-1.8h3" />
    </svg>
  );
}

/* Разум — профиль с витком */
export function IconMind(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 20v-2.6H7.6c-.8 0-1.2-.9-.7-1.5l1.4-1.7A6.8 6.8 0 1 1 12 17.7" />
      <path d="M12.6 11.8a1.9 1.9 0 1 1 2.6-2.6 3.4 3.4 0 1 0-4.7 3.2" />
    </svg>
  );
}

/* Дух — раскрывающийся лотос */
export function IconSpirit(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 20c-4.8 0-7.8-2.6-8.5-5.5 1.9.4 3.4.3 4.6-.2C7 12 6.6 8.9 7.4 6.7c1.8 1 3.2 2.4 4.6 4.6 1.4-2.2 2.8-3.6 4.6-4.6.8 2.2.4 5.3-.7 7.6 1.2.5 2.7.6 4.6.2-.7 2.9-3.7 5.5-8.5 5.5Z" />
      <path d="M12 11.3V20" />
    </svg>
  );
}

/* Гештальт — незавершённый цикл, замыкающийся в точку */
export function IconGestalt(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M17.5 6.5A7.2 7.2 0 1 0 19.2 12" />
      <circle cx="19.2" cy="8.6" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* Телесные практики — волна дыхания */
export function IconWave(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M3 9.5c2.2-2.8 4.3-2.8 6.5 0s4.3 2.8 6.5 0 3-2.4 5-.6" />
      <path d="M3 15c2.2-2.8 4.3-2.8 6.5 0s4.3 2.8 6.5 0 3-2.4 5-.6" />
    </svg>
  );
}

/* Mindfulness — круги на воде */
export function IconStill(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="10" r="2.2" />
      <path d="M7.5 14.5c2.7 2 6.3 2 9 0M5 17.8c4 2.9 10 2.9 14 0" />
    </svg>
  );
}

export function IconPhone(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M5.5 4h3l1.5 4-2 1.5a12.5 12.5 0 0 0 6.5 6.5L16 14l4 1.5v3A1.8 1.8 0 0 1 18 20.3 15.8 15.8 0 0 1 3.7 6 1.8 1.8 0 0 1 5.5 4Z" />
    </svg>
  );
}

export function IconSend(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M20.5 3.5 3.5 10.8l6 2.4 2.4 6.3 8.6-16Z" />
      <path d="m9.5 13.2 4.5-4.5" />
    </svg>
  );
}

export function IconCheck(props: P) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.8 4.2 4.2L19 7" />
    </svg>
  );
}

export function IconArrow(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 12h15M13.5 5.5 20 12l-6.5 6.5" />
    </svg>
  );
}

export function IconPlus(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconClock(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.5V12l3.2 2.4" />
    </svg>
  );
}

export function IconUsers(props: P) {
  return (
    <svg {...base(props)}>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19.5c.6-3.4 2.8-5.3 5.5-5.3s4.9 1.9 5.5 5.3" />
      <path d="M15.5 5.8a3.1 3.1 0 0 1 0 5.9M17.6 14.6c1.7.8 2.7 2.5 3 4.9" />
    </svg>
  );
}

/* Бережность — ладони, держащие искру */
export function IconCare(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 4.5c1 1.6 2.4 2.3 2.4 4a2.4 2.4 0 1 1-4.8 0c0-1.7 1.4-2.4 2.4-4Z" />
      <path d="M4 14.5c2.5-1.4 5-1.4 7 .2l1.6 1.2h2.9a1.4 1.4 0 0 1 0 2.8h-4.2M4 14.5V20M4 14.5c-1 .4-1.5 2-1.5 3.5" />
      <path d="M20 13.2c.9 1.6 1.3 3.3 1 5.3" />
    </svg>
  );
}

export function IconTrash(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 6.5h15M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7M6.5 6.5l.8 12.2c.05.9.8 1.6 1.7 1.6h6c.9 0 1.65-.7 1.7-1.6l.8-12.2M10 10.5v6M14 10.5v6" />
    </svg>
  );
}

export function IconDownload(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 4v10.5M7.5 10.5 12 15l4.5-4.5M4.5 19.5h15" />
    </svg>
  );
}

export function IconUpload(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 15V4.5M7.5 9 12 4.5 16.5 9M4.5 19.5h15" />
    </svg>
  );
}

export function IconLock(props: P) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
    </svg>
  );
}

export function IconDoc(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4M9.5 12h5M9.5 15.5h5" />
    </svg>
  );
}

export function IconCart(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M4 5h2l2.2 10.2a1.6 1.6 0 0 0 1.6 1.3h6.9a1.6 1.6 0 0 0 1.6-1.2L20 8H7" />
      <circle cx="10.2" cy="19.6" r="1.2" />
      <circle cx="16.6" cy="19.6" r="1.2" />
    </svg>
  );
}

export function IconSeed(props: P) {
  return (
    <svg {...base(props)}>
      <path d="M12 20v-7M12 13c0-3.5 2.6-6.5 7-6.5 0 4.5-2.8 6.8-7 6.5ZM12 13c0-2.6-1.9-4.8-5.2-4.8 0 3.4 2 5.1 5.2 4.8Z" />
    </svg>
  );
}
