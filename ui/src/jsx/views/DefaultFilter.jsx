import React from 'react';
import Reflux from 'reflux';

import ListDataStore from '../stores/ListDataStore.jsx';
import ListDataActions from '../actions/ListDataActions.jsx';

class DefaultFilter extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.state = {};
        this.store = ListDataStore;
        this.storeKeys = ['search'];
    }

    static onChange(event) {
        ListDataActions.setState({
            search: event.target.value
        });
    }

    render() {
        const { search } = this.state;
        return (
            <div className="nice-header-form">
                <div className="nice-header-input-wrapper">
                    <input
                        id="search"
                        className="nice-form-control"
                        type="text"
                        name="search"
                        value={search}
                        placeholder="Search..."
                        onChange={this.constructor.onChange}
                    />
                </div>
            </div>
        );
    }
}

export default DefaultFilter;
