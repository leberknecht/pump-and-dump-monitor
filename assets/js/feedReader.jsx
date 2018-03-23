import React from "react";
import ReactDOM from "react-dom";

class FeedReader extends React.Component {
    constructor(props) {
        super(props);

        const webSocketHost = document.getElementById('root').getAttribute('data-websocket-host');
        console.log('websocket host: ' + webSocketHost);
        this.state = {
            trades: [],
            webSocketHost: webSocketHost
        };
    }

    componentDidMount(){
        this.connection = new WebSocket(this.state.webSocketHost);
        this.connection.onmessage = evt => {
            this.setState({
                trades : this.state.trades.concat([ JSON.parse(evt.data) ])
            })
        };
    }

    render() {
        return (
            <table className="table">
                {
                    this.state.trades.map( (msg, index) =>
                        <tr>
                        <td key={'msg-' + index }>{ msg.exchange }</td>
                        <td key={'msg-' + index }>{ msg.price }</td>
                        </tr>
                    )
                }
            </table>
        )
    }
}

ReactDOM.render(
    <FeedReader/>,
    document.getElementById('root')
);