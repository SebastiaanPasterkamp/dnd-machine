import React from 'react';
import PropTypes from 'prop-types';

import LazyComponent from '../LazyComponent.jsx';
import SingleSelect from '../SingleSelect.jsx';

class SelectPropertySelect extends LazyComponent
{
    componentDidMount() {
        this.props.onChange(
            this.props.path,
            this.props.current
        );
    }

    componentWillUnmount() {
        this.props.onChange(
            this.props.path,
            undefined
        );
    }

    onChange(value) {
        this.props.onChange(
            this.props.path,
            value
        );
    }

    render() {
        const { hidden = false, items, current } = this.props;

        if (hidden) {
            return null;
        }

        return <SingleSelect
            className="small"
            items={items}
            setState={(value) => this.onChange(value)}
            selected={current}
            emptyLabel="Please select"
            />;
    }
};

SelectPropertySelect.propTypes = {
    path: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    current: PropTypes.any,
    hidden: PropTypes.bool,
};

export default SelectPropertySelect;
