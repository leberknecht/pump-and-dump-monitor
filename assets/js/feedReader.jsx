import React from "react";
import ReactDOM from "react-dom";

class FeedReader extends React.Component {
    constructor(props) {
        super(props);

        const webSocketHost = document.getElementById('root').getAttribute('data-websocket-host');
        console.log('web-socket host: ' + webSocketHost);
        this.state = {
            trades: [],
            symbolStats: [],
            webSocketHost: webSocketHost
        };
    }

    componentDidMount() {
        this.connection = new WebSocket(this.state.webSocketHost);
        this.connection.onmessage = evt => {
            if (this.state.trades.length > 8) {
                this.state.trades.shift();
            }

            let trade = JSON.parse(evt.data);
            this.handleTrade(trade);
            this.setState({
                trades : this.state.trades.concat([ trade ])
            })
        };
    }

    handleTrade(trade) {
        let symbolStats = this.state.symbolStats;
        if ( !(trade.exchange in symbolStats) ) {
            symbolStats[trade.exchange] = [];
        }

        if ( !(trade.symbol in symbolStats[trade.exchange]) ) {
            symbolStats[trade.exchange][trade.symbol] = {
                trades: [ trade ],
                lastPrice: trade.price,
                change: 0,
                lastChanges: []
            }
        } else {
            let symbolTrades = symbolStats[trade.exchange][trade.symbol].trades;
            let lastTrade = symbolTrades[symbolTrades.length - 1];
            if (lastTrade.price > trade.price ) {
                console.log('price -- falling for ' + trade.symbol + 'last: ' + lastTrade.price + 'now:' + trade.price)
            } else {
                console.log('price ++ raising for ' + trade.symbol + 'last: ' + lastTrade.price + 'now:' + trade.price)
            }

            symbolTrades.push(trade);
            symbolStats[trade.exchange][trade.symbol].trades = symbolTrades;
        }

        this.state.symbolStats = symbolStats;
    }

    render() {
        return (
            <table className="table">
                <tbody>
                {
                    this.state.trades.slice().reverse().map( (msg, index) =>
                        <tr key={'record-' + index}>
                            <td key={'exchange-' + index }>{ msg.exchange }</td>
                            <td key={'symbol-' + index }>{ msg.symbol }</td>
                            <td key={'price-' + index }>{ msg.price }</td>
                        </tr>
                    )
                }
                </tbody>
            </table>
        )
    }
}

ReactDOM.render(
    <FeedReader/>,
    document.getElementById('root')
);