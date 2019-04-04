import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import '../../sass/_tab-component.scss';

import LazyComponent from '../components/LazyComponent.jsx';
import utils from '../utils.jsx';

export class TabComponent extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            activeTab: 0
        };
    }

    componentDidMount() {
        const {
            children,
            tabConfig,
        } = this.props;

        let activeTab = 0;
        React.Children.forEach(
            children,
            (child, index) => {
                const tabcfg = _.isFunction(tabConfig)
                    ? tabConfig(index)
                    : tabConfig[index];
                if (tabcfg.active) {
                    activeTab = index;
                }
            }
        );

        if (activeTab != this.state.activeTab) {
            this.switchTab(activeTab);
        }
    }

    switchTab(index) {
        const {
            onTabChange,
        } = this.props;
        this.setState(
            {activeTab: index},
            () => onTabChange && onTabChange(index)
        );
    }

    renderTab(index) {
        const {
            tabConfig,
        } = this.props;
        const isActive = (index == this.state.activeTab);
        const {
            color,
            disabled,
            icon,
            label,
        } = _.isFunction(tabConfig)
            ? tabConfig(index)
            : tabConfig[index];
        const tabStyle = utils.makeStyle({
            [color]: (color && !disabled),
            muted: disabled,
            current: isActive,
        }, ['tab-component__tab']);
        const linkStyle = utils.makeStyle({
            icon: icon,
            [icon]: icon,
            'cursor-not-allowed': disabled,
            'cursor-pointer': !disabled,
        });

        return <li
            key={"tab-" + index}
            className={tabStyle}
        >
            <a
                className={linkStyle}
                onClick={!(isActive || disabled)
                    ? e => {
                        e.preventDefault();
                        this.switchTab(index);
                    }
                    : null
                }
            >
                {label}
            </a>
        </li>;
    }

    render() {
        const {
            children,
            className,
            mountAll,
        } = this.props;
        const {
            activeTab,
        } = this.state;
        const style = utils.makeStyle({}, [
            'nice-tabs-wrapper',
            'tab-component',
            className
        ]);

        return <div className={style}>
            <ul className="nice-tabs bold">
                {React.Children.map(
                    children,
                    (child, index) => this.renderTab(index)
                )}
            </ul>
            <ul className="nice-tab-content">
                {React.Children.map(children, (child, index) => (
                    (mountAll || index == activeTab) &&
                    <li
                        className={
                            index == activeTab
                            ? "current"
                            : null
                        }
                        >
                        {child}
                    </li>
                ))}
            </ul>
        </div>;
    }
}

TabComponent.propTypes = {
    children: PropTypes.node.isRequired,
    tabConfig: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
    ]).isRequired,
    mountAll: PropTypes.bool,
    onTabChange: PropTypes.func,
};

export default TabComponent;