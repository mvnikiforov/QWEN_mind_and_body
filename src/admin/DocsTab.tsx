import { useRef, useState, type ChangeEvent, type ReactNode } from "react";
import { useStore } from "../lib/store";
import { changePassword, exportDB, importDB, resetDB } from "../lib/db";
import { IconDoc, IconDownload, IconUpload } from "../components/icons";

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-[24px] border border-line bg-card p-6 sm:p-8">
      <h3 className="font-display text-[20px] font-semibold">{title}</h3>
      <div className="mt-4 text-[14px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return <code className="rounded-[8px] bg-ink px-2 py-1 font-mono text-[12.5px] text-[#e9e4d9]">{children}</code>;
}

function SettingsSection() {
  const { session } = useStore();
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [msg, setMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const savePass = () => {
    if (p1.length < 6) return setMsg("Пароль должен быть не короче 6 символов");
    if (p1 !== p2) return setMsg("Пароли не совпадают");
    changePassword(session!.login, p1);
    setP1(""); setP2("");
    setMsg("Пароль изменён ✓");
  };

  const onImport = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setMsg(importDB(String(r.result)) ? "База импортирована ✓" : "Ошибка: файл не похож на резервную копию");
    r.readAsText(f);
  };

  const download = () => {
    const blob = new Blob([exportDB()], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `probalance-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const field = "w-full rounded-[12px] border border-ink/15 bg-paper px-3.5 py-2.5 text-[14px] font-semibold outline-none focus:border-gold-deep focus:ring-4 focus:ring-gold/25";

  return (
    <Block title="Настройки базы и доступа">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-gold-deep">Смена пароля администратора</p>
          <div className="mt-3 space-y-3">
            <input type="password" placeholder="Новый пароль (мин. 6 символов)" value={p1} onChange={(e) => setP1(e.target.value)} className={field} />
            <input type="password" placeholder="Повторите пароль" value={p2} onChange={(e) => setP2(e.target.value)} className={field} />
            <button onClick={savePass} className="rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">Сменить пароль</button>
          </div>
          <p className="mt-4 text-[12.5px] text-ink-faint">
            Учётная запись: <b>{session?.login}</b>, роль — администратор (полный доступ к админ-панели).
            Ролевая модель закладывается в таблицу <Code>users</Code>: при переносе на сервер добавьте роли
            <Code>manager</Code>/<Code>viewer</Code> и разграничьте доступ к разделам.
          </p>
        </div>
        <div>
          <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-gold-deep">Резервное копирование</p>
          <div className="mt-3 flex flex-wrap gap-3">
            <button onClick={download} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[12.5px] font-bold text-card transition-colors hover:bg-gold-deep">
              <IconDownload className="h-4 w-4" /> Экспорт базы (JSON)
            </button>
            <input ref={fileRef} type="file" accept="application/json" onChange={onImport} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-5 py-2.5 text-[12.5px] font-bold transition-colors hover:border-ink hover:bg-ink hover:text-card">
              <IconUpload className="h-4 w-4" /> Импорт базы
            </button>
            <button
              onClick={() => {
                if (window.confirm("Сбросить базу к исходным данным? Заказы и изменения будут удалены.")) resetDB();
              }}
              className="rounded-full border border-[#c06b4a]/50 px-5 py-2.5 text-[12.5px] font-bold text-[#a8522f] transition-colors hover:bg-[#f3e0d6]"
            >
              Сброс к исходным данным
            </button>
          </div>
          <p className="mt-4 text-[12.5px] text-ink-faint">
            Экспортируйте базу перед переносом сайта на другой хостинг и периодически — для резервных копий.
          </p>
        </div>
      </div>
      {msg && <p className="fadeup mt-5 inline-block rounded-full bg-stone px-4 py-2 text-[12.5px] font-bold">{msg}</p>}
    </Block>
  );
}

export default function DocsTab() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-ink text-card"><IconDoc className="h-5 w-5" /></span>
        <div>
          <h2 className="font-display text-[24px] font-semibold">Настройки и документация</h2>
          <p className="text-[12.5px] font-semibold text-ink-soft">Памятка администратора по низкоуровневым компонентам и переносу сайта</p>
        </div>
      </div>

      <SettingsSection />

      <Block title="1. Как устроено хранение данных (низкоуровневые компоненты)">
        <ul className="list-disc space-y-2 pl-5">
          <li>«База данных» сайта — таблицы <Code>users</Code>, <Code>services</Code>, <Code>orders</Code>, <Code>events</Code>, <Code>posts</Code>, <Code>content</Code> в localStorage браузера (ключ <Code>probalance-db-v3</Code>). Сессия входа — в sessionStorage.</li>
          <li>Все изменения из админ-панели (витрина, афиша, публикации, контакты, статусы заказов) записываются в базу мгновенно и сразу видны на сайте.</li>
          <li>Заявки с сайта попадают в таблицу <Code>orders</Code> со статусом <b>Новый</b> и заполненной мини-анкетой. Оплата не подключена — статусы меняются вручную: Новый → Оплачен → Проведена встреча → Закрыт.</li>
          <li>Загружаемые фото сжимаются на лету (до ~1000 px, JPEG 85%) и хранятся в базе в виде data-URL.</li>
          <li>Важно: localStorage привязан к браузеру и устройству. Данные живут на компьютере/телефоне администратора — поэтому делайте <b>Экспорт базы</b> перед чисткой браузера или сменой устройства.</li>
        </ul>
      </Block>

      <Block title="2. Работа с низкоуровневыми компонентами (памятка)">
        <ul className="list-disc space-y-2 pl-5">
          <li><b>Резервная копия:</b> «Настройки» → Экспорт базы → сохраните JSON-файл. Восстановление — Импорт базы.</li>
          <li><b>Пароль:</b> первый вход <Code>admin</Code> / <Code>valeria</Code>, сразу смените в «Настройках». Сессия сбрасывается при закрытии вкладки.</li>
          <li><b>Сброс:</b> кнопка «Сброс к исходным данным» возвращает витрину, афишу и тексты к заводским; заказы при этом удаляются.</li>
          <li><b>Отладка:</b> в консоли браузера база доступна как <Code>JSON.parse(localStorage.getItem('probalance-db-v3'))</Code>.</li>
          <li><b>Канал МАХ:</b> блок «Актуальное из канала» пытается подгрузить публикации по URL из «Контент → URL автоподгрузки» (RSS/JSON, таймаут 4 сек). Пока API закрыт — поле пустое, показываются ручные публикации из вкладки «Канал». Ожидаемый формат JSON: <Code>[&#123;"date","title","text","image"&#125;]</Code>.</li>
        </ul>
      </Block>

      <Block title="3. Перенос и запуск на хостинге / VDS">
        <ol className="list-decimal space-y-3 pl-5">
          <li><b>Сборка:</b> выполните <Code>npm install</Code>, затем <Code>npm run build</Code>. В папке <Code>dist</Code> появится статический сайт (index.html + assets).</li>
          <li><b>Статический хостинг:</b> скопируйте содержимое <Code>dist</Code> в корень сайта (Netlify / Vercel / GitHub Pages / любая панель с nginx). Сайт полностью статичен — база работает в браузере посетителя и администратора.</li>
          <li><b>VDS + nginx:</b> установите nginx и создайте конфиг: <Code>server &#123; listen 80; server_name vash-domen.ru; root /var/www/probalance; index index.html; location / &#123; try_files $uri /index.html; &#125; &#125;</Code>, затем <Code>sudo nginx -s reload</Code>.</li>
          <li><b>HTTPS:</b> <Code>sudo apt install certbot python3-certbot-nginx</Code> → <Code>sudo certbot --nginx -d vash-domen.ru</Code>.</li>
          <li><b>Перенос данных:</b> на старом устройстве — «Экспорт базы», на новом — войдите в админку и сделайте «Импорт базы».</li>
        </ol>
      </Block>

      <Block title="4. Развитие: серверная база данных и приём заявок на почту">
        <ul className="list-disc space-y-2 pl-5">
          <li>Структура таблиц переносится 1-в-1 в PostgreSQL/MySQL: <Code>users</Code> (с bcrypt-хэшем пароля), <Code>services</Code>, <Code>orders</Code> (+JSON-колонка <Code>form</Code> для анкеты), <Code>events</Code>, <Code>posts</Code>, <Code>content</Code>.</li>
          <li>Точки замены в коде: <Code>src/lib/db.ts</Code> (функции loadDB / mutate → fetch на API) и <Code>createOrder</Code> в форме записи → POST на сервер с дублированием на e-mail (например, через nodemailer или Telegram-бота).</li>
          <li>Минимальный стек для этого шага: Vite + React (уже есть) + Node/Express или Supabase + домен. Текущая версия сайта готова работать и без сервера.</li>
        </ul>
      </Block>
    </div>
  );
}
