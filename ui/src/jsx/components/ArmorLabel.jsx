import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_armor-label.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';

export class ArmorLabel extends LazyComponent
{
    renderInfo(armor) {
        const { showInfo = true } = this.props;

        if (!showInfo) {
            return null;
        }

        return <div className="armor-label__info">
            <span>
                <strong>AC:</strong>
                {armor.value}

                {'value' in armor ? null : armor.formula}

                {armor.bonus
                    ? <Bonus
                        bonus={armor.bonus}
                        />
                    : null
                }
            </span>

            {armor.requirements.strength
                ? <span>
                    <strong>Strength:</strong>
                    {armor.requirements.strength}
                </span>
                : null
            }

            {armor.disadvantage
                ? <span>
                    <strong>Stealth:</strong>
                    Disadvantage
                </span>
                : null
            }
        </div>;
    }

    renderDescription(armor) {
        const { showDescription = '' } = this.props;

        if (!showDescription) {
            return null;
        }

        return <MDReactComponent
            text={armor.description}
            />;
    }

    render() {
        const {
            armor, armor_types = [], showDescription, showInfo = true,
        } = this.props;

        if (!armor) {
            return null;
        }

        return <div className="armor-label inline">
            <strong>{armor.name}</strong>
            <i>
                (<ListLabel
                    items={armor_types}
                    value={armor.type}
                    />)
            </i>
            {this.renderDescription(armor)}
            {this.renderInfo(armor)}
        </div>;
    }
}

ArmorLabel.propTypes = {
    armor_id: PropTypes.number.isRequired,
    armor_types: PropTypes.array,

    showInfo: PropTypes.bool,
    showDescription: PropTypes.bool,

    armor: PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        description: PropTypes.string,
        value: PropTypes.number,
        formula: PropTypes.string,
        bonus: PropTypes.number,
        requirements: PropTypes.object,
        disadvantage: PropTypes.bool,
    }),
};

export default ListDataWrapper(
    ObjectDataWrapper(
        ArmorLabel,
        [{type: 'armor', id: 'armor_id', group: 'items'}]
    ),
    [
        "armor_types",
    ],
    'items'
);