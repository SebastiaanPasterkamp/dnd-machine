import React from 'react';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

import LazyComponent from '../../src/jsx/components/LazyComponent.jsx';

class TestComponent extends LazyComponent
{
    constructor(props) {
        super(props);
        this.state = {
            foo: 'bar'
        };
    }
}

describe('Component: LazyComponent', () => {
    it('should not render anything', () => {
        const tree = renderer.create(
            <LazyComponent />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should not rerender because of props', () => {
        const props = {
            foo: 'bar'
        };
        const lc = shallow(
            <LazyComponent {...props}/>
        ).instance();

        const shouldUpdate = lc.shouldComponentUpdate(props, {});
        expect(shouldUpdate).toBe(false);
    });

    it('should rerender because of props', () => {
        let props = {
            foo: 'bar'
        };
        const lc = shallow(
            <LazyComponent {...props}/>
        ).instance();

        props.foo = 'foobar';
        const shouldUpdate = lc.shouldComponentUpdate(props, {});
        expect(shouldUpdate).toBe(true);
    });

    it('should not rerender because of state', () => {
        const props = {
            foo: 'bar'
        };
        const lc = shallow(
            <TestComponent {...props}/>
        ).instance();

        const shouldUpdate = lc.shouldComponentUpdate(
            props, {foo: 'bar'}
        );
        expect(shouldUpdate).toBe(false);
    });

    it('should rerender because of state', () => {
        let props = {
            foo: 'bar'
        };
        const lc = shallow(
            <TestComponent {...props}/>
        ).instance();

        props.foo = 'foobar';
        const shouldUpdate = lc.shouldComponentUpdate(
            props, {foo: 'barfoo'}
        );
        expect(shouldUpdate).toBe(true);
    });
});
