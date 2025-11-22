FROM php:8.3-apache

WORKDIR /var/www/html

# 必要パッケージ・拡張機能
RUN apt-get update && apt-get install -y \
    git zip unzip vim \
    libfreetype6-dev libjpeg62-turbo-dev libpng-dev \
    libicu-dev libzip-dev libpq-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd bcmath pdo_mysql mysqli exif intl zip pdo_pgsql pgsql \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Composer をコピー
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Laravel ソースコードをコピー
COPY ./www/laravel/ /var/www/html/

# Apache ドキュメントルートを public に切り替える
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf && \
    sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

RUN a2enmod rewrite

# Composer install はビルド時に実行
RUN composer install --no-dev --optimize-autoloader --no-scripts

# 権限設定
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 🎉 起動時に実行する処理を全てここに統合（start.sh 必要なし）
CMD bash -c "\
    php artisan key:generate --force && \
    php artisan migrate --force || true && \
    apache2-foreground \
"

