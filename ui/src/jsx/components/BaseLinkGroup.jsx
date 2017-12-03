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
                if ('action' in props) {
                    return <a
                        key={button}
                        onClick={props.action}
                        className={"nice-btn-alt cursor-pointer icon fa-" + props.icon}>
                        {props.label}
                    </a>;
                }
                return <Link
                    key={button}
                    to={props.link}
                    className={"nice-btn-alt icon fa-" + props.icon}>
                    {props.label}
                </Link>;
            })}
        </div>;
    }
}

BaseLinkGroup.defaultProps = {
    buttons: ['view', 'edit', 'host'],
};

export default BaseLinkGroup;
