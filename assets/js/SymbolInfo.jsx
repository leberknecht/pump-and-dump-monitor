import React from "react";
import AlaSQL from "alasql"

function TrendIcon(props) {
    let change = props.change;
    if (change > 0) {
        return (
            <span className="fa fa-arrow-up trend-up" />
        );
    }

    return (
        <span className="fa fa-arrow-down trend-down" />
    );
}

class SymbolInfo extends React.Component {
    constructor(props) {
        super(props);

        this.renderSymbol = this.renderSymbol.bind(this);
        this.state = {
            symbolStats: props.symbolStats,
        };
    }

    shouldComponentUpdate(nextProps) {
        return Math.random() > 0.95;
    }

    renderSymbol(symbolName) {
        let stats = this.state.symbolStats[symbolName].exchanges;
        let exchanges = Object.keys(stats);

        return (
            <div className="row">
                <div className="col-12">
                    <div className="card mb-3" key={ symbolName }>
                        <div className="card-header" key={ "symbol-name" + symbolName}>
                            { symbolName }
                            <small>avg: { this.state.symbolStats[symbolName].averageChange.toFixed(6) } %</small>
                        </div>
                        <div className="card-body">
                            <table className="table" key={ "exchanges-" + symbolName}>
                                <tbody>
                                {
                                    exchanges.map((exchangeName) =>
                                        <tr key={symbolName + exchangeName}>
                                            <td>{ exchangeName}</td>
                                            <td>{ stats[exchangeName].tradeCount }</td>
                                            <td>
                                                { stats[exchangeName].change.toFixed(6) } %
                                            </td>
                                            <td>
                                                <TrendIcon change={ stats[exchangeName].change }/>
                                            </td>
                                        </tr>
                                    )
                                }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getSortedKeysByTradesCount(stats) {
        let keys = Object.keys(stats);
        return keys.sort((a,b) => {
            if (stats[a].averageChange && stats[b].averageChange) {
                return stats[a].averageChange - stats[b].averageChange
            }

            return 0;
        });
    }

    render() {
        let trades = AlaSQL("SELECT count(1) as overallTradesCount from trades");
        //30 seconds
        let averageChanges = AlaSQL("SELECT AVG(change) as averageChange, symbol FROM trades WHERE time > " + (Date.now() - (30 * 1000)) + " GROUP BY symbol");
        for (let i = 0; i < averageChanges.length; i++) {
            let item = averageChanges[i];
            if (this.state.symbolStats[item.symbol]) {
                this.state.symbolStats[item.symbol].averageChange = item.averageChange;
            }
        }

        let keys = this.getSortedKeysByTradesCount(this.state.symbolStats);
        trades = trades[0].overallTradesCount;

        return (
            <div key="symbol-wrapper">
                <div key="symbol-wrapper-tradescount">Trades: { trades }</div>
                <div key="symbol-wrapper-symbolinfo"> { keys.map(this.renderSymbol) }</div>
            </div>

        );
    }
}

export default SymbolInfo;
