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
                <th>Members</th>
                {this.props.challenge
                    ? <th>Challenge</th>
                    : null
                }
                <th>Actions</th>
            </tr>
        </thead>;
    }
}

class PartyFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={this.props.challenge
                    ? 3
                    : 2
                }></td>
                <td>
                    <PartyLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class PartyRow extends LazyComponent
{
    render() {
        let cr = null,
            ratio = null;
        if (this.props.challenge) {
            cr = this.props.challenge;
            ratio = {
                easy: cr.easy / cr.deadly,
                medium: (cr.medium - cr.easy) / cr.deadly,
                hard: (cr.hard - cr.medium) / cr.deadly,
                deadly: (cr.deadly - cr.hard) / cr.deadly
            };
        }

        return <tr
                data-name={this.props.name}>
            <td>
                {this.props.name}<br/>
                <i>{this.props.description}</i>
            </td>
            <td>
                <ul>
                {this.props.members.map((member) => {
                    return <CharacterLabel
                        key={member}
                        character_id={member}
                        progress={true}
                        />;
                })}
                </ul>
            </td>
            {this.props.challenge ? <td>
                <div className="nice-progress stacked">
                    <div
                        className="nice-progress-fill accent"
                        style={{
                            width: (ratio.easy * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {cr.easy}
                    </div>
                    <div
                        className="nice-progress-fill good"
                        style={{
                            width: (ratio.medium * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {cr.medium}
                    </div>
                    <div
                        className="nice-progress-fill warning"
                        style={{
                            width: (ratio.hard * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {cr.hard}
                    </div>
                    <div
                        className="nice-progress-fill bad"
                        style={{
                            width: (ratio.deadly * 100.0) + '%',
                            height: '1.25rem'
                        }}>
                        {cr.deadly}
                    </div>
                </div>
            </td> : null}
            <td>{this.props.id != null
                ? <PartyLinks
                    altStyle={true}
                    buttons={['view', 'edit', 'host']}
                    party_id={this.props.id}
                    />
                : null
            }</td>
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
        if (this.props.parties == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");
        let has_challenge = 'challenge' in (
            _.first(_.values(this.props.parties)) || {}
        );

        return <div>
            <h2 className="icon fa-users">Party</h2>

            <table className="nice-table condensed bordered responsive">
                <PartyHeader
                    challenge={has_challenge} />
                <tbody key="tbody">
                    {_.map(this.props.parties, (party) => {
                        return this.shouldDisplayRow(pattern, party)
                            ? <PartyRow
                                key={party.id}
                                {...party}
                                />
                            : null;
                    })}
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
