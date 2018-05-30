import React from 'react';
import { mount } from 'enzyme';
import { AutoCompleteInput } from 'components/AutoCompleteInput.jsx';
import renderer from 'react-test-renderer';

const items = [
    {"code": "light", "label": "Light Armor"},
    {"code": "heavy", "label": "Heavy Armor"},
];

describe('Component: AutoCompleteInput', () => {
    it('should render with minimum props', () => {
        const tree = renderer.create(
            <AutoCompleteInput
                items={items}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render value not in the list', () => {
        const tree = renderer.create(
            <AutoCompleteInput
                items={items}
                value="whatever"
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render be disabled', () => {
        const tree = renderer.create(
            <AutoCompleteInput
                items={items}
                disabled={true}
                />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should expand on focus', () => {
        const wrapper = mount(
            <AutoCompleteInput
                items={items}
                />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper
            .find('input')
            .simulate('focus');

        expect(wrapper).toMatchSnapshot();
    });

    it('should stay expanded on blur', () => {
        const wrapper = mount(
            <AutoCompleteInput
                items={items}
                />
        );

        expect(wrapper).toMatchSnapshot();

        wrapper
            .find('input')
            .simulate('focus');
        wrapper
            .setState({hover: true});
        wrapper
            .find('input')
            .simulate('blur');

        expect(wrapper).toMatchSnapshot();
    });

    it('should stay hide when losing focus/mouse', () => {
        const wrapper = mount(
            <AutoCompleteInput
                items={items}
                />
        );

        wrapper
            .find('input')
            .simulate('focus');
        wrapper.setState({hover: false});
        wrapper
            .find('input')
            .simulate('blur');

        expect(wrapper).toMatchSnapshot();
    });

    it('should hide when w/o results', () => {
        const setState = jest.fn()
        const wrapper = mount(
            <AutoCompleteInput
                items={items}
                setState={setState}
                />
        );

        wrapper
            .find('input')
            .simulate('focus');
        wrapper.setProps({value: 'unknown'});

        expect(wrapper).toMatchSnapshot();
    });

    it('should emit change on input', () => {
        const setState = jest.fn()
        const wrapper = mount(
            <AutoCompleteInput
                items={items}
                setState={setState}
                />
        );

        wrapper
            .find('input')
            .simulate('change', {target: {value: 'unknown'}});

        expect(setState).toBeCalledWith('unknown');
    });

    it('should pick the first result on enter', () => {
        const setState = jest.fn()
        const wrapper = mount(
            <AutoCompleteInput
                value="li"
                items={items}
                setState={setState}
                />
        );

        wrapper
            .find('input')
            .simulate('keyPress', { key: 'Enter' });

        expect(setState).toBeCalledWith('Light Armor');
    });
});
