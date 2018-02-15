import React from 'react';
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
        const size = React.Children.count(this.props.children);
        let activeTab = 0;
        React.Children.forEach(this.props.children, (child, index) => {
            const tabcfg = _.isFunction(this.props.tabConfig)
                ? this.props.tabConfig(index)
                : this.props.tabConfig[index];
            if (tabcfg.active || false) {
                activeTab = index;
            }
        });

        if (activeTab != this.state.activeTab) {
            this.switchTab(activeTab);
        }
    }

    switchTab(index) {
        this.setState({
            activeTab: index
        }, () => {
            if (this.props.onTabChange) {
                this.props.onTabChange(index);
            }
        });
    }

    renderTab(index) {
        const tabConfig = this.props.tabConfig;
        const isActive = (index == this.state.activeTab);
        const tabcfg = _.isFunction(tabConfig)
            ? tabConfig(index)
            : tabConfig[index];
        const tabStyle = utils.makeStyle({
            [tabcfg.color || '']: tabcfg.color && !tabcfg.disabled,
            muted: tabcfg.disabled,
            current: isActive,
        });
        const linkStyle = utils.makeStyle({
                icon: 'icon' in tabcfg,
                [tabcfg.icon || '']: 'icon' in tabcfg,
                'cursor-not-allowed': tabcfg.disabled || false,
                'cursor-pointer': !tabcfg.disabled,
            }
        );

        return <li
                key={"tab-" + index}
                className={tabStyle}
                >
            <a
                    className={linkStyle}
                    onClick={(e) => {
                        e.preventDefault();
                        if (isActive || tabcfg.disabled) {
                            return;
                        }
                        this.switchTab(index);
                    }}
                    >
                {tabcfg.label}
            </a>
        </li>;
    }

    render() {
        return <div className="nice-tabs-wrapper tab-component">
            <ul className="nice-tabs bold">
                {React.Children.map(
                    this.props.children, (child, index) => {
                        return this.renderTab(index);
                    }
                )}
            </ul>
            <ul className="nice-tab-content">
                <li className="current">
                    {React.Children.map(
                        this.props.children, (child, index) => {
                            if (index == this.state.activeTab) {
                                return child;
                            }
                        }
                    )}
                </li>
            </ul>
        </div>;
    }
}

export default TabComponent;