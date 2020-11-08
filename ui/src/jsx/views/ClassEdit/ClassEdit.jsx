import React from 'react';
import PropTypes from 'prop-types';

import './sass/_class-edit.scss';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';

import { BaseEditView } from '../../components/DataConfig';

export class ClassEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.onSubclassLevelChange = this.onSubclassLevelChange.bind(this);
    }

    onSubclassLevelChange(subclass_level) {
        this.props.setState({ subclass_level });
    }

    render() {
        const { subclass_level, ...props } = this.props;

        return (
            <BaseEditView
                baseClass="class-edit"
                canBeCaster={true}
                conditionsTitle="Multiclassing requirements"
                {...props}
            >

                <ControlGroup label="Sub class level">
                    <InputField
                        placeholder="Sub class level..."
                        min={1}
                        max={20}
                        type="number"
                        value={subclass_level}
                        setState={this.onSubclassLevelChange}
                    />
                </ControlGroup>

            </BaseEditView>
        );
    }
}

ClassEdit.propTypes = {
    id: PropTypes.number,
    subclass_level: PropTypes.number,
};

ClassEdit.defaultProps = {
    id: null,
    subclass_level: 1,
};

export default RoutedObjectDataWrapper(
    ClassEdit,
    {
        className: 'class-edit',
        icon: 'fa-user',
        label: 'Class',
        buttons: ['cancel', 'save']
    },
    "class",
    "data"
);
