import React from 'react';
import Reflux from 'reflux';

import listDataActions from '../actions/listDataActions.jsx';
import DataStore from '../stores/dataStore.jsx';

class DefaultFilter extends Reflux.Component
{
    constructor(props) {
        super(props);
        this.store = DataStore;
        this.storeKeys = ['search'];
    }

    onChange(event) {
        listDataActions.setState({
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
                    value={this.state.search.text}
                    placeholder="Search..."
                    onChange={(event) => this.onChange(event)}
                    />
            </div>
        </div>;
    }
}

export default DefaultFilter;
