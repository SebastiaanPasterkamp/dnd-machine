import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_adventure-league-log-edit.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import ButtonField from '../components/ButtonField.jsx';
import CalculatorInputField from '../components/CalculatorInputField.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import CharacterPicker from './CharacterPicker.jsx';
import ToggleSwitch from '../components/ToggleSwitch.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import Coinage from '../components/Coinage.jsx';
import CostEditor from '../components/CostEditor.jsx';
import InputField from '../components/InputField.jsx';
import ListComponent from '../components/ListComponent.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import ModalDialog from '../components/ModalDialog.jsx';
import Panel from '../components/Panel.jsx';
import UserLabel from '../components/UserLabel.jsx';
import TabComponent from '../components/TabComponent.jsx';

export class AdventureSession extends React.Component
{
    onFieldChange(field, value) {
        this.props.setState({[field]: value});
    }

    render() {
        const {
            name, id, date, dm_name, dm_dci
        } = this.props;

        return <Panel
            className="al-log-edit__session"
            header="Adventure"
            >
            <ControlGroup label="Name">
                <InputField
                    placeholder="Name..."
                    value={name}
                    setState={(value) => this.onFieldChange(
                        'name', value
                    )}
                    />
            </ControlGroup>

            <ControlGroup label="Session #">
                <InputField
                    placeholder="Session #..."
                    value={id}
                    setState={(value) => this.onFieldChange(
                        'id', value
                    )}
                    />
            </ControlGroup>

            <ControlGroup label="Date">
                <InputField
                    placeholder="Date..."
                    type="date"
                    value={date}
                    setState={(value) => this.onFieldChange(
                        'date', value
                    )}
                    />
            </ControlGroup>

            <ControlGroup label="DM Name">
                <InputField
                    placeholder="DM Name..."
                    value={dm_name}
                    setState={(value) => this.onFieldChange(
                        'dm_name', value
                    )}
                    />
            </ControlGroup>

            <ControlGroup label="DM DCI">
                <InputField
                    placeholder="DM DCI..."
                    value={dm_dci}
                    setState={(value) => this.onFieldChange(
                        'dm_dci', value
                    )}
                    />
            </ControlGroup>
        </Panel>;
    }
};

export class AdventureDelta extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
    }

    computeTotal(earned) {
        const { starting = 0 } = this.props;
        return starting + earned;
    }

    onChange(earned) {
        const { disabled = false, setState } = this.props;
        if (disabled) {
            return;
        }
        const total = this.computeTotal(earned);
        setState({ earned, total });
    }

    render() {
        const {
            starting = 0, earned = 0, className, label,
            disabled = false,
        } = this.props;
        const total = this.computeTotal(earned);
        const { formula = earned } = this.state;

        return (
            <Panel
                header={label}
                className={className}
            >
                <ControlGroup label="Starting">
                    <InputField
                        placeholder="Starting..."
                        disabled={true}
                        type="number"
                        value={starting}
                    />
                </ControlGroup>
                <ControlGroup label="Earned">
                    <CalculatorInputField
                        placeholder="Earned..."
                        value={earned}
                        disabled={disabled}
                        setState={(value, formula) => this.setState(
                            {formula},
                            () => this.onChange(value)
                        )}
                    />
                </ControlGroup>
                <ControlGroup label="Total">
                    <InputField
                        placeholder="Total..."
                        disabled={true}
                        type="number"
                        value={earned ? total : starting}
                        />
                </ControlGroup>
            </Panel>
        );
    }
};

export class AdventureGold extends React.Component
{
    computeTotal(earned) {
        const { starting = {} } = this.props;
        return _.assign(
            {},
            starting,
            _.mapValues(
                earned,
                (value, coin) => (value + (starting[coin] || 0))
            )
        );
    }

    onChange(earned) {
        const { disabled = false, setState } = this.props;
        if (disabled) {
            return;
        }
        const total = this.computeTotal(earned);
        setState({ earned, total });
    }

    render() {
        const {
            starting = {}, earned = {}, className, label,
            disabled = false,
        } = this.props;
        const total = this.computeTotal(earned);

        return <Panel
            className={className}
            header={label}
            >
            <ControlGroup label="Starting">
                <Coinage
                    {...starting}
                    className="nice-form-control"
                    extended="1"
                    />
            </ControlGroup>

            <ControlGroup label="Earned">
                <CostEditor
                    value={earned}
                    disabled={disabled}
                    setState={(value) => {
                        this.onChange(value);
                    }} />
            </ControlGroup>

            <ControlGroup label="Total">
                <Coinage
                    {...total}
                    className="nice-form-control"
                    extended="1"
                    />
            </ControlGroup>
        </Panel>;
    }
};

