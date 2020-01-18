import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    isNil,
    map,
} from 'lodash/fp';

import BaseSelect from '../BaseSelect';
import utils, { memoize } from '../../utils';

import SelectItem from './components/SelectItem';

class SingleSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
        this.memoize = memoize.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { defaultValue, selected, setState } = props;
        if (isNil(selected) && !isNil(defaultValue)) {
            setState(defaultValue);
        }
        return null;
    }

    getItemValue(item) {
        const { code, id, name, label } = item;
        if (code !== undefined) {
            return code;
        }
        if (id !== undefined) {
            return id;
        }
        if (name !== undefined) {
            return name;
        }
        return label;
    }

    getItemText(item) {
        const { label, name } = item;
        if (label !== undefined) {
            return label;
        }
        return name;
    }

    onClick(id) {
        return this.memoize(id, () => {
            const { setState } = this.props;
            setState(id);
        });
    }

    getLabel() {
        const {
            items,
            selected,
            renderEmpty,
            emptyLabel,
        } = this.props;

        if (renderEmpty && selected === null) {
            return renderEmpty;
        }

        const item = (
            find({code: selected}, items)
            || find({id: selected}, items)
            || find({name: selected}, items)
            || find({label: selected}, items)
        );

        if (isNil(item)) {
            return emptyLabel;
        }

        return this.getItemText(item);
    }

    render() {
        const {
            items,
            selected,
            setState,
            isDisabled,
            emptyLabel,
            renderEmpty,
            defaultValue,
            ...props,
        } = this.props;

        return (
            <BaseSelect
                label={ this.getLabel() }
                {...props}
            >
                {renderEmpty ? (
                    <SelectItem
                        id={null}
                        label={renderEmpty}
                        selected={null === selected}
                        onClick={this.onClick(null)}
                    />
                ) : null}
                {map(item => {
                    const id = this.getItemValue(item);
                    return (
                        <SelectItem
                            key={id}
                            id={id}
                            label={this.getItemText(item)}
                            selected={id === selected}
                            disabled={isDisabled(item)}
                            onClick={this.onClick(id)}
                        />
                    );
                })(items)}
            </BaseSelect>
        );
    }
}

SingleSelect.defaultProps = {
    isDisabled: (item) => item.disabled,
    selected: null,
    defaultValue: null,
    renderEmpty: null,
    setState: (selected) => {
        console.log(['SingleSelect', selected]);
    },
};

SingleSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.any,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
    renderEmpty: PropTypes.string,
};

export default SingleSelect;
