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
        return <TabComponent
                tabConfig={this.props.options}
                >
            {_.map(this.props.options, (option, index) => {
                const props = {
                    index: this.props.index.concat([index]),
                    getCurrent: this.props.getCurrent,
                    getItems: this.props.getItems,
                    onChange: this.props.onChange,
                    config: option.config
                };

                return <div key={index}>
                    {option.description
                        ? <MDReactComponent
                            text={option.description}
                            />
                        : null
                    }
                    <CharacterConfig
                        {...props}
                        />
                </div>;
            })}
        </TabComponent>;
    }
};

ChoiceSelect.propTypes = {
    onChange: PropTypes.func.isRequired,
    getCurrent: PropTypes.func.isRequired,
    getItems: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.object).isRequired,
    description: PropTypes.string,
};

export default ChoiceSelect;
