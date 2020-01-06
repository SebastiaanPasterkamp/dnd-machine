import React from 'react';
import PropTypes from 'prop-types';
import {
    fromPairs,
    map,
    keys,
} from 'lodash/fp';

import DefinitionComponent from './components/DefinitionComponent';
import ListComponent from './ListComponent';

export class DefinitionListComponent extends React.Component
{
    constructor(props) {
        super(props);
        this.onSetState = this.onSetState.bind(this);
    }

    initialItem = {
        name: '',
        description: '',
    };

    onSetState(value, callback) {
        const { list, setState } = this.props;

        setState(
            fromPairs(
                map(
                    ({name, description}) => ([name, description])
                )(value)
            ),
            callback
        );
    }

    render() {
        const { list, setState,...props } = this.props;

        return (
            <ListComponent
                newItem="auto"
                {...props}
                list={map(
                    name => ({
                        name,
                        description: list[name],
                    })
                )(keys(list))}
                component={ DefinitionComponent }
                initialItem={this.initialItem}
                keyProp="name"
                setState={this.onSetState}
            />
        );
    }
}

DefinitionListComponent.defaultProps = {
    setState: (value) => {
        console.log(['DefinitionList', value]);
    }
};

DefinitionListComponent.propTypes = {
    list: PropTypes.object.isRequired,
    setState: PropTypes.func.isRequired,
};

export default DefinitionListComponent;
