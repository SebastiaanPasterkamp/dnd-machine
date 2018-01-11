import React from 'react';
import {Link} from 'react-router-dom';
import _ from 'lodash';

import LazyComponent from '../components/LazyComponent.jsx';

class BaseLinkGroup extends LazyComponent
{
    constructor(props) {
        super(props);
        this.buttonList = {};
    }

    getAllowed() {
        return [];
    }

    renderButton(button, props) {
        let classNames = [
            this.props.altStyle ? 'nice-btn-alt' : 'nice-btn',
            'cursor-pointer'
        ];
        if ('icon' in props) {
            classNames = classNames.concat(['icon', 'fa-' + props.icon]);
        }
        if ('className' in props) {
            classNames = classNames.concat([props.className]);
        }
        if ('action' in props) {
            return <a
                key={button}
                onClick={props.action}
                className={classNames.join(' ')}>
                {props.label}
            </a>;
        }
        if ('download' in props) {
            return <a
                key={button}
                href={props.download}
                className={classNames.join(' ')}>
                {props.label}
            </a>;
        }
        return <Link
            key={button}
            to={props.link}
            className={classNames.join(' ')}>
            {props.label}
        </Link>;
    }

    render() {
        let buttons = this.getAllowed();
        if ('buttons' in this.props) {
            buttons = _.intersection(
                this.props.buttons,
                buttons
            );
        }

        let classNames = ['nice-btn-group'];
        if ('className' in this.props) {
            classNames = classNames.concat([this.props.className]);
        }

        return <div className={classNames.join(' ')}>
            {_.map(this.buttonList, (func, button) => {
                if (_.indexOf(buttons, button) < 0) {
                    return null;
                }
                let props = func();
                return this.renderButton(button, props);
            })}
            {_.map(this.props.extra, (props, button) => {
                return this.renderButton(button, props);
            })}
        </div>;
    }
}

BaseLinkGroup.defaultProps = {
    altStyle: false,
};

export default BaseLinkGroup;
