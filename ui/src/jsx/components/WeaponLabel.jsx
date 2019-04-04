import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_weapon-label.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Reach from '../components/Reach.jsx';

export class WeaponLabel extends LazyComponent
{
    renderInfo(weapon) {
        const { showInfo, weapon_properties } = this.props;

        if (!showInfo) {
            return null;
        }

        return <div className="weapon-label--info">
            <code>
                <DiceNotation
                    {...weapon.damage}
                    />
            </code>
            {weapon.bonus
                ? <React.Fragment>
                    <strong>Hit:</strong>&nbsp;<Bonus
                        bonus={weapon.bonus}
                        />
                </React.Fragment>
                : null
            }
            {weapon.type.match('ranged')
                ? <React.Fragment>
                    <strong>Range:</strong>&nbsp;<Reach {...weapon.range}/>
                </React.Fragment>
                : null
            }
            {weapon.property.length
                ? <ul className="weapon-label--properties">
                    {_.map(weapon.property || [], (prop) => {
                        return <li key={prop}>
                            <ListLabel
                                items={weapon_properties || []}
                                value={prop}
                                tooltip={true}
                                />
                            {prop == 'thrown'
                                ? <i> (<Reach {...weapon.range}/>)</i>
                                : null
                            }
                            {prop == 'versatile'
                                ? <i> (<DiceNotation
                                    {...weapon.versatile}
                                    />)</i>
                                : null
                            }
                        </li>;
                    })}
                </ul>
                : null
            }
        </div>;
    }

    renderDescription(weapon) {
        const { showDescription } = this.props;

        if (!showDescription) {
            return null;
        }

        return <MDReactComponent
            text={weapon.description || ''}
            />;
    }

    render() {
        const {
            weapon, weapon_types, showDescription, showInfo
        } = this.props;
        if (!weapon) {
            return null;
        }

        return <div className="weapon-label inline">
            <strong>{weapon.name}</strong>
            &nbsp;
            <i>
                (<ListLabel
                    items={weapon_types || []}
                    value={weapon.type}
                    />)
            </i>
            {this.renderDescription(weapon)}
            {this.renderInfo(weapon)}
        </div>;
    }
}

WeaponLabel.defaultProps = {
    showDescription: false,
    showInfo: true
};

export default ListDataWrapper(
    ObjectDataWrapper(
        WeaponLabel,
        [{
            type: 'weapon',
            id: 'weapon_id',
            group: 'items',
        }]
    ),
    [
        "weapon_types",
        "weapon_properties",
    ],
    'items'
);