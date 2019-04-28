import React from 'react';
import { mount } from 'enzyme';
import renderer from 'react-test-renderer';
import MockRouter from 'react-mock-router';

import BaseFilterListDialog from '../BaseFilterListDialog';

const rowComponent = ({item: {value, id}, ...props}) => (
    <div {...props}>{value}</div>
);

describe('BaseFilterListDialog', () => {
    const fullProps = {
        items: {
            one: {
                id: 1,
                value: 'one',
            },
            two: {
                id: 2,
                value: 'two',
            },
        },
        rowComponent: rowComponent,
        label: "Base Item Picker",
        className: "class-name",
        onCancel: jest.fn(),
        onDone: jest.fn(),
    };

    describe('rendering', () => {
        it('should work with minimum props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseFilterListDialog
                        items={{}}
                        label={fullProps.label}
                        onCancel={fullProps.onCancel}
                        rowComponent={fullProps.rowComponent}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with full props', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseFilterListDialog
                        {...fullProps}
                        extraProp="passed"
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });

        it('should work with filtered items', () => {
            const tree = renderer.create(
                <MockRouter>
                    <BaseFilterListDialog
                        {...fullProps}
                        onFilter={(item) => item.id !== 1}
                    />
                </MockRouter>
            );

            expect(tree).toMatchSnapshot();
        });
    });

    it('should filter items when rendering', () => {
        const onFilter = jest.fn(() => true);

        const wrapper = mount(
            <MockRouter>
                <BaseFilterListDialog
                    {...fullProps}
                    onFilter={onFilter}
                />
            </MockRouter>
        );

        expect(onFilter.mock.calls).toMatchSnapshot();
        expect(onFilter)
            .toBeCalledWith(fullProps.items.one);
        expect(onFilter)
            .toBeCalledWith(fullProps.items.two);
    });

    describe('action buttons', () => {
        const onCancel = jest.fn();
        const onDone = jest.fn();

        const wrapper = mount(
            <MockRouter>
                <BaseFilterListDialog
                    {...fullProps}
                    onCancel={onCancel}
                    onDone={onDone}
                />
            </MockRouter>
        );

        it('should bind onCancel properly', () => {
            expect(onCancel).not.toBeCalled();
            wrapper
                .find('.nice-btn.fa-cross')
                .simulate('click');
            expect(onCancel).toBeCalled();
        });

        it('should bind onDone properly', () => {
            expect(onDone).not.toBeCalled();
            wrapper
                .find('.nice-btn.fa-check')
                .simulate('click');
            expect(onDone).toBeCalled();
        });
    });
});