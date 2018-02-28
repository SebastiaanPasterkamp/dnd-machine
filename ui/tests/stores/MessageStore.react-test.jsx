import React from 'react';
import Reflux from 'reflux';
import _ from 'lodash';
jest.useFakeTimers();

import {MessageStore} from '../../src/jsx/stores/MessageStore.jsx';
jest.mock('../../src/jsx/actions/ReportingActions.jsx');

describe('MessageStore', () => {
    var store;

    beforeEach(() => {
        Reflux.initStore(MessageStore);
        store = new MessageStore();

        _.uniqueId = jest.fn();
        _.uniqueId
            .mockReturnValueOnce('id_1')
            .mockReturnValueOnce('unexpected_2');
    });

    it('capture a message', function() {

        store.onShowMessage(
            'good', 'Hello world'
        );
        jest.runAllTimers();
        expect(store.state).toMatchSnapshot();
    });

    it('remove a message', function() {

        store.onShowMessage(
            'muted', 'Goodbye world', 'Bye', 10
        );
        jest.runAllTimers();
        expect(store.state).toMatchSnapshot();

        store.onHideMessage("id_1")
        jest.runAllTimers();
        expect(store.state).toMatchSnapshot();
    });
});
