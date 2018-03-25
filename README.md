Installation
====

    docker-compose build
    docker-compose run pnd_phpfpm composer install
    docker-compose run pnd_scraper_bitstamp /bin/bash -c 'cd /code && yarn install'
    docker-compose run pnd_scraper_bitstamp /bin/bash -c 'cd /code && yarn encore dev'
    docker-compose up -d && sudo bin/docker-ip-helper.sh
    gulp

