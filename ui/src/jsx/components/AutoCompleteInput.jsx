import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import utils from '../utils.jsx';

import InputField from './InputField.jsx';
import LazyComponent from './LazyComponent.jsx';

export class AutoCompleteInput extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            hover: false,
        };
    }

    selectItem(item, e) {
        if (e && 'preventDefault' in e) {
            e.preventDefault();
        }
        this.props.setState(item.name);
    }

    render() {
        const { items, value, disabled, ...props } = this.props;
        const { focus, hover } = this.state;
        const filter = new RegExp(value, "i");

        const filtered = _.filter(
            items,
            ({ name = '' }) => name.match(filter)
        );

        const dropStyle = utils.makeStyle({
            shown: (focus || hover) && filtered.length
        }, ['dropdown-menu']);

        return <div className="nice-dropdown nice-form-control">
            <InputField
                {...props}
                value={value}
                disabled={disabled}
                onFocus={() => this.setState({focus: true})}
                onBlur={() => this.setState({focus: false})}
                onEnter={filtered.length
                    ? (e) => this.selectItem(filtered[0], e)
                    : null
                }
                />
            <ul
                className={dropStyle}
                onMouseEnter={() => this.setState({hover: true})}
                onMouseLeave={() => this.setState({hover: false})}
                >
                {_.map(filtered, item => (
                    <li key={item.id}>
                        <a
                            href="#"
                            onClick={(e) => this.selectItem(item, e)}
                        >
                            {item.name}
                        </a>
                    </li>
                ))}
            </ul>
        </div>;
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
        PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            name: PropTypes.string,
            description: PropTypes.string,
        })
    ).isRequired,
    disabled: PropTypes.bool,
};

export default AutoCompleteInput;
