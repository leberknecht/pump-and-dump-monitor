FROM php:7.1-fpm

RUN docker-php-ext-install bcmath && docker-php-ext-enable bcmath

RUN docker-php-ext-install mbstring && docker-php-ext-enable mbstring

RUN docker-php-ext-install pdo_mysql

RUN pecl install xdebug \
        && docker-php-ext-enable xdebug

RUN pecl install redis \
        && docker-php-ext-enable redis

RUN echo "xdebug.remote_autostart=true" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_connect_back=true" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_enable=true" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.idekey=xdebug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.max_nesting_level=1024" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN apt-get update
RUN apt-get install -y git libzip-dev

RUN docker-php-ext-install zip

RUN apt install -y libmagickwand-dev
RUN pecl install imagick
RUN docker-php-ext-enable imagick
RUN apt-get install -y libpng-dev
RUN docker-php-ext-install gd
RUN apt-get install -y cron

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY wait-for-it.sh /usr/bin/wait-for-it
RUN chmod a+x /usr/bin/wait-for-it

RUN chown www-data:www-data /var/www

RUN usermod -s /bin/bash www-data

RUN /bin/su www-data -c 'composer global require "hirak/prestissimo:^0.3"'
RUN echo "memory_limit=-1" > /usr/local/etc/php/conf.d/no_memory_limit.ini

WORKDIR /code

VOLUME /var/www
