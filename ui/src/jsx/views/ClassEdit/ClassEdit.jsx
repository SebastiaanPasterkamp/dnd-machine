import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_class-edit.scss';

import { memoize } from '../../utils';

import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import { SelectListComponent } from '../../components/ListComponent';
import TabComponent from '../../components/TabComponent';

import CasterPanel from './components/CasterPanel';

import {
    OPTIONS,
} from '../../components/DataConfig';

export class ClassEdit extends React.Component
{
    optionType = 'config';

    constructor(props) {
        super(props);

        this.levels = map(i => ({
            label: `Level ${i}`,
            level: i,
        }))(range(1, 20));

        this.onFieldChange = this.onFieldChange.bind(this);
        this.onDictChange = this.onDictChange.bind(this);

        this.memoize = memoize.bind(this);
    }

    onFieldChange(field) {
        return this.memoize(field, value => {
            const { setState } = this.props;
            setState({
                type: this.optionType,
                [field]: value,
            });
        });
    }

    onDictChange(dict) {
        return this.memoize(dict, update => {
            const { setState, [dict]: previous } = this.props;
            setState({
                type: this.optionType,
                [dict]: {...previous, ...update},
            });
        });
    }

    render() {
        const { id, name, description, config, features } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="class-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Class">
                        <InputField
                            placeholder="Class..."
                            value={name}
                            setState={this.onFieldChange('name')}
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

                <CasterPanel
                    {...features}
                    setState={this.onDictChange('features')}
                />

                <Panel
                    key="levels"
                    className="class-edit__levels"
                    header="Levels"
                >
                    <TabComponent
                        tabConfig={this.levels}
                        mountAll={true}
                    >
                        <SelectListComponent
                            list={config}
                            options={OPTIONS}
                            setState={this.onFieldChange('config')}
                        />
                    </TabComponent>
                </Panel>
            </React.Fragment>
        );
    }
}

ClassEdit.propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    features: PropTypes.object,
};

ClassEdit.defaultProps = {
    id: null,
    name: '',
    description: '',
    config: [],
    features: {},
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
