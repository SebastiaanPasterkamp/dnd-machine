import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import {CharacterLabel} from '../components/CharacterLabel.jsx';
import CharacterLinks from '../components/CharacterLinks.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
import ListLabel from '../components/ListLabel.jsx';
import UserLabel from '../components/UserLabel.jsx';
import Progress from '../components/Progress.jsx';

class CharactersHeader extends React.Component
{
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <thead key="thead">
            <tr>
                <th>Name</th>
                <th>Gender &amp; Race</th>
                <th>Level &amp; Class</th>
                <th>Alignment</th>
                <th>User</th>
            </tr>
        </thead>;
    }
}

class CharactersFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan={5}>
                    <CharacterLinks
                        altStyle={true}
                    />
                </td>
            </tr>
        </tbody>
    }
};

class CharactersRow extends LazyComponent
{
    render() {
        const {
            name, gender, genders = [], race, level, 'class': _class,
            alignment, alignments = [], user_id, id,
            xp_progress, xp_level,
            adventure_checkpoints, acp_progress, acp_level,
        } = this.props;

        const character = {
            level, xp_progress, xp_level,
            adventure_checkpoints, acp_progress, acp_level,
        };

        return <React.Fragment>
            <tr data-id={id}>
                <th rowSpan={2}>
                    {name}
                    <CharacterLinks
                        altStyle={true}
                        id={id}
                        exclude={['delete', 'new_log']}
                    />
                </th>
                <td>
                    <ListLabel
                        items={genders}
                        value={gender}
                        />
                        &nbsp;
                        {race}
                </td>
                <td>Level {level} {_class}</td>
                <td>
                    <ListLabel
                            items={alignments}
                            value={alignment}
                            />
                </td>
                <td>
                    <UserLabel
                        user_id={user_id}
                        />
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <CharacterLabel
                        showInfo={false}
                        showProgress={true}
                        character={character}
                    />
                </td>
            </tr>
        </React.Fragment>;
    }
};

class CharactersTable extends LazyComponent
{
    shouldDisplayRow(pattern, character) {
        return (
            (character.name && character.name.match(pattern))
            || (character.class && character.class.match(pattern))
            || (character.race && character.race.match(pattern))
        );
    }

    render() {
        const {
            characters, search = ''
        } = this.props;

        if (!characters) {
            return null;
        }

        let pattern = new RegExp(search, "i");
        const filtered = _.filter(
            characters,
            (character) => this.shouldDisplayRow(pattern, character)
        );

        return <div>
            <h2 className="icon fa-user-secret">Character list</h2>
            <table className="nice-table condensed bordered responsive">
                <CharactersHeader />
                <tbody key="tbody">
                    {_.map(filtered, (character) => (
                        <CharactersRow
                            key={character.id}
                            {...character}
                            {...this.props}
                            />
                    ))}
                </tbody>
                <CharactersFooter />
            </table>
        </div>;
    }
}

export default ListDataWrapper(
    ObjectDataListWrapper(
        CharactersTable,
        {characters: {type: 'character'}}
    ),
    ['search', 'alignments', 'genders'],
    'items'
);
