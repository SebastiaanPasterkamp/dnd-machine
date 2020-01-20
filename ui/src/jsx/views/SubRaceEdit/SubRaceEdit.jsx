import React from 'react';
import PropTypes from 'prop-types';
import {
    map,
    range,
} from 'lodash/fp';

import './sass/_sub-race-edit.scss';

import { memoize } from '../../utils';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import InputField from '../../components/InputField';
import MarkdownTextField from '../../components/MarkdownTextField';
import Panel from '../../components/Panel';
import SingleSelect from '../../components/SingleSelect';
import TabComponent from '../../components/TabComponent';

export class SubRaceEdit extends React.Component
{
    constructor(props) {
        super(props);
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
            race,
            subrace,
            description,
            races,
        } = this.props;

        return (
            <React.Fragment>
                <Panel
                    key="description"
                    className="sub-race-edit__description"
                    header="Description"
                >
                    <ControlGroup label="Class">
                        <SingleSelect
                            selected={race}
                            items={races.length ? races[0].options : []}
                            setState={this.onFieldChange('race')}
                        />
                    </ControlGroup>

                    <ControlGroup label="Sub Race">
                        <InputField
                            placeholder="Sub Race..."
                            value={subrace}
                            setState={this.onFieldChange('subrace')}
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
                    className="sub-race-edit__requirements"
                    header="Requirements"
                >
                </Panel>

                <Panel
                    key="config"
                    className="sub-race-edit__config"
                    header="Config"
                >
                </Panel>
            </React.Fragment>
        );
    }
}

SubRaceEdit.propTypes = {
    id: PropTypes.number,
    race: PropTypes.string,
    subrace: PropTypes.string,
    description: PropTypes.string,
    races: PropTypes.array,
};

SubRaceEdit.defaultProps = {
    race: '',
    subrace: '',
    description: '',
    classes: [],
};

export default ListDataWrapper(
    RoutedObjectDataWrapper(
        SubRaceEdit,
        {
            className: 'sub-race-edit',
            icon: 'fa-cubes',
            label: 'Sub Races',
            buttons: ['cancel', 'save']
        },
        "subrace"
    ),
    [
        'race',
    ],
    'data'
);
