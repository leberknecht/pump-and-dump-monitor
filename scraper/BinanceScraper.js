const WebSocket = require('ws');
const tradePusher = require(__dirname + "/TradePusher");

class BinanceScraper {
    constructor(binanceSocket) {
        this.websocket = binanceSocket;
        this.websocket.onclose = BinanceScraper.onClose;
        this.websocket.onopen = BinanceScraper.onOpen;
        this.websocket.onmessage = BinanceScraper.onMessage;
    }

    static onMessage(msg) {
        let marketData = JSON.parse(msg.data);
        let parts = marketData.data.s.match(/(.{2,})(ETC|BTC|USDT|ETH|BNB)/);
        tradePusher.send("binance", parts[2] + '-' + parts[1], marketData.data.q, marketData.data.p)
    };

    static onClose() {
        console.log("socket closed");
        process.exit(1);
    }

    static onOpen() {
        console.log("socket opened");
    };
}

new BinanceScraper(
    new WebSocket("wss://stream.binance.com:9443/stream?streams=ethbtc@trade/ltcbtc@trade/bnbbtc@trade/neobtc@trade/qtumeth@trade/bccbtc@trade/gasbtc@trade/bnbeth@trade/btcusdt@trade/ethusdt@trade/hsrbtc@trade/oaxeth@trade/icneth@trade/mcobtc@trade/lrceth@trade/qtumbtc@trade/omgbtc@trade/zrxbtc@trade/zrxeth@trade/bqxbtc@trade/knceth@trade/funbtc@trade/snmbtc@trade/neoeth@trade/iotabtc@trade/iotaeth@trade/linkbtc@trade/linketh@trade/xvgbtc@trade/xvgeth@trade/salteth@trade/mdabtc@trade/mdaeth@trade/mtleth@trade/subbtc@trade/subeth@trade/eosbtc@trade/etceth@trade/etcbtc@trade/mtheth@trade/engbtc@trade/zeceth@trade/bntbtc@trade/astbtc@trade/asteth@trade/dashbtc@trade/dasheth@trade/oaxbtc@trade/btgbtc@trade/btgeth@trade/evxeth@trade/reqbtc@trade/reqeth@trade/hsreth@trade/trxbtc@trade/xrpbtc@trade/xrpeth@trade/modeth@trade/storjbtc@trade/bnbusdt@trade/venbnb@trade/powrbnb@trade/venbtc@trade/nulsbtc@trade/rdnbtc@trade/rdnbnb@trade/xmrbtc@trade/xmreth@trade/dltbnb@trade/dltbtc@trade/ambeth@trade/bcceth@trade/bccusdt@trade/bccbnb@trade/batbtc@trade/bateth@trade/bcpteth@trade/bcptbnb@trade/arnbtc@trade/gvtbtc@trade/gvteth@trade/gxsbtc@trade/neousdt@trade/poeeth@trade/qspbtc@trade/qspeth@trade/btseth@trade/xzcbtc@trade/xzceth@trade/lskbtc@trade/fuelbtc@trade/fueleth@trade/bcdbtc@trade/bcdeth@trade/dgdbtc@trade/iotabnb@trade/adxbtc@trade/adxeth@trade/adabtc@trade/pptbtc@trade/ppteth@trade/cmtbnb@trade/xlmbtc@trade/xlmeth@trade/xlmbnb@trade/cndbtc@trade/cndeth@trade/cndbnb@trade/lendeth@trade/wabieth@trade/ltceth@trade/ltcusdt@trade/ltcbnb@trade/tnbbtc@trade/wavesbtc@trade/waveseth@trade/gtobtc@trade/gtoeth@trade/gtobnb@trade/icxbtc@trade/icxeth@trade/icxbnb@trade/ostbtc@trade/osteth@trade/ostbnb@trade/elfbtc@trade/neblbtc@trade/brdeth@trade/brdbnb@trade/edobtc@trade/edoeth@trade/wingsbtc@trade/navbnb@trade/trigbtc@trade/trigbnb@trade/appcbtc@trade/appcbnb@trade/vibeeth@trade/rlcbnb@trade/insbtc@trade/inseth@trade/pivxbtc@trade/pivxeth@trade/pivxbnb@trade/iostbtc@trade/iosteth@trade/steemeth@trade/steembnb@trade/viabtc@trade/viabnb@trade/blzeth@trade/aebtc@trade/aeeth@trade/aebnb@trade/rpxbtc@trade/rpxeth@trade/rpxbnb@trade")
);

