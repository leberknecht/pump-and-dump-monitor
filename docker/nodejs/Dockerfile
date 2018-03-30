FROM node
FROM node:9.9.0

RUN npm install -g gulp
RUN npm install -g yarn
RUN mkdir /var/www/.cache/yarn -p
RUN chown www-data:www-data /var/www -R

COPY wait-for-it.sh /bin/wait-for-it
COPY entrypoint.sh /entrypoint.sh
RUN chmod a+x /bin/wait-for-it
RUN chmod a+x /entrypoint.sh
RUN chmod a+x /usr/local/bin/yarn

WORKDIR /code
ENTRYPOINT ["/entrypoint.sh"]
CMD ["/entrypoint.sh"]
