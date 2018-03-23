FROM node
FROM node:9.9.0

RUN npm install ws
RUN npm install amqplib
RUN npm install pusher-js
RUN npm install mock-browser
RUN npm install sleep
RUN npm install autobahn
RUN npm install js-yaml
RUN npm install fs
RUN npm install cloudscraper
RUN npm install request@2.81.0
RUN npm install signalr-client@0.0.17
RUN npm install object-assign
RUN npm install jsonic

COPY wait-for-it.sh /bin/wait-for-it
RUN chmod a+x /bin/wait-for-it
