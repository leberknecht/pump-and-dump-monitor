FROM php:7.2-fpm

RUN apt-get update

RUN pecl install xdebug

RUN apt-get install -y git libzip-dev

RUN docker-php-ext-install bcmath \
                            mbstring \
                            pdo_mysql \
                            zip

RUN docker-php-ext-enable bcmath \
                            mbstring \
                            xdebug

ENV PHPREDIS_VERSION 3.0.0

RUN mkdir -p /usr/src/php/ext/redis \
    && curl -L https://github.com/phpredis/phpredis/archive/$PHPREDIS_VERSION.tar.gz | tar xvz -C /usr/src/php/ext/redis --strip 1 \
    && echo 'redis' >> /usr/src/php-available-exts \
    && docker-php-ext-install redis

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN chown www-data:www-data /var/www
RUN usermod -s /bin/bash www-data
RUN /bin/su www-data -c 'composer global require "hirak/prestissimo:^0.3"'

RUN echo "xdebug.remote_autostart=true" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_connect_back=true" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.remote_enable=true" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.idekey=xdebug" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini
RUN echo "xdebug.max_nesting_level=1024" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

RUN echo "memory_limit=-1" > /usr/local/etc/php/conf.d/no_memory_limit.ini
RUN echo "umask 0002" >> /etc/bash.bashrc

COPY entrypoint.sh /entrypoint.sh
COPY wait-for-it.sh /usr/bin/wait-for-it

RUN chmod a+x /usr/bin/wait-for-it
RUN chmod a+x /entrypoint.sh

WORKDIR /code
VOLUME /var/www
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/bin/bash", "-i", "-c", "/usr/local/sbin/php-fpm"]
