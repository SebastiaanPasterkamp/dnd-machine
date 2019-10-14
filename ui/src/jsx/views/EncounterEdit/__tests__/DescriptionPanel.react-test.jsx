import React from 'react';
import { shallow, mount } from 'enzyme';
import 'jest-enzyme';
import renderer from 'react-test-renderer';

import DescriptionPanel from '../components/DescriptionPanel';

describe('View DescriptionPanel', () => {
    const fullProps = {
        name: 'Bar fight',
        description: 'A _fight_ in a **bar**!',
    };

    describe('rendering', () => {
        it('should work w/ minimum props', () => {
            const onSetState = jest.fn();
            const tree = renderer.create(
                <DescriptionPanel
                    setState={onSetState}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
            expect(onSetState).not.toBeCalled();
        });

        it('should work w/ full props', () => {
            const onSetState = jest.fn();
            const tree = renderer.create(
                <DescriptionPanel
                    {...fullProps}
                    setState={onSetState}
                />
            );

            expect(tree.toJSON()).toMatchSnapshot();
            expect(onSetState).not.toBeCalled();
        });
    });

    describe('should handle changing', () => {
        const setState = jest.fn();
        let wrapped;

        beforeAll(() => {
            wrapped = mount(
               <DescriptionPanel
                   setState={setState}
               />
           );
       });

       beforeEach(() => setState.mockClear());

        it('the name', () => {
            wrapped
                .find('input')
                .simulate('change', {target: {
                    value: fullProps.name,
                }});

            expect(setState).toBeCalledWith({
                name: fullProps.name,
            });
        });

        it('the description', () => {
            wrapped
                .find('textarea')
                .simulate('change', {target: {
                    value: fullProps.description,
                }});

            expect(setState).toBeCalledWith({
                description: fullProps.description,
            });
        });
    });
});
