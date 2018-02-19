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
            </tr>
        </thead>;
    }
}

class NpcFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={5}>
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
        const {
            id, name, race, 'class': _class, alignment, location,
            organization
        } = this.props;

        return <tr data-name={id}>
            <th>
                {name}
                <NpcLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    npc_id={id}
                    />
            </th>
            <td>{race}</td>
            <td>{_class}</td>
            <td>{alignment}</td>
            <td>{location}</td>
            <td>{organization}</td>
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
        const {
            npcs, search = ''
        } = this.props;

        if (!npcs) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            npcs,
            (npc) => this.shouldDisplayRow(pattern, npc)
        );

        return <div>
            <h2 className="icon fa-commenting-o">NPC list</h2>
            <table className="nice-table condensed bordered responsive">
                <NpcHeader />
                <tbody key="tbody">
                    {_.map(npcs, (npc) => (
                        <NpcRow
                            key={npc.id}
                            {...npc}
                            />
                    ))}
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
