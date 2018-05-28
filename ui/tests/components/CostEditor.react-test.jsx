import React from 'react';
import {mount} from 'enzyme';
import CostEditor from '../../src/jsx/components/CostEditor.jsx';
import renderer from 'react-test-renderer';

describe('Component: CostEditor', () => {
    it('should show a blank widget', () => {
        const tree = renderer.create(
            <CostEditor />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show coins in provided order', () => {
        const tree = renderer.create(
            <CostEditor
                value={{
                    gp: 5,
                    cp: 5,
                    sp: 5,
                }}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should remove the value', () => {
        const mock = jest.fn();
        const wrapper = mount(
            <CostEditor
                value={{gp: 5}}
                setState={mock}
                />
        );

        wrapper.find('button i.fa-trash-o').simulate('click');
        expect(mock).toBeCalledWith({});
    });

    it('should add a coin type', () => {
        const mock = jest.fn();
        const wrapper = mount(
            <CostEditor
                value={{}}
                setState={mock}
                />
        );

        wrapper.find('div.nice-dropdown button').simulate('click');
        wrapper.find('li[data-value="gp"] a').simulate('click');
        expect(mock).toBeCalledWith({gp: 1});
    });
});
