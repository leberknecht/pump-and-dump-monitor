const tradePusher = require(__dirname + "/TradePusher");
const process = require('process');
let bittrex = require('node.bittrex.api');
require('dotenv').config();

console.log('bittrex api key: ' + process.env.BITTREX_API_KEY);

function handleSymbolDelta(marketsDelta, lastValues) {
    let  pairName = marketsDelta.MarketName.replace('-', '');
    let  currentVolume = marketsDelta.Volume;
    let  currentPrice = marketsDelta.Last;
    let  currentTime = marketsDelta.TimeStamp;
    if (lastValues[pairName]) {
        if (lastValues[pairName]['lastVolume'] !== currentVolume) {
            let volumeDiff = currentVolume - lastValues[pairName]['lastVolume'];
            if (volumeDiff < 0) {
                volumeDiff *= -1;
            }
            lastValues[pairName]['lastVolume'] = currentVolume;
            lastValues[pairName]['lastPrice'] = currentPrice;

            let parts = pairName.match(/(BTC|USDT|ETH)(.{2,})/);
            pairName = parts[1] + '-' + parts[2];
            console.log('trade: ' + pairName);
            tradePusher.send('bittrex', pairName, volumeDiff, currentPrice);
        }
    } else {
        lastValues[pairName] = {lastVolume: currentVolume, lastPrice: currentPrice, time: currentTime};
    }
}

function handleSummaryUpdate(data, lastValues) {
    data.A.forEach(function (dataFor) {
        dataFor.Deltas.forEach(function (marketsDelta) {
            handleSymbolDelta(marketsDelta, lastValues);
        });
    });
}

function listenCallback(lastValues) {
    bittrex.websockets.listen(function (data) {
        if (data.M === 'updateSummaryState') {
            handleSummaryUpdate(data, lastValues);
        }
    });
}

function readFeed()
{
    bittrex.options({
        'apikey' : process.env.BITTREX_API_KEY,
        'apisecret' : process.env.BITTREX_API_SECRET,
    });

    let  lastValues = {};

    bittrex.websockets.client(function(wsClient){
        wsClient.serviceHandlers.onerror = function() {
            console.log('connection to bittrex failed, quitting.');
            process.exit(3);
        };
        wsClient.serviceHandlers.connected = function () {
            console.log('Connected !');
            wsClient.call('CoreHub', 'SubscribeToSummaryDeltas').done(function(err, result) {
                if (err) {
                    return console.error(err);
                }
                if (result === true) {
                    console.log('Subscribed to tickers');
                    listenCallback(lastValues);
                }
            });
        };
    });
}

try {
    readFeed();
} catch (err) {
    process.exit(2);
}
