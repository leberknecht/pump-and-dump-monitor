import SymbolInfo from "./SymbolInfo";
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
        let symbolStats  = this.state.symbolStats;

        if ( !(trade.symbol in symbolStats) ) {
            symbolStats[trade.symbol] = []
        }

        if ( !(trade.exchange in symbolStats[trade.symbol]) ) {
            symbolStats[trade.symbol][trade.exchange] =  {
                trades: [ trade ],
                tradeCount: 0,
                lastPrice: trade.price,
                change: 0,
                lastChanges: []
            }
        } else {
            let symbolInfo = symbolStats[trade.symbol][trade.exchange];
            if (symbolInfo.trades.length < 20) {
                symbolInfo.trades.push(trade);
            } else {
                symbolInfo.trades.shift();
            }
            symbolInfo.change = (trade.price / symbolInfo.lastPrice) - 1;
            symbolInfo.tradeCount++;
            symbolStats[trade.symbol][trade.exchange] = symbolInfo;
        }

        this.state.symbolStats = symbolStats;
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <h2>last trades</h2>
                    <span className="glyphicon glyphicon-asterisk" />
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
                </div>
                <div className="col-md-8">
                    <h2>Symbol</h2>
                    <SymbolInfo symbolStats={ this.state.symbolStats }/>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <FeedReader/>,
    document.getElementById('root')
);