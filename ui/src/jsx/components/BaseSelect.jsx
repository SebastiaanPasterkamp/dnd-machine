import React from 'react';
import _ from 'lodash';
import onClickOutside from 'react-onclickoutside';

import '../../sass/_base-select.scss';

import LazyComponent from '../components/LazyComponent.jsx';
import utils from '../utils.jsx';

export class BaseSelect extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            shown: false
        };
    }

    handleClickOutside() {
        this.setState({
            shown: false
        });
    }

    onToggle() {
        this.setState({
            shown: !this.state.shown
        });
    }

    onClick() {
        this.setState({
            shown: false
        });
    }

    renderButton() {
        return <button
                className="nice-btn"
                onClick={() => this.onToggle()}>
            {this.props.label}
            <i className="icon fa-angle-down"></i>
        </button>
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

        const divStyle = utils.makeStyle({}, [
            "nice-dropdown",
            "nice-form-control",
            className,
        ]);
        const ulStyle = utils.makeStyle({
            "shown": this.state.shown,
        }, ["dropdown-menu"]);

        return <div className={divStyle} {...props}>
            {this.renderButton()}
            <ul
                    className={ulStyle}
                    onClick={closeOnClick
                        ? () => this.onClick()
                        : null
                    }>
                {heading
                    ? <li className="heading">
                        <span>{heading}</span>
                    </li>
                    : null
                }
                {description
                    ? <li className="description">
                        <span>{description}</span>
                    </li>
                    : null
                }
                {children}
            </ul>
        </div>;
    }
}

BaseSelect.defaultProps = {
    closeOnClick: true,
};

export default onClickOutside(BaseSelect);
