import React from 'react';
import PropTypes from 'prop-types';

import BaseFilterListDialog from '../BaseFilterListDialog';
import MonsterRow from './components/MonsterRow.jsx';
import InputField from '../InputField.jsx';
import ObjectDataListWrapper from '../../hocs/ObjectDataListWrapper.jsx';

import './sass/_monster-picker.scss';


export class MonsterPicker extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            currentPick: null,
            search: '',
        };
    }

    onDone = () => {
        const { onDone } = this.props;
        const { currentPick } = this.state;
        onDone(currentPick);
    }

    onFilter = (monster) => {
        const { onFilter } = this.props;
        const { search } = this.state;
        if (onFilter !== undefined
            && !onFilter(monster, search)
        ) {
            return false;
        }

        if (!search) {
            return true;
        }

        const {
            name = '',
            description = '',
            type = '',
        } = monster;

        const pattern = search.toLowerCase();
        return (
            name.toLowerCase().match(pattern)
            || description.toLowerCase().match(pattern)
            || type.toLowerCase().match(pattern)
        );
    }

    onPick = (currentPick) => {
        this.setState({ currentPick });
    }

    onSearch = (search) => this.setState({
        search: search || '',
    });

    render() {
        const {
            monsters,
            onCancel,
            onDone,
            onFilter,
            ...props
        } = this.props
        const { currentPick, search } = this.state;

        return (
            <BaseFilterListDialog
                items={monsters}
                label="Pick a Monster"
                className="monster-picker"
                rowComponent={MonsterRow}
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

MonsterPicker.propTypes = {
    monsters: PropTypes.object,
    onCancel: PropTypes.func,
    onDone: PropTypes.func.isRequired,
    onFilter: PropTypes.func,
};

MonsterPicker.defaultProps = {
    monsters: {},
    onCancel: null,
};

export default ObjectDataListWrapper(
    MonsterPicker,
    {monsters: {type: 'monster'}}
);
