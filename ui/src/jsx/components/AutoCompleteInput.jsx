import React from 'react';
import PropTypes from 'prop-types';
import {
    isObject,
    filter,
    map,
} from 'lodash/fp';

import utils, { memoize } from '../utils.jsx';

import InputField from './InputField.jsx';
import MarkdownTextField from './MarkdownTextField';

export class AutoCompleteInput extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            hover: false,
        };
        this.memoize = memoize.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onFocus = this.onFocus.bind(this);
    }

    onBlur() {
        this.setState({focus: false});
    }

    onFocus() {
        this.setState({focus: true});
    }

    onMouseEnter() {
        this.setState({hover: true});
    }

    onMouseLeave() {
        this.setState({hover: false});
    }

    selectItem(item) {
        const { id, name } = isObject(item) ? item : {id: item, name: item};
        return this.memoize(id, (e) => {
            const { setState } = this.props;
            if (e && 'preventDefault' in e) {
                e.preventDefault();
            }
            setState(name);
        });
    }

    render() {
        const { items, markup, value, ...rest } = this.props;
        const { focus, hover } = this.state;
        const Component = markup ? MarkdownTextField : InputField;

        const search = value.toLowerCase();
        const filtered = filter(
            item => (isObject(item) ? item.name : item)
                .toLowerCase()
                .includes(search)
        )(items);

        const dropStyle = utils.makeStyle({
            shown: (focus || hover) && filtered.length
        }, ['dropdown-menu']);

        return (
            <div className="nice-dropdown nice-form-control">
                <Component
                    {...rest}
                    value={value}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
                    onEnter={filtered.length ? this.selectItem(filtered[0]) : null}
                />
                <ul
                    className={dropStyle}
                    onMouseEnter={this.onMouseEnter}
                    onMouseLeave={this.onMouseLeave}
                >
                    {map(
                        item => (
                            <li key={item.id}>
                                <a
                                    href="#"
                                    onClick={this.selectItem(item)}
                                >
                                    {item.name}
                                </a>
                            </li>
                        )
                    )(
                        map(
                            item => isObject(item)
                                ? item
                                : { id: item, name: item }
                        )(filtered)
                    )}
                </ul>
            </div>
        );
    }
}

AutoCompleteInput.defaultProps = {
    setState: (value) => {
        console.log(['AutoCompleteInput', value]);
    }
};

AutoCompleteInput.propTypes = {
    setState: PropTypes.func,
    value: PropTypes.any,
    items: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.number,
                ]),
                name: PropTypes.string,
                description: PropTypes.string,
            })
        ])
    ).isRequired,
    disabled: PropTypes.bool,
    markup: PropTypes.bool,
};

AutoCompleteInput.defaultProps = {
    value: '',
    disabled: false,
    markup: false,
};

export default AutoCompleteInput;
