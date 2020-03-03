import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import ListDataWrapper from '../../../hocs/ListDataWrapper';

import ControlGroup from '../../../components/ControlGroup';
import { DefinitionListComponent } from '../../../components/ListComponent';
import InputField from '../../../components/InputField';
import FormGroup from '../../../components/FormGroup';
import Panel from '../../../components/Panel';
import TagContainer from '../../../components/TagContainer';
import TagValueContainer from '../../../components/TagValueContainer';

export class PropertiesPanel extends React.Component
{
    constructor(props) {
        super(props);

        this.motion = [
            {id: 'walk', name: 'Walk'},
            {id: 'burrow', name: 'Burrow'},
            {id: 'climb', name: 'Climb'},
            {id: 'fly', name: 'Fly'},
            {id: 'swim', name: 'Swim'},
        ];
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(
            field,
            (value) => {
                const { setState } = this.props;
                setState({ [field]: value });
            }
        );
    }

    render() {
        const {
            challenge_rating_precise, xp_rating, motion,
            languages, _languages, traits,
        } = this.props;

        return (
            <Panel
                key="properties"
                className="monster-edit__properties" header="Properties"
            >
                <ControlGroup labels={["Challenge Rating", "/", "XP"]}>
                    <InputField
                        type="float"
                        value={challenge_rating_precise}
                        disabled={true}
                    />
                    <InputField
                        type="number"
                        value={ xp_rating }
                        disabled={true}
                    />
                </ControlGroup>
                <ControlGroup label="Motion">
                    <TagValueContainer
                        value={motion}
                        items={this.motion}
                        defaultValue={30}
                        setState={this.onFieldChange('motion')}
                    />
                </ControlGroup>
                <ControlGroup label="Languages">
                    <TagContainer
                        value={languages}
                        items={_languages}
                        setState={this.onFieldChange('languages')}
                    />
                </ControlGroup>
                <FormGroup label="Traits">
                    <DefinitionListComponent
                        list={traits}
                        newItem="auto"
                        setState={this.onFieldChange('traits')}
                    />
                </FormGroup>
            </Panel>
        );
    }
}

PropertiesPanel.propTypes = {
    challenge_rating_precise: PropTypes.number,
    xp_rating: PropTypes.number,
    motion: PropTypes.object,
    languages: PropTypes.array,
    _languages: PropTypes.array,
    traits: PropTypes.object,
    setState: PropTypes.func.isRequired,
};

PropertiesPanel.defaultProps = {
    challenge_rating_precise: 0.0,
    xp_rating: 0,
    motion: {},
    languages: [],
    _languages: [],
    traits: {},
};

export default ListDataWrapper(
    PropertiesPanel,
    [
        'languages',
    ],
    'items',
    {'languages': '_languages'}
);
