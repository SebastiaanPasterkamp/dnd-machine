import React from 'react';
import PropTypes from 'prop-types';
import {
    find,
    indexOf,
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

    onAdd(item) {
        const { id } = item || {};
        return this.memoize(`add-${id}`, () => {
            const { selected, objects, setState } = this.props;
            if (objects) {
                setState([...selected, item]);
            } else {
                setState([...selected, id]);
            }
        });
    }

    onDel(item) {
        const { id } = item || {};
        return this.memoize(`del-${id}`, () => {
            const { selected, objects, setState } = this.props;
            const needle = objects ? { id } : id;
            const index = indexOf(needle, selected);

            setState([
                ...selected.slice(0, index),
                ...selected.slice(index + 1),
            ]);
        });
    }

    getLabel() {
        const {
            items, selected, objects, renderEmpty, emptyLabel,
        } = this.props;

        if (selected.length == 1) {
            if (renderEmpty && selected[0] === null) {
                return renderEmpty;
            }
            if (objects) {
                return selected.name;
            }

            const { name } = find({ id: selected[0] }, items) || {};
            if (name !== undefined) {
                return name;
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
            objects,
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
                        name={renderEmpty}
                        checked={includes(null, selected)}
                        onSelect={this.onAdd(null)}
                        onDeselect={this.onDel(null)}
                    />
                ) : null}
                {map(item => {
                    const { id, name } = item;
                    return (
                        <SelectItem
                            key={id}
                            id={id}
                            name={name}
                            checked={includes(objects ? { id } : id, selected)}
                            disabled={isDisabled(item)}
                            onSelect={this.onAdd(item)}
                            onDeselect={this.onDel(item)}
                        />
                    );
                })(items)}
            </BaseSelect>
        );
    }
}

MultiSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.arrayOf(PropTypes.any).isRequired,
    objects: PropTypes.bool,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
    renderEmpty: PropTypes.string,
};

MultiSelect.defaultProps = {
    emptyLabel: "0 selected",
    isDisabled: (item) => item.disabled,
    selected: [],
    objects: false,
    defaultValue: [],
    renderEmpty: null,
    setState: (selected) => {
        console.log(['MultiSelect', selected]);
    }
};

export default MultiSelect;
