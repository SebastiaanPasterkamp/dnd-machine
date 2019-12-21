import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_spell-label.scss';

import utils from '../utils';

import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper';

import Bonus from '../components/Bonus';
import DiceNotation from '../components/DiceNotation';
import LazyComponent from '../components/LazyComponent';
import ListLabel from '../components/ListLabel';
import Reach from '../components/Reach';
import ToolTip from '../components/ToolTip';

export class SpellLabel extends LazyComponent
{
    renderInfo(spell) {
        const {
            showInfo, magic_components, magic_schools, tooltip
        } = this.props;

        if (!showInfo) {
            return null;
        }

        return <div className="spell-label--info">
            <strong>Level:</strong> {spell.level}

            <strong>Casting Time:</strong> {spell.casting_time}

            <strong>School:</strong>&nbsp;
            <ListLabel
                items={magic_schools || []}
                value={spell.school}
                tooltip={tooltip}
                />

            <strong>Range:</strong>&nbsp;
            <Reach
                distance={spell.range}/>

            {spell.components
                ? <React.Fragment>
                    <strong>Components:</strong>
                    <ul className="spell-label--properties inline">
                        {_.map(spell.components, (component) => {
                            return <li key={component}>
                                <ListLabel
                                    items={magic_components || []}
                                    value={component}
                                    tooltip={tooltip}
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
        </div>;
    }

    renderDescription(spell) {
        const { showDescription } = this.props;

        if (!showDescription) {
            return null;
        }

        return <MDReactComponent
            className="spell-label--description"
            text={spell.description || ''}
            />;
    }

    render() {
        const {
            spell, tooltip
        } = this.props;

        if (!spell) {
            return null;
        }

        return <div className="spell-label inline">
            {tooltip
                ? <ToolTip content={spell.description}>
                    <strong>{spell.name}</strong>
                </ToolTip>
                : <strong>{spell.name}</strong>
            }
            {this.renderInfo(spell)}
            {this.renderDescription(spell)}
        </div>;
    }
}

SpellLabel.defaultProps = {
    showDescription: false,
    showInfo: true
};

SpellLabel.propTypes = {
    showInfo: PropTypes.bool,
    showDescription: PropTypes.bool,
    tooltip: PropTypes.bool,
    spell: PropTypes.object,
    magic_components: PropTypes.arrayOf(PropTypes.object),
    magic_schools: PropTypes.arrayOf(PropTypes.object),

}

export default ListDataWrapper(
    ObjectDataWrapper(
        SpellLabel,
        [{
            type: 'spell',
            id: 'spell_id',
            group: 'items',
        }]
    ),
    [
        "magic_components",
        "magic_schools",
    ],
    'items'
);
