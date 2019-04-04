import React from 'react';
import PropTypes from 'prop-types';
import {
    assign,
    get,
    isObject,
    keys,
    map,
    mapValues,
    maxBy,
} from 'lodash/fp';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper.jsx';

import CalculatorInputField from '../../components/CalculatorInputField.jsx';
import CharacterLabel from '../../components/CharacterLabel.jsx';
import CharacterSelectDialog from '../../components/CharacterSelectDialog.jsx';
import ToggleSwitch from '../../components/ToggleSwitch.jsx';
import ControlGroup from '../../components/ControlGroup.jsx';
import Coinage from '../../components/Coinage.jsx';
import CostEditor from '../../components/CostEditor.jsx';
import InputField from '../../components/InputField.jsx';
import ListComponent from '../../components/ListComponent.jsx';
import MarkdownTextField from '../../components/MarkdownTextField.jsx';
import ModalDialog from '../../components/ModalDialog.jsx';
import Panel from '../../components/Panel.jsx';
import UserLabel from '../../components/UserLabel.jsx';
import TabComponent from '../../components/TabComponent.jsx';

import './sass/_adventure-league-log-edit.scss';
import AdventureDelta from './components/AdventureDelta';
import AdventureGold from './components/AdventureGold';
import AdventureItems from './components/AdventureItems';
import AdventureSession from './components/AdventureSession';
import TreasureCheckpoints from './components/TreasureCheckpoints';

import { deltaType, deltaDefault } from './extraProps';

export class AdventureLeagueLogEdit extends React.Component
{
    tierLevels = {
        one: 1,
        two: 5,
        three: 11,
        four: 17,
    };

    constructor(props) {
        super(props);
        this.state = {
            forceAdventureCheckpoints: false,
        };

        this.memoize = memoize.bind(this);
    }

    onSwitch = (forceAdventureCheckpoints) => {
        this.setState({ forceAdventureCheckpoints });
    }

    componentDidMount() {
        const { character_id, user_id, setState } = this.props;
        setState({ character_id, user_id });
    }

    onFieldChange = (field) => {
        return this.memoize(field, update => {
            const { [field]: original, setState } = this.props;
            let value = {};
            value = assign(value, original);
            value = assign(value, update);

            setState({ [field]: value });
        });
    };

    characterFilter = (character) => {
        const { current_user } = this.props;
        return (
            current_user.id === character.user_id
            && (
                character.xp == 0
                || character.adventure_league
            )
        );
    }

