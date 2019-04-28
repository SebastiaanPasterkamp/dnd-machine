import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_adventure-league-log-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';
import ObjectDataWrapper from '../hocs/ObjectDataWrapper.jsx';

import AdventureLeagueLogLinks from '../components/AdventureLeagueLogLinks.jsx';
import { BaseLinkButton } from '../components/BaseLinkGroup/index.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import CharacterPicker from '../components/CharacterPicker';
import Coinage from '../components/Coinage.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import ModalDialog from '../components/ModalDialog.jsx';

import { userHasRole } from '../utils.jsx';

const AdventureLeagueLogHeader = function() {
    return (
        <thead>
            <tr>
                <th>Adventure</th>
                <th>Gains</th>
                <th>Notes</th>
                <th>Character</th>
            </tr>
        </thead>
    );
};

const AdventureLeagueLogFooter = function({
    onNew,
    characterId,
}) {
    return (
        <tbody>
            <tr>
                <th>
                    <AdventureLeagueLogLinks
                        altStyle={true}
                        characterId={characterId}
                    >
                        <BaseLinkButton
                            name="new"
                            label="New"
                            icon="plus"
                            altStyle={true}
                            available={!characterId}
                            action={onNew}
                        />
                    </AdventureLeagueLogLinks>
                </th>
                <td colSpan={3}>
                </td>
            </tr>
        </tbody>
    );
};

class AdventureLeagueRow extends LazyComponent
{
    render() {
        const {
            id, logId, adventure, xp = {}, gold = {}, downtime = {},
            renown = {}, items, notes = '', character_id,
            adventure_checkpoints = {}, treasure_checkpoints = {},
            character_snapshot = {},
        } = this.props;

        return <tr data-id={id}>
            <th>
                <h3>{adventure.name}</h3>
                <span>{adventure.id}</span>
                <span>{adventure.date}</span>
                <AdventureLeagueLogLinks
                    altStyle={true}
                    id={logId}
                />
            </th>
            <td>
                {xp.earned
                    ? <span>
                        <strong>XP</strong>
                        {xp.earned} XP
                    </span>
                    : null
                }
                {adventure_checkpoints.earned
                    ? <span>
                        <strong>ACP</strong>
                        {adventure_checkpoints.earned} ACP
                    </span>
                    : null
                }
                {gold.earned
                    ? <span>
                        <strong>Gold</strong>
                        <Coinage
                            {...gold.earned}
                            extended={true}
                            />
                    </span>
                    : null
                }
                {downtime.earned
                    ? <span>
                        <strong>Downtime</strong>
                        {downtime.earned}
                    </span>
                    : null
                }
                {renown.earned
                    ? <span>
                        <strong>Renown</strong>
                        {renown.earned}
                    </span>
                    : null
                }
                {items.earned.length
                    ? <ul>
                        {_.map(items.earned, (item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    : null
                }
            </td>
            <td>
                <MDReactComponent
                    text={notes}
                    />
            </td>
            <td>
                {character_id && (
                    <CharacterLabel
                        character_id={parseInt(
                            character_id
                        )}
                        showProgress={true}
                        characterUpdate={character_snapshot}
                    />
                )}
            </td>
        </tr>
    }
};

class AdventureLeagueLogTable extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            dialog: false,
        };

        this.toggleDialog = this.toggleDialog.bind(this);
    }

    onCharacterFilter = (character) => {
        const { currentUser } = this.props;
        return (
            currentUser.id == character.user_id
            && (
                character.xp == 0
                || character.adventure_league
            )
        );
    }

    onCharacterSelect = (id) => {
        const { router: { history } } = this.context;
        history.push(`/log/adventureleague/new/${id}`);
    }

    toggleDialog() {
        const {
            dialog,
        } = this.state;
        this.setState({
            dialog: !dialog,
        });
    }

    shouldDisplayRow(pattern, character_id, log) {
        if (
            character_id !== undefined
            && log.character_id !== character_id
        ) {
            return false;
        }
        return (
            (log.adventure.name && log.adventure.name.match(pattern))
            || (log.notes && log.notes.match(pattern))
        );
    }

    render() {
        const {
            logs,
            currentUser,
            search = '',
            character: {
                id: character_id,
            } = {},
        } = this.props;
        const {
            dialog,
        } = this.state;

        if (!logs) {
            return null;
        }

        const pattern = new RegExp(search, "i");
        const filtered = _.filter(
            logs,
            entry => this.shouldDisplayRow(
                pattern,
                character_id,
                entry,
            )
        );

        const canCreateNew = (
            userHasRole(currentUser, 'player')
            && currentUser.dci
        );

        return <div className="adventure-league-log-table">
            <h2 className="icon fa-pencil-square-o">
                Adventure League Logs
            </h2>

            <table
                className="nice-table condensed bordered responsive"
                >
                <AdventureLeagueLogHeader />
                <tbody key="tbody">
                {_.map(filtered, entry => (
                    <AdventureLeagueRow
                        key={entry.id}
                        logId={entry.id}
                        {...entry}
                        />
                ))}
                </tbody>
                {canCreateNew && <AdventureLeagueLogFooter
                    onNew={this.toggleDialog}
                    characterId={character_id}
                />}
            </table>

            {dialog && canCreateNew && (
                <CharacterPicker
                    onCancel={this.toggleDialog}
                    onDone={this.onCharacterSelect}
                    onFilter={this.onCharacterFilter}
                />
            )}
        </div>
    }
};

AdventureLeagueLogTable.contextTypes = {
    router: PropTypes.object,
};

export default ListDataWrapper(
    ObjectDataListWrapper(
        ObjectDataWrapper(
            AdventureLeagueLogTable,
            [
                {type: 'character', id: 'character_id'},
            ]
        ),
        {logs: {group: 'log', type: 'adventureleague'}}
    ),
    [
        'current_user',
        'search',
    ],
    null,
    { current_user: 'currentUser' }
);
