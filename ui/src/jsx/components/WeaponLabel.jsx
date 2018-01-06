import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import Coinage from '../components/Coinage.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Reach from '../components/Reach.jsx';

class WeaponLabel extends LazyComponent
{
    constructor(props) {
        super(props);

        this.types = [
            {code: "simple melee weapon", label: "Simple Melee Weapon"},
            {code: "simple ranged weapon", label: "Simple Ranged Weapon"},
            {code: "martial melee weapon", label: "Martial Melee Weapon"},
            {code: "martial ranged weapon", label: "Martial Ranged Weapon"},
        ];
        this.properties = [
            {'code': 'ammunition', 'label': 'Ammunition'},
            {'code': 'finesse', 'label': 'Finesse'},
            {'code': 'heavy', 'label': 'Heavy'},
            {'code': 'light', 'label': 'Light'},
            {'code': 'loading', 'label': 'Loading'},
            {'code': 'reach', 'label': 'Reach'},
            {'code': 'special', 'label': 'Special'},
            {'code': 'thrown', 'label': 'Thrown'},
            {'code': 'two-handed', 'label': 'Two-Handed'},
            {'code': 'versatile', 'label': 'Versatile'},
        ];
    }

    renderInfo(weapon) {
        return <div>
            <DiceNotation
                {...weapon.damage}
                />
            {weapon.bonus
                ? <span>
                    , Hit: <Bonus
                        bonus={weapon.bonus}
                        />
                    </span>
                : null
            }
            {weapon.versatile
                ? <span>
                    , Versatile: <DiceNotation
                        {...weapon.versatile}
                        />
                    </span>
                : null
            }
            {weapon.range
                ? <span>
                    , <Reach {...weapon.range}/>
                    </span>
                : null
            }
            &nbsp;
            ({_.map(weapon.property || [], (prop, i) => {
                return [
                    (i > 0 ? ', ' : null),
                    <ListLabel
                        key={prop}
                        items={this.properties}
                        value={prop}
                        />
                ];
            })})
        </div>;
    }

    render() {
        if (!this.props.weapons) {
            return null;
        }
        const weapon = this.props.weapons;

        return <div className="weapon-label inline">
            {weapon.name}
            &nbsp;
            (<ListLabel
                items={this.types}
                value={weapon.type}
                />)
            {this.props.showDescription
                ? <MDReactComponent
                    text={weapon.description || ''}
                    />
                : null
            }
            {this.props.showInfo
                ? this.renderInfo(weapon)
                : null
            }
        </div>;
    }
}

WeaponLabel.defaultProps = {
    showDescription: false,
    showInfo: true
};

export default ObjectDataWrapper(
    WeaponLabel,
    [{type: 'weapons', id: 'weapon_id', group: 'items'}]
);