Installation
====

We assume that your user is member of `www-data` group on your system. 
Containers are configured to create files with group write permission

    bin/setup.sh

The last command will update your `/etc/hosts` file, so you can use container names from 
your host. If you are on MacOS and use docker-machine, this last step is not required. 
Open http://pndmoni.local/ to see if everything worked fine.

Develop
== 
If you have `gulp` installed on your host, run it, and your browser should open http://localhost:3000 
which is a browser-sync session that will automatically refresh if front-end assets get changed. 
The update will be triggered when either files under `templates/`, `assets/js/` or `assets/css/` 
get changed (by a container running `yarn encore dev --watch` in the background). 

If `gulp` fails, then most probably because you are missing node or have a version different than 9.9.0
installed


Scrapers
===

The project ships with scrapers for
* Binance
* Bittrex
* Poloniex
* Bitstamp (just because)

But as Binance has very high traffic (50-100 trades per second), the scraper is disabled per default. 
To enable it, simply un-comment the service in the docker-compose.yml
Finally, to scraper Bittrex you will have to create an API key, see https://support.bittrex.com/hc/en-us/articles/115003723911
and set the secret + key in `.env`

Queue
===
We use RabbitMQ for queuing the trades from the ticker, the admin-ui is available on [http://pnd_rabbitmq:15672]
If you have the feeling the stats have a lag, check the load of the `trades` queue. If it piles up, trades are
coming in faster than the app/your-machine can process them.