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
        this.props.setState(item.label);
    }

    render() {
        const { items, value, ...props } = this.props;
        const { focus, hover } = this.state;

        const filtered = _.filter(items, item => (
            item.label.match(value)
        ));

        const dropStyle = utils.makeStyle({
            shown: (focus || hover) && filtered.length
        }, ['dropdown-menu']);

        return <div className="nice-dropdown">
            <InputField
                {...props}
                value={value}
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
                    <li key={item.code}>
                        <a
                            href="#"
                            onClick={(e) => this.selectItem(item, e)}
                        >
                            {item.label}
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
    items: PropTypes.arrayOf(
        PropTypes.shape({
            code: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
            ]),
            label: PropTypes.string,
            description: PropTypes.string,
        })
    ),
    disabled: PropTypes.bool,
};

export default AutoCompleteInput;
