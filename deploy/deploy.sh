#!/usr/bin/env bash
#  Быстрый деплой на VDS по SSH
#  Использование:  bash deploy/deploy.sh user@ip-адрес-сервера
set -euo pipefail

SERVER="${1:?Укажите адрес сервера, например: bash deploy/deploy.sh root@123.45.67.89}"
REMOTE_DIR="/var/www/probalance"

echo "→ Собираю production-версию…"
npm run build

echo "→ Загружаю dist/ на $SERVER:$REMOTE_DIR …"
rsync -avz --delete dist/ "$SERVER:$REMOTE_DIR"

echo "→ Готово! Сайт обновлён: http://$SERVER"
