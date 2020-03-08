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

    onClick(item) {
        const { id } = item || {};
        return this.memoize(id, () => {
            const { objects, setState } = this.props;
            if (objects) {
                setState(item);
            } else {
                setState(id);
            }
        });
    }

    getLabel() {
        const {
            items,
            selected,
            objects,
            renderEmpty,
            emptyLabel,
        } = this.props;

        if (renderEmpty && selected === null) {
            return renderEmpty;
        }

        const { name } = objects
            ? (selected || {})
            : (
                find({ id: selected }, items)
                || find({ name: selected }, items)
                || { name: emptyLabel }
            );

        return name;
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
            defaultValue,
            ...props,
        } = this.props;

        const { name: current = null } = objects
            ? (selected || {})
            : { name : selected };

        return (
            <BaseSelect
                label={ this.getLabel() }
                {...props}
            >
                {renderEmpty ? (
                    <SelectItem
                        id={null}
                        name={renderEmpty}
                        selected={current === null}
                        onClick={this.onClick(null)}
                    />
                ) : null}
                {map(item => {
                    const { id, name } = item;
                    return (
                        <SelectItem
                            key={id}
                            id={id}
                            name={name}
                            selected={current === id}
                            disabled={isDisabled(item)}
                            onClick={this.onClick(item)}
                        />
                    );
                })(items)}
            </BaseSelect>
        );
    }
}

SingleSelect.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.bool,
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]).isRequired,
            name: PropTypes.string.isRequired,
        }),
    ]),
    objects: PropTypes.bool,
    setState: PropTypes.func.isRequired,
    isDisabled: PropTypes.func.isRequired,
    emptyLabel: PropTypes.string,
    renderEmpty: PropTypes.string,
};

SingleSelect.defaultProps = {
    isDisabled: (item) => item.disabled,
    selected: null,
    objects: false,
    defaultValue: null,
    renderEmpty: null,
    setState: (selected) => {
        console.log(['SingleSelect', selected]);
    },
};

export default SingleSelect;
