const tradePusher = require(__dirname + '/TradePusher');
const fs = require('fs');
const process = require('process');
const WebSocket = require('ws');

const map = {
    '7': 'BTC_BCN',
    '8': 'BTC_BELA',
    '10': 'BTC_BLK',
    '12': 'BTC_BTCD',
    '13': 'BTC_BTM',
    '14': 'BTC_BTS',
    '15': 'BTC_BURST',
    '20': 'BTC_CLAM',
    '24': 'BTC_DASH',
    '25': 'BTC_DGB',
    '27': 'BTC_DOGE',
    '28': 'BTC_EMC2',
    '31': 'BTC_FLDC',
    '32': 'BTC_FLO',
    '38': 'BTC_GAME',
    '40': 'BTC_GRC',
    '43': 'BTC_HUC',
    '50': 'BTC_LTC',
    '51': 'BTC_MAID',
    '58': 'BTC_OMNI',
    '61': 'BTC_NAV',
    '63': 'BTC_NEOS',
    '64': 'BTC_NMC',
    '69': 'BTC_NXT',
    '73': 'BTC_PINK',
    '74': 'BTC_POT',
    '75': 'BTC_PPC',
    '83': 'BTC_RIC',
    '89': 'BTC_STR',
    '92': 'BTC_SYS',
    '97': 'BTC_VIA',
    '98': 'BTC_XVC',
    '99': 'BTC_VRC',
    '100': 'BTC_VTC',
    '104': 'BTC_XBC',
    '108': 'BTC_XCP',
    '112': 'BTC_XEM',
    '114': 'BTC_XMR',
    '116': 'BTC_XPM',
    '117': 'BTC_XRP',
    '121': 'USDT_BTC',
    '122': 'USDT_DASH',
    '123': 'USDT_LTC',
    '124': 'USDT_NXT',
    '125': 'USDT_STR',
    '126': 'USDT_XMR',
    '127': 'USDT_XRP',
    '129': 'XMR_BCN',
    '130': 'XMR_BLK',
    '131': 'XMR_BTCD',
    '132': 'XMR_DASH',
    '137': 'XMR_LTC',
    '138': 'XMR_MAID',
    '140': 'XMR_NXT',
    '148': 'BTC_ETH',
    '149': 'USDT_ETH',
    '150': 'BTC_SC',
    '151': 'BTC_BCY',
    '153': 'BTC_EXP',
    '155': 'BTC_FCT',
    '158': 'BTC_RADS',
    '160': 'BTC_AMP',
    '162': 'BTC_DCR',
    '163': 'BTC_LSK',
    '166': 'ETH_LSK',
    '167': 'BTC_LBC',
    '168': 'BTC_STEEM',
    '169': 'ETH_STEEM',
    '170': 'BTC_SBD',
    '171': 'BTC_ETC',
    '172': 'ETH_ETC',
    '173': 'USDT_ETC',
    '174': 'BTC_REP',
    '175': 'USDT_REP',
    '176': 'ETH_REP',
    '177': 'BTC_ARDR',
    '178': 'BTC_ZEC',
    '179': 'ETH_ZEC',
    '180': 'USDT_ZEC',
    '181': 'XMR_ZEC',
    '182': 'BTC_STRAT',
    '183': 'BTC_NXC',
    '184': 'BTC_PASC',
    '185': 'BTC_GNT',
    '186': 'ETH_GNT',
    '187': 'BTC_GNO',
    '188': 'ETH_GNO',
    '189': 'BTC_BCH',
    '190': 'ETH_BCH',
    '191': 'USDT_BCH',
    '192': 'BTC_ZRX',
    '193': 'ETH_ZRX',
    '194': 'BTC_CVC',
    '195': 'ETH_CVC',
    '196': 'BTC_OMG',
    '197': 'ETH_OMG',
    '198': 'BTC_GAS',
    '199': 'ETH_GAS',
    '200': 'BTC_STORJ',
};

class PoloniexScraper {
    constructor(poloniexSocket) {
        this.websocket = poloniexSocket;
        this.websocket.onmessage = this.onMessage;
        this.websocket.onclose = this.onClose;
        this.websocket.onopen = this.onOpen;
    }

    onMessage(msg) {
        msg = JSON.parse(msg.data);
        if (3 === msg.length) {
            if (map[msg[2][0]]) {
                tradePusher.send('poloniex', map[msg[2][0]].replace('_','-'), msg[2][6], msg[2][1])
            } else {
                console.log('unknown symbol: ' + msg[2][0] + ' @ ' + msg[2][1])
            }
        }
    };

    onClose(ev)
    {
        console.log('socket closed');
        process.exit(1);
    };

    onOpen() {
        this.send(JSON.stringify({
            command: 'subscribe',
            channel: '1002',
        }));
    };
}

let poloniexScraper = new PoloniexScraper(new WebSocket("wss://api2.poloniex.com"));
