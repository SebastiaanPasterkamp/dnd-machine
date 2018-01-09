import React from 'react';
import LazyComponent from '../components/LazyComponent.jsx';

import _ from 'lodash';
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
        const tabcfg = _.isFunction(this.props.tabConfig)
            ? this.props.tabConfig(index)
            : this.props.tabConfig[index];
        const tabStyle = utils.makeStyle({
                [tabcfg.color || '']: (tabcfg.color || false)
                    && !tabcfg.disabled || false,
                muted: tabcfg.disabled || false,
                current: index == this.state.activeTab,
            }
        );
        const linkStyle = utils.makeStyle({
                icon: 'icon' in tabcfg,
                [tabcfg.icon || '']: 'icon' in tabcfg,
                'cursor-not-allowed': tabcfg.disabled || false,
                'cursor-pointer': !(tabcfg.disabled || false),
            }
        );

        return <li
                key={"tab-" + index}
                className={tabStyle}
                >
            <a
                    className={linkStyle}
                    onClick={
                        (
                            index == this.state.activeTab
                            || (tabcfg.disabled || false)
                        )
                        ? null
                        : () => this.switchTab(index)
                    }
                    >
                {tabcfg.label}
            </a>
        </li>;
    }

    render() {
        return <div className="nice-tabs-wrapper">
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