export class AdventureItems extends React.Component
{
    computeTotal(earned) {
        const { starting = 0 } = this.props;
        return starting + _.filter(earned).length;
    }

    onChange(items) {
        const { disabled = false, setState } = this.props;
        if (disabled) {
            return;
        }
        const earned = _.map(
            items,
            item => (_.isObject(item) ? item.value : item)
        );
        const total = this.computeTotal(earned);
        setState({ earned, total });
    }

    render() {
        const {
            starting = 0, earned = [], className, label,
            disabled = false,
        } = this.props;
        const total = this.computeTotal(earned);

        return <Panel
            className={className}
            header={label}
            >
            <ControlGroup label="Starting">
                <InputField
                    placeholder="Starting..."
                    disabled={true}
                    type="number"
                    value={starting}
                    />
            </ControlGroup>

            <ControlGroup label="Obtained">
                <ListComponent
                    newItem='auto'
                    list={_.map(earned, value => ({value}))}
                    component={InputField}
                    initialItem={{value: ''}}
                    disabled={disabled}
                    setState={!disabled
                        ? (items) => this.onChange(items)
                        : null
                    }
                    componentProps={{ disabled }}
                    />
            </ControlGroup>

            <ControlGroup label="Total">
                <InputField
                    placeholder="Total..."
                    disabled={true}
                    type="number"
                    value={earned.length ? total : starting}
                    />
            </ControlGroup>
        </Panel>;
    }
};

export class TreasureCheckpoints extends React.Component
{
    computeTotal(tier, earned) {
        const {
            [tier]: current = {
                starting: 0,
            },
        } = this.props;
        return _.assign(
            {},
            current,
            {
                earned,
                total: current.starting + earned,
            }
        );
    }

    onChange(tier, earned) {
        const { disabled = false, setState } = this.props;
        if (disabled) {
            return;
        }
        const computed = this.computeTotal(tier, earned);
        setState({ [tier]: computed });
    }

    render() {
        const {
            one = {},
            two = {},
            three = {},
            four = {},
            className,
            label,
            disabled = false,
            currentTier = 'one',
        } = this.props;

        return <Panel
            className={className}
            header={label}
            >
            {_.map({one, two, three, four}, ({ starting = 0, earned = 0, total = 0 }, tier) => (
                <ControlGroup
                    key={`tier-${tier}`}
                    className={tier === currentTier ? 'current' : undefined}
                    labels={[
                        tier === currentTier
                            ? 'Current tier'
                            : `Tier ${tier}`,
                        "±",
                        "="
                    ]}
                >
                    <InputField
                        disabled={true}
                        type="number"
                        value={starting}
                    />
                    <CalculatorInputField
                        placeholder="Earned..."
                        value={earned}
                        disabled={disabled}
                        setState={(value, formula) => this.onChange(tier, value)}
                        maxValue={currentTier === tier
                            ? undefined
                            : 0
                        }
                        minValue={(total || 0) * -1}
                    />
                    <InputField
                        placeholder="Total..."
                        disabled={true}
                        type="number"
                        value={disabled ? total : starting + earned}
                    />
                </ControlGroup>
            ))}
        </Panel>;
    }
};

export class CharacterSelectDialog extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            character_id: null,
        };
    }

    render() {
        const {
            onCancel,
            onDone,
            current_user,
        } = this.props
        const {
            character_id,
        } = this.state;

        return (
            <ModalDialog
                label="Pick a Character"
                onCancel={onCancel}
                onDone={character_id == null
                    ? null
                    : () => onDone(character_id)
                }
            >
                <CharacterPicker
                    filter={character => (
                        current_user.id == character.user_id
                        && (
                            character.xp == 0
                            || character.adventure_league
                        )
                    )}
                    actions={character => ({
                        'pick': {
                            className: character_id == character.id
                                ? 'accent'
                                : null,
                            label: 'Pick',
                            action: () => this.setState({
                                character_id: character.id,
                            }),
                            icon: 'user-secret',
                        },
                    })}
                />
            </ModalDialog>
        );
    }
};

