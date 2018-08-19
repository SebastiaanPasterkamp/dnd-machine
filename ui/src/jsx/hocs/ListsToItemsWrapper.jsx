import React from 'react';
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
                            (value, update) => (
                                _.includes(props.list,update)
                            )
                        ),
                    );
                    const items = _.reduce(
                        listed,
                        (items, list, key) => _.concat(items, list),
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
            const { listed } = this.state;
            _.forEach(
                list,
                (item) => {
                    if (item in listed) {
                        return;
                    }
                    actions.fetchItems(
                        item,
                        storeCategory
                    );
                }
            );
        }

        render() {
            const {
                items: stateItems = [],
            } = this.state;
            const {
                items: propItems = [],
                list,
                ...props
            } = this.props;

            let items = stateItems;
            if (propItems.length) {
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

    ListsToItems.WrappedComponent = WrappedComponent;

    return ListsToItems;
};

export default ListsToItemsWrapper;
