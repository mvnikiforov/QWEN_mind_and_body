import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useStore } from "../lib/store";
import { changePassword, importDB, loadDB, resetContentToDefault } from "../lib/db";
import { IconDoc, IconDownload, IconUpload, IconTrash } from "../components/icons";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-ink/10 bg-cream/50 p-6 sm:p-7">
      <h3 className="font-display text-[15px] font-bold">{title}</h3>
      <div className="mt-4 text-[14px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-[14px] bg-ink p-4 text-[12px] leading-relaxed text-paper/90">
      <code>{children}</code>
    </pre>
  );
}

const NGINX = `# /etc/nginx/sites-available/valeria.conf
server {
    listen 80;
    server_name vash-domen.ru www.vash-domen.ru;
    root /var/www/valeria/dist;      # папка со сборкой
    index index.html;

    # SPA: любые пути отдают index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}

# SSL (Let's Encrypt):
# sudo apt install certbot python3-certbot-nginx
# sudo certbot --nginx -d vash-domen.ru -d www.vash-domen.ru`;

const SQL = `-- Схема для переноса на PostgreSQL / Supabase
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'manager'  -- 'admin' | 'manager'
);

CREATE TABLE services (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  title TEXT NOT NULL,
  duration TEXT,
  price INT NOT NULL DEFAULT 0,
  price_unit TEXT,
  subscriber_price INT,
  badge TEXT, note TEXT, description TEXT,
  cta TEXT, featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, contact TEXT NOT NULL,
  service_id TEXT REFERENCES services(id),
  service_title TEXT, price TEXT, comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new'
  -- 'new' -> 'paid' -> 'done' -> 'closed'
);

CREATE TABLE content (
  key TEXT PRIMARY KEY,        -- 'about', 'culture', 'contacts'
  body JSONB NOT NULL
);`;

