#!/bin/sh

# マイグレーションを実行
/usr/local/bin/php /var/www/html/artisan migrate --force

# 権限を修正
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apache をフォアグラウンドで起動
exec /usr/sbin/apache2-foreground
