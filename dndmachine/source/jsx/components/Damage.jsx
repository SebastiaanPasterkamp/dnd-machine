import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';

class Damage extends LazyComponent
{
    render() {
        const notation = [
            this.props.dice_count,
            'd',
            this.props.dice_size,
            'dice_bonus' in this.props && this.props.dice_bonus
                ? "+" + this.props.dice_bonus
                : null,
            'type' in this.props && this.props.type
                ? " " + this.props.type
                : null
            ].filter((item) => !_.isNull(item));
        return <div
                className="damage inline capitalize">
            {notation.join('')}
        </div>;
    }
}

export default Damage;