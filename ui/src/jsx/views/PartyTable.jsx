import React from 'react';
import {Link} from 'react-router-dom';

import ItemStore from '../mixins/ItemStore.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import CharacterLabel from '../components/CharacterLabel.jsx';
import PartyLinks from '../components/PartyLinks.jsx';
import Progress from '../components/Progress.jsx';

class PartyHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Members</th>
                <th>Challenge</th>
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
                <td colSpan="3"></td>
                <td>
                    <PartyLinks
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
        let cr = this.props.challenge,
            ratio = {
                easy: cr.easy / cr.deadly,
                medium: (cr.medium - cr.easy) / cr.deadly,
                hard: (cr.hard - cr.medium) / cr.deadly,
                deadly: (cr.deadly - cr.hard) / cr.deadly
            };

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
            <td>
                <div className="nice-progress stacked">
                    <div
                        className="nice-progress-fill muted"
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
            </td>
            <td>{this.props.id != null
                ? <PartyLinks
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
    filterRow(pattern, row) {
        return (
            (row.name && row.name.search(pattern) >= 0)
        );
    }

    render() {
        let pattern = new RegExp(this.props.search, "i");

        return <div>
            <h2 className="icon fa-users">Party</h2>
            <table className="nice-table condensed bordered responsive">
                <PartyHeader />
                <tbody key="tbody">
                    {this.props.party
                        .filter((row) => this.filterRow(pattern, row))
                        .map((row) => {
                            return <PartyRow key={row.id} {...row}/>
                        })
                    }
                </tbody>
                <PartyFooter />
            </table>
        </div>;
    }
}

export default ItemStore(PartyTable, ['party', 'search']);
