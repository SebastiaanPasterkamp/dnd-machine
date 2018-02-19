import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

class DiceNotation extends LazyComponent
{
    render() {
        const {
            dice_count, dice_size, bonus, type
        } = this.props;

        return <div className="dice-notation inline capitalize">
            <code>
                {dice_count}d{dice_size}
                {bonus > 0 ? '+' + bonus : ''}
            </code>
            {type}
        </div>;
    }
}

export default DiceNotation;