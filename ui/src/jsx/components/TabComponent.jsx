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
        const { children, tabConfig } = this.props;

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
        this.setState({
            activeTab: index
        }, () => {
            if (this.props.onTabChange) {
                this.props.onTabChange(index);
            }
        });
    }

    renderTab(index) {
        const { tabConfig } = this.props;
        const isActive = (index == this.state.activeTab);
        const tabcfg = _.isFunction(tabConfig)
            ? tabConfig(index)
            : tabConfig[index];
        const tabStyle = utils.makeStyle({
            [tabcfg.color || '']: (
                tabcfg.color
                && !tabcfg.disabled
            ),
            muted: tabcfg.disabled,
            current: isActive,
        });
        const linkStyle = utils.makeStyle({
            icon: 'icon' in tabcfg,
            [tabcfg.icon || '']: 'icon' in tabcfg,
            'cursor-not-allowed': tabcfg.disabled,
            'cursor-pointer': !tabcfg.disabled,
        });

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
        const { children, className } = this.props;
        const style = utils.makeStyle({}, [
            'nice-tabs-wrapper', 'tab-component', className
        ]);

        return <div className={style}>
            <ul className="nice-tabs bold">
                {React.Children.map(
                    children,
                    (child, index) => this.renderTab(index)
                )}
            </ul>
            <ul className="nice-tab-content">
                <li className="current">
                {React.Children.map(
                    children,
                    (child, index) => (
                        index == this.state.activeTab
                        ? child
                        : null
                    )
                )}
                </li>
            </ul>
        </div>;
    }
}

export default TabComponent;