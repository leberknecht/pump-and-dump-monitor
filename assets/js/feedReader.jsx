import SymbolInfo from "./SymbolInfo";
import React from "react";
import ReactDOM from "react-dom";
import AlaSQL from "alasql"

class FeedReader extends React.Component {
    constructor(props) {
        super(props);

        const webSocketHost = document.getElementById('root').getAttribute('data-websocket-host');
        AlaSQL('CREATE TABLE trades (price FLOAT, symbol STRING, time INT, change FLOAT)');
        console.log('web-socket host: ' + webSocketHost);

        this.togglePause = this.togglePause.bind(this);
        this.state = {
            trades: [],
            symbolStats: [],
            pause: false,
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

            if (!this.state.pause) {
                this.handleTrade(trade);
                this.setState({
                    trades : this.state.trades.concat([ trade ])
                })
            }
        };
    }

    handleTrade(trade) {
        let symbolStats  = this.state.symbolStats;

        if ( !(trade.symbol in symbolStats) ) {
            symbolStats[trade.symbol] = {
                'averageChange': 0,
                'exchanges': []
            }
        }

        if ( !(trade.exchange in symbolStats[trade.symbol]) ) {
            symbolStats[trade.symbol].exchanges[trade.exchange] =  {
                trades: [ trade ],
                tradeCount: 0,
                lastPrice: trade.price,
                change: 0,
                lastChanges: []
            }
        } else {
            let symbolInfo = symbolStats[trade.symbol].exchanges[trade.exchange];

            if (symbolInfo.trades.length < 20) {
                symbolInfo.trades.push(trade);
            } else {
                symbolInfo.trades.shift();
            }
            symbolInfo.change = (trade.price / symbolInfo.lastPrice) - 1;
            symbolInfo.tradeCount++;
            AlaSQL("INSERT INTO trades (price, symbol, time, change) VALUES(" +
                trade.price + ",'" +
                trade.symbol+ "', "+
                Date.now() + "," +
                symbolInfo.change.toFixed(8) + ")"
            );
            symbolStats[trade.symbol].exchanges[trade.exchange] = symbolInfo;
        }

        this.state.symbolStats = symbolStats;
    }

    togglePause(event) {
        if (event) {
            event.preventDefault();
        }
        this.state.pause = !this.state.pause;
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <h2>last trades</h2>
                    <button onClick={this.togglePause}>Pause</button>
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