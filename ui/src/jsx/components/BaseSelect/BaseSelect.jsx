import React from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';

import './sass/_base-select.scss';

import utils from '../../utils';

import InputField from '../../components/InputField';
import SelectButton from './components/SelectButton';

export class BaseSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.state = {
            shown: false,
        };
        this.filter = null;
        this.filterRef = this.filterRef.bind(this);
        this.onToggle = this.onToggle.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    filterRef(filter) {
        this.filter = filter;
    }

    handleClickOutside() {
        this.setState({ shown: false });
    }

    onToggle() {
        const { shown } = this.state;
        this.setState(
            { shown: !shown },
            () => {
                if (this.state.shown && this.filter) {
                    this.filter.focus();
                }
            }
        );
    }

    onClick(e) {
        const { closeOnClick } = this.props;
        if (closeOnClick) {
            this.setState({ shown: false });
        }
    }

    stopPropagation(e) {
        if (e) {
            e.stopPropagation();
        }
    }

    render() {
        const {
            label,
            closeOnClick,
            heading,
            className,
            description,
            filter,
            onFilter,
            disabled,
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
                    disabled={disabled}
                    onToggle={this.onToggle}
                />
                <ul
                    className={ulStyle}
                    onClick={this.onClick}
                >
                    {onFilter ? (
                        <InputField
                            data-name="filter"
                            type="text"
                            value={filter}
                            placeholder="Filter..."
                            setState={onFilter}
                            onClick={this.stopPropagation}
                            inputRef={this.filterRef}
                        />
                    ) : null}
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
    filter: PropTypes.string,
    onFilter: PropTypes.func,
    disabled: PropTypes.bool,
};

BaseSelect.defaultProps = {
    label: "",
    closeOnClick: true,
    heading: null,
    className: null,
    description: null,
    filter: '',
    onFilter: null,
    disabled: false,
};

export default onClickOutside(BaseSelect);
