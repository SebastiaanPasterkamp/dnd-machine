import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../../LazyComponent';
import SingleSelect from '../../SingleSelect';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';
import ListsToItemsWrapper from '../../../hocs/ListsToItemsWrapper';

export class SelectPropertySelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        const { current, onChange } = this.props;
        if (current !== undefined) {
            onChange(this.props.current);
        }
    }

    onChange(current) {
        const { onChange, setState } = this.props;
        setState({ current });
        onChange(current);
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
                setState={this.onChange}
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
    onChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    current: PropTypes.any,
    hidden: PropTypes.bool,
};

export default ListsToItemsWrapper(
    CharacterEditorWrapper(
        SelectPropertySelect,
        {
            current: true,
        }
    ),
    'items'
);
