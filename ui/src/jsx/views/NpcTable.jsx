import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import NpcLinks from '../components/NpcLinks.jsx';

class NpcHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Race</th>
                <th>Class</th>
                <th>Alignment</th>
                <th>Location</th>
                <th>Organization</th>
                <th>Actions</th>
            </tr>
        </thead>;
    }
}

class NpcFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="6"></td>
                <td>
                    <NpcLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class NpcRow extends LazyComponent
{
    render() {
        return <tr
                data-name={this.props.name}>
            <td>{this.props.name}</td>
            <td>{this.props.race}</td>
            <td>{this.props.class}</td>
            <td>{this.props.alignment}</td>
            <td>{this.props.location}</td>
            <td>{this.props.organization}</td>
            <td>{this.props.id != null
                ? <NpcLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    npc_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class NpcTable extends LazyComponent
{
    shouldDisplayRow(pattern, npc) {
        return (
            (npc.name && npc.name.search(pattern) >= 0)
            || (npc.location && npc.location.search(pattern) >= 0)
            || (npc.organization && npc.organization.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.npcs == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-commenting-o">NPC list</h2>
            <table className="nice-table condensed bordered responsive">
                <NpcHeader />
                <tbody key="tbody">
                    {_.map(this.props.npcs, (npc) => {
                        return this.shouldDisplayRow(pattern, npc)
                            ? <NpcRow
                                key={npc.id}
                                {...npc}
                                />
                            : null;
                    })}
                </tbody>
                <NpcFooter />
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        NpcTable,
        {npcs: {type: 'npc'}}
    ),
    ['search']
);
