import React from "react";
import Axios from 'axios';

import SymbolStats from "./SymbolStats"

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
                Object.keys(res.data).map(timeSpan => {
                    res.data[timeSpan].map(entry =>{
                        if (entry.symbol in currentStats && entry.exchange in currentStats[entry.symbol]) {
                            currentStats[entry.symbol][entry.exchange].stats[timeSpan].price = Number(entry['price']);
                            currentStats[entry.symbol][entry.exchange].stats[timeSpan].volume = Number(entry['volume']);
                            currentStats[entry.symbol][entry.exchange].stats[timeSpan].change = Number(entry['percentChange']);
                        }
                    });
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
            <div className="row symbol-info" key={"row-" + symbolName }>
                <div className="col-12">
                    <div className="card mb-3" key={ symbolName }>
                        <div className="card-header">
                            <strong>{ symbolName }</strong>
                        </div>
                        <div className="card-body">
                            <SymbolStats stats={ stats } exchanges={ exchanges } symbolName={ symbolName } />
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
            Object.keys(stats[a]).map((exchange) => {aVal += stats[a][exchange].stats[10].change});
            Object.keys(stats[b]).map((exchange) => {bVal += stats[b][exchange].stats[10].change});

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