export class AdventureLeagueLogEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            forceAdventureCheckpoints: false,
        };

        this.onSwitch = this.onSwitch.bind(this);
    }

    onSwitch(forceAdventureCheckpoints) {
        this.setState({ forceAdventureCheckpoints });
    }

    componentDidMount() {
        const { character_id, user_id, setState } = this.props;
        setState({ character_id, user_id });
    }

    onFieldChange(field, update) {
        const { [field]: original, setState } = this.props;
        const value = _.assign({}, original, update);
        setState({[field]: value});
    }

    render() {
        const {
            character_id,
            character_snapshot = {},
            character = {
                adventure_checkpoints: 0,
                treasure_checkpoints: {},
                wealth: {},
                level: 1,
                xp: 0,
            },
            user_id, current_user = {}, adventure = {}, xp = {},
            gold = {}, downtime = {}, renown = {}, equipment = {},
            items = {}, notes = '', consumed = false, setState,
            adventure_checkpoints = {}, treasure_checkpoints = {},
        } = this.props;
        const {
            forceAdventureCheckpoints,
        } = this.state;

        const currentTier = ['one', 'two', 'three', 'four'][
            Math.floor(character.level / 5.0)
        ];

        const acp_mode = (
            adventure_checkpoints.earned
            || character.adventure_checkpoints
            || forceAdventureCheckpoints
        );

        return <React.Fragment>
            <AdventureSession
                {...adventure}
                setState={(value) => this.onFieldChange(
                    'adventure', value
                )}
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
                    consumed
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
                    disabled={!!consumed}
                    {...xp}
                    starting={consumed
                        ? xp.starting
                        : character.xp
                    }
                    setState={!consumed
                        ? (value) => this.onFieldChange('xp', value)
                        : null
                    }
                />
            )}

            {!acp_mode && (
                <AdventureDelta
                    className="al-log-edit__renown"
                    label="Renown"
                    disabled={!!consumed}
                    {...renown}
                    starting={consumed
                        ? renown.starting
                        : character.renown
                    }
                    setState={!consumed
                        ? (value) => this.onFieldChange('renown', value)
                        : null
                    }
                />
            )}

            {acp_mode && (
                <AdventureDelta
                    key="acp"
                    className="al-log-edit__acp al-log-edit--acp-mode"
                    label="Adventure Checkpoints"
                    disabled={!!consumed}
                    {...adventure_checkpoints}
                    starting={consumed
                        ? adventure_checkpoints.starting
                        : character.adventure_checkpoints
                    }
                    setState={!consumed
                        ? (value) => this.onFieldChange(
                            'adventure_checkpoints',
                            value
                        ) : null
                    }
                />
            )}

            {acp_mode && (
                <TreasureCheckpoints
                    className="al-log-edit__treasure"
                    label="Treasure Points"
                    disabled={!!consumed}
                    currentTier={currentTier}
                    {..._.merge({},
                        character.treasure_checkpoints,
                        treasure_checkpoints
                    )}
                    setState={!consumed
                        ? (value) => this.onFieldChange(
                            'treasure_checkpoints',
                            value
                        )
                        : null
                    }
                />
            )}

            <AdventureDelta
                className="al-log-edit__downtime"
                label="Downtime"
                disabled={!!consumed}
                {...downtime}
                starting={consumed
                    ? downtime.starting
                    : character.downtime
                }
                setState={!consumed
                    ? (value) => this.onFieldChange('downtime', value)
                    : null
                }
            />

            <AdventureGold
                className="al-log-edit__gold"
                label="Gold"
                disabled={!!consumed}
                {...gold}
                starting={consumed
                    ? gold.starting
                    : character.wealth
                }
                setState={!consumed
                    ? (value) => this.onFieldChange('gold', value)
                    : null
                }
            />

            <AdventureItems
                className="al-log-edit__equipment"
                label="Regular Items"
                disabled={!!consumed}
                {...equipment}
                starting={equipment.starting}
                setState={!consumed
                    ? (value) => this.onFieldChange(
                        'equipment', value
                    )
                    : null
                }
            />

            <AdventureItems
                className="al-log-edit__items"
                label="Magical Items"
                disabled={!!consumed}
                {...items}
                starting={consumed
                    ? items.starting
                    : character.adventure_items
                }
                setState={!consumed
                    ? (value) => this.onFieldChange('items', value)
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
                    setState={(value) => this.props.setState({
                        'notes': value
                    })}
                />
            </Panel>

            {character_id == undefined && (
                <CharacterSelectDialog
                    onDone={character_id => setState({character_id})}
                    current_user={current_user}
                />
            )}
        </React.Fragment>;
    }
};

AdventureLeagueLogEdit.propTypes = {
    character_id: PropTypes.number,
    user_id: PropTypes.number,
    consumed: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
    ]),
    adventure: PropTypes.object,
    xp: PropTypes.object,
    gold: PropTypes.object,
    downtime: PropTypes.object,
    renowm: PropTypes.object,
    items: PropTypes.object,
    notes: PropTypes.string,
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
