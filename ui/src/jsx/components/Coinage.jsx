import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

class Coinage extends LazyComponent
{
    constructor(props) {
        super(props);
        this.coins = {
            'cp': 'Copper',
            'sp': 'Silver',
            'ep': 'Electrum',
            'gp': 'Gold',
            'pp': 'Platinum'
        };
        this.order = ['pp', 'gp', 'ep', 'sp', 'cp'];
    }

    renderCoin(coin, value) {
        let description = this.props.extended
            ? " " + this.coins[coin]
            : coin;
        return value + description;
    }

    render() {
        const coins = this.order
            .filter((coin) => {return coin in this.props;})
            .map((coin) => this.renderCoin(coin, this.props[coin]));
        const separator = this.props.extended ? ', ' : ' ';

        return <div
                className="damage capitalize">
            {coins.join(separator)}
        </div>
    }
}

export default Coinage;