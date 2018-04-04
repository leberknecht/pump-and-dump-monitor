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
        let stats = this.state.symbolStats[symbolName];
        let exchanges = Object.keys(stats);

        return (
            <div className="row">
                <div className="col-12">
                    <div className="card mb-3" key={ symbolName }>
                        <div className="card-header" key={ "symbol-name" + symbolName}>
                            { symbolName }
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
            let achange = 0;
            let bchange = 0;
            Object.keys(stats[a]).map((e) => {achange += stats[a][e].change});
            Object.keys(stats[b]).map((e) => {bchange += stats[b][e].change});
            achange = achange / stats[a].length;
            achange = bchange / stats[b].length;
            return achange - achange
        });
    }

    render() {
        let keys = this.getSortedKeysByTradesCount(this.state.symbolStats);
        let trades = AlaSQL("SELECT count(1) as overallTradesCount from trades");
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
