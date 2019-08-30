import React from 'react';
import PropTypes from 'prop-types';
import Reflux from 'reflux';
import _ from 'lodash';

import actions from '../actions/ListDataActions.jsx';
import store from '../stores/ListDataStore.jsx';

function ListsToItemsWrapper(
    WrappedComponent, storeCategory=null
) {

    const ListsToItems = class extends Reflux.Component {
        constructor(props) {
            super(props);
            this.WrappedComponent = WrappedComponent;
            this.state = {
                items: [],
                listed: {},
                loading: {},
            };

            this.mapStoreToState(
                store,
                (updated) => {
                    if (
                        !_.intersection(
                            props.list,
                            _.keys(updated)
                        ).length
                    ) {
                        return {};
                    }

                    const listed = _.assign(
                        {},
                        this.state.listed,
                        _.pickBy(
                            updated,
                            (value, update) => _.includes(
                                props.list, update
                            )
                        ),
                    );
                    const items = _.reduce(
                        listed,
                        (items, list) => _.concat(items, list),
                        []
                    );

                    return {
                        items,
                        listed,
                    };
                }
            );
        }

        componentDidMount() {
            const { list } = this.props;
            const { loading, listed } = this.state;
            _.forEach(
                list,
                (item) => {
                    if (item in listed || loading[item]) {
                        return;
                    }
                    actions.fetchItems(item, storeCategory);
                }
            );
        }

        render() {
            const {
                items: stateItems = [],
            } = this.state;
            const {
                items: propItems,
                list,
                ...props
            } = this.props;

            let items = stateItems;
            if (propItems) {
                if (_.isObject(propItems[0])) {
                    items = propItems;
                } else {
                    items = _.map(
                        propItems,
                        item => ({
                            code: item,
                            label: item,
                        })
                    );
                }
            }

            return <WrappedComponent
                items={items}
                {...props}
                />
        }
    };

    ListsToItems.propTypes = {
        list: PropTypes.arrayOf(
            PropTypes.string
        ),
        items: PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    code: PropTypes.string.isRequired,
                }),
                PropTypes.string,
            ])
        ),
    };

    ListsToItems.WrappedComponent = WrappedComponent;

    ListsToItems.displayName = `ListsToItems${
        WrappedComponent.displayName
        || WrappedComponent.name
    }`;

    return ListsToItems;
};

export default ListsToItemsWrapper;