    render() {
        const {
            character_id, character_snapshot, character,
            user_id, current_user, adventure, xp,
            gold, downtime, renown, equipment,
            items, notes, consumed, setState,
            adventure_checkpoints, treasure_checkpoints,
        } = this.props;
        const {
            forceAdventureCheckpoints,
        } = this.state;

        const disabled = consumed ? true : false;

        const currentTier = maxBy(
            tier => this.tierLevels[tier] <= character.level
                ? this.tierLevels[tier]
                : 0,
            keys(this.tierLevels),
        );

        const acp_mode = (
            adventure_checkpoints.earned
            || character.adventure_checkpoints
            || forceAdventureCheckpoints
        );

        return <React.Fragment>
            <AdventureSession
                {...adventure}
                setState={this.onFieldChange('adventure')}
            />

            <Panel
                key="adventurer"
                className="al-log-edit__adventurer"
                header="Adventurer"
            >
                <UserLabel
                    user_id={user_id || current_user.id}
                    showDCI={true}
                />
                {character_id && (
                    <CharacterLabel
                        character_id={character_id}
                        showProgress={true}
                        characterUpdate={character_snapshot}
                    />
                )}
                {!(
                    disabled
                    || adventure_checkpoints.earned
                    || character.adventure_checkpoints
                ) && (
                    <ToggleSwitch
                        className="accent"
                        checked={forceAdventureCheckpoints}
                        onChange={this.onSwitch}
                        label="Switch to Adventure Checkpoints"
                    />
                )}
                {forceAdventureCheckpoints && xp && <span className="al-log-edit__acp-switch-warning clearfix">
                    Switching a character from XP based progression
                    to Adventure Checkpoints cannot be undone (yet?).
                    The first time a character progresses using ACP's, the following changes are made:
                    <ul>
                        <li>The XP is converted to the equivalent
                        amount of Adventure Checkpoints appropriate
                        for the current level, as well as the current
                        progression in the level. This will always be
                        rounded up. Simply log 1 ACP less to round
                        down instead.</li>
                        <li>Renown is reset to 0 and will increase by 1 every 4 ACP's. The <em>Faction Agent</em> background feature is not yet implemented.</li>
                    </ul>
                </span>}
            </Panel>

            {!acp_mode && (
                <AdventureDelta
                    key="xp"
                    className="al-log-edit__xp"
                    label="Experience Points"
                    disabled={disabled}
                    {...xp}
                    starting={disabled
                        ? xp.starting
                        : character.xp
                    }
                    setState={!disabled
                        ? this.onFieldChange('xp')
                        : null
                    }
                />
            )}

            {!acp_mode && (
                <AdventureDelta
                    className="al-log-edit__renown"
                    label="Renown"
                    disabled={disabled}
                    {...renown}
                    starting={disabled
                        ? renown.starting
                        : character.renown
                    }
                    setState={!disabled
                        ? this.onFieldChange('renown')
                        : null
                    }
                />
            )}

            {acp_mode && (
                <AdventureDelta
                    key="acp"
                    className="al-log-edit__acp al-log-edit--acp-mode"
                    label="Adventure Checkpoints"
                    disabled={disabled}
                    {...adventure_checkpoints}
                    starting={disabled
                        ? adventure_checkpoints.starting
                        : character.adventure_checkpoints
                    }
                    setState={!disabled
                        ? this.onFieldChange('adventure_checkpoints')
                        : null
                    }
                />
            )}

            {acp_mode && (
                <TreasureCheckpoints
                    className="al-log-edit__treasure"
                    label="Treasure Points"
                    disabled={disabled}
                    currentTier={currentTier}
                    {...treasure_checkpoints}
                    starting={disabled
                        ? treasure_checkpoints.starting
                        : character.treasure_checkpoints
                    }
                    setState={!disabled
                        ? this.onFieldChange('treasure_checkpoints')
                        : null
                    }
                />
            )}

            <AdventureDelta
                className="al-log-edit__downtime"
                label="Downtime"
                disabled={disabled}
                {...downtime}
                starting={disabled
                    ? downtime.starting
                    : character.downtime
                }
                setState={!disabled
                    ? this.onFieldChange('downtime')
                    : null
                }
            />

            <AdventureGold
                className="al-log-edit__gold"
                label="Gold"
                disabled={disabled}
                {...gold}
                starting={disabled
                    ? gold.starting
                    : character.wealth
                }
                setState={!disabled
                    ? this.onFieldChange('gold')
                    : null
                }
            />

            <AdventureItems
                className="al-log-edit__equipment"
                label="Regular Items"
                disabled={disabled}
                {...equipment}
                setState={!disabled
                    ? this.onFieldChange('equipment')
                    : null
                }
            />

            <AdventureItems
                className="al-log-edit__items"
                label="Magical Items"
                disabled={disabled}
                {...items}
                starting={disabled
                    ? items.starting
                    : character.adventure_items
                }
                setState={!disabled
                    ? this.onFieldChange('items')
                    : null
                }
            />

            <Panel
                key="notes"
                className="al-log-edit__notes"
                header="Adventure Notes / Downtime Activity"
                >
                <MarkdownTextField
                    placeholder="Adventure Notes..."
                    value={notes}
                    rows={5}
                    setState={this.memoize(
                        'notes',
                        notes => setState({ notes })
                    )}
                />
            </Panel>

            {character_id === null && (
                <CharacterSelectDialog
                    filter={this.characterFilter}
                    onDone={this.memoize(
                        'character_id',
                        character_id => setState({ character_id })
                    )}
                />
            )}
        </React.Fragment>;
    }
};

AdventureLeagueLogEdit.propTypes = {
    setState: PropTypes.func.isRequired,
    character_id: PropTypes.number,
    character_snapshot: PropTypes.object,
    character: PropTypes.object,
    current_user: PropTypes.object,
    user_id: PropTypes.number,
    consumed: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.oneOf([0, 1]),
    ]),
    adventure: PropTypes.object,
    xp: deltaType,
    adventure_checkpoints: deltaType,
    treasure_checkpoints: PropTypes.shape({
        one: deltaType,
        two: deltaType,
        three: deltaType,
        four: deltaType,
    }),
    gold: PropTypes.shape({
        starting: PropTypes.objectOf( PropTypes.number ),
        earned: PropTypes.objectOf( PropTypes.number ),
        total: PropTypes.objectOf( PropTypes.number ),
    }),
    downtime: deltaType,
    renown: deltaType,
    equipment: PropTypes.shape({
        starting: PropTypes.number,
        earned: PropTypes.arrayOf( PropTypes.string ),
        total: PropTypes.number,
    }),
    items: PropTypes.shape({
        starting: PropTypes.number,
        earned: PropTypes.arrayOf( PropTypes.string ),
        total: PropTypes.number,
    }),
    notes: PropTypes.string,
};

AdventureLeagueLogEdit.defaultProps = {
    character_id: null,
    character_snapshot: {},
    character: {
        adventure_checkpoints: 0,
        treasure_checkpoints: {},
        wealth: {},
        level: 1,
        xp: 0,
    },
    current_user: {},
    user_id: null,
    consumed: false,
    adventure: {},
    xp: deltaDefault,
    adventure_checkpoints:  deltaDefault,
    treasure_checkpoints: {},
    gold: {},
    downtime: deltaDefault,
    renown: deltaDefault,
    equipment: {
        starting: 0,
        earned: [],
        total: 0,
    },
    items: {
        starting: 0,
        earned: [],
        total: 0,
    },
    notes: '',
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        ObjectDataWrapper(
            AdventureLeagueLogEdit,
            [
                {type: 'user', id: 'user_id'},
                {type: 'character', id: 'character_id'},
            ]
        ),
        {
            className: 'al-log-edit',
            icon: 'fa-pencil-square-o', // fa-d-and-d
            label: 'Adventure League Log',
            buttons: ['cancel', 'reload', 'save']
        },
        "adventureleague",
        "log"
    ),
    [
        'current_user',
    ]
);
