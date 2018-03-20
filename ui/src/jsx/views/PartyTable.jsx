import React from 'react';
import {Link} from 'react-router-dom';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import PartyLinks from '../components/PartyLinks.jsx';
import Progress from '../components/Progress.jsx';

class PartyHeader extends LazyComponent
{
    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Members</th>
            </tr>
        </thead>;
    }
}

class PartyFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={3}>
                    <PartyLinks
                        altStyle={true}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class PartyRow extends LazyComponent
{
    render() {
        const {
            id, challenge, name, description, member_ids
        } = this.props;

        let ratio = null;
        if (challenge) {
            const {
                easy, medium, hard, deadly
            } = challenge;
            ratio = {
                easy: easy / deadly,
                medium: (medium - easy) / deadly,
                hard: (hard - medium) / deadly,
                deadly: (deadly - hard) / deadly
            };
        }

        return <tr data-name={id}>
            <th>
                {name}
                <PartyLinks
                    altStyle={true}
                    party_id={id}
                    />
            </th>
            <td>
                {challenge ? <div className="nice-progress stacked">
                    <div
                        className="nice-progress-fill accent"
                        style={{
                            width: (ratio.easy * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {challenge.easy}
                    </div>
                    <div
                        className="nice-progress-fill good"
                        style={{
                            width: (ratio.medium * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {challenge.medium}
                    </div>
                    <div
                        className="nice-progress-fill warning"
                        style={{
                            width: (ratio.hard * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {challenge.hard}
                    </div>
                    <div
                        className="nice-progress-fill bad"
                        style={{
                            width: (ratio.deadly * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {challenge.deadly}
                    </div>
                </div> : null}
                {description}
            </td>
            <td>
            {_.map(member_ids, id => (
                <CharacterLabel
                    key={id}
                    character_id={id}
                    showProgress={true}
                    />
            ))}
            </td>
        </tr>
    }
};

class PartyTable extends LazyComponent
{
    shouldDisplayRow(pattern, row) {
        return (
            (row.name && row.name.search(pattern) >= 0)
        );
    }

    render() {
        const {
            parties, search = ''
        } = this.props;

        if (!parties) {
            return null;
        }

        const has_challenge = 'challenge' in (
            _.first(_.values(parties)) || {}
        );

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            parties,
            (party) => this.shouldDisplayRow(pattern, party)
        );


        return <div>
            <h2 className="icon fa-users">Party list</h2>

            <table className="nice-table condensed bordered responsive">
                <PartyHeader
                    challenge={has_challenge} />
                <tbody key="tbody">
                    {_.map(filtered, (party) => (
                        <PartyRow
                            key={party.id}
                            {...party}
                            />
                    ))}
                </tbody>
                <PartyFooter
                    challenge={has_challenge} />
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        PartyTable,
        {parties: {type: 'party'}}
    ),
    ['search']
);
