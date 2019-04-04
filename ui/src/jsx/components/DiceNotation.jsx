import React from 'react';
import PropTypes from 'prop-types';

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

DiceNotation.propTypes = {
    dice_count: PropTypes.number.isRequired,
    dice_size: PropTypes.number.isRequired,
    bonus: PropTypes.number,
    type: PropTypes.string,
};

export default DiceNotation;