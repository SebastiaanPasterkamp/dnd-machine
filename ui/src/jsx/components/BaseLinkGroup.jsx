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
        let classNames = ['nice-btn-alt', 'cursor-pointer'];
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
        return <Link
            key={button}
            to={props.link}
            className={classNames.join(' ')}>
            {props.label}
        </Link>;
    }

    render() {
        let buttons = _.intersection(
            this.props.buttons,
            this.getAllowed()
        );
        return <div className="nice-btn-group">
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
    buttons: ['view', 'edit', 'host'],
};

export default BaseLinkGroup;
