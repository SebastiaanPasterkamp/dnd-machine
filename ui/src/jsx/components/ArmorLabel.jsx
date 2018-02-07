import React from 'react';
import _ from 'lodash';
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
        const { showInfo, armor_properties } = this.props;

        if (!showInfo) {
            return null;
        }

        return <div className="armor-label">
            <strong>AC:</strong>
            {armor.value}
            {'value' in armor ? null : armor.formula}
            {armor.bonus
                ? <Bonus
                    bonus={armor.bonus}
                    />
                : null
            }
            {armor.requirements.strength
                ? <React.Fragment>
                    <strong>Strength:</strong>&nbsp;{armor.requirements.strength}
                </React.Fragment>
                : null
            }
            {armor.disadvantage
                ? <React.Fragment>
                    <strong>Stealth:</strong>&nbsp;Disadvantage
                </React.Fragment>
                : null
            }
        </div>;
    }

    renderDescription(armor) {
        const { showDescription } = this.props;

        if (!showDescription) {
            return null;
        }

        return <MDReactComponent
            text={armor.description || ''}
            />;
    }

    render() {
        const {
            armor, armor_types, showDescription, showInfo
        } = this.props;
        if (!armor) {
            return null;
        }

        return <div className="armor-label inline">
            <strong>{armor.name}</strong>
            &nbsp;
            <i>
                (<ListLabel
                    items={armor_types || []}
                    value={armor.type}
                    />)
            </i>
            {this.renderDescription(armor)}
            {this.renderInfo(armor)}
        </div>;
    }
}

ArmorLabel.defaultProps = {
    showDescription: false,
    showInfo: true
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