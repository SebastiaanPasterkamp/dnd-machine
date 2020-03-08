import React from 'react';
import PropTypes from 'prop-types';
import {
    keys,
} from 'lodash/fp';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import InputField from '../../InputField';
import TagContainer from '../../TagContainer';

export class FilterProficiencies extends React.Component
{
    filterType = 'proficiencies';
    filterMethod = 'proficiency';

    constructor(props) {
        super(props);
        this.onObjectsChange = this.onObjectsChange.bind(this);
        this.onFormulaChange = this.onFormulaChange.bind(this);
    }

    onFormulaChange(objects_formula) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            method: this.filterMethod,
            objects_formula,
            objects: undefined,
        });
    }

    onObjectsChange(objects) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            method: this.filterMethod,
            objects,
            objects_formula: undefined,
        });
    }

    render() {
        const { objects, objects_formula, items } = this.props;

        const objs = keys(objects).length > 0;
        const fmla = !!objects_formula;

        return (
            <FieldSet label="Filter proficiencies">
                {!objs ? (
                    <ControlGroup label="Formula">
                        <InputField
                            placeholder="Formula..."
                            value={objects_formula}
                            type="text"
                            setState={this.onFormulaChange}
                        />
                    </ControlGroup>
                ) : null}
                {!fmla ? (
                    <ControlGroup label="Proficiencies">
                        <TagContainer
                            items={items}
                            value={objects}
                            setState={this.onObjectsChange}
                            objects={true}
                            filterable={true}
                        />
                    </ControlGroup>
                ) : null}
            </FieldSet>
        );
    }
};

FilterProficiencies.propTypes = {
    type: PropTypes.oneOf(['proficiencies']),
    method: PropTypes.oneOf(['proficiency']),
    field: PropTypes.string,
    filter: PropTypes.string,
};

FilterProficiencies.defaultProps = {
    type: 'proficiencies',
    method: 'proficiency',
    field: '_formula',
    filter: '',
};

export default FilterProficiencies;
