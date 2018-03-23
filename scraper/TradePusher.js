"use strict";

const amqp = require('amqplib/callback_api');
const yaml = require('js-yaml');
const fs = require('fs');

const configPath = __dirname + '/../config/services.yaml';

class TradePusher {
    constructor() {
        this.queueChannel = null;
        this.queueName = 'trades';
        let configParameters = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')).parameters;
        this.rabbitHost = configParameters.rabbitmq_host;
        this.rabbitUser = configParameters.rabbitmq_user;
        this.rabbitPassword = configParameters.rabbitmq_password;
        console.log('using parameters file: ' + configPath);
        console.log('rabbit-host: ' + this.rabbitHost);
        console.log('rabbit-user: ' + this.rabbitUser);
    }

    openConnection()
    {
        if (!this.queueChannel) {
            let uri = 'amqp://' + this.rabbitUser + ':' + this.rabbitPassword + '@' + this.rabbitHost;
            let that = this;

            amqp.connect(uri, function(err, conn) {
                if (conn) {
                    conn.createChannel(function(err, ch) {
                        that.queueChannel = ch;
                    });
                }
            });
            console.log('connection to rabbit server established on: ' + this.rabbitHost);
        }
    }

    send(exchange, channel, volume, price)
    {
        let msg = {
            exchange: exchange,
            symbol: channel,
            volume: volume,
            price: price,
            time: new Date().toISOString()
        };
        this.sendMessage(msg);
    }

    sendMessage(message)
    {
        if (!this.queueChannel) {
            this.openConnection();
        }
        if (this.queueChannel) {
            this.queueChannel.assertQueue(this.queueName, {durable: false});
            this.queueChannel.sendToQueue(this.queueName, new Buffer(JSON.stringify(message)));
        }
    }
}

let tradePusher = new TradePusher();
module.exports = tradePusher;
