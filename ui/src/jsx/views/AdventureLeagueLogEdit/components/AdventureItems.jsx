import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    isObject,
    map,
} from 'lodash/fp';

import ControlGroup from '../../../components/ControlGroup';
import InputField from '../../../components/InputField';
import Panel from '../../../components/Panel';
import ListComponent from '../../../components/ListComponent';

export class AdventureItems extends React.PureComponent
{
    constructor(props) {
        super(props);
        this.initalItem = {
            value: '',
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(items) {
        const { starting, disabled, setState } = this.props;
        if (disabled) {
            return;
        }
        const earned = filter(item => item)(
            map(
                item => ( isObject(item) ? item.value : item )
            )(items)
        );
        const total = starting + earned.length;
        setState({ starting, earned, total });
    }

    render() {
        const {
            starting, earned, total, className, label, disabled,
        } = this.props;

        return (
            <Panel
                className={className}
                header={label}
            >
                <ControlGroup label="Starting">
                    <InputField
                        placeholder="Starting..."
                        disabled={true}
                        type="number"
                        value={starting}
                    />
                </ControlGroup>

                <ControlGroup label="Obtained">
                    <ListComponent
                        newItem='auto'
                        list={map( value => ({ value }) )(earned)}
                        component={InputField}
                        initialItem={this.initalItem}
                        disabled={disabled}
                        setState={!disabled
                            ? this.onChange
                            : null
                        }
                        componentProps={{ disabled }}
                    />
                </ControlGroup>

                <ControlGroup label="Total">
                    <InputField
                        placeholder="Total..."
                        disabled={true}
                        type="number"
                        value={total}
                    />
                </ControlGroup>
            </Panel>
        );
    }
};

AdventureItems.propTypes = {
    setState: PropTypes.func,
    label: PropTypes.string.isRequired,
    starting: PropTypes.number,
    earned: PropTypes.arrayOf( PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
            item: PropTypes.string,
        }),
    ])),
    total: PropTypes.number,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

AdventureItems.defaultProps = {
    starting: 0,
    earned: [],
    total: 0,
    className: '',
    disabled: false,
};

export default AdventureItems;
