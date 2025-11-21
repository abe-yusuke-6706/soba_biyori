/usr/local/bin/php /var/www/html/artisan migrate --force

chown -R www-data:www-data storage bootstrap/cache

exec /usr/sbin/apache2-foreground