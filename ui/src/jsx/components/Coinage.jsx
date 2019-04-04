import React from 'react';

import utils from '../utils.jsx';

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
        const { className, extended } = this.props;
        const coins = this.order
            .filter((coin) => (
                coin in this.props
                && this.props[coin])
            )
            .map((coin) => this.renderCoin(coin, this.props[coin]));
        const separator = extended ? ', ' : ' ';
        const style = utils.makeStyle({
            [className]: className,
        }, [
            'coinage',
            'capitalize',
        ]);

        if (style.match('nice-form-control')) {
            return <input
                className={style}
                disabled={true}
                value={coins.join(separator)}
                />;
        }

        return <div className={style}>
            {coins.join(separator)}
        </div>
    }
}

export default Coinage;