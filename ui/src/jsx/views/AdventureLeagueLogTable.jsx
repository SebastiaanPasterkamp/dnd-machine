import React from 'react';
import MDReactComponent from 'markdown-react-js';

import '../../sass/_adventure-league-log-table.scss';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import AdventureLeagueLogLinks from '../components/AdventureLeagueLogLinks.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import Coinage from '../components/Coinage.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';

class AdventureLeagueLogHeader extends LazyComponent
{
    render() {
        return <thead>
            <tr>
                <th>Adventure</th>
                <th>Gains</th>
                <th>Notes</th>
                <th>Character</th>
            </tr>
        </thead>
    }
};

class AdventureLeagueLogFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <th>
                    <AdventureLeagueLogLinks
                        altStyle={true}
                        />
                </th>
                <td colSpan={3}>
                </td>
            </tr>
        </tbody>
    }
};

class AdventureLeagueRow extends LazyComponent
{
    render() {
        const {
            id, logId, adventure, xp = {}, gold = {}, downtime = {},
            renown = {}, items, notes = '', character_id
        } = this.props;

        return <tr data-id={id}>
            <th>
                <h3>{adventure.name}</h3>
                <span>{adventure.id}</span>
                <span>{adventure.date}</span>
                <AdventureLeagueLogLinks
                    altStyle={true}
                    logId={logId}
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
                {character_id
                    ? <CharacterLabel
                        character_id={parseInt(
                            character_id
                        )}
                        showProgress={true}
                        />
                    : null
                }
            </td>
        </tr>
    }
};

class AdventureLeagueLogTable extends LazyComponent
{
    shouldDisplayRow(pattern, log) {
        return (
            (log.adventure.name && log.adventure.name.match(pattern))
            || (log.notes && log.notes.match(pattern))
        );
    }

    render() {
        const {
            logs, search = '',
        } = this.props;

        if (!logs) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            logs,
            entry => this.shouldDisplayRow(pattern, entry)
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
                <AdventureLeagueLogFooter />
            </table>
        </div>
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        AdventureLeagueLogTable,
        {logs: {group: 'log', type: 'adventureleague'}}
    ),
    ['search']
);
