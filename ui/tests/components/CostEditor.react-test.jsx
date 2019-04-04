import React from 'react';
import { mount } from 'enzyme';
import CostEditor from '../../src/jsx/components/CostEditor.jsx';
import renderer from 'react-test-renderer';

describe('Component: CostEditor', () => {
    it('should show a blank widget', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <CostEditor
                setState={setState}
                value={{}}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should show coins in provided order', () => {
        const setState = jest.fn();
        const tree = renderer.create(
            <CostEditor
                setState={setState}
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
        const setState = jest.fn();
        const wrapper = mount(
            <CostEditor
                value={{gp: 5}}
                setState={setState}
                />
        );

        wrapper
            .find('button i.fa-trash-o')
            .simulate('click');
        expect(setState)
            .toBeCalledWith({});
    });

    it('should add a coin type', () => {
        const setState = jest.fn();
        const wrapper = mount(
            <CostEditor
                value={{}}
                setState={setState}
                />
        );

        wrapper
            .find('div.nice-dropdown button')
            .simulate('click');
        wrapper
            .find('li[data-value="gp"] a')
            .simulate('click');

        expect(setState)
            .toBeCalledWith({gp: 1});
    });
});
