import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
} from 'lodash/fp';

import { memoize } from '../../../utils';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import MarkdownTextField from '../../../components/MarkdownTextField';
import TagContainer from '../../../components/TagContainer';

export default class MultiAttackEditor extends React.Component
{
    constructor(props) {
        super(props);
        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        const { setState } = this.props;
        return this.memoize(
            field,
            (value, callback=null) => setState(
                {[field]: value },
                callback
            )
        );
    }

    render() {
        const {
            name, description, condition, sequence, attacks,
        } = this.props;
        const attackOptions = map(attack => ({
            code: attack.name,
            label: attack.name
        }))(attacks);

        return (
            <div className="edit-multiattack">
                <ControlGroup label="Name">
                    <InputField
                        placeholder="Rotation name..."
                        value={name}
                        setState={this.onFieldChange('name')}
                    />
                </ControlGroup>
                <ControlGroup label="Description">
                    <MarkdownTextField
                        placeholder="Rotation does an average of %average% damage..."
                        value={description}
                        rows={5}
                        setState={this.onFieldChange('description')}
                    />
                </ControlGroup>
                <ControlGroup label="Condition">
                    <MarkdownTextField
                        placeholder="Condition..."
                        value={condition}
                        rows={5}
                        setState={this.onFieldChange('condition')}
                    />
                </ControlGroup>
                <TagContainer
                    value={sequence}
                    items={attackOptions}
                    multiple={true}
                    setState={this.onFieldChange('sequence')}
                />
            </div>
        );
    }
}

MultiAttackEditor.propTypes = {
    name: PropTypes.string,
    description: PropTypes.string,
    condition: PropTypes.string,
    sequence: PropTypes.array,
    attacks: PropTypes.array,
    setState: PropTypes.func.isRequired,
};

MultiAttackEditor.defaultProps = {
    name: '',
    description: '',
    condition: '',
    sequence: [],
    attacks: [],
};
