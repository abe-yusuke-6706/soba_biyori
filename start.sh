#!/bin/bash
# Laravel のキャッシュをクリアして再構築
php artisan config:clear
php artisan cache:clear
php artisan config:cache
# マイグレーション
php artisan migrate --force
# Apache をフォアグラウンドで起動
apache2-foreground
