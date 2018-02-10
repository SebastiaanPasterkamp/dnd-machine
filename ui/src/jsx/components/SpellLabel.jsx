import React from 'react';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_spell-label.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import Bonus from '../components/Bonus.jsx';
import DiceNotation from '../components/DiceNotation.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import Reach from '../components/Reach.jsx';
import ToolTip from '../components/ToolTip.jsx';

export class SpellLabel extends LazyComponent
{
    renderInfo(spell) {
        const {
            showInfo, magic_components, magic_schools
        } = this.props;

        if (!showInfo) {
            return null;
        }

        return <div className="spell-label--info">
            <strong>Level:</strong> {spell.level}

            <strong>Casting Time:</strong> {spell.casting_time}

            {spell.components
                ? <React.Fragment>
                    <strong>Components:</strong>
                    <ul className="spell-label--properties inline">
                        {_.map(spell.components, (component) => {
                            return <li key={component}>
                                <ListLabel
                                    items={magic_components || []}
                                    value={component}
                                    tooltip={true}
                                    />
                            </li>;
                        })}
                    </ul>
                </React.Fragment>
                : null
            }

            {spell.cost
                ? <React.Fragment>
                    <strong>Cost:</strong> {spell.cost}
                </React.Fragment>
                : null
            }

            <strong>Duration:</strong> {spell.duration}

            <strong>Range:</strong>&nbsp;
            <Reach
                distance={spell.range}/>

            <strong>School:</strong>&nbsp;
            <ListLabel
                items={magic_schools || []}
                value={spell.school}
                tooltip={true}
                />
        </div>;
    }

    renderDescription(spell) {
        const { showDescription } = this.props;

        if (!showDescription) {
            return null;
        }

        return <MDReactComponent
            text={spell.description || ''}
            />;
    }

    render() {
        const {
            spell, magic_components, magic_schools, tooltip
        } = this.props;
        if (!spell) {
            return null;
        }

        return <div className="spell-label inline">
            <ToolTip content={tooltip ? spell.description : null}>
                <strong>{spell.name}</strong>
            </ToolTip>
            {this.renderDescription(spell)}
            {this.renderInfo(spell)}
        </div>;
    }
}

SpellLabel.defaultProps = {
    showDescription: false,
    showInfo: true
};

export default ListDataWrapper(
    ObjectDataWrapper(
        SpellLabel,
        [{
            type: 'spells',
            id: 'spell_id',
            group: 'items',
            prop: 'spell',
        }]
    ),
    [
        "magic_components",
        "magic_schools",
    ],
    'items'
);