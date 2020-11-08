import React from 'react';
import PropTypes from 'prop-types';
import {
    filter,
    flatten,
    isArray,
    isObject,
    map,
    keys,
    sortBy,
    sortedUniqBy,
    uniq,
} from 'lodash/fp';

import ControlGroup from '../../ControlGroup';
import FieldSet from '../../FieldSet';
import SingleSelect from '../../SingleSelect';
import TagContainer from '../../TagContainer';

export class FilterAttributeField extends React.Component
{
    filterType = 'attribute';

    constructor(props) {
        super(props);
        this.state = {
            attributes: [],
            values: [],
        };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.onOptionsChange = this.onOptionsChange.bind(this);
    }

    onFieldChange(field) {
        const { setState, field: oldField } = this.props;
        if (field != oldField) {
            setState({
                type: this.filterType,
                field,
                options: [],
            });
        }
    }

    onOptionsChange(options) {
        const { setState } = this.props;
        setState({
            type: this.filterType,
            options,
        });
    }

    static getDerivedStateFromProps(props, state) {
        const { items, field } = props;
        if (!items.length) {
            return null;
        }
        const attributes = sortBy('id')(
            map(
                attribute => ({
                    id: attribute,
                    name: attribute,
                })
            )(
                uniq(
                    flatten(
                        map(item => keys(item))(items)
                    )
                )
            )
        );
        if (!field) {
            return {
                attributes,
            };
        }

        const values = sortedUniqBy('id')(
            sortBy('name')(
                flatten(
                    filter(
                        null,
                        map(
                            item => {
                                const { [field]: id, name } = item;
                                if (id === null || id === undefined) {
                                    return null;
                                }
                                if (isArray(id)) {
                                    return map(
                                        (sub) => ({
                                            id: sub,
                                            name: sub,
                                        })
                                    )(id);
                                }
                                if (isObject(id)) {
                                    return null;
                                }
                                return {
                                    id,
                                    name: field.match(/^(uu)?id$/) ? name : `${id}`,
                                };
                            }
                        )(items)
                    )
                )
            )
        );

        return {
            attributes,
            values,
        };
    }

    render() {
        const { attributes, values } = this.state;
        const { field, options } = this.props;

        return (
            <FieldSet label="Filter attributes">
                <ControlGroup label="Field">
                    <SingleSelect
                        selected={field}
                        items={attributes}
                        setState={this.onFieldChange}
                    />
                </ControlGroup>
                <FieldSet label="Options">
                    <TagContainer
                        items={values}
                        value={options}
                        setState={this.onOptionsChange}
                        filterable={true}
                    />
                </FieldSet>
            </FieldSet>
        );
    }
};

FilterAttributeField.propTypes = {
    type: PropTypes.oneOf(['attribute']),
    field: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.bool,
            PropTypes.number,
            PropTypes.string,
        ]),
    ),
    items: PropTypes.arrayOf(PropTypes.object),
};

FilterAttributeField.defaultProps = {
    type: 'attribute',
    field: '',
    options: [],
    items: [],
};

export default FilterAttributeField;
