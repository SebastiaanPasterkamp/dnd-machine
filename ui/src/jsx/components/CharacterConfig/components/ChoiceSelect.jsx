import React from 'react';
import PropTypes from 'prop-types';
import {
    entries,
    filter,
    findIndex,
    flow,
    map,
} from 'lodash/fp';

import TabComponent from '../../TabComponent';

import CharacterEditorWrapper from '../hocs/CharacterEditorWrapper';

import CharacterConfig from '../CharacterConfig';
import MatchesFilters from '../utils/MatchesFilters';

export class ChoiceSelect extends React.Component
{
    constructor(props) {
        super(props);
        this.onTabChange = this.onTabChange.bind(this);
    }

    getTabs() {
        const { options, filter: filters } = this.props;
        return filter(
            (option) => !option.hidden && MatchesFilters(option, filters)
        )(options);
    }

    componentDidMount() {
        const { selected } = this.props;
        if (selected === null || selected === undefined) {
            this.onTabChange(0);
        }
    }

    onTabChange(index) {
        const { uuid, setState, selected } = this.props;
        const tabs = this.getTabs();
        if (
            index >= 0
            && index < tabs.length
            && tabs[index].uuid !== selected
        ) {
            setState({
                selected: tabs[index].uuid,
            });
        }
    }

    render() {
        const { selected } = this.props;
        const tabs = this.getTabs();

        if (!tabs.length) {
            return null;
        }

        const activeTab = findIndex({ uuid: selected }, tabs) || 0;

        return (
            <TabComponent
                tabConfig={tabs}
                activeTab={activeTab >= 0 ? activeTab : 0}
                onTabChange={this.onTabChange}
            >
                {flow(entries, map(
                    ([index, tab]) => (
                        <CharacterConfig
                            key={ index }
                            config={ [tab] }
                        />
                    )
                ))(tabs)}
            </TabComponent>
        );
    }
};

ChoiceSelect.propTypes = {
    type: PropTypes.oneOf(['choice']).isRequired,
    uuid: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
        })
    ).isRequired,
    selected: PropTypes.string,
};

ChoiceSelect.defaultProps = {
    type: 'choice',
    selected: null,
};

export default CharacterEditorWrapper(ChoiceSelect);
