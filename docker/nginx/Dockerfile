FROM nginx

RUN apk add bash
COPY wait-for-it.sh /bin/wait-for-it
RUN chmod a+x /bin/wait-for-it
RUN echo 'daemon off;' >> /etc/nginx/nginx.conf
