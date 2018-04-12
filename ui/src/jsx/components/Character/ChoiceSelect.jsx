import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';

import LazyComponent from '../LazyComponent.jsx';
import TabComponent from '../TabComponent.jsx';

import CharacterConfig from './CharacterConfig.jsx';

class ChoiceSelect extends LazyComponent
{
    constructor(props) {
        super(props);
    }

    render() {
        const {
            description = '', options = [],
            index: prefix, getCurrent, getItems, onChange
        } = this.props;
        const props = { getCurrent, getItems, onChange };

        return <React.Fragment>
            {description &&
                <MDReactComponent
                    text={description}
                    />
            }
            <TabComponent
                tabConfig={options}
                >
            {_.map(options, (option, index) => (
                <div key={index}>
                    {option.description &&
                        <MDReactComponent
                            text={option.description || ''}
                            />
                    }
                    <CharacterConfig
                        {...props}
                        config={[option]}
                        index={prefix.concat([index])}
                        />
                </div>
            ))}
            </TabComponent>
        </React.Fragment>;
    }
};

ChoiceSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    index: PropTypes.arrayOf(PropTypes.number).isRequired,
    description: PropTypes.string,
};

export default ChoiceSelect;
