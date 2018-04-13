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

export default TrendIcon;