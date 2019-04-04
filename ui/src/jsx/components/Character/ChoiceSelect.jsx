import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import LazyComponent from '../LazyComponent.jsx';
import TabComponent from '../TabComponent.jsx';

import CharacterConfig from './CharacterConfig.jsx';

export class ChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            options,
        } = this.props;
        const props = {
            label: undefined,
        };

        const filtered = _.chain(options)
            .filter( option => !option.hidden )
            .value();

        return <TabComponent
            tabConfig={filtered}
            >
            {_.map(
                filtered,
                (option, index) => <CharacterConfig
                    {...props}
                    key={ index }
                    config={ [option] }
                    />
            )}
        </TabComponent>;
    }
};

ChoiceSelect.propTypes = {
    type: PropTypes.oneOf(['choice']).isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
        })
    ).isRequired,
    description: PropTypes.string,
};

export default ChoiceSelect;
