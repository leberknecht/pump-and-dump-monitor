"use strict";

const yaml = require('js-yaml');
const fs   = require('fs');
const Pusher = require('pusher-js');
const tradePusher = require(__dirname + "/TradePusher");

const configPath = __dirname + '/../config/services.yaml';

class BitstampScraper {
    constructor(tradePusher)
    {
        let configParameters = yaml.safeLoad(fs.readFileSync(configPath, 'utf8')).parameters;
        console.log('using parameters file: ' + configPath);
        console.log('pusher-id: ' + configParameters.pusher_id);
        this.pusher = new Pusher(configParameters.pusher_id);
        this.tradePusher = tradePusher;
    }

    run()
    {
        let tradesChannel = this.pusher.subscribe('live_trades');
        let tradesChannelEur = this.pusher.subscribe('live_trades_btceur');
        let that = this;
        tradesChannel.bind('trade', function (data) {
            that.tradePusher.send('bitstamp', 'BTC-USD', data.amount, data.price);
        });
        tradesChannelEur.bind('trade', function (data) {
            that.tradePusher.send('bitstamp', 'BTC-EUR', data.amount, data.price);
        });
    }
}

let bitstampScraper = new BitstampScraper(tradePusher);
bitstampScraper.run();
