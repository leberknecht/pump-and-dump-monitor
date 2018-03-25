import React from "react";

class SymbolInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            symbolStats: props.symbolStats,
        };
    }

    render() {
        return (
            <div className="well">
                <h1>Symbol</h1>
                <table>
                <tbody>
                  {
                      this.state.symbolStats.map( (msg, index) =>
                          <tr key={ index }><td key={ "symbol-name" + index}>{ index }</td></tr>
                      )
                  }
                </tbody>
                </table>
            </div>
        );
    }
}

export default SymbolInfo;
