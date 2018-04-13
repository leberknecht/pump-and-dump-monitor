import React from "react"

function SymbolLink(props) {
    let symbolName = props.symbolName;
    let exchange = props.exchange;

    let urls = {
        'bittrex': 'https://bittrex.com/Market/Index?MarketName='+ symbolName,
        'poloniex': 'https://poloniex.com/exchange#'+ symbolName.replace('-', '_'),
        'binance': 'https://www.binance.com/trade.html?symbol=' + symbolName.split('-')[1] + '_' + symbolName.split('-')[0]
    };

    return (
        <a href={ urls[exchange] } target="_blank" >{ exchange }</a>
    )
}

export default SymbolLink;