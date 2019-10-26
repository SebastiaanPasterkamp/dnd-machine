import React from 'react';
import PropTypes from 'prop-types';
import {
    concat,
    difference,
    find,
    includes,
    map,
} from 'lodash/fp';

import BaseSelect from './BaseSelect.jsx';
import utils, { memoize } from '../utils.jsx';

class MultiSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
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
            items, selected, emptyLabel,
        } = this.props;

        if (selected.length == 1) {
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

    renderItem(item) {
        const {
            selected,
            isDisabled,
        } = this.props;
        const id = this.getItemValue(item);
        const checked = includes(id, selected);
        const disabled = isDisabled(item);
        const style = utils.makeStyle({
            info: checked,
            disabled,
        });

        return (
            <li
                key={id}
                data-value={id}
                className={style}
            >
                <label>
                    <input
                        type="checkbox"
                        checked={ checked }
                        disabled={ disabled }
                        onChange={ disabled ? null : (
                            checked
                            ? this.onDel(id)
                            : this.onAdd(id)
                        ) }
                    />
                    { this.getItemText(item) }
                </label>
            </li>
        );
    }

    render() {
        const {
            items,
            selected,
            setState,
            isDisabled,
            emptyLabel,
            ...props,
        } = this.props;

        return (
            <BaseSelect
                label={ this.getLabel() }
                closeOnClick={ false }
                {...props}
            >
                {map(item => this.renderItem(item))(items)}
            </BaseSelect>
        );
    }
}

MultiSelect.defaultProps = {
    emptyLabel: "0 selected",
    isDisabled: (item) => item.disabled,
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
};

export default MultiSelect;
