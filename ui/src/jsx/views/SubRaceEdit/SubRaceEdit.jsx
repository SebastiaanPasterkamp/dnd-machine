import React from 'react';
import PropTypes from 'prop-types';

import './sass/_sub-race-edit.scss';

import ListDataWrapper from '../../hocs/ListDataWrapper';
import RoutedObjectDataWrapper from '../../hocs/RoutedObjectDataWrapper';

import ControlGroup from '../../components/ControlGroup';
import SingleSelect from '../../components/SingleSelect';

import { BaseEditView } from '../../components/DataConfig';

export class SubRaceEdit extends React.Component
{
    constructor(props) {
        super(props);
        this.onRaceChange = this.onRaceChange.bind(this);
    }

    onRaceChange(race_id) {
        this.props.setState({ race_id });
    }

    render() {
        const { race_id,  races, ...props } = this.props;

        return (
            <BaseEditView
                baseClass="sub-race-edit"
                {...props}
            >

                <ControlGroup label="Race">
                    <SingleSelect
                        selected={race_id}
                        items={races}
                        setState={this.onRaceChange}
                    />
                </ControlGroup>

            </BaseEditView>
        );
    }
}

SubRaceEdit.propTypes = {
    id: PropTypes.number,
    race_id: PropTypes.number,
    name: PropTypes.string,
    description: PropTypes.string,
    config: PropTypes.arrayOf(PropTypes.object),
    phases: PropTypes.arrayOf(PropTypes.object),
    description: PropTypes.string,
    races: PropTypes.array,
};

SubRaceEdit.defaultProps = {
    race_id: null,
    name: '',
    description: '',
    config: [],
    phases: [],
    races: [],
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
        ["subrace"],
        "data",
    ),
    ["race"],
    "data",
    {
        race: "races",
    },
);
