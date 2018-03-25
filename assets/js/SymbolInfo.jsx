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

    getSortedKeysByTradesCount(stats) {
        let keys = Object.keys(stats);
        return keys.sort((a,b) => {
            console.log('sorting a ' + a + ' b ' + b);

            let atrades = 0;
            let btrades = 0;
            Object.keys(stats[a]).map((e) => {atrades += stats[a][e].trades.length});
            Object.keys(stats[b]).map((e) => {btrades += stats[b][e].trades.length});

            return btrades - atrades
        });
    }

    render() {
        let keys = this.getSortedKeysByTradesCount(this.state.symbolStats);
        
        return (
            <div className="well">
                <h1>Symbol</h1>
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
