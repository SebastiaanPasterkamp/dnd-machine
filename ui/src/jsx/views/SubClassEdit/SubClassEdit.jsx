import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_sub-class-edit.scss';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import TabComponent from '../../components/TabComponent';

export class SubClassEdit extends React.Component
{
    constructor(props) {
        super(props);

        this.levels = map(i => ({
            label: `Level ${i}`,
            level: i,
        }))(range(2, 20));

        this.onFieldChange = this.onFieldChange.bind(this);

        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { setState } = this.props;
            setState({ [field]: value });
        });
    }

    render() {
        const {
            id,
            class: _class,
            subclass,
            description,
            classes,
            weapon,
        } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="sub-class-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Class">
                        <SingleSelect
                            selected={_class}
                            items={classes.length ? classes[0].options : []}
                            setState={this.onFieldChange('class')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Sub Class">
                        <InputField
                            placeholder="Sub Class..."
                            value={subclass}
                            setState={this.onFieldChange('subclass')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Description">
                        <MarkdownTextField
                            placeholder="Description..."
                            value={description}
                            setState={this.onFieldChange('description')}
                        />
                    </ControlGroup>
                </Panel>

                <Panel
                    key="requirements"
                    className="sub-class-edit__requirements"
                    header="Requirements"
                >
                </Panel>

                <Panel
                    key="levels"
                    className="sub-class-edit__levels"
                    header="Levels"
                >
                    <TabComponent
                        tabConfig={this.tabConfig}
                        mountAll={true}
                    >
                    </TabComponent>
                </Panel>
            </React.Fragment>
        );
    }
}

SubClassEdit.propTypes = {
    id: PropTypes.number,
    class: PropTypes.string,
    subclass: PropTypes.string,
    description: PropTypes.string,
    classes: PropTypes.array,
    weapon: PropTypes.array,
};

SubClassEdit.defaultProps = {
    class: '',
    subclass: '',
    description: '',
    classes: [],
    weapon: [],
};

export default ListDataWrapper(
    ListDataWrapper(
        RoutedObjectDataWrapper(
            SubClassEdit,
            {
                className: 'sub-class-edit',
                icon: 'fa-users',
                label: 'Sub Class',
                buttons: ['cancel', 'save']
            },
            "subclass"
        ),
        [
            'weapon',
        ],
        'items',
    ),
    [
        'classes',
    ],
    'character'
);
