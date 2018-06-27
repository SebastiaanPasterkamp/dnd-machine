import React from 'react';
import PropTypes from 'prop-types';
import MDReactComponent from 'markdown-react-js';
import _ from 'lodash';

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
            description = '', options, index: prefix,
            getCurrent, getItems, onChange,
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
            {_.map(options, ({description, label, ...option}, index) => (
                <div key={index}>
                    {description &&
                        <MDReactComponent
                            text={ description }
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
    options: PropTypes.arrayOf(
        PropTypes.shape({
            description: PropTypes.string,
        })
    ).isRequired,
    index: PropTypes.arrayOf(PropTypes.number).isRequired,
    description: PropTypes.string,
};

export default ChoiceSelect;
