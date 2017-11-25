import React from 'react';

import ItemStore from '../mixins/ItemStore.jsx';

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
                            label: this.props.xp
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
    filterRow(pattern, row) {
        return (
            (row.name && row.name.search(pattern) >= 0)
            || (row.class && row.class.search(pattern) >= 0)
            || (row.race && row.race.search(pattern) >= 0)
        );
    }

    render() {
        let pattern = new RegExp(this.props.search, "i");

        return <div>
            <h2 className="icon fa-user-secret">Characters</h2>
            <table className="nice-table condensed bordered responsive">
                <CharactersHeader />
                <tbody key="tbody">
                    {this.props.character
                        .filter((row) => this.filterRow(pattern, row))
                        .map((row) => {
                            return <CharactersRow key={row.id} {...row}/>
                        })
                    }
                </tbody>
                <CharactersFooter />
            </table>
        </div>;
    }
}

export default ItemStore(CharactersTable, ['character', 'search']);
