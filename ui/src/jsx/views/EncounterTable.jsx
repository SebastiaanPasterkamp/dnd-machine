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
                <th>Actions</th>
            </tr>
        </thead>;
    }
}

class EncounterFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="3"></td>
                <td>
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
        let ratingStyle = 'muted';
        if (this.props.hosted_party) {
            ratingStyle = utils.closestStyle(
                {
                    info: this.props.hosted_party.challenge.easy,
                    good: this.props.hosted_party.challenge.medium,
                    warning: this.props.hosted_party.challenge.hard,
                    bad: this.props.hosted_party.challenge.deadly,
                },
                this.props.xp_modified,
                ratingStyle
            );
        }

        return <tr
                data-name={this.props.name}>
            <td>{this.props.name}</td>
            <td>{this.props.size}</td>
            <td className={ratingStyle}>
                <span>
                    <strong>Challenge:</strong>&nbsp;
                    {this.props.challenge_rating}
                    &nbsp;/&nbsp;
                    {this.props.xp_rating}XP
                </span>
                {this.props.hosted_party
                    ? <span><br/>
                        <strong>Modified:</strong>&nbsp;
                        {this.props.challenge_modified}
                        &nbsp;/&nbsp;
                        {this.props.xp_modified}XP
                    </span>
                    : null
                }
            </td>
            <td>{this.props.id != null
                ? <EncounterLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    encounter_id={this.props.id}
                    />
                : null
            }</td>
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
        if (this.props.encounters == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-gamepad">Encounter list</h2>

            <table className="nice-table condensed bordered responsive">
                <EncounterHeader />
                <tbody key="tbody">
                    {_.map(this.props.encounters, (encounter) => {
                        return this.shouldDisplayRow(pattern, encounter)
                            ? <EncounterRow
                                key={encounter.id}
                                {...encounter}
                                hosted_party={this.props.hosted_party}
                                />
                            : null;
                    })}
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