export default function DocsTab() {
  const { session } = useStore();
  const [pass, setPass] = useState("");
  const [passMsg, setPassMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [resetAsk, setResetAsk] = useState(false);
  const [ioMsg, setIoMsg] = useState("");
  const importRef = useRef<HTMLInputElement>(null);

  const changePass = () => {
    if (!session) return;
    if (pass.length < 6) { setPassMsg({ ok: false, t: "Пароль должен быть не короче 6 символов" }); return; }
    changePassword(session.userId, pass);
    setPass("");
    setPassMsg({ ok: true, t: "Пароль изменён ✓ (вступит в силу со следующего входа)" });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(loadDB(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `valeria-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setIoMsg("Резервная копия выгружена ✓");
  };

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      const ok = importDB(String(r.result));
      setIoMsg(ok ? "Данные импортированы ✓" : "Файл не похож на резервную копию этого сайта");
    };
    r.readAsText(f);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-lav text-lav-deep"><IconDoc className="h-5.5 w-5.5" style={{ height: 22, width: 22 }} /></span>
        <div>
          <h2 className="font-display text-xl font-bold">Настройки и документация</h2>
          <p className="text-[13px] font-semibold text-ink-soft">Инструкции администратору: данные, безопасность, перенос на хостинг</p>
        </div>
      </div>

      {/* Безопасность */}
      <Block title="Смена пароля администратора">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            placeholder="Новый пароль (мин. 6 символов)"
            className="w-full max-w-xs rounded-[12px] border border-ink/15 bg-paper px-4 py-2.5 text-[14px] font-semibold outline-none focus:border-peach-deep"
          />
          <button onClick={changePass} className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-peach-deep">
            Сменить пароль
          </button>
        </div>
        {passMsg && <p className={`mt-2 text-[13px] font-bold ${passMsg.ok ? "text-mint-deep" : "text-peach-deep"}`}>{passMsg.t}</p>}
        <p className="mt-3 text-[12.5px]">
          Ролевая модель: доступ к админ-панели имеют только пользователи с ролью <b>admin</b>. Роль <b>manager</b>
          заложена в схему данных для будущего расширения (например, помощник без прав на настройки).
        </p>
      </Block>

      {/* Данные */}
      <Block title="Резервное копирование и перенос базы">
        <div className="flex flex-wrap gap-3">
          <button onClick={exportData} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-peach-deep">
            <IconDownload className="h-4 w-4" /> Экспорт базы (JSON)
          </button>
          <input ref={importRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
          <button onClick={() => importRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2.5 text-[13px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-paper">
            <IconUpload className="h-4 w-4" /> Импорт из копии
          </button>
          <button
            onClick={() => (resetAsk ? (resetContentToDefault(true), setResetAsk(false), setIoMsg("Контент и витрина сброшены к значениям по умолчанию, заказы сохранены")) : setResetAsk(true))}
            className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-bold transition-all ${resetAsk ? "bg-peach-deep text-paper" : "border-2 border-peach-deep/50 text-peach-deep hover:bg-peach/50"}`}
          >
            <IconTrash className="h-4 w-4" /> {resetAsk ? "Точно сбросить? Заказы останутся" : "Сбросить контент к исходному"}
          </button>
        </div>
        {ioMsg && <p className="mt-3 text-[13px] font-bold text-mint-deep">{ioMsg}</p>}
        <p className="mt-3 text-[12.5px]">
          Делайте экспорт перед обновлением текстов и минимум раз в неделю. Файл копии содержит все таблицы:
          пользователей, витрину, заказы и контент.
        </p>
      </Block>

      {/* Инструкция по админке */}
      <Block title="Как работать с админ-панелью">
        <ol className="list-decimal space-y-2 pl-5">
          <li><b>Заказы.</b> Каждая заявка с формы сайта попадает сюда со статусом «Новый». Согласуйте оплату вручную
            (карта, СБП или наличные) и переведите заказ в «Оплачен» выбором из выпадающего списка. После сессии —
            «Проведена встреча», после завершения цикла работы — «Закрыт». Счётчик новых заявок виден на вкладке.</li>
          <li><b>Витрина.</b> Редактируйте названия, описания, цены, бейджи и заметки карточек. Цена «для подписчиков»
            переключателем на сайте меняется только у индивидуальной консультации — поле есть у всех карточек,
            но используется по логике витрины. Кнопка «Сохранить» применяет изменения мгновенно.</li>
          <li><b>Контент.</b> Загрузка фото для «Обо мне»: изображение автоматически сжимается (до 900 px по большей
            стороне) и сохраняется в базе. Здесь же редактируются тексты «Обо мне», блок культурного кода и контакты
            (телефон, Telegram — меняются и на сайте, и в подвале).</li>
          <li><b>Данные.</b> Хранятся в браузере (localStorage, ключ <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[12px]">valeria_db_v1</code>).
            Для продакшена на VDS см. раздел про бэкенд ниже и не забывайте про экспорт.</li>
        </ol>
      </Block>

      {/* Низкоуровневые компоненты */}
      <Block title="Низкоуровневые компоненты: слой данных">
        <p>
          Вся работа с данными идёт через единый модуль <b>src/lib/db.ts</b> — адаптер «мини-БД». Таблицы:
        </p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          <li><b>users</b> — пользователи и роли (admin / manager), пароль хранится хэшем;</li>
          <li><b>services</b> — карточки витрины (цена, цена подписчика, бейдж, описание);</li>
          <li><b>orders</b> — заявки с сайта и их статусы (Новый → Оплачен → Проведена встреча → Закрыт);</li>
          <li><b>content</b> — редактируемые тексты: «Обо мне», культурный код, контакты.</li>
        </ul>
        <p className="mt-3">
          Компоненты не обращаются к хранилищу напрямую — только через функции-мутаторы
          (<code className="rounded bg-ink/8 px-1.5 py-0.5 text-[12px]">addOrder, setOrderStatus, updateService, updateContent…</code>)
          и подписку на изменения. Сейчас адаптер пишет в localStorage; чтобы перейти на серверную базу,
          достаточно заменить внутренности <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[12px]">loadDB/persist</code> на
          запросы к REST API или Supabase — интерфейсы функций останутся прежними. Схема для PostgreSQL:
        </p>
        <Code>{SQL}</Code>
      </Block>

      {/* Перенос на VDS */}
      <Block title="Перенос и запуск на арендованном хостинге / VDS">
        <p><b>1. Сборка.</b> На машине с Node.js 18+ выполните:</p>
        <Code>{`npm install
npm run build     # результат появится в папке dist/`}</Code>
        <p className="mt-3"><b>2. VDS.</b> Арендуйте сервер (Ubuntu 22.04+, 1 ГБ RAM достаточно), установите nginx:</p>
        <Code>{`sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/valeria
# скопируйте содержимое dist/ на сервер:
# scp -r dist/* user@IP-сервера:/var/www/valeria/dist/`}</Code>
        <p className="mt-3"><b>3. Конфиг nginx и SSL:</b></p>
        <Code>{NGINX}</Code>
        <Code>{`sudo ln -s /etc/nginx/sites-available/valeria.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`}</Code>
        <p className="mt-3">
          <b>4. Хранилище данных.</b> Текущая версия хранит базу в браузере посетителя/администратора (localStorage) —
          сайт полностью статичен и не требует процессов на сервере. Заявки видны администратору в том браузере,
          где они были созданы. Для приёма заявок с любого устройства подключите бэкенд по схеме выше
          (Supabase — самый быстрый вариант: создайте проект, таблицы по SQL-схеме и замените адаптер в
          <b> src/lib/db.ts</b>), либо направьте форму на бесплатный обработчик форм (Formspree/Getform) как
          временное решение.
        </p>
        <p className="mt-3">
          <b>5. Обновления.</b> После правок: <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[12px]">npm run build</code> →
          скопировать новый <code className="rounded bg-ink/8 px-1.5 py-0.5 text-[12px]">dist/</code> → готово.
          Перед каждым обновлением делайте «Экспорт базы (JSON)» на этой странице.
        </p>
        <p className="mt-3">
          <b>6. Простой хостинг без VDS.</b> Папку dist/ можно положить на Netlify/Vercel/Cloudflare Pages или
          обычный shared-хостинг с поддержкой статики — сборка полностью автономна.
        </p>
      </Block>

      <p className="text-center text-[12px] font-medium text-ink-faint">
        Полная версия этих инструкций также лежит в файле README.md в корне проекта.
      </p>
    </div>
  );
}
