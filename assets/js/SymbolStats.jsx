import React from "react";
import TrendIcon from "./TrendIcon"
import SymbolLink from "./SymbolLink"

function SymbolStats(props) {
    let exchanges = props.exchanges;
    let symbolName = props.symbolName;
    let stats = props.stats;
    return (
        <table className="table" >
            <tbody>
            {
                exchanges.map((exchangeName) =>
                    <tr key={symbolName + exchangeName}>
                        <td>
                            <SymbolLink exchange={exchangeName} symbolName={symbolName} />
                        </td>
                        <td>{ stats[exchangeName].tradeCount }</td>
                        <td>
                            { stats[exchangeName].change.toFixed(6) } %
                        </td>
                        <td>
                            <TrendIcon change={ stats[exchangeName].change }/>
                        </td>
                        <td>
                            <h4>recent stats:</h4>
                            <table>
                                <thead>
                                    <tr>
                                        <th>stat</th>
                                        <th>1h</th>
                                        <th>30 min</th>
                                        <th>5 min</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Change</td>
                                        <td>{ Number(stats[exchangeName].stats[60].change).toFixed(3) } %</td>
                                        <td>{ Number(stats[exchangeName].stats[30].change).toFixed(3) } %</td>
                                        <td>{ Number(stats[exchangeName].stats[5].change).toFixed(3) } %</td>
                                    </tr>
                                    <tr>
                                        <td>Volume</td>
                                        <td>{ Number(stats[exchangeName].stats[60].volume).toFixed(2) }</td>
                                        <td>{ Number(stats[exchangeName].stats[30].volume).toFixed(2) }</td>
                                        <td>{ Number(stats[exchangeName].stats[5].volume).toFixed(2) }</td>
                                    </tr>
                                    <tr>
                                        <td>Price</td>
                                        <td>{ Number(stats[exchangeName].stats[60].price).toFixed(6) }</td>
                                        <td>{ Number(stats[exchangeName].stats[30].price).toFixed(6) }</td>
                                        <td>{ Number(stats[exchangeName].stats[5].price).toFixed(6) }</td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                )
            }
            </tbody>
        </table>
    );
}

export default SymbolStats;
