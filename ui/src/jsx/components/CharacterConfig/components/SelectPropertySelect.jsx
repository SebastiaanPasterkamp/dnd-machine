import React from 'react';
import PropTypes from 'prop-types';

import SingleSelect from '../../SingleSelect';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';
import ListsToItemsWrapper from '../../../hocs/ListsToItemsWrapper';

export class SelectPropertySelect extends React.Component
{
    constructor(props) {
        super(props);
        this.onSetState = this.onSetState.bind(this);
    }

    onSetState(current) {
        const { setState } = this.props;
        setState({ current });
    }

    render() {
        const { hidden, items, current } = this.props;

        if (hidden) {
            return null;
        }

        return (
            <SingleSelect
                className="small"
                items={items}
                setState={this.onSetState}
                selected={current}
                emptyLabel="Please select"
            />
        );
    }
};

SelectPropertySelect.propTypes = {
    type: PropTypes.oneOf(['select']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    current: PropTypes.any,
    hidden: PropTypes.bool,
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(SelectPropertySelect),
    'items'
);
