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
        let style = utils.makeStyle({
            "shown": this.state.shown,
        }, ["dropdown-menu"]);

        return <div className="nice-dropdown nice-form-control">
            {this.renderButton()}
            <ul
                    className={style}
                    onClick={this.props.closeOnClick
                        ? () => this.onClick()
                        : null
                    }>
                {this.props.heading
                    ? <li className="heading">
                        <span>{this.props.heading}</span>
                    </li>
                    : null
                }
                {this.props.description
                    ? <li className="description">
                        <span>{this.props.description}</span>
                    </li>
                    : null
                }
                {this.props.children}
            </ul>
        </div>;
    }
}

BaseSelect.defaultProps = {
    closeOnClick: true,
};

export default onClickOutside(BaseSelect);