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

import ListDataWrapper from '../../hocs/ListDataWrapper';
import ObjectDataWrapper from '../../hocs/ObjectDataWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import CalculatorInputField from '../../components/CalculatorInputField';
import CharacterLabel from '../../components/CharacterLabel';
import CharacterPicker from '../../components/CharacterPicker';
import ToggleSwitch from '../../components/ToggleSwitch';
import ControlGroup from '../../components/ControlGroup';
import Coinage from '../../components/Coinage';
import CostEditor from '../../components/CostEditor';
import InputField from '../../components/InputField';
import ListComponent from '../../components/ListComponent';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import UserLabel from '../../components/UserLabel';
import TabComponent from '../../components/TabComponent';

import './sass/_adventure-league-log-edit.scss';
import AdventureDelta from './components/AdventureDelta';
import AdventureGold from './components/AdventureGold';
import AdventureItems from './components/AdventureItems';
import AdventureSession from './components/AdventureSession';
import TreasureCheckpoints from './components/TreasureCheckpoints';

import { deltaType, deltaDefault } from './extraProps';

export class AdventureLeagueLogEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            forceAdventureCheckpoints: false,
        };
        this.tierLevels = {
            one: 1,
            two: 5,
            three: 11,
            four: 17,
        };

        this.memoize = memoize.bind(this);
        this.onSwitchSlow = this.onSwitchSlow.bind(this);
        this.onSwitchACP = this.onSwitchACP.bind(this);
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onCharacterFilter = this.onCharacterFilter.bind(this);
        this.onCharacterSelect = this.onCharacterSelect.bind(this);
    }

    onSwitchSlow(slow_progress) {
        this.props.setState({ slow_progress });
    }

    onSwitchACP(forceAdventureCheckpoints) {
        this.setState({ forceAdventureCheckpoints });
        if (this.state.slow_progress) {
            this.props.setState({ slow_progress: false });
        }
    }

    componentDidMount() {
        const { character_id, user_id, setState } = this.props;
        setState({ character_id, user_id });
    }

    onFieldChange(field) {
        return this.memoize(field, update => {
            const { [field]: original, setState } = this.props;
            let value = {};
            value = assign(value, original);
            value = assign(value, update);

            setState({ [field]: value });
        });
    };

    onCharacterFilter(character) {
        const { current_user } = this.props;
        return (
            current_user
            && current_user.id === character.user_id
            && (
                character.xp == 0
                || character.adventure_league
            )
        );
    }

    onCharacterSelect({ id }) {
        const { setState } = this.props;
        setState({ character_id: id });
    }

    render() {
        const {
            character_id, character_snapshot, character,
            user_id, current_user, adventure, xp,
            gold, downtime, renown, equipment,
            items, notes, consumed, setState,
            adventure_checkpoints, treasure_checkpoints,
            slow_progress
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
                    user_id={user_id || (current_user || {}).id}
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
                        className="brand"
                        switchId="acp-switch"
                        checked={forceAdventureCheckpoints}
                        onChange={this.onSwitchACP}
                        label="Switch to Adventure Checkpoints"
                    />
                )}
                {forceAdventureCheckpoints && xp && (
                    <span className="al-log-edit__acp-switch-warning">
                        Switching a character from XP based progression to
                        Adventure Checkpoints cannot be undone (yet?). The first
                        time a character progresses using ACP's, the following
                        changes are made:
                        <ul>
                            <li>The XP is converted to the equivalent amount of
                            Adventure Checkpoints appropriate for the current
                            level, as well as the current progression in the
                            level. This will always be rounded up. Simply log 1
                            ACP less to round down instead.</li>
                            <li>Renown is reset to 0 and will increase by 1
                            every 4 ACP's. The <em>Faction Agent</em> background
                            feature is not yet implemented.</li>
                            <li>Downtime is accumulated automatically at a rate
                            of 2 every 5 ACP's, but can still be spent.</li>
                        </ul>
                    </span>
                )}
                {acp_mode && (
                    <ToggleSwitch
                        className="warning"
                        switchId="acp-slow-progress"
                        checked={slow_progress}
                        onChange={this.onSwitchSlow}
                        disabled={disabled}
                        label="Enable Slow Progress"
                    />
                )}
                {slow_progress && (
                    <span className="al-log-edit__acp-slow-warning">
                        Enabling <em> slow progress </em> will be applied when
                        consuming the log sheet. It will:
                        <ul>
                            <li>
                                Half the number of Adventure Checkpoints gained.
                            </li>
                            <li>
                                Half the number of Treasure Points gained.
                            </li>
                            <li>
                                Half the amount of renown and downtime gained
                                based on the full number of Adventure Checkpoints.
                            </li>
                        </ul>
                    </span>
                )}
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
                maxValue={acp_mode ? 0 : undefined}
                minValue={(character.downtime || 0) * -1}
                setState={!disabled
                    ? this.onFieldChange('downtime')
                    : null
                }
            >
                {acp_mode && (
                    <span className="al-log-edit__acp-downtime-renown clearfix">
                        Downtime and Renown are computed automatically
                        based on Adventure Checkpoints. Downtime
                        <em> can </em> be <em> consumed </em>.
                    </span>
                )}
            </AdventureDelta>

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
                <CharacterPicker
                    filter={this.onCharacterFilter}
                    onDone={this.onCharacterSelect}
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
    slow_progress: PropTypes.bool,
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
    slow_progress: false,
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
