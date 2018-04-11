import React from "react";
import Axios from 'axios';

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

        this.refreshSymbolStatusData = this.refreshSymbolStatusData.bind(this);
        this.renderSymbol = this.renderSymbol.bind(this);
        this.state = {
            symbolStats: props.symbolStats,
            symbolStatusUrl: props.symbolStatusUrl
        };
    }

    refreshSymbolStatusData() {
        let component = this;

        Axios.get(this.state.symbolStatusUrl)
            .then(res => {
                let currentStats = this.state.symbolStats;
                res.data.map(entry =>{
                    if (entry.symbol in currentStats && entry.exchange in currentStats[entry.symbol]) {
                        currentStats[entry.symbol][entry.exchange].accumulatedPrice = Number(entry['price']);
                        currentStats[entry.symbol][entry.exchange].accumulatedPercentChange = Number(entry['percentChange']);
                        currentStats[entry.symbol][entry.exchange].accumulatedVolume = Number(entry['volume']);
                    }
                });
                component.setState({ symbolStats: currentStats });
            });
    }

    componentDidMount() {
        this.refreshSymbolStatusData();
        this.interval = setInterval(this.refreshSymbolStatusData, 5000)
    }

    shouldComponentUpdate() {
        return Math.random() > 0.95;
    }

    renderSymbol(symbolName) {
        let stats = this.state.symbolStats[symbolName];
        let exchanges = Object.keys(stats);

        return (
            <div className="row" key={"row-" + symbolName }>
                <div className="col-12">
                    <div className="card mb-3" key={ symbolName }>
                        <div className="card-header">
                            <strong>{ symbolName }</strong>
                        </div>
                        <div className="card-body">
                            <table className="table" >
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
                                            <td>
                                                <h4>Last hour stats:</h4>
                                                Volume: { Number(stats[exchangeName].accumulatedVolume).toFixed(4) }<br/>
                                                Change: { Number(stats[exchangeName].accumulatedPercentChange).toFixed(4) } %<br/>
                                                Average Price: { Number(stats[exchangeName].accumulatedPrice).toFixed(5) }<br/>
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

    getSortedKeysAccumulatedChange(stats) {
        let keys = Object.keys(stats);
        return keys.sort((a,b) => {
            let aVal = 0;
            let bVal = 0;
            Object.keys(stats[a]).map((exchange) => {aVal += stats[a][exchange].accumulatedPercentChange});
            Object.keys(stats[b]).map((exchange) => {bVal += stats[b][exchange].accumulatedPercentChange});

            aVal = aVal / Object.keys(stats[a]).length;
            bVal = bVal / Object.keys(stats[b]).length;
            return bVal - aVal;
        });
    }

    render() {
        let keys = this.getSortedKeysAccumulatedChange(this.state.symbolStats);

        return (
            keys.map(this.renderSymbol)
        );
    }
}

export default SymbolInfo;
