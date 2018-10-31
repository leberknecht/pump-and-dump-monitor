#!/usr/bin/env bash
set -e
cp .env.dist .env
docker-compose build
docker-compose run pnd_phpfpm composer install
docker-compose run pnd_scraper_bitstamp yarn install
docker-compose run -d pnd_scraper_bitstamp yarn encore dev --watch
docker-compose run pnd_phpfpm php bin/console doctrine:database:create --if-not-exists
docker-compose run pnd_phpfpm php bin/console doctrine:migrations:migrate -n
docker-compose up -d
echo "Updating /etc/hosts..."
echo "--------"
sudo bin/docker-ip-helper.sh
echo "--------"
printf "\ndone, open http://pndmoni.local/ \n"
