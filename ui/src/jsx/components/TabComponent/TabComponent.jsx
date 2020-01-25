import React from 'react';
import PropTypes from 'prop-types';
import {
    isFunction,
} from 'lodash/fp';

import './sass/_tab-component.scss';

import utils, { memoize } from '../../utils';

import Tab from './components/Tab';

export class TabComponent extends React.Component
{
    constructor(props) {
        super(props);
        const { activeTab = 0 } = props;
        this.state = { activeTab };
        this.memoize = memoize.bind(this);
    }

    getTabConfig(index) {
        const { tabConfig } = this.props;
        return isFunction(tabConfig)
            ? tabConfig(index)
            : tabConfig[index];
    }

    componentDidMount() {
        const { children, activeTab, tabConfig } = this.props;
        if (activeTab !== undefined) {
            this.setState({ activeTab });
            return;
        }

        let selectedTab = 0;
        React.Children.forEach(
            children,
            (child, index) => {
                const { active } = this.getTabConfig(index);
                if (active) {
                    selectedTab = index;
                }
            }
        );

        if (selectedTab != this.state.activeTab) {
            this.switchTab(selectedTab)();
        }
    }

    switchTab(index) {
        return this.memoize(`tab-${index}`, e => {
            const { onTabChange } = this.props;
            if (e) {
                e.preventDefault();
            }
            this.setState(
                { activeTab: index },
                () => {
                    if (onTabChange) {
                        onTabChange(index);
                    }
                }
            );
        });
    }

    render() {
        const { activeTab: stateTab } = this.state;
        const {
            children, className, mountAll, activeTab = stateTab,
        } = this.props;
        const style = utils.makeStyle({}, [
            'nice-tabs-wrapper',
            'tab-component',
            className,
        ]);

        return (
            <div className={style}>
                <ul className="nice-tabs bold">
                    {React.Children.map(
                        children,
                        (child, index) => (
                            <Tab
                                key={`tab-${index}`}
                                {...this.getTabConfig(index)}
                                active={index === stateTab}
                                onSelect={this.switchTab(index)}
                            />
                        )
                    )}
                </ul>
                <ul className="nice-tab-content">
                    {React.Children.map(children, (child, index) => (
                        (mountAll || index == activeTab) ? (
                            <li
                                key={`child-${index}`}
                                className={utils.makeStyle({
                                    current: index == activeTab,
                                })}
                            >
                                {child}
                            </li>
                        ) : null
                    ))}
                </ul>
            </div>
        );
    }
}

TabComponent.propTypes = {
    children: PropTypes.node.isRequired,
    tabConfig: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.func,
    ]).isRequired,
    activeTab: PropTypes.number,
    mountAll: PropTypes.bool,
    onTabChange: PropTypes.func,
};

export default TabComponent;
