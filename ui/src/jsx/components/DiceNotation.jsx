import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

class DiceNotation extends LazyComponent
{
    render() {
        const notation = [].concat(
            this.props.dice_count
            ? [this.props.dice_count, 'd', this.props.dice_size]
            : []
        ).concat(
            this.props.dice_bonus || null
            ? ["+", this.props.dice_bonus]
            : []
        ).concat(
            this.props.type || null
            ? [" ", this.props.type]
            : []
        );
        return <div className="dice-notation inline capitalize">
            {notation.join('')}
        </div>;
    }
}

export default DiceNotation;