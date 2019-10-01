import React from 'react';

import '../../sass/_encounter-table.scss';

import utils from '../utils';
import ListDataWrapper from '../hocs/ListDataWrapper';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper';

import LazyComponent from '../components/LazyComponent';
import EncounterLinks from '../components/EncounterLinks';
import MonsterLabel from '../components/MonsterLabel';

class EncounterHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Size</th>
                <th>Challenge Rating</th>
            </tr>
        </thead>;
    }
}

class EncounterFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={3}>
                    <EncounterLinks
                        altStyle={true}
                    />
                </td>
            </tr>
        </tbody>
    }
};

class EncounterRow extends LazyComponent
{
    render() {
        const {
            id, hosted_party, name, monster_ids, challenge_rating,
            xp_rating, challenge_modified, xp, xp_modified,
        } = this.props;

        let ratingStyle = 'muted';
        if (hosted_party) {
            ratingStyle = utils.closest(
                {
                    muted: 0,
                    info: hosted_party.challenge.easy,
                    good: hosted_party.challenge.medium,
                    warning: hosted_party.challenge.hard,
                    bad: hosted_party.challenge.deadly,
                },
                xp_rating,
                ratingStyle
            );
        }

        return <tr data-name={id}>
            <th>
                {name}
                <EncounterLinks
                    id={id}
                    altStyle={true}
                />
            </th>
            <td>
                {_.map(monster_ids, monster => (
                    <span key={monster.id}>
                        {monster.count}
                        &nbsp;x&nbsp;
                        <MonsterLabel
                            monster_id={monster.id}
                            />
                    </span>
                ))}
            </td>
            <td className={ratingStyle}>
                <span>
                    <strong>Challenge:</strong>&nbsp;
                    CR {challenge_rating}
                    &nbsp;/&nbsp;
                    {xp} XP
                </span>
                {hosted_party
                    ? <span>
                        <strong>Modified:</strong>&nbsp;
                        CR {challenge_modified}
                        &nbsp;/&nbsp;
                        {xp_modified} XP
                    </span>
                    : null
                }
            </td>
        </tr>
    }
};

class EncounterTable extends LazyComponent
{
    shouldDisplayRow(pattern, encounter) {
        return (
            (encounter.name && encounter.name.search(pattern) >= 0)
        );
    }

    render() {
        const {
            encounters, hosted_party, search = ''
        } = this.props;

        if (!encounters) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            encounters,
            (encounter) => this.shouldDisplayRow(pattern, encounter)
        );

        return <div className="encounter-table">
            <h2 className="icon fa-gamepad">Encounter list</h2>

            <table className="nice-table condensed bordered responsive">
                <EncounterHeader />
                <tbody key="tbody">
                    {_.map(filtered, (encounter) => (
                        <EncounterRow
                            key={encounter.id}
                            {...encounter}
                            hosted_party={hosted_party}
                            />
                    ))}
                </tbody>
                <EncounterFooter />
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        EncounterTable,
        {encounters: {type: 'encounter'}}
    ),
    ['search', 'hosted_party']
);
