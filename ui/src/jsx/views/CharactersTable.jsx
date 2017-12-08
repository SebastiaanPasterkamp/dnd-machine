import React from 'react';

import ListDataWrapper from '../hocs/ListDataWrapper.jsx';
import ObjectDataListWrapper from '../hocs/ObjectDataListWrapper.jsx';

import CharacterLinks from '../components/CharacterLinks.jsx';
import LazyComponent from '../components/LazyComponent.jsx';
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
                <th>Progress</th>
                <th>Actions</th>
            </tr>
        </thead>;
    }
}

class CharactersFooter extends LazyComponent
{
    render() {
        return <tbody>
            <tr>
                <td colSpan="6"></td>
                <td>
                    <CharacterLinks
                        altStyle={true}
                        buttons={['new']}
                        />
                </td>
            </tr>
        </tbody>
    }
};

class CharactersRow extends LazyComponent
{
    render() {
        return <tr
                data-name={this.props.name}>
            <td>{this.props.name}</td>
            <td>{this.props.gender} {this.props.race}</td>
            <td>Level {this.props.level} {this.props.class}</td>
            <td>{this.props.alignment}</td>
            <td>
                <UserLabel
                    user_id={this.props.user_id}
                    />
            </td>
            <td>
                <Progress
                    value={this.props.xp_progress}
                    total={this.props.xp_level}
                    color={"good"}
                    labels={[
                        {
                            value: 0.75,
                            label: this.props.xp_progress
                                + " / "
                                + this.props.xp_level
                        },
                        {
                            value: 0.33,
                            label: this.props.xp_progress
                        },
                        {
                            value: 0.10,
                            label: this.props.level
                        }
                    ]}
                    />
            </td>
            <td>{this.props.id != null
                ? <CharacterLinks
                    altStyle={true}
                    buttons={['view', 'edit', 'download']}
                    character_id={this.props.id}
                    />
                : null
            }</td>
        </tr>
    }
};

class CharactersTable extends LazyComponent
{
    shouldDisplayRow(pattern, character) {
        return (
            (character.name && character.name.search(pattern) >= 0)
            || (character.class && character.class.search(pattern) >= 0)
            || (character.race && character.race.search(pattern) >= 0)
        );
    }

    render() {
        if (this.props.characters == null) {
            return null;
        }
        let pattern = new RegExp(this.props.search || '', "i");

        return <div>
            <h2 className="icon fa-user-secret">Character list</h2>
            <table className="nice-table condensed bordered responsive">
                <CharactersHeader />
                <tbody key="tbody">
                    {_.map(this.props.characters, (character) => {
                        return this.shouldDisplayRow(pattern, character)
                            ? <CharactersRow
                                key={character.id}
                                {...character}
                                />
                            : null;
                    })}
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
    ['search']
);
