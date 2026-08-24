# Валерия — сайт-витрина психологических услуг

Одностраничный сайт-магазин услуг психолога-консультанта (гештальт-практика) со встроенной
админ-панелью: витрина с ценами, форма записи, учёт заказов, редактирование контента.

## Стек

- **React 18 + TypeScript + Vite** — фронтенд, сборка в `dist/`
- **Tailwind CSS 4** — стилизация
- **Слой данных** — `src/lib/db.ts`: таблицы `users`, `services`, `orders`, `content`.
  Текущий адаптер — localStorage браузера (ключ `valeria_db_v1`), интерфейс доступа
  готов к замене на REST API / Supabase / PostgreSQL без переписывания компонентов.

## Быстрый старт

```bash
npm install
npm run dev      # локальная разработка, http://localhost:5173
npm run build    # продакшен-сборка в папку dist/
```

## Админ-панель

Вход: ссылка «Для администратора» в подвале сайта или адрес `…/#/admin`.

- **Первый вход:** логин `admin`, пароль `valeria`. Сразу смените пароль:
  вкладка «Настройки и документация» → «Смена пароля администратора».
- **Роли:** доступ к админке имеет только роль `admin`. Роль `manager` заложена
  в схему данных для будущего расширения (помощник без прав на настройки).

### Заказы

Заявки с формы сайта попадают на вкладку «Заказы» со статусом **«Новый»**.
Оплата в этой версии не подключена — она согласуется вручную (карта/СБП/наличные).
Статус меняется выбором из выпадающего списка:

> Новый → Оплачен → Проведена встречу → Закрыт

Счётчик новых заявок отображается на кнопке вкладки. Заказ можно удалить (двойное
подтверждение).

### Витрина

Вкладка «Витрина»: редактирование названия, описания, длительности, цены,
цены для подписчиков, бейджа, заметки (у мастер-класса — тема и дата), текста кнопки.
«Сохранить» применяет изменения мгновенно. Переключатель «Для подписчиков» на сайте
меняет цену только индивидуальной консультации (2 500 ₽ вместо 3 000 ₽).

### Контент

- **Фото «Обо мне»** — загрузка JPG/PNG; изображение автоматически сжимается
  (до 900 px по большей стороне, JPEG 85%) и сохраняется в базе.
- **Тексты** — абзацы «Обо мне» (разделяются пустой строкой), плашки, блок
  «Бережность к культурному коду».
- **Контакты** — телефон и Telegram (отображение и ссылки), примечание,
  финальная фраза. Меняются и в секции контактов, и в подвале.

### Данные и резервные копии

- **Экспорт базы (JSON)** — скачивает все таблицы (пользователи, витрина, заказы, контент).
  Делайте копию перед правками и минимум раз в неделю.
- **Импорт** — восстановление из файла копии.
- **Сброс** — возвращает витрину и контент к значениям по умолчанию (заказы сохраняются).

## Низкоуровневые компоненты (слой данных)

Вся работа с данными идёт через `src/lib/db.ts`:

| Таблица   | Назначение                                                        |
|-----------|-------------------------------------------------------------------|
| `users`   | пользователи и роли, пароль — хэш                                  |
| `services`| карточки витрины: цена, цена подписчика, бейдж, описание           |
| `orders`  | заявки и статусы (`new`, `paid`, `done`, `closed`)                 |
| `content` | редактируемые тексты: «Обо мне», культурный код, контакты          |

Компоненты используют только функции-мутаторы (`addOrder`, `setOrderStatus`,
`updateService`, `updateContent`, `changePassword`, `importDB`, `resetContentToDefault`)
и подписку `subscribe()`. Для переезда на серверную БД замените внутренности
`loadDB()/persist()` на запросы к API — сигнатуры функций не изменятся.

### Схема PostgreSQL / Supabase

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT UNIQUE NOT NULL,
  pass_hash TEXT NOT NULL,
  name TEXT,
  role TEXT NOT NULL DEFAULT 'manager'   -- 'admin' | 'manager'
);

CREATE TABLE services (
  id TEXT PRIMARY KEY, kind TEXT NOT NULL, title TEXT NOT NULL,
  duration TEXT, price INT NOT NULL DEFAULT 0, price_unit TEXT,
  subscriber_price INT, badge TEXT, note TEXT, description TEXT,
  cta TEXT, featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, contact TEXT NOT NULL,
  service_id TEXT REFERENCES services(id),
  service_title TEXT, price TEXT, comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'new'     -- new -> paid -> done -> closed
);

CREATE TABLE content (
  key TEXT PRIMARY KEY,                  -- 'about' | 'culture' | 'contacts'
  body JSONB NOT NULL
);
```

## Перенос и запуск на хостинге / VDS

### Вариант А — VDS (nginx)

```bash
# 1. Сборка (на машине с Node.js 18+)
npm install && npm run build

# 2. Сервер (Ubuntu 22.04+, 1 ГБ RAM достаточно)
sudo apt update && sudo apt install -y nginx
sudo mkdir -p /var/www/valeria
# скопируйте содержимое dist/ на сервер:
# scp -r dist/* user@IP:/var/www/valeria/dist/
```

Конфиг `/etc/nginx/sites-available/valeria.conf`:

```nginx
server {
    listen 80;
    server_name vash-domen.ru www.vash-domen.ru;
    root /var/www/valeria/dist;
    index index.html;

    location / { try_files $uri $uri/ /index.html; }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/valeria.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# SSL Let's Encrypt:
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d vash-domen.ru -d www.vash-domen.ru
```

Обновления: `npm run build` → скопировать новый `dist/` → готово.

### Вариант Б — статический хостинг

Папку `dist/` можно разместить на Netlify, Vercel, Cloudflare Pages или любом
shared-хостинге со статикой — сборка полностью автономна.

### Важно про данные

В текущей версии база живёт в localStorage браузера: сайт статичен, серверные
процессы не нужны, но заявки видны администратору в том браузере, где созданы.
Чтобы принимать заявки с любых устройств, подключите бэкенд по SQL-схеме выше
(Supabase — самый быстрый путь: проект → таблицы → заменить адаптер в `src/lib/db.ts`),
либо временно направьте форму на обработчик форм (Formspree/Getform).
Не забывайте делать «Экспорт базы (JSON)» перед обновлениями.
