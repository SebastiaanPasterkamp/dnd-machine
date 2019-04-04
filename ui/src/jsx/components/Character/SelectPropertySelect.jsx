import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import SingleSelect from '../SingleSelect.jsx';

import CharacterEditorWrapper from '../../hocs/CharacterEditorWrapper.jsx';
import ListsToItemsWrapper from '../../hocs/ListsToItemsWrapper.jsx';

export class SelectPropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.current
        );
    }

    render() {
        const {
            onChange,
            hidden,
            items,
            current,
        } = this.props;

        if (hidden) {
            return null;
        }

        return <SingleSelect
            className="small"
            items={items}
            setState={onChange}
            selected={current}
            emptyLabel="Please select"
            />;
    }
};

SelectPropertySelect.propTypes = {
    type: PropTypes.oneOf(['select']).isRequired,
    onChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    current: PropTypes.any,
    hidden: PropTypes.bool,
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(SelectPropertySelect),
    'items'
);
