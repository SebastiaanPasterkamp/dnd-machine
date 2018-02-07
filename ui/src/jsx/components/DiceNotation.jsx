import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

class DiceNotation extends LazyComponent
{
    render() {
        const {
            dice_count, dice_size, bonus, type
        } = this.props;

        const notation = [].concat(
            dice_count
            ? [dice_count, 'd', dice_size]
            : []
        ).concat(
            bonus
            ? [(bonus > 0 ? '+' : ''), bonus]
            : []
        ).concat(
            type || null
            ? [" ", type]
            : []
        );
        return <div className="dice-notation inline capitalize">
            {notation.join('')}
        </div>;
    }
}

export default DiceNotation;