import React from "react";

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
                                                { stats[exchangeName].change.toFixed(4) } %
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
            let atrades = 0;
            let btrades = 0;
            Object.keys(stats[a]).map((e) => {atrades += stats[a][e].tradeCount});
            Object.keys(stats[b]).map((e) => {btrades += stats[b][e].tradeCount});

            return btrades - atrades
        });
    }

    render() {
        let keys = this.getSortedKeysByTradesCount(this.state.symbolStats);

        return (
            keys.map(this.renderSymbol)
        );
    }
}

export default SymbolInfo;
