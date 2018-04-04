import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_adventure-league-log-view.scss';

import BaseViewWrapper from '../hocs/BaseViewWrapper.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';
import RoutedObjectDataWrapper from '../hocs/RoutedObjectDataWrapper.jsx';

import AdventureLeagueLogLinks from '../components/AdventureLeagueLogLinks.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import Coinage from '../components/Coinage.jsx';
import Panel from '../components/Panel.jsx';
import UserLabel from '../components/UserLabel.jsx';

export class AdventureSession extends React.Component
{
    render() {
        const {
            name, id, date, dm_name, dm_dci, logId
        } = this.props;

        return <Panel
            className="adventure-league-log-view__session"
            header="Adventure"
            >
            <thead>
                <tr>
                    <th colSpan={3}>
                        <AdventureLeagueLogLinks
                            className="pull-right"
                            logId={logId}
                            />
                        <h3>{name}</h3>
                        <h4>{id}</h4>
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr>
                    <th>Date</th>
                    <th>DM Name</th>
                    <th>DM DCI</th>
                </tr>
                <tr>
                    <th>{date}</th>
                    <th>{dm_name}</th>
                    <th>{dm_dci}</th>
                </tr>
            </tbody>
        </Panel>;
    }
};

export class AdventureDelta extends React.Component
{
    render() {
        const {
            starting = 0, earned = 0, className, label,
        } = this.props;
        const total = starting + earned;

        return <Panel
            className={className}
            header={label}
            >
            <tbody>
                <tr>
                    <th>Starting</th>
                    <th>{starting}</th>
                </tr>
                <tr>
                    <th>Earned</th>
                    <th>{earned}</th>
                </tr>
                <tr>
                    <th>Total</th>
                    <th>{earned ? total : starting}</th>
                </tr>
            </tbody>
        </Panel>;
    }
};

export class AdventureGold extends React.Component
{
    render() {
        const {
            starting = {}, earned = {}, className, label,
        } = this.props;
        const total = _.assign(
            {},
            starting,
            _.mapValues(
                earned,
                (value, coin) => (value + (starting[coin] || 0))
            )
        );

        return <Panel
            className={className}
            header={label}
            >
            <tbody>
                <tr>
                    <th>Starting</th>
                    <td>
                        <Coinage
                            {...starting}
                            extended={true}
                            />
                    </td>
                </tr>
                <tr>
                    <th>Earned</th>
                    <td>
                        <Coinage
                            {...earned}
                            extended={true}
                            />
                    </td>
                </tr>
                <tr>
                    <th>Total</th>
                    <td>
                        <Coinage
                            {...total}
                            extended={true}
                            />
                    </td>
                </tr>
            </tbody>
        </Panel>;
    }
};

export class AdventureItems extends React.Component
{
    render() {
        const {
            starting = 0, earned = [], className, label,
            disabled = false,
        } = this.props;
        const total = starting + _.filter(earned).length;

        return <Panel
            className={className}
            header={label}
            >
            <tbody>
                <tr>
                    <th>Starting</th>
                    <th>{starting}</th>
                </tr>
                <tr>
                    <th>Earned</th>
                    <th>{earned.length
                        ? _.map(earned, (item, i) => (
                            <span key={i}>{item}</span>
                        ))
                        : <span>&mdash;</span>
                    }</th>
                </tr>
                <tr>
                    <th>Total</th>
                    <th>{earned.length ? total : starting}</th>
                </tr>
            </tbody>
        </Panel>;
    }
};

export class AdventureLeagueLogView extends React.Component
{
    render() {
        const {
            id, character_id, character = {wealth: {}}, user_id,
            current_user = {}, adventure = {}, xp = {}, gold = {},
            downtime = {}, renown = {}, equipment = {}, items = {},
            notes = '', consumed = false
        } = this.props;

        return <React.Fragment>

            <AdventureSession
                {...adventure}
                logId={id}
                consumed={consumed}
                />

            <Panel
                key="adventurer"
                className="adventure-league-log-view__adventurer"
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
                className="adventure-league-log-view__xp"
                label="XP"
                {...xp}
                starting={consumed
                    ? xp.starting
                    : character.xp
                }
                />

            <AdventureGold
                className="adventure-league-log-view__gold"
                label="Gold"
                {...gold}
                starting={consumed
                    ? gold.starting :
                    character.wealth
                }
                />

            <AdventureDelta
                className="adventure-league-log-view__downtime"
                label="Downtime"
                {...downtime}
                starting={consumed
                    ? downtime.starting
                    : character.downtime
                }
                />

            <AdventureDelta
                className="adventure-league-log-view__renown"
                label="Renown"
                {...renown}
                starting={consumed
                    ? renown.starting
                    : character.renown
                }
                />

            <AdventureItems
                className="adventure-league-log-view__equipment"
                label="Regular Items"
                {...equipment}
                />

            <AdventureItems
                className="adventure-league-log-view__items"
                label="Magical Items"
                {...items}
                />

            <Panel
                key="notes"
                className="adventure-league-log-view__notes"
                header="Adventure Notes / Downtime Activity"
                >
                <MDReactComponent
                    text={notes}
                    />
            </Panel>

        </React.Fragment>;
    }
};

AdventureLeagueLogView.propTypes = {
    character_id: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]),
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
            AdventureLeagueLogView,
            [
                {type: 'user', id: 'user_id'},
                {type: 'character', id: 'character_id'},
            ]
        ),
        {
            className: 'adventure-league-log-view',
            icon: 'fa-pencil-square-o', // fa-d-and-d
            label: 'Adventure League Log',
        },
        "adventureleague",
        "log"
    ),
    [
        'current_user',
    ]
);
