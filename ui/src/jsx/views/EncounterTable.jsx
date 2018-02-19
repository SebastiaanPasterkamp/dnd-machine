import React from 'react';

import utils from '../utils.jsx';
import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import EncounterLinks from '../components/EncounterLinks.jsx';

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
                        buttons={['new']}
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
            id, hosted_party, name, size, challenge_rating, xp_rating,
            challenge_modified, xp_modified
        } = this.props;

        let ratingStyle = 'muted';
        if (hosted_party) {
            ratingStyle = utils.closestStyle(
                {
                    info: hosted_party.challenge.easy,
                    good: hosted_party.challenge.medium,
                    warning: hosted_party.challenge.hard,
                    bad: hosted_party.challenge.deadly,
                },
                xp_modified,
                ratingStyle
            );
        }

        return <tr data-name={id}>
            <th>
                {name}
                <EncounterLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    encounter_id={id}
                    />
            </th>
            <td>{size}</td>
            <td className={ratingStyle}>
                <span>
                    <strong>Challenge:</strong>&nbsp;
                    {challenge_rating}
                    &nbsp;/&nbsp;
                    {xp_rating}XP
                </span>
                {hosted_party
                    ? <span><br/>
                        <strong>Modified:</strong>&nbsp;
                        {challenge_modified}
                        &nbsp;/&nbsp;
                        {xp_modified}XP
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

        return <div>
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
