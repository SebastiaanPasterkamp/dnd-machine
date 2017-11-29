import React from 'react';
import Reflux from 'reflux';

import ListDataStore from '../stores/ListDataStore.jsx';

import ListDataActions from '../actions/ListDataActions.jsx';

class DefaultFilter extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = ListDataStore;
        this.storeKeys = ['search'];
    }

    onChange(event) {
        ListDataActions.setState({
            search: event.target.value
        });
    }

    render() {
        return <div className="nice-header-form">
            <div className="nice-header-input-wrapper">
                <input
                    id="search"
                    className="nice-form-control"
                    type="text"
                    name="search"
                    value={this.state.search}
                    placeholder="Search..."
                    onChange={(event) => this.onChange(event)}
                    />
            </div>
        </div>;
    }
}

export default DefaultFilter;
