import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import './sass/_base-select.scss';

import utils from '../../utils';

import SelectButton from './components/SelectButton';

export class BaseSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            shown: false,
        };
        this.onToggle = this.onToggle.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    handleClickOutside() {
        this.setState({ shown: false });
    }

    onToggle() {
        const { shown } = this.state;
        this.setState({ shown: !shown });
    }

    onClick() {
        const { closeOnClick } = this.props;
        if (closeOnClick) {
            this.setState({ shown: false });
        }
    }

    render() {
        const {
            label,
            closeOnClick,
            heading,
            className,
            description,
            children,
            /* onClickOutside */
            eventTypes,
            enableOnClickOutside,
            disableOnClickOutside,
            outsideClickIgnoreClass,
            stopPropagation,
            preventDefault,
            ...props
        } = this.props;
        const { shown } = this.state;

        const divStyle = utils.makeStyle({}, [
            "nice-dropdown",
            "nice-form-control",
            className,
        ]);
        const ulStyle = utils.makeStyle(
            { shown },
            ["dropdown-menu"]
        );

        return (
            <div className={divStyle} {...props}>
                <SelectButton
                    label={label}
                    onToggle={this.onToggle}
                />
                <ul
                    className={ulStyle}
                    onClick={this.onClick}
                >
                    {heading ? (
                        <li className="heading">
                            <span>{heading}</span>
                        </li>

                    ) : null}
                    {description ? (
                        <li className="description">
                            <span>{description}</span>
                        </li>
                    ) : null}
                    {children}
                </ul>
            </div>
        );
    }
}

BaseSelect.propTypes = {
    label: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    closeOnClick: PropTypes.bool,
    heading: PropTypes.string,
    className: PropTypes.string,
    description: PropTypes.string,
};

BaseSelect.defaultProps = {
    label: "",
    closeOnClick: true,
    heading: null,
    className: null,
    description: null,
};

export default onClickOutside(BaseSelect);
