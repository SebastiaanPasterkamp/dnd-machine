import React from 'react';
import PropTypes from 'prop-types';
import {
    concat,
    difference,
    find,
    includes,
    map,
} from 'lodash/fp';

import BaseSelect from '../BaseSelect';
import utils, { memoize } from '../../utils';

import SelectItem from './components/SelectItem';

class MultiSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {};
        this.memoize = memoize.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        const { defaultValue, selected, setState } = props;
        if (!selected.length && defaultValue.length) {
            setState(defaultValue);
        }
        return null;
    }

    getItemValue(item) {
        const { code, id, name } = item;
        if (code !== undefined) {
            return code;
        }
        if (id !== undefined) {
            return id;
        }
        return name;
    }

    getItemText(item) {
        const { label, name } = item;
        if (label !== undefined) {
            return label;
        }
        return name;
    }

    onAdd(id) {
        return this.memoize(`add-${id}`, () => {
            const { selected, setState } = this.props;
            setState(concat(selected, [id]));
        });
    }

    onDel(id) {
        return this.memoize(`del-${id}`, () => {
            const { selected, setState } = this.props;
            setState(difference(selected, [id]));
        });
    }

    getLabel() {
        const {
            items, selected, renderEmpty, emptyLabel,
        } = this.props;

        if (selected.length == 1) {
            if (renderEmpty && selected[0] === null) {
                return renderEmpty;
            }
            const current = find(
                (item) => this.getItemValue(item) == selected[0]
            )(items);

            if (current) {
                return this.getItemText(current);
            }
        }

        if (selected.length > 1) {
            return selected.length + ' selected';
        }

        return emptyLabel;
    }

    render() {
        const {
            items,
            selected,
            setState,
            isDisabled,
            emptyLabel,
            renderEmpty,
            ...props,
        } = this.props;

        return (
            <BaseSelect
                label={ this.getLabel() }
                closeOnClick={ false }
                {...props}
            >
                {renderEmpty ? (
                    <SelectItem
                        id={null}
                        label={renderEmpty}
                        checked={includes(null, selected)}
                        onSelect={this.onAdd(null)}
                        onDeselect={this.onDel(null)}
                    />
                ) : null}
                {map(item => {
                    const id = this.getItemValue(item);
                    return (
                        <SelectItem
                            key={id}
                            id={id}
                            label={this.getItemText(item)}
                            checked={includes(id, selected)}
                            disabled={isDisabled(item)}
                            onSelect={this.onAdd(id)}
                            onDeselect={this.onDel(id)}
                        />
                    );
                })(items)}
            </BaseSelect>
        );
    }
}

MultiSelect.defaultProps = {
    emptyLabel: "0 selected",
    isDisabled: (item) => item.disabled,
    selected: [],
    defaultValue: [],
    renderEmpty: null,
    setState: (selected) => {
        console.log(['MultiSelect', selected]);
    }
};

MultiSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.arrayOf(PropTypes.any).isRequired,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
    renderEmpty: PropTypes.string,
};

export default MultiSelect;
