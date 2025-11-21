FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
    git \
    zip \
    unzip \
    vim \
    libfreetype6-dev \
    libjpeg62-turbo-dev \
    libpng-dev \
    libicu-dev \
    libzip-dev

RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd \
    && docker-php-ext-install bcmath pdo_mysql mysqli exif intl zip

RUN cd /usr/bin \
    && curl -s https://getcomposer.org/installer | php \
    && ln -s /usr/bin/composer.phar /usr/bin/composer

WORKDIR /var/www/html

# storage と cache の権限は "実行時" に設定する（ビルド時には意味ない）
CMD ["sh", "-c", "chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && php-fpm"]
