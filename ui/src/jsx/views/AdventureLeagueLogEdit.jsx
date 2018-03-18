import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_adventure-league-log-edit.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import CalculatorInputField from '../components/CalculatorInputField.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import ControlGroup from '../components/ControlGroup.jsx';
import Coinage from '../components/Coinage.jsx';
import CostEditor from '../components/CostEditor.jsx';
import InputField from '../components/InputField.jsx';
import ListComponent from '../components/ListComponent.jsx';
import MarkdownTextField from '../components/MarkdownTextField.jsx';
import Panel from '../components/Panel.jsx';
import UserLabel from '../components/UserLabel.jsx';

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
            className="adventure-league-log-edit__session"
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
        this.state = { };
    }

    onChange(earned) {
        const {
            starting = 0, disabled = false, setState
        } = this.props;
        if (disabled) {
            return;
        }
        setState({
            earned,
            total: starting + earned
        });
    }

    render() {
        const {
            starting = 0, earned = 0, total = 0, className, label,
            disabled = false,
        } = this.props;
        const { formula = earned } = this.state;

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

            <ControlGroup
                labels={
                    formula != earned
                        ? ["Earned", "="]
                        : ["Earned"]
                }
                >
                <CalculatorInputField
                    placeholder="Earned..."
                    value={earned}
                    disabled={disabled}
                    setState={(value, formula) => this.setState(
                        {formula},
                        () => this.onChange(value)
                    )}
                    />
                {formula != earned
                    ? <InputField
                        placeholder="Earned..."
                        disabled={true}
                        type="number"
                        value={earned}
                        />
                    : null
                }
            </ControlGroup>

            <ControlGroup label="Total">
                <InputField
                    placeholder="Total..."
                    disabled={true}
                    type="number"
                    value={earned ? total : starting}
                    />
            </ControlGroup>
        </Panel>;
    }
};

export class AdventureGold extends React.Component
{
    onChange(earned) {
        const {
            starting = {}, disabled = false, setState
        } = this.props;
        if (disabled) {
            return;
        }
        const total = _.assign(
            {},
            starting,
            _.mapValues(
                earned,
                (value, coin) => (value + (starting[coin] || 0))
            )
        );

        setState({ earned, total });
    }

    render() {
        const {
            starting = {}, earned = {}, total = {}, className, label,
            disabled = false,
        } = this.props;

        return <Panel
            className={className}
            header={label}
            >
            <ControlGroup label="Starting">
                <Coinage
                    {...starting}
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
                    extended="1"
                    />
            </ControlGroup>
        </Panel>;
    }
};

export class AdventureItems extends React.Component
{
    onChange(items) {
        const {
            starting = 0, disabled = false, setState
        } = this.props;
        if (disabled) {
            return;
        }
        const earned = _.map(
            items,
            item => (_.isObject(item) ? item.value : item)
        );
        const total = starting + _.filter(earned).length;
        setState({ earned, total });
    }

    render() {
        const {
            starting = 0, earned = [], total = 0, className, label,
            disabled = false,
        } = this.props;

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
                    list={_.map(
                        earned.length ? earned : [''],
                        value => ({value})
                    )}
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

export class AdventureLeagueLogEdit extends React.Component
{
    componentDidMount() {
        const {
            character_id, consumed = false, setState
        } = this.props;
        if (consumed || !character_id) {
            return;
        }
        setState({character_id});
    }

    onFieldChange(field, update) {
        const { [field]: original, setState } = this.props;
        const value = _.assign({}, original, update);
        setState({[field]: value});
    }

    render() {
        const {
            character_id, character = {wealth: {}}, user_id,
            current_user = {}, adventure = {}, xp = {}, gold = {},
            downtime = {}, renown = {}, items = {}, notes = '',
            consumed = false
        } = this.props;

        return <React.Fragment>
            <AdventureSession
                {...adventure}
                setState={(value) => this.onFieldChange(
                    'adventure', value
                )}
                />

            <Panel
                key="adventurer"
                className="adventure-league-log-edit__adventurer"
                header="Adventurer"
                >
                <UserLabel
                    user_id={user_id || current_user.id}
                    showDCI={true}
                    />
                {character_id
                    ? <CharacterLabel
                        character_id={parseInt(
                            character_id
                        )}
                        showProgress={true}
                        />
                    : null
                }
            </Panel>

            <AdventureDelta
                className="adventure-league-log-edit__xp"
                label="XP"
                disabled={consumed}
                {...xp}
                starting={xp.starting || character.xp}
                setState={!consumed
                    ? (value) => this.onFieldChange('xp', value)
                    : null
                }
                />

            <AdventureGold
                className="adventure-league-log-edit__gold"
                label="Gold"
                disabled={consumed}
                {...gold}
                starting={gold.starting || character.wealth}
                setState={!consumed
                    ? (value) => this.onFieldChange('gold', value)
                    : null
                }
                />

            <AdventureDelta
                className="adventure-league-log-edit__downtime"
                label="Downtime"
                disabled={consumed}
                {...downtime}
                starting={downtime.starting || character.downtime}
                setState={!consumed
                    ? (value) => this.onFieldChange('downtime', value)
                    : null
                }
                />

            <AdventureDelta
                className="adventure-league-log-edit__renown"
                label="Renown"
                disabled={consumed}
                {...renown}
                starting={renown.starting || character.renown}
                setState={!consumed
                    ? (value) => this.onFieldChange('renown', value)
                    : null
                }
                />

            <AdventureItems
                className="adventure-league-log-edit__items"
                label="Items"
                disabled={consumed}
                {...items}
                starting={items.starting || character.adventure_items}
                setState={!consumed
                    ? (value) => this.onFieldChange('items', value)
                    : null
                }
                />

            <Panel
                key="notes"
                className="adventure-league-log-edit__notes"
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
        </React.Fragment>;
    }
};

AdventureLeagueLogEdit.propTypes = {
    character_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
    user_id: PropTypes.number,
    consumed: PropTypes.bool,
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
            className: 'adventure-league-log-edit',
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
