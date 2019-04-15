import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import ChallengeRating from '../components/ChallengeRating.jsx';
import XpRating from '../components/XpRating.jsx';
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
            </tr>
        </thead>;
    }
}

class MonstersFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={2}>
                    <MonsterLinks
                        altStyle={true}
                    />
                </td>
            </tr>
        </tbody>
    }
};

class MonstersRow extends LazyComponent
{
    render() {
        const {
            id, name, challenge_rating, xp
        } = this.props;

        return <tr data-name={id}>
            <th>
                {name}
                <MonsterLinks
                    altStyle={true}
                    id={id}
                />
            </th>
            <td>
                <ChallengeRating
                    challengeRating={challenge_rating}
                    />
                &nbsp;/&nbsp;
                <XpRating
                    xpRating={xp}
                    />
            </td>
        </tr>
    }
};

class MonstersTable extends LazyComponent
{
    shouldDisplayRow(pattern, monster) {
        return (
            (monster.name && monster.name.match(pattern))
        );
    }

    render() {
        const {
            monsters, search = ''
        } = this.props;

        if (!monsters) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            monsters,
            (monster) => this.shouldDisplayRow(pattern, monster)
        );

        return <div>
            <h2 className="icon fa-paw">Monster list</h2>
            <table className="nice-table condensed bordered responsive">
                <MonstersHeader />
                <tbody key="tbody">
                    {_.map(filtered, (monster) => (
                        <MonstersRow
                            key={monster.id}
                            {...monster}
                            />
                    ))}
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
