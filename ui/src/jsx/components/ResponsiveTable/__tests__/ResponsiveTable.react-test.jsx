import React from 'react';
import { mount } from 'enzyme';
import ResponsiveTable from '../ResponsiveTable';
import renderer from 'react-test-renderer';

describe('Component: ResponsiveTable', () => {
    const fullProps = {
        items: [
            {id: 1, name: 'One'},
            {id: 2, name: 'Two'},
        ],
        headerComponent: () => (<tr><td>Name</td></tr>),
        rowComponent: (item) => (<tr><td id={item.id}>{item.name}</td></tr>),
        footerComponent: () => (<tr><td>Footer</td></tr>),
    };

    it('should render with minimum props', () => {
        const tree = renderer.create(
            <ResponsiveTable
                rowComponent={fullProps.rowComponent}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('should render with full props', () => {
        const tree = renderer.create(
            <ResponsiveTable
                {...fullProps}
            />
        ).toJSON();

        expect(tree).toMatchSnapshot();
    });

});
