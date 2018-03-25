import React from "react";

class SymbolInfo extends React.Component {
    constructor(props) {
        super(props);

        this.renderSymbol = this.renderSymbol.bind(this);
        this.state = {
            symbolStats: props.symbolStats,
        };
    }

    renderSymbol(symbolName) {
        let stats = this.state.symbolStats[symbolName];
        let exchanges = Object.keys(stats);

        return (
            <tr key={ symbolName }>
                <td key={ "symbol-name" + symbolName}>{ symbolName }</td>
                <td key={ "exchanges-" + symbolName}>
                    {
                        exchanges.map((exchangeName) =>
                            <li key={symbolName + exchangeName}>{ exchangeName} { stats[exchangeName].trades.length }</li>
                        )
                    }
                </td>
            </tr>
        );
    }

    render() {
        return (
            <div className="well">
                <h1>Symbol</h1>
                <table>
                <tbody>
                  {
                      Object.keys(this.state.symbolStats).map(this.renderSymbol)
                  }
                </tbody>
                </table>
            </div>
        );
    }
}

export default SymbolInfo;
