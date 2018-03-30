import React from "react";
import { Glyphicon } from "react-bootstrap";

function TrendIcon(props) {
    // let change = props.change;
    // if (change > 0) {
    //     return (
    //         <Glyphicon glyph="arrow-up" />
    //     );
    // }

    return (
        <h1>dud</h1>
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
            <tr key={ symbolName }>
                <td key={ "symbol-name" + symbolName}>{ symbolName }</td>
                <td key={ "exchanges-" + symbolName}>
                    <table className="table">
                        <tr>
                            <th>exchange</th>
                            <th>trades</th>
                            <th>change</th>
                        </tr>
                        <tbody>
                        {
                            exchanges.map((exchangeName) =>
                                <tr key={symbolName + exchangeName}>
                                    <td>{ exchangeName}</td>
                                    <td>{ stats[exchangeName].tradeCount }</td>
                                    <td>
                                        { stats[exchangeName].change.toFixed(4) } %
                                        <Glyphicon glyph={"start"}>dsd</Glyphicon>
                                    </td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </td>
            </tr>
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
            <div className="well">
                <table>
                <tbody>
                  {
                      keys.map(this.renderSymbol)
                  }
                </tbody>
                </table>
            </div>
        );
    }
}

export default SymbolInfo;
