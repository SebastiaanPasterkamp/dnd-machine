import React from 'react';
import PropTypes from 'prop-types';

import BaseFilterListDialog from '../BaseFilterListDialog';
import CharacterRow from './components/CharacterRow.jsx';
import InputField from '../InputField.jsx';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper.jsx';

import './sass/_character-picker.scss';


export class CharacterPicker extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            currentPick: null,
            search: '',
        };
        this.onDone = this.onDone.bind(this);
        this.onFilter = this.onFilter.bind(this);
        this.onPick = this.onPick.bind(this);
        this.onSearch = this.onSearch.bind(this);
    }

    onDone() {
        const { onDone } = this.props;
        const { currentPick } = this.state;
        onDone(currentPick);
    }

    onFilter(character) {
        const { onFilter } = this.props;
        const { search } = this.state;
        if (onFilter !== undefined
            && !onFilter(character, search)
        ) {
            return false;
        }

        if (!search) {
            return true;
        }

        const pattern = search.toLowerCase();
        return (
            character.name.toLowerCase().match(pattern)
            || character.class.toLowerCase().match(pattern)
            || character.race.toLowerCase().match(pattern)
            || character.background.toLowerCase().match(pattern)
        );
    }

    onPick(currentPick) {
        this.setState({ currentPick });
    }

    onSearch(search) {
        this.setState({
            search: search || '',
        });
    }

    render() {
        const {
            characters,
            onCancel,
            onDone,
            onFilter,
            ...props
        } = this.props
        const { currentPick, search } = this.state;

        return (
            <BaseFilterListDialog
                items={characters}
                label="Pick a Character"
                className="character-picker"
                rowComponent={CharacterRow}
                onCancel={onCancel}
                onDone={this.onDone}
                onFilter={this.onFilter}
                onPick={this.onPick}
                currentPick={currentPick}
                {...props}
            >
                <InputField
                    placeholder="Filter..."
                    value={search}
                    setState={this.onSearch}
                />
            </BaseFilterListDialog>
        );
    }
};

CharacterPicker.propTypes = {
    onDone: PropTypes.func.isRequired,
    onFilter: PropTypes.func,
    onCancel: PropTypes.func,
    characters: PropTypes.object,
};

CharacterPicker.defaultProps = {
    characters: {},
    onCancel: null,
};

export default ObjectDataListWrapper(
    CharacterPicker,
    {characters: {type: 'character'}}
);
