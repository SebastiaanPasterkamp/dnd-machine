import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import LazyComponent from '../components/LazyComponent.jsx';
import MonsterLinks from '../components/MonsterLinks.jsx';

class MonstersHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Challenge</th>
                <th>Actions</th>
            </tr>
        </thead>;
    }
}

class MonstersFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="2"></td>
                <td>
                    <MonsterLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class MonstersRow extends LazyComponent
{
    render() {
        return <tr
                data-name={this.props.name}>
            <td>{this.props.name}</td>
            <td>{this.props.challenge_rating} / {this.props.xp_rating}XP</td>
            <td>{this.props.id != null
                ? <MonsterLinks
                    altStyle={true}
                    buttons={['view', 'edit']}
                    monster_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class MonstersTable extends LazyComponent
{
    shouldDisplayRow(pattern, monster) {
        return (
            (monster.name && monster.name.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.monsters == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-paw">Monster list</h2>
            <table className="nice-table condensed bordered responsive">
                <MonstersHeader />
                <tbody key="tbody">
                    {_.map(this.props.monsters, (monster) => {
                        return this.shouldDisplayRow(pattern, monster)
                            ? <MonstersRow
                                key={monster.id}
                                {...monster}
                                />
                            : null;
                    })}
                </tbody>
                <MonstersFooter />
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        MonstersTable,
        {monsters: {type: 'monster'}}
    ),
    ['search']
);
