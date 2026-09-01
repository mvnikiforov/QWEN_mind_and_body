#!/usr/bin/env bash
# ============================================================
#  Быстрый деплой на VDS по SSH
#  Использование:  bash deploy/deploy.sh user@ip-адрес-сервера
#  Предварительно: на сервере установлены nginx и rsync,
#  папка /var/www/probalance создана (sudo mkdir -p /var/www/probalance)
# ============================================================
set -euo pipefail

SERVER="${1:?Укажите адрес сервера, например: bash deploy/deploy.sh root@123.45.67.89}"
REMOTE_DIR="/var/www/probalance"

echo "→ Собираю production-версию…"
npm run build

echo "→ Загружаю dist/ на $SERVER:$REMOTE_DIR …"
rsync -avz --delete dist/ "$SERVER:$REMOTE_DIR"

echo "→ Готово! Сайт обновлён: http://$SERVER"
echo "   (если домен привязан — проверьте его в браузере)"
